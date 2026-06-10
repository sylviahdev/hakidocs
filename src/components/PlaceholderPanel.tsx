"use client";

import { countFilled } from "@/lib/placeholders";

/**
 * Editable checklist of the document's [bracketed] placeholders. Typing a value
 * fills it live everywhere it appears in the document (handled by DocumentView).
 */
export default function PlaceholderPanel({
  placeholders,
  values,
  onChange,
  highlight,
  onToggleHighlight,
}: {
  placeholders: string[];
  values: Record<string, string>;
  onChange: (label: string, value: string) => void;
  highlight: boolean;
  onToggleHighlight: (next: boolean) => void;
}) {
  const filled = countFilled(placeholders, values);
  const total = placeholders.length;
  const done = filled === total;

  return (
    <div className="no-print mb-5 overflow-hidden rounded-2xl border border-gold-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gold-100 bg-gold-50 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className="text-lg">✍️</span>
          <div>
            <p className="text-sm font-semibold text-gold-900">
              Fill in your details
            </p>
            <p className="text-xs text-gold-700">
              {done
                ? "All blanks filled — your document is ready to send."
                : "Complete the blanks below to finish your document."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium text-gold-800">
            <input
              type="checkbox"
              checked={highlight}
              onChange={(e) => onToggleHighlight(e.target.checked)}
              className="h-3.5 w-3.5 accent-gold-600"
            />
            Highlight blanks
          </label>
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
              done
                ? "bg-emerald-100 text-emerald-700"
                : "bg-gold-200 text-gold-800"
            }`}
          >
            {filled} / {total} done
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full bg-gold-100">
        <div
          className={`h-full transition-all duration-500 ease-out ${
            done ? "bg-emerald-500" : "bg-gold-500"
          }`}
          style={{ width: `${total ? (filled / total) * 100 : 0}%` }}
        />
      </div>

      {/* Inputs */}
      <div className="grid gap-3 p-5 sm:grid-cols-2">
        {placeholders.map((label) => {
          const value = values[label] ?? "";
          const isFilled = value.trim().length > 0;
          return (
            <div key={label}>
              <label
                htmlFor={`ph-${label}`}
                className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-haki-700"
              >
                {isFilled ? (
                  <span className="text-emerald-600">✓</span>
                ) : (
                  <span className="text-gold-500">●</span>
                )}
                {label}
              </label>
              <input
                id={`ph-${label}`}
                type="text"
                value={value}
                onChange={(e) => onChange(label, e.target.value)}
                placeholder={`Enter ${label.toLowerCase()}…`}
                className={`w-full rounded-lg border px-3 py-2 text-sm text-haki-900 outline-none transition placeholder:text-haki-300 focus:ring-2 focus:ring-gold-200 ${
                  isFilled
                    ? "border-emerald-200 bg-emerald-50/40 focus:border-emerald-400"
                    : "border-gold-200 bg-gold-50/40 focus:border-gold-400"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
