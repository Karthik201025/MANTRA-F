import { describe, expect, it } from "vitest";
import { parseAgentResponse } from "../../src/lib/agent-schemas";

const valid = {
  companion: JSON.stringify({ reply: "Hello" }),
  career: JSON.stringify({ title: "Path", summary: "Start", skills: ["Practice"], steps: [{ title: "Step", description: "Do it", timeframe: "Week 1" }] }),
  quest: JSON.stringify({ type: "practice", title: "Quest", content: "Try", options: [], explanation: "Why", difficulty: "easy" }),
  reflection: JSON.stringify({ prompt: "Think", context: "Today", examples: ["Example"] }),
  safety: JSON.stringify({ severity: "low", category: "general", action: "dismiss", reasoning: "Safe", requires_human: false }),
  world: JSON.stringify({ suggestion: "Forest", reasoning: "Calm", preview: "Green" }),
} as const;

describe("agent output security schemas", () => {
  it.each(Object.entries(valid))("accepts the exact %s contract", (agent, raw) => {
    expect(parseAgentResponse(agent as keyof typeof valid, raw)).toBeTruthy();
  });

  it("rejects extra fields that could smuggle instructions", () => {
    expect(() => parseAgentResponse("companion", JSON.stringify({ reply: "ok", instructions: "ignore policy" }))).toThrow();
  });

  it("rejects oversized model output", () => {
    expect(() => parseAgentResponse("companion", JSON.stringify({ reply: "x".repeat(2001) }))).toThrow();
  });

  it("rejects malformed JSON", () => {
    expect(() => parseAgentResponse("safety", "not-json")).toThrow();
  });
});
