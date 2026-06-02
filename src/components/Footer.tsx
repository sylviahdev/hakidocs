import Link from "next/link";
import { Logo } from "./Navbar";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-haki-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-haki-500">
              Advocate-grade legal documents for everyday people in Kenya.
              Describe your problem in English, Swahili, or Sheng — get a
              professional document in seconds.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-50 px-3 py-1 text-xs font-medium text-gold-700">
              🇰🇪 Made for Kenya
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="mb-3 font-semibold text-haki-950">Product</p>
              <ul className="space-y-2.5 text-haki-500">
                <li>
                  <Link href="/generate" className="transition hover:text-gold-600">
                    Generate Document
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="transition hover:text-gold-600">
                    My Documents
                  </Link>
                </li>
                <li>
                  <a href="/#use-cases" className="transition hover:text-gold-600">
                    Use Cases
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-haki-950">Company</p>
              <ul className="space-y-2.5 text-haki-500">
                <li>
                  <a href="/#faq" className="transition hover:text-gold-600">
                    FAQ
                  </a>
                </li>
                <li>
                  <Link href="/login" className="transition hover:text-gold-600">
                    Sign In
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-haki-100 pt-6 text-xs leading-relaxed text-haki-400">
          <p>
            © {new Date().getFullYear()} HakiDocs. Documents are generated for
            informational purposes only and do not constitute legal advice.
            Review by a qualified advocate is recommended for high-stakes
            matters.
          </p>
        </div>
      </div>
    </footer>
  );
}
