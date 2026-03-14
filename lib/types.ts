export interface Document {
  doc_id: string;
  country: string;
  institution_name: string;
  source_type: string;
  title: string;
  document_type: string;
  legal_status: string;
  relevance_class: "high" | "medium" | "low";
  publication_date: string;
  effective_date: string;
  thematic_tags: string[];
  sectors_affected: string[];
  mandatory_or_voluntary: string;
  reporting_entities: string;
  reporting_threshold: string;
  summary: string;
  confidence_score: number;
  source_url: string;
  document_url: string;
  acquisition_method: string;
  language_detected: string;
  requires_human_review: boolean;
  pipeline_run_date: string;
}

export interface Source {
  country: string;
  institution_name: string;
  source_type: string;
  base_url: string;
  seed_url: string;
  language: string;
  relevance_priority: string;
  crawl_tier: string;
  active: string;
}

export type FilterState = {
  country: string;
  relevance_class: string;
  legal_status: string;
  document_type: string;
  mandatory_or_voluntary: string;
  thematic_tag: string;
  search: string;
};
