import { NextResponse } from "next/server";
import { isRecord } from "@/lib/api-validation";
import { callCloudflareAgent } from "@/lib/server-config";

export const runtime = "nodejs";

type WorldSuggestionResponse = {
  result?: {
    suggestion: string;
    reasoning: string;
    preview: string;
  };
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!isRecord(body)) return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });

  const preferences = isRecord(body.preferences) ? body.preferences : {};

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const result = await callCloudflareAgent<WorldSuggestionResponse>(
      "world",
      { preferences },
      controller.signal,
    );

    if (!result.result) {
      return NextResponse.json({ error: "The world builder agent returned no suggestion." }, { status: 502 });
    }

    return NextResponse.json({ suggestion: result.result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The AI provider request failed.";
    const status = message.includes("not configured") || message.includes("must be") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  } finally {
    clearTimeout(timeout);
  }
}
