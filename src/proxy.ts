import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 renamed the "middleware" convention to "proxy". This runs on every
// matched request to refresh the Supabase session and guard /dashboard.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Run on all paths except static assets and image optimization files.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
