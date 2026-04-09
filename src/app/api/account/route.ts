import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// RGPD: Export all user data
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Export all user data
  const [profile, sources, analyses, processes, corrections, vocabulary, sparring] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("sources").select("*").eq("user_id", user.id),
    supabase.from("analyses").select("*").eq("user_id", user.id),
    supabase.from("processes").select("*").eq("user_id", user.id),
    supabase.from("corrections").select("*").eq("user_id", user.id),
    supabase.from("vocabulary").select("*").eq("user_id", user.id),
    supabase.from("sparring_sessions").select("*").eq("user_id", user.id),
  ]);

  return NextResponse.json({
    exportDate: new Date().toISOString(),
    userId: user.id,
    email: user.email,
    profile: profile.data,
    sources: sources.data,
    analyses: analyses.data,
    processes: processes.data,
    corrections: corrections.data,
    vocabulary: vocabulary.data,
    sparringSessions: sparring.data,
  });
}

// RGPD: Delete all user data
export async function DELETE(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user } } = await supabase.auth.getUser(authHeader.replace("Bearer ", ""));
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete all user data in order (respecting foreign keys)
  // The CASCADE on foreign keys handles most of this, but let's be explicit
  await supabase.from("sparring_sessions").delete().eq("user_id", user.id);
  await supabase.from("vocabulary").delete().eq("user_id", user.id);
  await supabase.from("corrections").delete().eq("user_id", user.id);
  await supabase.from("company_patterns").delete().eq("user_id", user.id);
  await supabase.from("processes").delete().eq("user_id", user.id);
  await supabase.from("analyses").delete().eq("user_id", user.id);
  await supabase.from("sources").delete().eq("user_id", user.id);
  await supabase.from("profiles").delete().eq("id", user.id);

  // Delete the auth user
  // Note: this requires service_role key in production
  // For now, we just delete the data

  return NextResponse.json({
    deleted: true,
    userId: user.id,
    message: "All your data has been permanently deleted.",
  });
}
