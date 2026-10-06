import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

          const role = profile?.role || user.user_metadata?.role;

          if (role === "admin") {
            return NextResponse.redirect(`${origin}/admin`);
          }

          await supabase.auth.signOut();
        }
      } catch {
        await supabase.auth.signOut().catch(() => {});
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=not_admin`);
}