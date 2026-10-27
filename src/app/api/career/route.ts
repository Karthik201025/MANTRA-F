import { NextResponse } from "next/server";
import { MAX_CAREER_PROMPT_LENGTH, isRecord, textField } from "@/lib/api-validation";
import { callCloudflareAgent } from "@/lib/server-config";

export const runtime = "nodejs";

type CareerResponse = { roadmap?: unknown };

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
    const result = await callCloudflareAgent<CareerResponse>(
      "career",
      { prompt, displayName },
      controller.signal,
    );
    if (!result.roadmap) return NextResponse.json({ error: "The configured agent returned no roadmap." }, { status: 502 });
    return NextResponse.json({ roadmap: result.roadmap });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The AI provider request failed.";
    const status = message.includes("not configured") || message.includes("must be") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  } finally {
    clearTimeout(timeout);
  }
}
