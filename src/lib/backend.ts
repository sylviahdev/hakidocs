import type {
  DocumentTypeId,
  GeneratedDocument,
  Language,
} from "./types";

/**
 * Base URL of the HakiDocs Python (FastAPI) backend, which owns document
 * generation. Set HAKIDOCS_BACKEND_URL in the environment for non-local
 * deployments. This is read server-side (the /api/generate route runs on
 * Node), so it is intentionally not a NEXT_PUBLIC_ variable.
 */
const BACKEND_URL = (
  process.env.HAKIDOCS_BACKEND_URL ?? "http://localhost:8000"
).replace(/\/+$/, "");

interface GenerateResponseBody {
  document: GeneratedDocument;
}

interface BackendErrorBody {
  error?: string;
  detail?: string;
}

/**
 * Generate a structured legal document by delegating to the FastAPI backend.
 * The backend performs the Gemini call (thinking, structured JSON output,
 * implicit prompt caching); this client just forwards the request and unwraps
 * the response. Errors are surfaced with a clean, user-facing message.
 */
export async function generateDocument(
  problem: string,
  documentType: DocumentTypeId,
  language: Language,
): Promise<GeneratedDocument> {
  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem, documentType, language }),
      // Generation can take a while; let the platform's own timeout govern.
      cache: "no-store",
    });
  } catch {
    throw new Error(
      "Could not reach the document service. Please try again shortly.",
    );
  }

  if (!res.ok) {
    let message = "Failed to generate the document. Please try again.";
    try {
      const body = (await res.json()) as BackendErrorBody;
      message = body.error ?? body.detail ?? message;
    } catch {
      // Non-JSON error body — keep the default message.
    }
    throw new Error(message);
  }

  const body = (await res.json()) as GenerateResponseBody;
  if (!body?.document) {
    throw new Error("The document service returned an empty response.");
  }
  return body.document;
}
