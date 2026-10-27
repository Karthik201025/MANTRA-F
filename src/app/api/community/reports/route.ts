import { NextResponse } from "next/server";
import { isRecord, textField } from "@/lib/api-validation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to view your reports." }, { status: 401 });

    const { data, error } = await supabase
      .from("community_reports")
      .select("id, post_id, reason, status, created_at")
      .eq("reporter_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: "Reports could not be loaded." }, { status: 502 });
    return NextResponse.json({ reports: data });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for community reports." }, { status: 503 });
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

  const postId = textField(body.postId, 100);
  const reason = textField(body.reason, 1000);

  if (!postId || !reason) {
    return NextResponse.json({ error: "Post ID and reason are required." }, { status: 400 });
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to submit a report." }, { status: 401 });

    const { data, error } = await supabase
      .from("community_reports")
      .insert({ reporter_id: userData.user.id, post_id: postId, reason })
      .select("id, post_id, reason, status, created_at")
      .single();

    if (error) return NextResponse.json({ error: "Report could not be submitted." }, { status: 502 });
    return NextResponse.json({ report: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for community reports." }, { status: 503 });
  }
}
