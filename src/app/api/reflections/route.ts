import { NextResponse } from "next/server";
import { isRecord, textField } from "@/lib/api-validation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to view your reflections." }, { status: 401 });

    const { data, error } = await supabase
      .from("reflections")
      .select("id, body, created_at, updated_at")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) return NextResponse.json({ error: "Reflections could not be loaded." }, { status: 502 });
    return NextResponse.json({ reflections: data });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for private reflections." }, { status: 503 });
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
  const reflection = textField(body.body, 10000);
  if (!reflection) return NextResponse.json({ error: "Reflection text is required." }, { status: 400 });

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to save a private reflection." }, { status: 401 });
    const { data, error } = await supabase
      .from("reflections")
      .insert({ user_id: userData.user.id, body: reflection })
      .select("id, body, created_at")
      .single();
    if (error) return NextResponse.json({ error: "Reflection could not be saved." }, { status: 502 });
    return NextResponse.json({ reflection: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for private reflections." }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Reflection ID is required." }, { status: 400 });

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return NextResponse.json({ error: "Sign in to delete reflections." }, { status: 401 });

    const { error } = await supabase
      .from("reflections")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.user.id);

    if (error) return NextResponse.json({ error: "Reflection could not be deleted." }, { status: 502 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Supabase is not configured for private reflections." }, { status: 503 });
  }
}
