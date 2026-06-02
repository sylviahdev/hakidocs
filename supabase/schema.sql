-- ─── HakiDocs database schema ────────────────────────────────────────────────
-- Run this in the Supabase SQL editor (Dashboard → SQL → New query).
-- It creates the `documents` table, indexes, and row-level security so each
-- user can only ever read/write their own documents.

create extension if not exists "pgcrypto";

create table if not exists public.documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  title         text not null default 'Legal Document',
  document_type text not null,
  problem_input text not null,
  language      text not null default 'auto',
  -- The full structured GeneratedDocument JSON (sections, analysis, summary…).
  document      jsonb not null,
  created_at    timestamptz not null default now()
);

create index if not exists documents_user_id_created_at_idx
  on public.documents (user_id, created_at desc);

-- Row-level security: a user only sees their own rows.
alter table public.documents enable row level security;

drop policy if exists "Users can view their own documents" on public.documents;
create policy "Users can view their own documents"
  on public.documents for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own documents" on public.documents;
create policy "Users can insert their own documents"
  on public.documents for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own documents" on public.documents;
create policy "Users can delete their own documents"
  on public.documents for delete
  using (auth.uid() = user_id);

-- ─── Auth providers ──────────────────────────────────────────────────────────
-- Email (magic link) works out of the box. To enable Google login:
--   Authentication → Providers → Google → enable, add your OAuth client
--   ID/secret, and add `<your-domain>/auth/callback` to the redirect URLs.
