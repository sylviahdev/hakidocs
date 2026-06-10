import type { GeneratedDocument } from "./types";

/**
 * The generator inserts bracketed placeholders like [Landlord's Name] or
 * [Amount in KSh] wherever a specific detail is unknown (see lib/prompts.ts).
 * These helpers detect those placeholders so the UI can let the user fill
 * them in, and apply the filled values back into the document for export.
 */

// Matches a single [ ... ] token on one line. Greedy-free inner match.
export const PLACEHOLDER_RE = /\[[^\]\n]+\]/g;

/** Strip the surrounding brackets and trim: "[Your Name]" -> "Your Name". */
export function placeholderLabel(token: string): string {
  return token.slice(1, -1).trim();
}

/** Ordered, de-duplicated list of placeholder labels across the document. */
export function extractPlaceholders(doc: GeneratedDocument): string[] {
  const seen = new Set<string>();
  const order: string[] = [];
  const scan = (text: string) => {
    const matches = text.match(PLACEHOLDER_RE);
    if (!matches) return;
    for (const token of matches) {
      const label = placeholderLabel(token);
      if (label && !seen.has(label)) {
        seen.add(label);
        order.push(label);
      }
    }
  };
  scan(doc.title);
  for (const s of doc.sections) scan(s.body);
  scan(doc.swahiliSummary);
  return order;
}

/** Replace every [label] with its filled value; leave unfilled ones intact. */
export function fillText(
  text: string,
  values: Record<string, string>,
): string {
  return text.replace(PLACEHOLDER_RE, (token) => {
    const value = values[placeholderLabel(token)]?.trim();
    return value ? value : token;
  });
}

/** A copy of the document with all known placeholder values applied. */
export function fillDocument(
  doc: GeneratedDocument,
  values: Record<string, string>,
): GeneratedDocument {
  return {
    ...doc,
    title: fillText(doc.title, values),
    sections: doc.sections.map((s) => ({
      ...s,
      body: fillText(s.body, values),
    })),
    swahiliSummary: fillText(doc.swahiliSummary, values),
  };
}

/** How many of the given placeholders have a non-empty value. */
export function countFilled(
  placeholders: string[],
  values: Record<string, string>,
): number {
  return placeholders.filter((p) => values[p]?.trim()).length;
}
