export const MAX_CHAT_MESSAGE_LENGTH = 1000;
export const MAX_CAREER_PROMPT_LENGTH = 1200;
export const MAX_HISTORY_ITEMS = 20;

export function textField(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text && text.length <= maxLength ? text : null;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
