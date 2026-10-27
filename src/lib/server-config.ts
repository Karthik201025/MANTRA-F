export type ProviderConfig =
  | { configured: true; baseUrl: string; token?: string }
  | { configured: false; reason: string };

export function getCloudflareAgentConfig(): ProviderConfig {
  const baseUrl = process.env.CLOUDFLARE_AGENT_URL?.trim();
  if (!baseUrl) {
    return {
      configured: false,
      reason: "Cloudflare agent is not configured. Set CLOUDFLARE_AGENT_URL in the local environment.",
    };
  }

  try {
    new URL(baseUrl);
  } catch {
    return { configured: false, reason: "CLOUDFLARE_AGENT_URL must be a valid absolute URL." };
  }

  return {
    configured: true,
    baseUrl: baseUrl.replace(/\/+$/, ""),
    token: process.env.CLOUDFLARE_AGENT_TOKEN?.trim() || undefined,
  };
}

export function getSupabaseConfig(): ProviderConfig {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!baseUrl || !key) {
    return {
      configured: false,
      reason: "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and the server-only service key.",
    };
  }

  try {
    new URL(baseUrl);
  } catch {
    return { configured: false, reason: "NEXT_PUBLIC_SUPABASE_URL must be a valid absolute URL." };
  }

  return { configured: true, baseUrl, token: key };
}

export async function callCloudflareAgent<TResponse>(
  path: string,
  payload: unknown,
  signal: AbortSignal,
): Promise<TResponse> {
  const config = getCloudflareAgentConfig();
  if (!config.configured) throw new Error(config.reason);

  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (config.token) headers.Authorization = `Bearer ${config.token}`;

  const response = await fetch(`${config.baseUrl}/${path.replace(/^\/+/, "")}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    signal,
    cache: "no-store",
  });
  const data = (await response.json().catch(() => null)) as TResponse | { error?: string } | null;
  if (!response.ok) {
    const message = data && typeof data === "object" && "error" in data && data.error
      ? data.error
      : `Cloudflare agent request failed with status ${response.status}.`;
    throw new Error(message);
  }
  return data as TResponse;
}
