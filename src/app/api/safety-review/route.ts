import { NextResponse } from "next/server";
import { isRecord, textField } from "@/lib/api-validation";
import {
  callCloudflareAgent,
  ProviderRequestError,
  ProviderUnavailableError,
} from "@/lib/server-config";

export const runtime = "nodejs";

type SafetyReviewResponse = {
  result?: {
    severity: "low" | "medium" | "high" | "critical";
    category: string;
    action: "dismiss" | "warn" | "hide" | "review_required";
    reasoning: string;
    requires_human: boolean;
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

  const content = textField(body.content, 5000);
  const reason = textField(body.reason, 1000) || "";

  if (!content) {
    return NextResponse.json({ error: "Content to review is required." }, { status: 400 });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  try {
    const result = await callCloudflareAgent<SafetyReviewResponse>(
      "safety",
      { content, reason },
      controller.signal,
    );

    if (!result.result) {
      return NextResponse.json({ error: "The safety agent returned no review." }, { status: 502 });
    }

    return NextResponse.json({ review: result.result });
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
