/**
 * Mantra AI Agents - Six Specialized Agents
 *
 * Each agent has a specific responsibility and system prompt:
 * 1. Companion Agent - Conversation and emotional support
 * 2. Career Navigator Agent - Career exploration and roadmaps
 * 3. Quest/Learning Agent - Educational activities and quizzes
 * 4. Reflection Agent - Journaling prompts and insights
 * 5. Community Safety Agent - Content moderation
 * 6. World Builder Agent - World customization guidance
 */

type AiResult = { response?: string; [key: string]: unknown };

interface WorkersAi {
  run(model: string, input: Record<string, unknown>): Promise<AiResult>;
}

interface WorkerEnv {
  AI: WorkersAi;
  AI_MODEL?: string;
  AGENT_TOKEN?: string;
}

// Agent System Prompts
const AGENTS = {
  companion: {
    name: "Companion Agent",
    instructions: `You are a warm, supportive AI companion in the Mantra app for students. Your role:
- Listen actively and respond with empathy and encouragement
- Keep responses concise (2-3 sentences typically)
- Be honest: you're an AI, not a therapist or emergency service
- Suggest practical small steps, not overwhelming solutions
- Acknowledge feelings without dismissing them
- If someone mentions crisis/self-harm, direct them to crisis resources (988 Lifeline)
- Never claim to perform actions you didn't do
- Use the companion character's name naturally in conversation

Tone: Warm, genuine, supportive but realistic.`,
  },

  career: {
    name: "Career Navigator Agent",
    instructions: `You are the Mantra Career Navigator helping students explore career paths.

CRITICAL: You must return ONLY valid JSON with this exact structure:
{
  "title": "Career Path Title",
  "summary": "2-3 sentence overview",
  "skills": ["skill1", "skill2", "skill3"],
  "steps": [
    {"title": "Step 1", "description": "What to do", "timeframe": "Duration"},
    {"title": "Step 2", "description": "What to do", "timeframe": "Duration"}
  ]
}

Guidelines:
- Be practical and honest about difficulty and time required
- Acknowledge uncertainty ("This path typically requires...")
- Tell users to verify requirements with official sources
- Don't guarantee outcomes or job placement
- Adapt to user's available time and resources
- Include free/low-cost learning resources when possible
- Consider different entry paths (bootcamp, self-taught, degree)`,
  },

  quest: {
    name: "Quest/Learning Agent",
    instructions: `You are the Mantra Quest Agent creating educational mini-activities.

Return valid JSON with this structure:
{
  "type": "quiz" | "challenge" | "reflection",
  "title": "Activity Title",
  "content": "Question or prompt",
  "options": ["option1", "option2", "option3", "option4"],
  "explanation": "Learning point or insight",
  "difficulty": "easy" | "medium" | "hard"
}

Guidelines:
- Make activities gentle, encouraging, and bite-sized
- Focus on wellbeing, self-awareness, or practical skills
- Celebrate effort over perfect answers
- Include thoughtful explanations
- Keep difficulty appropriate for students feeling overwhelmed`,
  },

  reflection: {
    name: "Reflection Agent",
    instructions: `You are the Mantra Reflection Agent helping users explore their thoughts.

Provide gentle, open-ended prompts that encourage self-reflection. Format:
{
  "prompt": "A thoughtful question",
  "context": "Why this matters (1 sentence)",
  "examples": ["Example 1", "Example 2"]
}

Guidelines:
- Questions should be open, not yes/no
- Avoid "why" (can feel judgmental), prefer "what" or "how"
- Make prompts specific enough to be useful
- Acknowledge that there are no wrong answers
- Keep tone curious and non-judgmental
- Suitable for students dealing with stress or uncertainty`,
  },

  safety: {
    name: "Community Safety Agent",
    instructions: `You are the Mantra Community Safety Agent reviewing reported content.

Return valid JSON:
{
  "severity": "low" | "medium" | "high" | "critical",
  "category": "harassment" | "threats" | "spam" | "privacy" | "other",
  "action": "dismiss" | "warn" | "hide" | "review_required",
  "reasoning": "Brief explanation",
  "requires_human": boolean
}

Guidelines:
- Critical: threats, self-harm, illegal content → requires_human: true
- High: harassment, doxxing, hate speech
- Medium: spam, repeated violations
- Low: minor rule breaks, edge cases
- When uncertain, flag for human review
- Consider context and intent
- Protect vulnerable users
- False positives are acceptable for safety`,
  },

  world: {
    name: "World Builder Agent",
    instructions: `You are the Mantra World Builder helping users customize their experience.

Return valid JSON with suggestions:
{
  "suggestion": "Customization idea",
  "reasoning": "Why this fits the user's preferences",
  "preview": "What it would look/feel like"
}

Guidelines:
- Consider user's selected universe (Avengers, Sanrio, etc.)
- Respect their stated preferences
- Suggest themes, colors, layouts that match their vibe
- Keep suggestions feasible and not overwhelming
- Explain how customization affects their experience
- Encourage experimentation and play`,
  },
} as const;

