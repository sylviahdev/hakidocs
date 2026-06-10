"use client";

import { useMemo, useState } from "react";
import type { GeneratedDocument } from "@/lib/types";
import { downloadDocumentPdf } from "@/lib/pdf";
import {
  PLACEHOLDER_RE,
  countFilled,
  extractPlaceholders,
  fillDocument,
  placeholderLabel,
} from "@/lib/placeholders";
import Seal from "./Seal";
import PlaceholderPanel from "./PlaceholderPanel";

function toPlainText(doc: GeneratedDocument): string {
  const parts: string[] = [];
  parts.push(doc.title.toUpperCase());
  parts.push("PROFESSIONAL LEGAL DOCUMENT\n");
  for (const s of doc.sections) {
    parts.push(s.heading.toUpperCase());
    parts.push(s.body + "\n");
  }
  parts.push("MUHTASARI (SWAHILI SUMMARY)");
  parts.push(doc.swahiliSummary + "\n");
  parts.push(doc.disclaimer);
  return parts.join("\n");
}

/**
 * Render a string, swapping filled placeholders for their value and visually
 * marking any [blank] that is still empty.
 */
function renderText(
  text: string,
  values: Record<string, string>,
  highlight: boolean,
  keyPrefix: string,
): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const re = new RegExp(PLACEHOLDER_RE.source, "g");
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const value = values[placeholderLabel(match[0])]?.trim();
    if (value) {
      nodes.push(
        <span key={`${keyPrefix}-${i}`} className="font-semibold text-haki-950">
          {value}
        </span>,
      );
    } else {
      nodes.push(
        <span
          key={`${keyPrefix}-${i}`}
          className={
            highlight
              ? "rounded bg-gold-100 px-1 text-gold-800 ring-1 ring-gold-300 print:bg-transparent print:text-haki-900 print:ring-0"
              : undefined
          }
        >
          {match[0]}
        </span>,
      );
    }
    last = match.index + match[0].length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

function ActionButton({
  onClick,
  children,
  primary = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition active:scale-[0.98] ${
        primary
          ? "bg-haki-800 text-white shadow-sm ring-1 ring-haki-900/10 hover:bg-haki-900"
          : "border border-haki-200 bg-white text-haki-800 hover:border-gold-300 hover:bg-gold-50"
      }`}
    >
      {children}
    </button>
  );
}

export default function DocumentView({ doc }: { doc: GeneratedDocument }) {
  const [copied, setCopied] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [highlight, setHighlight] = useState(true);

  const placeholders = useMemo(() => extractPlaceholders(doc), [doc]);
  const remaining = placeholders.length - countFilled(placeholders, values);

  // The export-ready document with all filled values applied.
  const filledDoc = useMemo(
    () => fillDocument(doc, values),
    [doc, values],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(toPlainText(filledDoc));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard may be blocked; ignore silently.
    }
  };

  const r = (text: string, keyPrefix: string) =>
    renderText(text, values, highlight, keyPrefix);

  return (
    <div className="animate-fade-up">
      {/* Inline placeholder editor */}
      {placeholders.length > 0 && (
        <PlaceholderPanel
          placeholders={placeholders}
          values={values}
          onChange={(label, value) =>
            setValues((v) => ({ ...v, [label]: value }))
          }
          highlight={highlight}
          onToggleHighlight={setHighlight}
        />
      )}

      {/* Success banner + action bar */}
      <div className="no-print mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
          ✓ Your document is ready
        </span>
        <div className="flex flex-wrap items-center gap-3">
          <ActionButton onClick={handleCopy} primary>
            {copied ? "✓ Copied" : "📋 Copy"}
          </ActionButton>
          <ActionButton onClick={() => downloadDocumentPdf(filledDoc)}>
            ⬇️ Download PDF
          </ActionButton>
          <ActionButton onClick={() => window.print()}>🖨️ Print</ActionButton>
        </div>
      </div>

      {/* Reminder when blanks remain */}
      {remaining > 0 && (
        <div className="no-print mb-4 flex items-center gap-2 rounded-lg border border-gold-200 bg-gold-50 px-4 py-2.5 text-sm text-gold-800">
          <span>⚠️</span>
          <span>
            {remaining} blank{remaining > 1 ? "s" : ""} still to fill before you
            send or export. Empty blanks export as{" "}
            <span className="font-mono text-xs">[like this]</span>.
          </span>
        </div>
      )}

      {/* The document sheet — this is the print target */}
      <article className="print-area legal-document card-elevated relative overflow-hidden rounded-2xl p-6 sm:p-12">
        {/* Gold accent edge */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-700"
        />

        {/* Embossed seal, top-right */}
        <div className="absolute right-5 top-7 hidden sm:block">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-gold-200 bg-white/60 shadow-sm">
            <Seal size={56} />
          </div>
        </div>

        <header className="mb-9 border-b border-haki-100 pb-7 text-center">
          <div className="mb-4 flex justify-center sm:hidden">
            <Seal size={44} />
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
            {doc.documentTypeLabel}
          </p>
          <h1 className="font-serif text-2xl font-bold uppercase leading-tight text-haki-950 sm:text-3xl">
            {r(doc.title, "title")}
          </h1>
          <p className="mt-3 text-[0.65rem] uppercase tracking-[0.35em] text-haki-400">
            Drafted by HakiDocs · Republic of Kenya
          </p>
        </header>

        <div className="space-y-8">
          {doc.sections.map((section, i) => (
            <section key={i}>
              <h2 className="mb-2 flex items-baseline gap-2 font-serif text-base font-bold uppercase tracking-wide text-haki-900">
                <span className="text-gold-600">{i + 1}.</span>
                {section.heading}
              </h2>
              <div className="space-y-3 text-[0.95rem] text-haki-900">
                {section.body.split(/\n{2,}/).map((para, j) => (
                  <p key={j} className="whitespace-pre-wrap">
                    {r(para.trim(), `s${i}-p${j}`)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Swahili summary */}
        <section className="mt-10 rounded-xl border border-gold-200 bg-gold-50 p-5">
          <h2 className="mb-2 flex items-center gap-2 font-serif text-base font-bold uppercase tracking-wide text-gold-800">
            <span>📌</span> Muhtasari · Swahili Summary
          </h2>
          <p className="whitespace-pre-wrap text-[0.95rem] italic text-gold-900">
            {r(doc.swahiliSummary, "swahili")}
          </p>
        </section>

        {/* Disclaimer */}
        <footer className="mt-8 border-t border-haki-100 pt-4">
          <p className="text-xs italic leading-relaxed text-haki-400">
            {doc.disclaimer}
          </p>
        </footer>
      </article>
    </div>
  );
}
