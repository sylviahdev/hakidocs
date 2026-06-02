# HakiDocs ⚖️

**Justice Starts With the Right Document.**

HakiDocs is an AI-powered legal-document generator for everyday people in Kenya.
Describe your problem in plain language — English, Swahili, or Sheng — and get a
structured, professional legal document in seconds, complete with a Swahili
summary you can actually understand.

> Transform _"My problem in everyday language"_ → _"A structured legal document ready for use."_

---

## ✨ Features

- **Multilingual input** — English, Swahili, and Sheng (or a mix).
- **8 document types** — Demand Letter, Rental Deposit Refund, Employment
  Complaint, Service Agreement, Debt Demand, Consumer Complaint, Business
  Agreement, General Legal Notice — plus **auto-detect**.
- **Structured output** — Parties · Background Facts · Legal Issue ·
  Demand/Request · Required Action · Closing Statement.
- **Swahili summary** on every document.
- **Copy, Download PDF, Print** — all client-side, mobile-first.
- **Auth + history** — email magic-link & Google login, saved documents (via
  Supabase). Fully optional — the app generates documents without an account.

---

## 🏗️ Tech Stack

| Layer    | Choice                                                            |
| -------- | ---------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4   |
| Backend  | Next.js API routes (Node runtime)                                |
| AI       | Claude API (`claude-opus-4-8`) — adaptive thinking + structured outputs + prompt caching |
| Database | Supabase (Postgres + Auth, with row-level security)              |
| PDF      | `jspdf` (client-side, selectable text)                           |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── globals.css             # Blue/white theme + print styles
│   ├── page.tsx                # Landing page (Hero, How it Works, Use Cases,
│   │                           #   Benefits, Testimonials, FAQ, CTA)
│   ├── generate/page.tsx       # Generator page
│   ├── dashboard/page.tsx      # Saved documents (auth-gated)
│   ├── login/page.tsx          # Email + Google sign-in
│   ├── auth/callback/route.ts  # OAuth / magic-link exchange
│   └── api/
│       ├── generate/route.ts   # POST → Claude → structured document (+ save)
│       └── documents/route.ts  # GET list / DELETE saved documents
├── components/
│   ├── Navbar.tsx  Footer.tsx
│   ├── GeneratorForm.tsx       # Problem input + controls + result (client)
│   ├── DocumentView.tsx        # Renders a document + Copy/PDF/Print (client)
│   ├── LoginForm.tsx           # Magic link + Google (client)
│   └── DashboardClient.tsx     # History list (client)
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   ├── documentTypes.ts        # Document catalogue + metadata
│   ├── prompts.ts              # System prompt + JSON schema (prompt-cached)
│   ├── anthropic.ts            # Claude client + generateDocument()
│   ├── pdf.ts                  # Client-side PDF rendering
│   └── supabase/               # client / server / middleware helpers
├── middleware.ts               # Session refresh + /dashboard guard
└── ...
supabase/schema.sql             # documents table + RLS policies
.env.example                    # Required & optional environment variables
```

---

## 🚀 Getting Started

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

- **`ANTHROPIC_API_KEY`** — required. Get one at
  [platform.claude.com](https://platform.claude.com).
- **`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`** — optional;
  enable login + saved history.

### 3. (Optional) Set up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor.
3. Enable **Email** auth (on by default) and, optionally, **Google** under
   Authentication → Providers. Add `<your-domain>/auth/callback` to the
   redirect URLs.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🧠 How the AI works

1. The user's free-text problem is POSTed to `/api/generate`.
2. [`lib/anthropic.ts`](src/lib/anthropic.ts) calls `claude-opus-4-8` with:
   - a **static, prompt-cached system prompt** ([`lib/prompts.ts`](src/lib/prompts.ts))
     that defines the role, drafting rules, and required sections;
   - **adaptive thinking** so the model reasons about the legal context;
   - **structured outputs** (`output_config.format`) bound to a JSON schema, so
     the response is always a valid `GeneratedDocument`.
3. The model: identifies the legal category → extracts parties, facts, and the
   requested remedy → drafts six formal sections → writes a Swahili summary →
   attaches the standard disclaimer.
4. The document renders in [`DocumentView`](src/components/DocumentView.tsx),
   ready to copy, download, or print. Signed-in users get it saved to Supabase.

**Guardrails:** the prompt forbids inventing facts or fabricating legal
citations, uses `[bracketed placeholders]` for unknown details, avoids giving
legal advice, and always includes an informational-only disclaimer.

---

## 🗺️ Implementation Plan / Roadmap

**Phase 1 — MVP (this repo)** ✅
Landing page, multilingual generation, 8 document types, structured output,
Swahili summary, copy/PDF/print, optional auth + history.

**Phase 2 — Polish**

- Inline placeholder editing (fill `[Name]`, `[Amount]` in the UI before export).
- Per-document-type intake forms for sharper output.
- Streaming generation for faster perceived speed.
- Rate limiting + abuse protection on `/api/generate`.

**Phase 3 — Growth**

- Document sharing links & e-signature handoff.
- Advocate review marketplace (connect users to real lawyers).
- M-Pesa-based premium tier (unlimited docs, branded letterheads).
- Offline-first PWA for low-connectivity areas.

---

## ⚠️ Disclaimer

HakiDocs generates documents for **informational purposes only**. They do not
constitute legal advice. Review by a qualified advocate is recommended before
use.
