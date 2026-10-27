import { NextResponse } from "next/server";
import { isRecord, textField } from "@/lib/api-validation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to view your profile." }, { status: 401 });

    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, universe, companion, theme, created_at, updated_at")
      .eq("id", userData.user.id)
      .single();

    if (error) {
      // Profile doesn't exist yet - create default
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({ id: userData.user.id, display_name: "Hero" })
        .select("id, display_name, universe, companion, theme, created_at, updated_at")
        .single();

      if (createError) return NextResponse.json({ error: "Profile could not be created." }, { status: 502 });
      return NextResponse.json({ profile: newProfile });
    }

    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for user profiles." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!isRecord(body)) return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });

  const updates: Record<string, string> = {};
  if (body.displayName) updates.display_name = textField(body.displayName, 80) || "Hero";
  if (body.universe) updates.universe = textField(body.universe, 100) || "";
  if (body.companion) updates.companion = textField(body.companion, 100) || "";
  if (body.theme) updates.theme = textField(body.theme, 100) || "";

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  updates.updated_at = new Date().toISOString();

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to update your profile." }, { status: 401 });

    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userData.user.id)
      .select("id, display_name, universe, companion, theme, created_at, updated_at")
      .single();

    if (error) return NextResponse.json({ error: "Profile could not be updated." }, { status: 502 });
    return NextResponse.json({ profile: data });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for user profiles." }, { status: 503 });
  }
}
