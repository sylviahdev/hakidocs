import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";

export const metadata = { title: "Sign in — HakiDocs" };

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-haki-950">
              Welcome to HakiDocs
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Sign in to save and revisit your documents. You can also{" "}
              <Link href="/generate" className="font-semibold text-haki-700">
                generate without an account
              </Link>
              .
            </p>
          </div>
          <Suspense
            fallback={
              <div className="h-64 animate-pulse rounded-2xl border border-haki-100 bg-white" />
            }
          >
            <LoginForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
