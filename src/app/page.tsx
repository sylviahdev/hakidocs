import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Seal from "@/components/Seal";
import { DOCUMENT_TYPES } from "@/lib/documentTypes";

const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Describe your problem",
    body: "Type what happened in English, Swahili, or Sheng. No legal jargon needed.",
    icon: "💬",
  },
  {
    step: "2",
    title: "AI reads & understands",
    body: "HakiDocs identifies the legal category, the parties, the facts, and what you want.",
    icon: "🧠",
  },
  {
    step: "3",
    title: "Get a professional document",
    body: "Receive a structured legal document plus a simple Swahili summary — ready to copy, print, or download.",
    icon: "📄",
  },
];

const BENEFITS = [
  {
    title: "Speaks your language",
    body: "English, Swahili, and Sheng all work. Mix them freely — we understand.",
    icon: "🗣️",
  },
  {
    title: "Seconds, not days",
    body: "No queues, no appointments. A professional draft in under a minute.",
    icon: "⚡",
  },
  {
    title: "Advocate-grade tone",
    body: "Formal, respectful language that reads like it came from a law office.",
    icon: "🏛️",
  },
  {
    title: "Always with you",
    body: "Mobile-first. Generate, copy, and download a PDF straight from your phone.",
    icon: "📱",
  },
  {
    title: "Plain Swahili summary",
    body: "Every document comes with a clear explanation so you know exactly what it says.",
    icon: "✅",
  },
  {
    title: "Private & yours",
    body: "Sign in to save your history, or use it instantly without an account.",
    icon: "🔒",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Nilipata deposit yangu yote baada ya kutuma demand letter ya HakiDocs. Landlord aliogopa!",
    name: "Mercy A.",
    role: "Tenant, Nairobi",
    initial: "M",
  },
  {
    quote:
      "I'm a fundi. I now send a simple service agreement to every client before I start. It protects me.",
    name: "Brian K.",
    role: "Handyman, Nakuru",
    initial: "B",
  },
  {
    quote:
      "As a small shop owner, the debt demand letters have helped me recover money I had written off.",
    name: "Fatuma H.",
    role: "Duka owner, Mombasa",
    initial: "F",
  },
];

const FAQS = [
  {
    q: "Is this real legal advice?",
    a: "No. HakiDocs generates documents for informational purposes only. For high-stakes matters, have a qualified advocate review your document before using it.",
  },
  {
    q: "Can I really write in Swahili or Sheng?",
    a: "Yes. Write the way you speak — English, Swahili, Sheng, or a mix. The AI reads all of them and drafts a formal English document with a Swahili summary.",
  },
  {
    q: "How much does it cost?",
    a: "The MVP lets you generate documents for free. Sign in with email or Google to save your document history.",
  },
  {
    q: "What if some details are missing?",
    a: "The document uses clearly marked placeholders like [Landlord's Name] or [Amount in KSh] wherever a specific detail is needed, so you can fill them in.",
  },
  {
    q: "Can I download or print my document?",
    a: "Absolutely. Every document can be copied as text, downloaded as a PDF, or printed directly — all from your phone or computer.",
  },
];

const STATS = [
  { value: "8+", label: "Document types" },
  { value: "3", label: "Languages supported" },
  { value: "<60s", label: "From words to draft" },
  { value: "KSh 0", label: "To get started" },
];

function Hero() {
  return (
    <section className="relative overflow-hidden bg-haki-950 text-white">
      {/* Aurora glow + grid backdrop */}
      <div
        aria-hidden
        className="animate-aurora pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(40% 50% at 18% 18%, rgba(201,162,39,0.18), transparent 70%), radial-gradient(45% 55% at 85% 10%, rgba(69,89,140,0.45), transparent 70%), radial-gradient(40% 45% at 75% 90%, rgba(201,162,39,0.10), transparent 70%)",
        }}
      />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-40" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-background"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1.05fr_0.95fr] lg:py-32">
        {/* Copy column */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-gold-200">
            ⚖️ AI Legal Documents · Built for Kenya
          </span>
          <h1 className="font-display mx-auto mt-6 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:mx-0">
            Justice Starts With the{" "}
            <span className="text-gold-gradient italic">Right Document</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-haki-200 lg:mx-0">
            Describe your problem in English, Swahili, or Sheng — and get a
            professional, advocate-grade legal document in seconds. No lawyer, no
            queue, no jargon.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/generate"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-8 py-4 text-base font-semibold text-haki-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400 active:scale-[0.98] sm:w-auto"
            >
              Generate Document
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
            <a
              href="#how"
              className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10 sm:w-auto"
            >
              See how it works
            </a>
          </div>
          <p className="mt-6 text-sm text-haki-300">
            ✨ Free to start · No account needed · Works on any phone
          </p>
        </div>

        {/* Live document mockup */}
        <div className="relative mx-auto w-full max-w-md">
          <DocumentMockup />
        </div>
      </div>
    </section>
  );
}

