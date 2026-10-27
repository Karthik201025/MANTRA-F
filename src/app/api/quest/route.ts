import { NextResponse } from "next/server";
import { isRecord, textField } from "@/lib/api-validation";
import { callCloudflareAgent } from "@/lib/server-config";

export const runtime = "nodejs";

type QuestResponse = {
  result?: {
    type: string;
    title: string;
    content: string;
    options?: string[];
    explanation?: string;
    difficulty?: string;
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

  const topic = textField(body.topic, 100) || "wellbeing";
  const difficulty = textField(body.difficulty, 20) || "easy";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const result = await callCloudflareAgent<QuestResponse>(
      "quest",
      { topic, difficulty },
      controller.signal,
    );

    if (!result.result) {
      return NextResponse.json({ error: "The quest agent returned no activity." }, { status: 502 });
    }

    return NextResponse.json({ activity: result.result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "The AI provider request failed.";
    const status = message.includes("not configured") || message.includes("must be") ? 503 : 502;
    return NextResponse.json({ error: message }, { status });
  } finally {
    clearTimeout(timeout);
  }
}
