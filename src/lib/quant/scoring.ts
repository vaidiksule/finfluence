import { ArticleEvidence, EdgeState, EventStudyWindow } from '../types';
import scoringConfig from '../../config/scoring.json';

export interface ConfidenceResult {
  confidence: number; // 0 to 1
  components_used: string[];
  event_study_score: number | null;
  correlation_score: number | null;
  article_evidence_score: number | null;
}

export interface StateVerdict {
  state: EdgeState;
  reason: string;
}

/**
 * Compute article evidence score from supporting and contradicting articles.
 * Saturating curve: 1 - exp(-sum(relevance_i) / 3), penalized by contradicting articles.
 */
export function computeArticleEvidenceScore(evidenceList: ArticleEvidence[]): number {
  if (!evidenceList || evidenceList.length === 0) return 0.5; // neutral prior

  let supportWeight = 0;
  let contradictWeight = 0;

  for (const ev of evidenceList) {
    if (ev.supports === true) {
      supportWeight += ev.relevance;
    } else if (ev.supports === false) {
      contradictWeight += ev.relevance;
    }
  }

  // 1 - exp(-support / 3) gives ~0.63 for 3 relevance points, ~0.86 for 6
  const baseSupport = 1 - Math.exp(-supportWeight / 3.0);
  const penalty = 1 - Math.exp(-contradictWeight / 2.0);

  const netScore = Math.max(0.05, Math.min(0.95, baseSupport - 0.5 * penalty));
  return parseFloat(netScore.toFixed(3));
}

/**
 * Compute blended edge confidence using shrunken empirical hit rate,
 * lagged correlation, and article evidence.
 * Renormalizes weights if any component is absent.
 */
export function computeEdgeConfidence(
  eventStudyWindow: EventStudyWindow | null,
  bestCorr: number | null,
  expectedDirection: 'positive' | 'negative' | 'ambiguous',
  evidenceList: ArticleEvidence[] = []
): ConfidenceResult {
  const componentsUsed: string[] = [];
  let totalWeight = 0;
  let weightedSum = 0;

  let esScore: number | null = null;
  let corrScore: number | null = null;
  let artScore: number | null = null;

  // 1. Event Study Component
  if (eventStudyWindow && eventStudyWindow.n > 0) {
    // Shrunken empirical hit rate Laplace smoothing: (hits + 1) / (n + 2)
    const shrunkenHitRate = (eventStudyWindow.hits + 1) / (eventStudyWindow.n + 2);

    // Confidence cap if sample size is very small (n < 5)
    const sampleMultiplier = Math.min(1.0, eventStudyWindow.n / scoringConfig.min_events_for_verdict);
    esScore = parseFloat((shrunkenHitRate * (0.5 + 0.5 * sampleMultiplier)).toFixed(3));

    weightedSum += scoringConfig.weights.event_study * esScore;
    totalWeight += scoringConfig.weights.event_study;
    componentsUsed.push('event_study');
  }

  // 2. Correlation Component
  if (bestCorr !== null && !isNaN(bestCorr)) {
    // Correlation only scores if sign agrees with proposal
    let signAgrees = false;
    if (expectedDirection === 'positive' && bestCorr > 0) signAgrees = true;
    else if (expectedDirection === 'negative' && bestCorr < 0) signAgrees = true;
    else if (expectedDirection === 'ambiguous') signAgrees = true;

    corrScore = signAgrees ? parseFloat(Math.abs(bestCorr).toFixed(3)) : 0.05;
    weightedSum += scoringConfig.weights.correlation * corrScore;
    totalWeight += scoringConfig.weights.correlation;
    componentsUsed.push('correlation');
  }

  // 3. Article Evidence Component
  if (evidenceList.length > 0) {
    artScore = computeArticleEvidenceScore(evidenceList);
    weightedSum += scoringConfig.weights.article_evidence * artScore;
    totalWeight += scoringConfig.weights.article_evidence;
    componentsUsed.push('article_evidence');
  }

  const finalConfidence =
    totalWeight > 0
      ? parseFloat((weightedSum / totalWeight).toFixed(3))
      : 0.50; // default prior confidence

  return {
    confidence: Math.max(0.05, Math.min(0.99, finalConfidence)),
    components_used: componentsUsed,
    event_study_score: esScore,
    correlation_score: corrScore,
    article_evidence_score: artScore
  };
}

/**
 * Assign edge state (stated / validated / contradicted / inferred)
 * with radical honesty and full explanation for auditability.
 */
export function assignEdgeState(
  eventStudyWindow: EventStudyWindow | null,
  confidence: number,
  expectedDirection: 'positive' | 'negative' | 'ambiguous',
  isStatedInArticle: boolean = false
): StateVerdict {
  if (isStatedInArticle) {
    return {
      state: 'stated',
      reason: 'Directly asserted in news text with direct citation.'
    };
  }

  if (!eventStudyWindow || eventStudyWindow.n === 0) {
    return {
      state: 'inferred',
      reason: 'Inferred link: no historical price series or unmeasurable entities.'
    };
  }

  const { n, hit_rate, mean_car, significance } = eventStudyWindow;

  // Sample size honesty: if n < min_events (default 5), cannot be validated or contradicted
  if (n < scoringConfig.min_events_for_verdict) {
    return {
      state: 'inferred',
      reason: `Insufficient sample: only ${n} historical events observed (minimum ${scoringConfig.min_events_for_verdict} required for validation).`
    };
  }

  // Check contradiction: hit rate <= 40% OR mean CAR is opposite to expected with suggestive/significant p-value
  const signOpposite =
    (expectedDirection === 'positive' && mean_car < -0.002) ||
    (expectedDirection === 'negative' && mean_car > 0.002);

  if (
    hit_rate <= scoringConfig.contradicted_max_hit_rate ||
    (signOpposite && (significance === 'significant' || significance === 'suggestive'))
  ) {
    return {
      state: 'contradicted',
      reason: `Empirical data contradicts hypothesis: hit rate is ${(hit_rate * 100).toFixed(0)}% (mean CAR ${(mean_car * 100).toFixed(1)}%, p-value: ${eventStudyWindow.p_value}).`
    };
  }

  // Check validation: confidence >= 0.60 AND sign agrees
  const signAgrees =
    (expectedDirection === 'positive' && mean_car > 0) ||
    (expectedDirection === 'negative' && mean_car < 0) ||
    expectedDirection === 'ambiguous';

  if (confidence >= scoringConfig.validated_min_confidence && signAgrees) {
    return {
      state: 'validated',
      reason: `Empirically validated across ${n} past shock events with ${(hit_rate * 100).toFixed(0)}% hit rate and ${(confidence * 100).toFixed(0)}% confidence.`
    };
  }

  return {
    state: 'inferred',
    reason: `Inferred: ${n} events observed, but confidence (${(confidence * 100).toFixed(0)}%) remains below validation threshold (${(scoringConfig.validated_min_confidence * 100).toFixed(0)}%).`
  };
}
