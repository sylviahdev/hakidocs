import Link from "next/link";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardClient from "@/components/DashboardClient";
import { createClient } from "@/lib/supabase/server";
import type { SavedDocument } from "@/lib/types";

export const metadata = { title: "My Documents — HakiDocs" };

export default async function DashboardPage() {
  const supabase = await createClient();

  // Supabase not configured — explain, don't crash.
  if (!supabase) {
    return (
      <>
        <Navbar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-800">
            <h1 className="text-xl font-bold">Document history is not enabled</h1>
            <p className="mt-2 text-sm leading-relaxed">
              Add your Supabase keys to <code>.env.local</code> to save and
              revisit documents. You can still{" "}
              <Link href="/generate" className="font-semibold underline">
                generate documents
              </Link>{" "}
              without an account.
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirectTo=/dashboard");

  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const documents = (data ?? []) as SavedDocument[];

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-haki-950">
              My documents
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Signed in as {user.email}
            </p>
          </div>
          <Link
            href="/generate"
            className="rounded-xl bg-haki-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-haki-800 active:scale-[0.98]"
          >
            + New document
          </Link>
        </div>

        <DashboardClient initialDocuments={documents} />
      </main>
      <Footer />
    </>
  );
}