type AgentType = keyof typeof AGENTS;

// Utility Functions
function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function requestBody(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const value: unknown = await request.json();
    return typeof value === "object" && value !== null && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

function authorized(request: Request, env: WorkerEnv) {
  return !env.AGENT_TOKEN || request.headers.get("Authorization") === `Bearer ${env.AGENT_TOKEN}`;
}

// Main Agent Runner
async function runAgent(request: Request, env: WorkerEnv, agentType: AgentType) {
  if (!authorized(request, env)) return json({ error: "Unauthorized agent request." }, 401);

  const body = await requestBody(request);
  if (!body) return json({ error: "Request body must be a JSON object." }, 400);

  const agent = AGENTS[agentType];

  // Build messages based on agent type
  let messages: Array<{ role: string; content: string }>;
  let requiresJson = false;

  switch (agentType) {
    case "companion": {
      const message = body.message;
      if (typeof message !== "string" || !message.trim()) {
        return json({ error: "Message is required." }, 400);
      }
      messages = [
        { role: "system", content: agent.instructions },
        ...(Array.isArray(body.history) ? body.history.slice(-20) : []),
        {
          role: "user",
          content: `${String(body.companionName || "Companion")}, ${String(body.displayName || "friend")} says: ${message}`,
        },
      ];
      break;
    }

    case "career": {
      const prompt = body.prompt;
      if (typeof prompt !== "string" || !prompt.trim()) {
        return json({ error: "Career prompt is required." }, 400);
      }
      messages = [
        { role: "system", content: agent.instructions },
        { role: "user", content: `User: ${String(body.displayName || "Student")}. Goal: ${prompt}` },
      ];
      requiresJson = true;
      break;
    }

    case "quest": {
      const topic = body.topic || "wellbeing";
      const difficulty = body.difficulty || "easy";
      messages = [
        { role: "system", content: agent.instructions },
        { role: "user", content: `Create a ${difficulty} ${topic} activity.` },
      ];
      requiresJson = true;
      break;
    }

    case "reflection": {
      const context = body.context || "general";
      messages = [
        { role: "system", content: agent.instructions },
        { role: "user", content: `Generate a reflection prompt for: ${context}` },
      ];
      requiresJson = true;
      break;
    }

    case "safety": {
      const content = body.content;
      const reason = body.reason || "";
      if (typeof content !== "string") {
        return json({ error: "Content to review is required." }, 400);
      }
      messages = [
        { role: "system", content: agent.instructions },
        { role: "user", content: `Review this reported content.\nReason: ${reason}\nContent: ${content}` },
      ];
      requiresJson = true;
      break;
    }

    case "world": {
      const preferences = body.preferences || {};
      messages = [
        { role: "system", content: agent.instructions },
        {
          role: "user",
          content: `User preferences: ${JSON.stringify(preferences)}. Suggest a customization.`,
        },
      ];
      requiresJson = true;
      break;
    }

    default:
      return json({ error: "Unknown agent type." }, 400);
  }

  // Call AI
  const input: Record<string, unknown> = { messages };
  if (requiresJson) {
    input.response_format = { type: "json_object" };
  }

  try {
    const result = await env.AI.run(env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct", input);

    if (typeof result.response !== "string" || !result.response.trim()) {
      return json({ error: "Workers AI returned an empty response." }, 502);
    }

    // Handle response based on agent type
    if (agentType === "companion") {
      return json({ reply: result.response });
    }

    // For JSON responses, parse and return
    try {
      const parsed = JSON.parse(result.response);
      return json({ [agentType === "career" ? "roadmap" : "result"]: parsed });
    } catch {
      return json({ error: `${agent.name} returned invalid JSON.` }, 502);
    }
  } catch (error) {
    console.error(`Agent ${agentType} error:`, error);
    return json({ error: "Workers AI invocation failed." }, 502);
  }
}

// Worker Export
const worker = {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === "/" && request.method === "GET") {
      return json({
        status: "ok",
        agents: Object.keys(AGENTS),
        timestamp: new Date().toISOString(),
      });
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed." }, 405);
    }

    // Route to appropriate agent
    const agentPath = url.pathname.slice(1) as AgentType;
    if (agentPath in AGENTS) {
      return runAgent(request, env, agentPath);
    }

    return json({ error: "Agent route not found. Available: " + Object.keys(AGENTS).join(", ") }, 404);
  },
};

export default worker;
