import { NextResponse } from "next/server";
import { generateDocument } from "@/lib/backend";
import { createClient } from "@/lib/supabase/server";
import { documentTypeLabel } from "@/lib/documentTypes";
import type {
  DocumentTypeId,
  GenerateRequestBody,
  GenerateResponse,
  Language,
} from "@/lib/types";

const VALID_TYPES: DocumentTypeId[] = [
  "demand_letter",
  "rental_deposit_refund",
  "employment_complaint",
  "service_agreement",
  "debt_demand",
  "consumer_complaint",
  "business_agreement",
  "general_notice",
  "auto",
];
const VALID_LANGUAGES: Language[] = ["auto", "english", "swahili", "sheng"];

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  let body: GenerateRequestBody;
  try {
    body = (await request.json()) as GenerateRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const problem = (body.problem ?? "").trim();
  const documentType = VALID_TYPES.includes(body.documentType)
    ? body.documentType
    : "auto";
  const language = VALID_LANGUAGES.includes(body.language)
    ? body.language
    : "auto";

  if (problem.length < 10) {
    return NextResponse.json(
      { error: "Please describe your problem in a little more detail." },
      { status: 400 },
    );
  }
  if (problem.length > 6000) {
    return NextResponse.json(
      { error: "Your description is too long. Please shorten it." },
      { status: 400 },
    );
  }

  let document;
  try {
    document = await generateDocument(problem, documentType, language);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to generate the document.";
    // Surface configuration errors clearly; keep model errors generic.
    const status = message.includes("GEMINI_API_KEY") ? 500 : 502;
    return NextResponse.json({ error: message }, { status });
  }

  // Normalise a couple of fields defensively.
  if (!document.documentTypeLabel) {
    document.documentTypeLabel = documentTypeLabel(document.documentType);
  }

  const result: GenerateResponse = { document };

  // Persist for signed-in users when Supabase is configured.
  try {
    const supabase = await createClient();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("documents")
          .insert({
            user_id: user.id,
            title: document.title,
            document_type: document.documentType,
            problem_input: problem,
            language,
            document,
          })
          .select("id")
          .single();
        if (!error && data) result.savedId = data.id as string;
      }
    }
  } catch {
    // Saving is best-effort — never block returning the document to the user.
  }

  return NextResponse.json(result);
}
