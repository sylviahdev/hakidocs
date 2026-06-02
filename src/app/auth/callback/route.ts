import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth / magic-link callback. Exchanges the auth code for a session, then
 * redirects to the requested destination (defaults to the dashboard).
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
