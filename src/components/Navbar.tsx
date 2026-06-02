import Link from "next/link";
import Seal from "./Seal";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-2.5 ${className}`}>
      <span className="transition-transform duration-300 group-hover:rotate-[8deg]">
        <Seal size={34} />
      </span>
      <span className="font-display text-xl font-semibold tracking-tight text-haki-950">
        Haki<span className="text-gold-gradient">Docs</span>
      </span>
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-haki-100/80 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <div className="hidden items-center gap-8 text-sm font-medium text-haki-600 md:flex">
          <a href="/#how" className="transition hover:text-haki-950">
            How it Works
          </a>
          <a href="/#use-cases" className="transition hover:text-haki-950">
            Use Cases
          </a>
          <a href="/#benefits" className="transition hover:text-haki-950">
            Why HakiDocs
          </a>
          <a href="/#faq" className="transition hover:text-haki-950">
            FAQ
          </a>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/dashboard"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-haki-700 transition hover:bg-haki-50 sm:inline-block"
          >
            Dashboard
          </Link>
          <Link
            href="/generate"
            className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-haki-800 px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-haki-900/10 transition hover:bg-haki-900 active:scale-[0.98]"
          >
            <span className="relative">Generate</span>
            <span className="relative text-gold-300 transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
