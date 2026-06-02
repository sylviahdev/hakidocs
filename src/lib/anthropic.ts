import Anthropic from "@anthropic-ai/sdk";
import type {
  DocumentTypeId,
  GeneratedDocument,
  Language,
} from "./types";
import { SYSTEM_PROMPT, buildUserPrompt, DOCUMENT_SCHEMA } from "./prompts";

let client: Anthropic | null = null;

/** Lazily construct the client so a missing key fails at call time, not import. */
function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local — see .env.example.",
    );
  }
  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}

const MODEL = "claude-opus-4-8";

/**
 * Generate a structured legal document from a free-text problem description.
 * Uses adaptive thinking + structured outputs, and prompt-caches the static
 * system prompt so repeat requests are cheaper.
 */
export async function generateDocument(
  problem: string,
  documentType: DocumentTypeId,
  language: Language,
): Promise<GeneratedDocument> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "medium",
      format: {
        type: "json_schema",
        schema: DOCUMENT_SCHEMA as unknown as Record<string, unknown>,
      },
    },
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [
      {
        role: "user",
        content: buildUserPrompt(problem, documentType, language),
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("The model returned no document content. Please try again.");
  }

  let parsed: GeneratedDocument;
  try {
    parsed = JSON.parse(textBlock.text) as GeneratedDocument;
  } catch {
    throw new Error("The model returned malformed output. Please try again.");
  }

  return parsed;
}
