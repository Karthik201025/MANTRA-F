import { NextResponse } from "next/server";
import { isRecord, textField } from "@/lib/api-validation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("community_posts")
      .select("id, body, created_at, author_id")
      .eq("status", "visible")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) return NextResponse.json({ error: "Community posts could not be loaded." }, { status: 502 });
    return NextResponse.json({ posts: data });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for community persistence." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }
  if (!isRecord(body)) return NextResponse.json({ error: "Request body must be an object." }, { status: 400 });
  const content = textField(body.body, 2000);
  if (!content) return NextResponse.json({ error: "Post text is required." }, { status: 400 });

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to publish a community post." }, { status: 401 });
    const { data, error } = await supabase
      .from("community_posts")
      .insert({ author_id: userData.user.id, body: content })
      .select("id, body, created_at, author_id")
      .single();
    if (error) return NextResponse.json({ error: "Community post could not be saved." }, { status: 502 });
    return NextResponse.json({ post: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for community persistence." }, { status: 503 });
  }
}
