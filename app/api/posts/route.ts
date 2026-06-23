import { NextResponse } from "next/server";
import { getSessionUser, db } from "@/lib/api-auth";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = user.user_metadata?.role as string ?? "player_parent";
  const supabase = db();

  let query = supabase
    .from("posts")
    .select("id,title,body,visibility,created_at,workers(first_name,last_name)")
    .order("created_at", { ascending: false });

  if (role !== "admin" && role !== "worker") {
    query = query.in("visibility", ["all", "parents"]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const role = user.user_metadata?.role as string ?? "player_parent";
  if (role !== "admin" && role !== "worker") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const { title, content, visibility = "all" } = body;
  if (!title?.trim()) return NextResponse.json({ error: "Title required" }, { status: 400 });

  const supabase = db();
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, body: content ?? null, visibility, author_worker_id: null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
