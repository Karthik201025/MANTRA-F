import { NextResponse } from "next/server";
import {
  MAX_CHAT_MESSAGE_LENGTH,
  MAX_HISTORY_ITEMS,
  isRecord,
  textField,
} from "@/lib/api-validation";
import { callAiGateway } from "@/lib/ai-gateway";
import { contextPrompt, getAiUserContext } from "@/lib/ai-context";
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

  const message = textField(body.message, MAX_CHAT_MESSAGE_LENGTH);
  const companionName = textField(body.companionName, 80);
  const displayName = textField(body.displayName, 80);
  const history = Array.isArray(body.history) ? body.history.slice(-MAX_HISTORY_ITEMS) : [];
  if (!message || !companionName || !displayName) {
    return NextResponse.json({ error: "Message, display name and companion name are required." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);
  try {
    const userContext = await getAiUserContext();
    const reply = await callAiGateway([
      { role: "system", content: `You are ${companionName}, a warm and supportive AI companion. Keep replies concise, honest, and practical.\n${contextPrompt(userContext)}` },
      ...history.filter((item): item is { role: "user" | "assistant"; content: string } =>
        typeof item === "object" && item !== null &&
        (item as { role?: unknown }).role !== undefined &&
        ((item as { role?: unknown }).role === "user" || (item as { role?: unknown }).role === "assistant") &&
        typeof (item as { content?: unknown }).content === "string",
      ).map((item) => ({ role: item.role, content: item.content })),
      { role: "user", content: `${displayName} says: ${message}` },
    ], controller.signal);
    return NextResponse.json(parseAgentResponse("companion", JSON.stringify({ reply })));
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
