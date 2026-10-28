import { NextResponse } from "next/server";
import { MAX_CAREER_PROMPT_LENGTH, isRecord, textField } from "@/lib/api-validation";
import { callAgentGateway } from "@/lib/ai-gateway";
import { getAiUserContext } from "@/lib/ai-context";
import { parseAgentResponse } from "@/lib/agent-schemas";
import { ProviderRequestError, ProviderUnavailableError } from "@/lib/server-config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!isRecord(body)) return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
  const prompt = textField(body.prompt, MAX_CAREER_PROMPT_LENGTH);
  const displayName = textField(body.displayName, 80);
  if (!prompt || !displayName) {
    return NextResponse.json({ error: "A career goal and display name are required." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await callAgentGateway("career", `User: ${displayName}. Goal: ${prompt}`, await getAiUserContext(), controller.signal);
    return NextResponse.json(parseAgentResponse("career", response));
  } catch (error) {
    if (error instanceof ProviderUnavailableError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 503 });
    }
    if (error instanceof ProviderRequestError) {
      return NextResponse.json({ error: "The AI provider request failed.", code: error.code }, { status: 502 });
    }
    return NextResponse.json({ error: "The AI provider request failed." }, { status: 502 });
  } finally {
    clearTimeout(timeout);
  }
}
