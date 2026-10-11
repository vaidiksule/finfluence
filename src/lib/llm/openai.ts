import OpenAI from 'openai';
import entitiesData from '../../data/entities.json';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY || ''
});

export interface ExtractionResult {
  is_event: boolean;
  event_type:
    | 'commodity_shock'
    | 'rate_decision'
    | 'regulation'
    | 'geopolitical'
    | 'macro_data'
    | 'corporate'
    | 'other';
  summary: string;
  direction: 'up' | 'down' | 'neutral' | 'ambiguous';
  magnitude_text?: string;
  magnitude_value?: number | null;
  unit?: string;
  entities: Array<{
    name: string;
    type: string;
    canonical_id: string;
    ticker?: string | null;
  }>;
  candidate_edges: Array<{
    source_id: string;
    target_id: string;
    relation: 'INCREASES' | 'DECREASES' | 'AFFECTS' | 'DEPENDS_ON' | 'PART_OF';
    direction: 'positive' | 'negative' | 'ambiguous';
    lag_hint: number;
    rationale: string;
    mechanism_tag: string;
    cited_sentence?: string;
  }>;
}

const CANONICAL_ENTITIES_SUMMARY = (entitiesData as any).entities
  .map((e: any) => `${e.id} (${e.label}, type: ${e.type}${e.ticker ? `, ticker: ${e.ticker}` : ''})`)
  .join('\n');

/**
 * Single-Pass Structured Extraction: extracts Event + Entities + Candidate Edges in ONE LLM call.
 * Execution latency: 1.5 - 2.5 seconds with gpt-4o-mini.
 */
