import { ProviderRequestError } from "@/lib/server-config";

export type AgentName = "companion" | "career" | "quest" | "reflection" | "safety" | "world";

type RecordValue = Record<string, unknown>;

const MAX_TEXT = 2000;
const MAX_SHORT_TEXT = 500;
const MAX_ARRAY_ITEMS = 12;

function invalid(field: string): never {
  throw new ProviderRequestError(`AI agent returned invalid ${field}.`, 502);
}

function record(value: unknown): RecordValue {
  if (!value || typeof value !== "object" || Array.isArray(value)) invalid("object");
  return value as RecordValue;
}

function text(value: unknown, field: string, maxLength = MAX_TEXT): string {
  if (typeof value !== "string") invalid(field);
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) invalid(field);
  return normalized;
}

function textArray(value: unknown, field: string, maxItems = MAX_ARRAY_ITEMS): string[] {
  if (!Array.isArray(value) || value.length > maxItems) invalid(field);
  return value.map((item) => text(item, field, MAX_SHORT_TEXT));
}

function boolean(value: unknown, field: string): boolean {
  if (typeof value !== "boolean") invalid(field);
  return value;
}

function parseJson(raw: string): RecordValue {
  try {
    return record(JSON.parse(raw));
  } catch (error) {
    if (error instanceof ProviderRequestError) throw error;
    throw new ProviderRequestError("AI agent returned malformed JSON.", 502);
  }
}

export function parseAgentResponse(agent: AgentName, raw: string): RecordValue {
  const data = parseJson(raw);

  if (agent === "companion") {
    return { reply: text(data.reply, "reply") };
  }

  if (agent === "career") {
    if (!Array.isArray(data.steps) || data.steps.length === 0 || data.steps.length > MAX_ARRAY_ITEMS) invalid("steps");
    return {
      roadmap: {
        title: text(data.title, "title", MAX_SHORT_TEXT),
        summary: text(data.summary, "summary"),
        skills: textArray(data.skills, "skills"),
        steps: data.steps.map((step) => {
          const item = record(step);
          return {
            title: text(item.title, "step title", MAX_SHORT_TEXT),
            description: text(item.description, "step description"),
            timeframe: text(item.timeframe, "step timeframe", MAX_SHORT_TEXT),
          };
        }),
      },
    };
  }

  if (agent === "quest") {
    return {
      activity: {
        type: text(data.type, "type", MAX_SHORT_TEXT),
        title: text(data.title, "title", MAX_SHORT_TEXT),
        content: text(data.content, "content"),
        options: textArray(data.options, "options"),
        explanation: text(data.explanation, "explanation"),
        difficulty: text(data.difficulty, "difficulty", MAX_SHORT_TEXT),
      },
    };
  }

  if (agent === "reflection") {
    return {
      prompt: {
        prompt: text(data.prompt, "prompt"),
        context: text(data.context, "context", MAX_SHORT_TEXT),
        examples: textArray(data.examples, "examples"),
      },
    };
  }

  if (agent === "safety") {
    const severity = text(data.severity, "severity", MAX_SHORT_TEXT);
    const action = text(data.action, "action", MAX_SHORT_TEXT);
    if (!["low", "medium", "high", "critical"].includes(severity)) invalid("severity");
    if (!["dismiss", "warn", "hide", "review_required"].includes(action)) invalid("action");
    return {
      review: {
        severity,
        category: text(data.category, "category", MAX_SHORT_TEXT),
        action,
        reasoning: text(data.reasoning, "reasoning"),
        requires_human: boolean(data.requires_human, "requires_human"),
      },
    };
  }

  return {
    suggestion: {
      suggestion: text(data.suggestion, "suggestion"),
      reasoning: text(data.reasoning, "reasoning"),
      preview: text(data.preview, "preview"),
    },
  };
}
