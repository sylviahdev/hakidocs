"use client";

import { useState } from "react";
import Link from "next/link";
import type { SavedDocument } from "@/lib/types";
import { documentTypeLabel } from "@/lib/documentTypes";
import DocumentView from "./DocumentView";

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function DashboardClient({
  initialDocuments,
}: {
  initialDocuments: SavedDocument[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [openId, setOpenId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleDelete(id: string) {
    if (!confirm("Delete this document permanently?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/documents?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDocuments((docs) => docs.filter((d) => d.id !== id));
        if (openId === id) setOpenId(null);
      }
    } finally {
      setDeleting(null);
    }
  }

  if (documents.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-haki-200 bg-white p-12 text-center">
        <div className="text-4xl">📄</div>
        <h2 className="mt-4 text-lg font-semibold text-haki-950">
          No documents yet
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
          Generate your first legal document and it will appear here for you to
          revisit, copy, and download anytime.
        </p>
        <Link
          href="/generate"
          className="mt-6 inline-block rounded-xl bg-haki-800 px-6 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-haki-900/10 transition hover:bg-haki-900"
        >
          Generate a document →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {documents.map((d) => {
        const isOpen = openId === d.id;
        return (
          <div
            key={d.id}
            className="overflow-hidden rounded-2xl border border-haki-100 bg-white shadow-sm"
          >
            <div className="flex flex-wrap items-center gap-3 p-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-haki-950">
                  {d.title || documentTypeLabel(d.document_type)}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">
                  {documentTypeLabel(d.document_type)} · {formatDate(d.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : d.id)}
                  className="rounded-lg border border-haki-200 bg-white px-3 py-1.5 text-sm font-medium text-haki-700 transition hover:bg-haki-50"
                >
                  {isOpen ? "Hide" : "View"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(d.id)}
                  disabled={deleting === d.id}
                  className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting === d.id ? "…" : "Delete"}
                </button>
              </div>
            </div>
            {isOpen && (
              <div className="border-t border-haki-100 bg-haki-50/40 p-4 sm:p-6">
                <DocumentView doc={d.document} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
