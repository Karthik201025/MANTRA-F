import { Agent } from "agents";

export class MantraAgent extends Agent<Cloudflare.Env> {
  async onRequest(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed." }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }
    const body = await request.json().catch(() => null) as { prompt?: string } | null;
    if (!body?.prompt?.trim()) {
      return new Response(JSON.stringify({ error: "Prompt is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    const result = await this.env.AI.run(this.env.AI_MODEL || "@cf/meta/llama-3.1-8b-instruct", {
      messages: [{ role: "user", content: body.prompt }],
    });
    return new Response(JSON.stringify({ response: result.response || "" }), {
      headers: { "Content-Type": "application/json" },
    });
  }
}