export async function extractEventAndEdges(
  title: string,
  summary: string
): Promise<ExtractionResult> {
  const apiKey = process.env.OPEN_AI_API_KEY;

  // Fallback if no API key is provided
  if (!apiKey || apiKey.includes('your_openai_api_key')) {
    return getFallbackExtraction(title, summary);
  }

  try {
    const prompt = `You are Finfluence, an autonomous financial intelligence system.
Analyze the following news headline and snippet:

TITLE: "${title}"
SUMMARY: "${summary}"

KNOWN CANONICAL ENTITIES IN KNOWLEDGE GRAPH:
${CANONICAL_ENTITIES_SUMMARY}

TASK:
1. Determine if this article reports a significant macro or financial event (commodity shock, rate decision, regulation, geopolitical shock, macro data).
2. Extract all financial entities mentioned. Map them to a known canonical_id if they match; otherwise assign a descriptive canonical ID like "company.xyz" or "indicator.xyz".
3. Propose up to 8 candidate causal/impact edges connecting the event or primary driver to affected sectors, indicators, and equities.
4. STRICT RULES:
   - The LLM suggests hypotheses; historical market data will judge them.
   - Do NOT output hit rates, probability percentages, or certainty words (avoid "will rise", "guaranteed").
   - If the article directly asserts the link, quote the sentence in cited_sentence.
   - Mechanism tag should be a concise snake_case tag (e.g. "fuel_cost_operating_margin", "discount_rate_repricing").

Return ONLY a valid JSON object matching this schema:
{
  "is_event": boolean,
  "event_type": "commodity_shock" | "rate_decision" | "regulation" | "geopolitical" | "macro_data" | "corporate" | "other",
  "summary": string (1-2 sentences),
  "direction": "up" | "down" | "neutral" | "ambiguous",
  "magnitude_text": string (e.g. "+8%", "50 bps hike", or ""),
  "magnitude_value": number or null,
  "unit": string (e.g. "%", "bps", "USD/barrel", or ""),
  "entities": [
    { "name": string, "type": "commodity" | "indicator" | "sector" | "company" | "index" | "currency" | "institution", "canonical_id": string, "ticker": string or null }
  ],
  "candidate_edges": [
    {
      "source_id": string (canonical_id),
      "target_id": string (canonical_id),
      "relation": "INCREASES" | "DECREASES" | "AFFECTS" | "DEPENDS_ON" | "PART_OF",
      "direction": "positive" | "negative" | "ambiguous",
      "lag_hint": number (0 to 5 days),
      "rationale": string (1-2 sentences),
      "mechanism_tag": string,
      "cited_sentence": string (optional)
    }
  ]
}`;

    const completion = await openai.chat.completions.create({
      model: process.env.LLM_MODEL || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return getFallbackExtraction(title, summary);
    }

    const parsed = JSON.parse(content) as ExtractionResult;
    return parsed;
  } catch (err: any) {
    console.warn(`[OpenAI Extraction] API error (${err.message}). Using deterministic fallback.`);
    return getFallbackExtraction(title, summary);
  }
}

/**
 * Deterministic fallback extractor for offline demo safety (Principle 7).
 */
export function getFallbackExtraction(title: string, summary: string): ExtractionResult {
  const lower = (title + ' ' + summary).toLowerCase();

  if (lower.includes('oil') || lower.includes('crude') || lower.includes('brent')) {
    return {
      is_event: true,
      event_type: 'commodity_shock',
      summary: 'Crude oil benchmark surges amid global supply risk and geopolitical friction.',
      direction: 'up',
      magnitude_text: '+6.5%',
      magnitude_value: 6.5,
      unit: '%',
      entities: [
        { name: 'Brent Crude Oil', type: 'commodity', canonical_id: 'commodity.crude_oil', ticker: 'BZ=F' },
        { name: 'IndiGo Airlines', type: 'company', canonical_id: 'company.indigo', ticker: 'INDIGO.NS' },
        { name: 'Asian Paints', type: 'company', canonical_id: 'company.asian_paints', ticker: 'ASIANPAINT.NS' },
        { name: 'ONGC', type: 'company', canonical_id: 'company.ongc', ticker: 'ONGC.NS' },
        { name: 'USD/INR', type: 'currency', canonical_id: 'currency.usd_inr', ticker: 'INR=X' }
      ],
      candidate_edges: [
        {
          source_id: 'commodity.crude_oil',
          target_id: 'company.indigo',
          relation: 'DECREASES',
          direction: 'negative',
          lag_hint: 1,
          rationale: 'Surging crude increases aviation fuel costs, compressing passenger airline margins.',
          mechanism_tag: 'aviation_fuel_margin_squeeze'
        },
        {
          source_id: 'commodity.crude_oil',
          target_id: 'company.asian_paints',
          relation: 'DECREASES',
          direction: 'negative',
          lag_hint: 1,
          rationale: 'Petrochemical derivatives represent >50% of raw material costs for decorative coatings.',
          mechanism_tag: 'petrochemical_input_margin_erosion'
        },
        {
          source_id: 'commodity.crude_oil',
          target_id: 'company.ongc',
          relation: 'INCREASES',
          direction: 'positive',
          lag_hint: 1,
          rationale: 'Upstream exploration entities realize higher net realizations per barrel sold.',
          mechanism_tag: 'upstream_revenue_expansion'
        },
        {
          source_id: 'commodity.crude_oil',
          target_id: 'currency.usd_inr',
          relation: 'INCREASES',
          direction: 'positive',
          lag_hint: 2,
          rationale: 'India imports >85% of crude requirements; expanding trade deficit weighs on the rupee.',
          mechanism_tag: 'import_bill_currency_depreciation'
        }
      ]
    };
  }

  if (lower.includes('rate') || lower.includes('rbi') || lower.includes('repo') || lower.includes('fed')) {
    return {
      is_event: true,
      event_type: 'rate_decision',
      summary: 'Central bank enacts monetary policy rate adjustment to counter inflationary pressures.',
      direction: 'up',
      magnitude_text: '+50 bps',
      magnitude_value: 50,
      unit: 'bps',
      entities: [
        { name: 'Policy Rate Expectations', type: 'indicator', canonical_id: 'indicator.rate_expectations', ticker: null },
        { name: 'Nifty Bank', type: 'index', canonical_id: 'index.nifty_bank', ticker: '^NSEBANK' },
        { name: 'Nifty Realty', type: 'index', canonical_id: 'index.nifty_realty', ticker: '^CNXREALTY' },
        { name: 'Government 10Y Yield', type: 'instrument', canonical_id: 'instrument.yield_10y', ticker: '^TNX' }
      ],
      candidate_edges: [
        {
          source_id: 'indicator.rate_expectations',
          target_id: 'instrument.yield_10y',
          relation: 'INCREASES',
          direction: 'positive',
          lag_hint: 1,
          rationale: 'Rate tightening drives benchmark sovereign bond yields higher across the curve.',
          mechanism_tag: 'yield_curve_repricing'
        },
        {
          source_id: 'indicator.rate_expectations',
          target_id: 'index.nifty_bank',
          relation: 'AFFECTS',
          direction: 'negative',
          lag_hint: 2,
          rationale: 'Rising deposit costs and mark-to-market bond portfolio hits weigh on bank profitability.',
          mechanism_tag: 'banking_cost_of_funds_headwind'
        },
        {
          source_id: 'indicator.rate_expectations',
          target_id: 'index.nifty_realty',
          relation: 'DECREASES',
          direction: 'negative',
          lag_hint: 3,
          rationale: 'Higher home loan interest rates dampen residential buyer affordability and demand.',
          mechanism_tag: 'mortgage_rate_housing_slowdown'
        }
      ]
    };
  }

  return {
    is_event: false,
    event_type: 'other',
    summary: 'General market news update.',
    direction: 'neutral',
    entities: [],
    candidate_edges: []
  };
}