function DocumentMockup() {
  return (
    <div className="animate-float relative">
      {/* "You say" bubble */}
      <div className="absolute -left-3 -top-6 z-20 max-w-[78%] rounded-2xl rounded-bl-sm border border-white/10 bg-haki-800/90 p-3.5 text-left shadow-xl backdrop-blur sm:-left-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold-300">
          You say
        </p>
        <p className="mt-1 text-sm italic text-haki-100">
          &ldquo;Landlord hanirudishii deposit yangu ya KSh 30,000 baada ya
          kuhama.&rdquo;
        </p>
      </div>

      {/* The "paper" */}
      <div className="card-elevated relative mt-16 rotate-1 rounded-2xl p-6 text-haki-950 transition-transform duration-500 hover:rotate-0">
        {/* Embossed seal */}
        <div className="animate-seal-in absolute -right-4 -top-4 z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-200 bg-white shadow-lg">
          <Seal size={42} />
        </div>

        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-gold-600">
          Demand Letter
        </p>
        <h3 className="font-serif mt-1 text-base font-bold uppercase leading-snug text-haki-950">
          Rental Deposit Refund Demand Letter
        </h3>
        <div className="mt-4 space-y-2.5">
          <div className="h-2 w-full rounded bg-haki-100" />
          <div className="h-2 w-[92%] rounded bg-haki-100" />
          <div className="h-2 w-[97%] rounded bg-haki-100" />
          <div className="h-2 w-1/3 rounded bg-gold-300" />
          <div className="h-2 w-[88%] rounded bg-haki-100" />
          <div className="h-2 w-[95%] rounded bg-haki-100" />
        </div>
        <div className="mt-4 rounded-lg border border-gold-200 bg-gold-50 p-3">
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-gold-700">
            Muhtasari · Swahili
          </p>
          <div className="mt-1.5 space-y-1.5">
            <div className="h-1.5 w-full rounded bg-gold-200/70" />
            <div className="h-1.5 w-2/3 rounded bg-gold-200/70" />
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <span className="rounded-md bg-haki-800 px-2.5 py-1 text-[0.6rem] font-semibold text-white">
            📋 Copy
          </span>
          <span className="rounded-md border border-haki-200 px-2.5 py-1 text-[0.6rem] font-semibold text-haki-700">
            ⬇ PDF
          </span>
          <span className="rounded-md border border-haki-200 px-2.5 py-1 text-[0.6rem] font-semibold text-haki-700">
            🖨 Print
          </span>
        </div>
      </div>
    </div>
  );
}

