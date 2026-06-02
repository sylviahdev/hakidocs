import type { DocumentTypeId } from "./types";

export interface DocumentTypeMeta {
  id: DocumentTypeId;
  label: string;
  /** Short description shown in the picker. */
  description: string;
  /** Emoji icon for quick visual identification (mobile-first, no asset deps). */
  icon: string;
  /** Example prompt that fits this document type. */
  example: string;
}

/**
 * The catalogue of supported documents. `auto` lets the AI classify the
 * problem itself — the recommended default for everyday users.
 */
export const DOCUMENT_TYPES: DocumentTypeMeta[] = [
  {
    id: "auto",
    label: "Detect Automatically",
    description: "Let HakiDocs read your problem and choose the right document.",
    icon: "✨",
    example: "Just describe what happened in your own words.",
  },
  {
    id: "demand_letter",
    label: "Demand Letter",
    description: "Formally demand action, payment, or a remedy from someone.",
    icon: "📨",
    example: "A supplier took my money but never delivered the goods.",
  },
  {
    id: "rental_deposit_refund",
    label: "Rental Deposit Refund Letter",
    description: "Ask a landlord to return your withheld rental deposit.",
    icon: "🏠",
    example: "Landlord hanirudishii deposit yangu ya KSh 30,000.",
  },
  {
    id: "employment_complaint",
    label: "Employment Complaint Letter",
    description: "Raise a formal complaint about unfair treatment at work.",
    icon: "💼",
    example: "Boss alinifukuza bila notice na sijaqlipwa mshahara.",
  },
  {
    id: "service_agreement",
    label: "Service Agreement",
    description: "Set clear terms between a service provider and a client.",
    icon: "🤝",
    example: "Nataka agreement ya fundi wa nyumba kazi ya miezi mitatu.",
  },
  {
    id: "debt_demand",
    label: "Debt Demand Letter",
    description: "Demand repayment of money someone owes you.",
    icon: "💰",
    example: "My friend borrowed KSh 50,000 and refuses to pay back.",
  },
  {
    id: "consumer_complaint",
    label: "Consumer Complaint Letter",
    description: "Complain about a faulty product or poor service.",
    icon: "🛒",
    example: "Bought a phone that stopped working after two days.",
  },
  {
    id: "business_agreement",
    label: "Business Agreement",
    description: "Document terms between business partners or parties.",
    icon: "📑",
    example: "Two partners starting a salon want to split profits 60/40.",
  },
  {
    id: "general_notice",
    label: "General Legal Notice",
    description: "Give formal legal notice for any other situation.",
    icon: "⚖️",
    example: "Notice to a neighbour to stop blocking a shared access road.",
  },
];

export const DOCUMENT_TYPE_MAP: Record<DocumentTypeId, DocumentTypeMeta> =
  Object.fromEntries(DOCUMENT_TYPES.map((d) => [d.id, d])) as Record<
    DocumentTypeId,
    DocumentTypeMeta
  >;

export function documentTypeLabel(id: DocumentTypeId): string {
  return DOCUMENT_TYPE_MAP[id]?.label ?? "Legal Document";
}
