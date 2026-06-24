"use client";

import { useEffect, useState } from "react";
import { DOCUMENT_TYPES } from "@/lib/documentTypes";
import type {
  DocumentTypeId,
  GeneratedDocument,
  GenerateResponse,
  Language,
} from "@/lib/types";
import { extractPlaceholders } from "@/lib/placeholders";
import DocumentView from "./DocumentView";

const LANGUAGES: { id: Language; label: string }[] = [
  { id: "auto", label: "Auto-detect" },
  { id: "english", label: "English" },
  { id: "swahili", label: "Swahili" },
  { id: "sheng", label: "Sheng" },
];

const EXAMPLES = [
  "Landlord hanirudishii deposit yangu ya KSh 30,000 baada ya kuhama.",
  "Boss alinifukuza kazi bila notice na sijalipwa mshahara wa mwezi mmoja.",
  "Nataka agreement ya fundi wa nyumba — kazi ya miezi mitatu, KSh 5,000 kwa wiki.",
  "A customer bought goods worth KSh 80,000 on credit and refuses to pay.",
];

// Staged "thinking" messages — make the wait feel like real legal reasoning.
const THINKING_STAGES = [
  "Reading your problem…",
  "Detecting the language…",
  "Identifying the parties involved…",
  "Determining the legal category…",
  "Structuring the document…",
  "Drafting in formal language…",
  "Writing your Swahili summary…",
  "Finalising your document…",
];

export default function GeneratorForm({
  showHeading = true,
}: {
  showHeading?: boolean;
}) {
  const [problem, setProblem] = useState("");
  const [docType, setDocType] = useState<DocumentTypeId>("auto");
  const [language, setLanguage] = useState<Language>("auto");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [doc, setDoc] = useState<GeneratedDocument | null>(null);
  const [stage, setStage] = useState(0);

  const charCount = problem.trim().length;
  const canSubmit = charCount >= 10 && !loading;

  // Advance the thinking stages while a request is in flight.
  useEffect(() => {
    if (!loading) {
      setStage(0);
      return;
    }
    const id = setInterval(() => {
      setStage((s) => Math.min(s + 1, THINKING_STAGES.length - 1));
    }, 1400);
    return () => clearInterval(id);
  }, [loading]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setDoc(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problem, documentType: docType, language }),
      });
      const data = (await res.json()) as GenerateResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      setDoc(data.document);

      if (typeof pendo !== "undefined") {
        pendo.track("document_generated", {
          documentType: data.document.documentType,
          documentTypeLabel: data.document.documentTypeLabel,
          language,
          problemLength: problem.length,
          sectionCount: data.document.sections.length,
          placeholderCount: extractPlaceholders(data.document).length,
          wasSaved: Boolean(data.savedId),
          documentTitle: data.document.title,
        });
      }
      setTimeout(
        () =>
          document
            .getElementById("haki-result")
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        80,
      );
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unexpected error.";
      setError(errorMessage);

      if (typeof pendo !== "undefined") {
        pendo.track("document_generation_failed", {
          documentType: docType,
          language,
          problemLength: problem.length,
          errorMessage,
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="card-elevated rounded-2xl p-5 sm:p-7"
      >
        {showHeading && (
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-600">
              Step 1
            </p>
            <h2 className="font-display mt-1 text-2xl font-semibold text-haki-950">
              Describe your problem
            </h2>
            <p className="mt-1 text-sm text-haki-500">
              Write naturally in English, Swahili, or Sheng. HakiDocs will do the
              rest.
            </p>
          </div>
        )}

        {/* Controls — choose document type & language first */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="docType"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-haki-500"
            >
              Document type
            </label>
            <select
              id="docType"
              value={docType}
              onChange={(e) => setDocType(e.target.value as DocumentTypeId)}
              className="w-full rounded-xl border border-haki-200 bg-white px-3 py-2.5 text-sm text-haki-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
            >
              {DOCUMENT_TYPES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.icon} {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="language"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-haki-500"
            >
              Input language
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full rounded-xl border border-haki-200 bg-white px-3 py-2.5 text-sm text-haki-900 outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-200"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem input */}
        <label
          htmlFor="problem"
          className="mt-6 mb-1.5 block text-xs font-semibold uppercase tracking-wide text-haki-500"
        >
          Describe your problem
        </label>
        <textarea
          id="problem"
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          rows={5}
          maxLength={6000}
          placeholder="e.g. Landlord hanirudishii deposit yangu baada ya kuhama nyumba..."
          className="w-full resize-y rounded-xl border border-haki-200 bg-haki-50/40 p-4 text-[0.95rem] text-haki-900 outline-none transition placeholder:text-haki-400 focus:border-gold-400 focus:bg-white focus:ring-2 focus:ring-gold-200"
        />

        {/* Example chips */}
        <div className="mt-3">
          <p className="mb-2 text-xs font-medium text-haki-400">
            Try an example:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setProblem(ex)}
                className="rounded-full border border-haki-100 bg-haki-50 px-3 py-1 text-left text-xs text-haki-700 transition hover:border-gold-300 hover:bg-gold-50 hover:text-gold-700"
              >
                {ex.length > 48 ? ex.slice(0, 46) + "…" : ex}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-haki-400">
            {charCount < 10
              ? "Add a little more detail to continue."
              : `${charCount} characters`}
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-haki-800 px-7 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-haki-900/10 transition hover:bg-haki-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-haki-200 disabled:text-haki-400 disabled:ring-0"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold-300/40 border-t-gold-300" />
                Drafting…
              </>
            ) : (
              <>
                <span className="text-gold-300">⚖️</span> Generate Document
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
      </form>

      {/* Thinking state — staged "reasoning" while the model works */}
      {loading && (
        <div className="card-elevated mt-8 overflow-hidden rounded-2xl">
          <div className="relative border-b border-haki-100 bg-haki-950 px-6 py-5 text-white">
            <div className="flex items-center gap-3">
              <span className="h-5 w-5 animate-spin rounded-full border-2 border-gold-300/30 border-t-gold-300" />
              <span className="font-display text-lg font-medium">
                {THINKING_STAGES[stage]}
              </span>
            </div>
            {/* progress bar */}
            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-700 ease-out"
                style={{
                  width: `${((stage + 1) / THINKING_STAGES.length) * 100}%`,
                }}
              />
            </div>
            <p className="mt-2 text-xs text-haki-300">
              HakiDocs is reasoning through your case — this usually takes under a
              minute.
            </p>
          </div>
          {/* skeleton paper */}
          <div className="animate-pulse p-8">
            <div className="mx-auto h-6 w-1/2 rounded bg-haki-100" />
            <div className="mx-auto mt-3 h-3 w-1/3 rounded bg-haki-50" />
            <div className="mt-8 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 rounded bg-haki-100"
                  style={{ width: `${95 - i * 6}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Result */}
      {doc && !loading && (
        <div id="haki-result" className="mt-8 scroll-mt-24">
          <DocumentView doc={doc} />
        </div>
      )}
    </div>
  );
}