function Stats() {
  return (
    <section className="border-b border-haki-100 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-2 sm:grid-cols-4 sm:px-6">
        {STATS.map((s) => (
          <div key={s.label} className="px-4 py-6 text-center">
            <div className="font-display text-3xl font-semibold text-haki-900 sm:text-4xl">
              {s.value}
            </div>
            <div className="mt-1 text-xs font-medium uppercase tracking-wide text-haki-400">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-14 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-600">
        {eyebrow}
      </p>
      <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight text-haki-950 sm:text-4xl">
        {title}
      </h2>
      <div className="gold-rule mx-auto mt-5" />
      {subtitle && (
        <p className="mx-auto mt-5 max-w-xl text-haki-500">{subtitle}</p>
      )}
    </div>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <Reveal>
        <SectionHeading
          eyebrow="The Process"
          title="From everyday words to a document"
          subtitle="Three simple steps. No legal training required."
        />
      </Reveal>
      <div className="grid gap-6 md:grid-cols-3">
        {HOW_IT_WORKS.map((s, i) => (
          <Reveal key={s.step} delay={i * 120}>
            <div className="card-elevated group relative h-full rounded-2xl p-7 transition-transform duration-300 hover:-translate-y-1">
              <span className="absolute -top-4 left-7 flex h-9 w-9 items-center justify-center rounded-lg bg-haki-800 font-display text-sm font-bold text-gold-300 shadow">
                {s.step}
              </span>
              <div className="mb-3 mt-4 text-3xl">{s.icon}</div>
              <h3 className="text-lg font-semibold text-haki-950">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-haki-500">
                {s.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function UseCases() {
  return (
    <section
      id="use-cases"
      className="scroll-mt-20 border-y border-haki-100 bg-white py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading
            eyebrow="What you can create"
            title="Documents for every situation"
            subtitle="Tenants, employees, business owners, and consumers — HakiDocs has you covered."
          />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOCUMENT_TYPES.filter((d) => d.id !== "auto").map((d, i) => (
            <Reveal key={d.id} delay={(i % 4) * 80}>
              <div className="group h-full rounded-2xl border border-haki-100 bg-haki-50/40 p-5 transition duration-300 hover:-translate-y-1 hover:border-gold-300 hover:bg-white hover:shadow-lg">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-2xl shadow-sm ring-1 ring-haki-100 transition group-hover:ring-gold-200">
                  {d.icon}
                </div>
                <h3 className="text-sm font-bold text-haki-950">{d.label}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-haki-500">
                  {d.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section
      id="benefits"
      className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <Reveal>
        <SectionHeading
          eyebrow="Why HakiDocs"
          title="Built for real Kenyan problems"
        />
      </Reveal>
      <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={(i % 3) * 100}>
            <div className="flex gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-haki-50 to-haki-100 text-xl ring-1 ring-haki-100">
                {b.icon}
              </div>
              <div>
                <h3 className="font-semibold text-haki-950">{b.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-haki-500">
                  {b.body}
                </p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y border-haki-100 bg-haki-950 py-24 text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(40% 50% at 80% 20%, rgba(201,162,39,0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-14 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold-400">
              Real Stories
            </p>
            <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Trusted by everyday Kenyans
            </h2>
            <div className="gold-rule mx-auto mt-5" />
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:border-gold-500/30 hover:bg-white/[0.07]">
                <div className="mb-4 text-2xl text-gold-400">&ldquo;</div>
                <blockquote className="text-sm leading-relaxed text-haki-100">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-gold-600 font-display text-sm font-bold text-haki-950">
                    {t.initial}
                  </span>
                  <span className="text-sm">
                    <span className="block font-semibold text-white">
                      {t.name}
                    </span>
                    <span className="block text-xs text-haki-300">{t.role}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="mx-auto max-w-3xl scroll-mt-20 px-4 py-24 sm:px-6"
    >
      <Reveal>
        <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
      </Reveal>
      <div className="space-y-3">
        {FAQS.map((f, i) => (
          <Reveal key={f.q} delay={i * 70}>
            <details className="group rounded-xl border border-haki-100 bg-white p-5 transition hover:border-haki-200 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold text-haki-950">
                {f.q}
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-haki-50 text-gold-600 transition group-open:rotate-45 group-open:bg-gold-500 group-open:text-white">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-haki-500">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:px-6">
      <Reveal>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-haki-950 px-6 py-16 text-center text-white shadow-xl">
          <div
            aria-hidden
            className="animate-aurora pointer-events-none absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(40% 60% at 15% 20%, rgba(201,162,39,0.22), transparent 70%), radial-gradient(45% 60% at 85% 80%, rgba(69,89,140,0.5), transparent 70%)",
            }}
          />
          <div className="relative">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold-300/40 bg-white/5">
              <Seal size={44} />
            </div>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Your document is one sentence away
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-haki-200">
              Describe your problem and let HakiDocs handle the legal language.
              Free to start — no account required.
            </p>
            <Link
              href="/generate"
              className="group mt-9 inline-flex items-center gap-2 rounded-xl bg-gold-500 px-8 py-4 text-base font-semibold text-haki-950 shadow-lg shadow-gold-500/20 transition hover:bg-gold-400 active:scale-[0.98]"
            >
              Generate Document
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Stats />
        <HowItWorks />
        <UseCases />
        <Benefits />
        <Testimonials />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
