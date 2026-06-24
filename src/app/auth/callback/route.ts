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
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        try {
          await fetch("https://data.pendo.io/data/track", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-pendo-integration-key": "cf36e143-d85f-4200-a5ff-49c21607ae1c",
            },
            body: JSON.stringify({
              type: "track",
              event: "sign_in_completed",
              visitorId: data.session?.user?.id ?? "system",
              accountId: "system",
              timestamp: Date.now(),
              properties: {
                redirectTo,
                authProvider: data.session?.user?.app_metadata?.provider ?? "unknown",
              },
            }),
          });
        } catch {
          // Don't let tracking failures break auth flow
        }
        return NextResponse.redirect(`${origin}${redirectTo}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
