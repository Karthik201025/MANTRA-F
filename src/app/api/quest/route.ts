import { NextResponse } from "next/server";
import { isRecord, textField } from "@/lib/api-validation";
import {
  callCloudflareAgent,
  ProviderRequestError,
  ProviderUnavailableError,
} from "@/lib/server-config";

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
