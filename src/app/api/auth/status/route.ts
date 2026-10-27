import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
    return NextResponse.json({ configured: false, authenticated: false });
  }
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error) return NextResponse.json({ configured: true, authenticated: false });
    return NextResponse.json({ configured: true, authenticated: Boolean(data.user) });
  } catch {
    return NextResponse.json({ configured: false, authenticated: false });
  }
}
