// Shared types for HakiDocs

export type DocumentTypeId =
  | "demand_letter"
  | "rental_deposit_refund"
  | "employment_complaint"
  | "service_agreement"
  | "debt_demand"
  | "consumer_complaint"
  | "business_agreement"
  | "general_notice"
  | "auto";

export type Language = "auto" | "english" | "swahili" | "sheng";

/** One titled section of the generated legal document. */
export interface DocumentSection {
  heading: string;
  /** Body text. May contain multiple paragraphs separated by "\n\n". */
  body: string;
}

/** The structured analysis the AI extracts from the user's free-text problem. */
export interface DocumentAnalysis {
  legalCategory: string;
  parties: string[];
  facts: string[];
  requestedRemedy: string;
}

/** The full structured document returned by the generation API. */
export interface GeneratedDocument {
  /** Resolved document type the AI decided on. */
  documentType: DocumentTypeId;
  /** Human-readable label, e.g. "Demand Letter". */
  documentTypeLabel: string;
  title: string;
  analysis: DocumentAnalysis;
  sections: DocumentSection[];
  /** Plain-language explanation of the document in Swahili. */
  swahiliSummary: string;
  /** Standard legal disclaimer. */
  disclaimer: string;
}

export interface GenerateRequestBody {
  problem: string;
  documentType: DocumentTypeId;
  language: Language;
}

export interface GenerateResponse {
  document: GeneratedDocument;
  /** Present only when the document was persisted for a signed-in user. */
  savedId?: string;
}

export interface ApiError {
  error: string;
}

/** A document row as stored in Supabase and returned to the dashboard. */
export interface SavedDocument {
  id: string;
  user_id: string;
  title: string;
  document_type: DocumentTypeId;
  problem_input: string;
  language: Language;
  document: GeneratedDocument;
  created_at: string;
}
