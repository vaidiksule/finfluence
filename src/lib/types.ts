export type NodeType =
  | 'event'
  | 'commodity'
  | 'indicator'
  | 'sector'
  | 'company'
  | 'index'
  | 'currency'
  | 'instrument'
  | 'institution';

export type MarketType = 'India' | 'US' | 'Global';

export type RelationType =
  | 'INCREASES'
  | 'DECREASES'
  | 'AFFECTS'
  | 'DEPENDS_ON'
  | 'PART_OF';

export type EdgeDirection = 'positive' | 'negative' | 'ambiguous';

export type EdgeState = 'proposed' | 'stated' | 'inferred' | 'validated' | 'contradicted';

export type CreatedByType = 'prior' | 'llm' | 'article';

export interface EventStudyWindow {
  n: number;
  hits: number;
  hit_rate: number;
  mean_car: number;
  median_car?: number;
  std_error?: number;
  p_value: number;
  significance: 'insignificant' | 'suggestive' | 'significant';
}

export interface ArticleEvidence {
  article_id: string;
  title: string;
  url?: string;
  published_at?: string;
  relevance: number; // 0 to 1
  supports: boolean | 'neutral';
  quote_span?: string;
}

export interface EvidenceProvenance {
  article_id: string;
  url?: string;
  quote_span?: string;
  retrieved_at: string;
  content_hash?: string;
  extraction_model?: string;
  extraction_version?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: NodeType;
  market: MarketType;
  ticker?: string | null;
  measurable: boolean;
  proxy_of?: string | null;
  description?: string;
  first_seen?: string;
  last_seen?: string;
  unresolved?: boolean;
  review_status?: 'pending' | 'approved' | 'rejected';
  // 3D visualization coordinates (populated dynamically by 3d force graph)
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

export interface GraphEdge {
  id: string;
  source: string; // node ID or object in 3D-force-graph
  target: string; // node ID or object in 3D-force-graph
  relation: RelationType;
  direction: EdgeDirection;
  state: EdgeState;
  confidence: number; // 0 to 1
  rationale: string;
  mechanism_tag?: string;
  lag_best?: number; // days (0-5)
  corr_best?: number; // -1 to 1
  event_study?: {
    windows: {
      [windowDays: string]: EventStudyWindow; // e.g. "1", "5", "10"
    };
    trigger_count?: number;
  };
  evidence: ArticleEvidence[];
  components_used: string[]; // e.g. ["event_study", "correlation", "article_evidence"]
  last_validated?: string;
  created_by: CreatedByType;
  cited_sentence?: string;
  state_reason?: string;
  review_status?: 'proposed' | 'approved' | 'rejected';
  provenance?: EvidenceProvenance[];
  audit_version?: string;
}

export interface RipplePath {
  path_id: string;
  nodes: string[];
  edges: GraphEdge[];
  total_confidence: number; // product of edge confidences
  hop_count: number;
  warnings: string[]; // e.g. "weakened: includes contradicted edge", "partly unverified"
}

export interface DetectedEvent {
  id: string;
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
  occurred_at: string;
  confidence_in_extraction: number;
}

export interface IngestedArticle {
  id: string;
  source: string;
  url?: string;
  title: string;
  summary?: string;
  published_at: string;
  fetched_at: string;
  is_replay: boolean;
  event?: DetectedEvent | null;
  extracted_entities?: string[];
  proposed_edges_count?: number;
  content_hash?: string;
  retrieved_at?: string;
  extraction_model?: string;
  extraction_version?: string;
  source_kind?: 'user_submitted' | 'rss' | 'public_url' | 'replay';
}

export type SSEEventType =
  | 'status'
  | 'article_ingested'
  | 'event_detected'
  | 'node_added'
  | 'edge_added'
  | 'edge_updated'
  | 'validation_progress'
  | 'paths_updated';

export interface SSEMessage {
  type: SSEEventType;
  data: any;
  timestamp: string;
}

export interface ScoringConfig {
  min_events_for_verdict: number;
  validated_min_confidence: number;
  contradicted_max_hit_rate: number;
  significance_p_value_threshold: number;
  suggestive_p_value_threshold: number;
  weights: {
    event_study: number;
    correlation: number;
    article_evidence: number;
  };
  estimation_window_days: number;
  event_study_windows: number[];
  trigger_threshold_sigma: number;
}
