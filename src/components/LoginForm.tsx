"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginForm() {
  const params = useSearchParams();
  const redirectTo = params.get("redirectTo") ?? "/dashboard";
  const configured = isSupabaseConfigured();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const callbackUrl = () =>
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/callback?redirectTo=${encodeURIComponent(
          redirectTo,
        )}`
      : undefined;

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    if (!supabase) return;
    setStatus("sending");
    setMessage(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: callbackUrl() },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);

      if (typeof pendo !== "undefined") {
        pendo.track("magic_link_request_failed", {
          errorMessage: error.message,
          redirectTo,
        });
      }
    } else {
      setStatus("sent");
      setMessage("Check your email for a secure sign-in link.");

      if (typeof pendo !== "undefined") {
        pendo.track("magic_link_requested", {
          redirectTo,
        });
      }
    }
  }

  async function handleGoogle() {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: callbackUrl() },
    });
  }

  if (!configured) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        <p className="font-semibold">Authentication is not configured yet.</p>
        <p className="mt-2 leading-relaxed">
          Add your Supabase keys to <code className="font-mono">.env.local</code>{" "}
          to enable email and Google sign-in. See{" "}
          <code className="font-mono">.env.example</code>. You can still generate
          documents without signing in.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-haki-100 bg-white p-6 shadow-sm">
      <button
        type="button"
        onClick={handleGoogle}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-haki-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-haki-50 active:scale-[0.99]"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
          />
        </svg>
        Continue with Google
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
        <span className="h-px flex-1 bg-haki-100" />
        OR
        <span className="h-px flex-1 bg-haki-100" />
      </div>

      <form onSubmit={handleMagicLink} className="space-y-3">
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-xl border border-haki-200 px-4 py-3 text-sm outline-none focus:border-haki-500 focus:ring-2 focus:ring-haki-200"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full rounded-xl bg-haki-800 px-4 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-haki-900/10 transition hover:bg-haki-900 active:scale-[0.99] disabled:bg-haki-200 disabled:text-haki-400 disabled:ring-0"
        >
          {status === "sending" ? "Sending…" : "Email me a sign-in link"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            status === "error"
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
