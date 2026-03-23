# Modern Portfolio (Next.js + Supabase + Tailwind + 3D)

A premium, animation-driven portfolio starter with:

- Next.js (App Router + TypeScript)
- Tailwind CSS
- Supabase contact endpoint
- 3D hero scene via React Three Fiber / Drei
- Motion choreography with Framer Motion

## 1) Prerequisites

Install Node.js 20+ and npm.

## 2) Install

```bash
npm install
```

## 3) Environment setup

Copy `.env.example` to `.env.local` and set values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 4) Supabase table setup

Run SQL from `supabase/schema.sql` in the Supabase SQL editor.

## 5) Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Notes

- Contact form posts to `POST /api/contact` and stores data in `contact_messages`.
- Update content arrays in `src/data/site.ts`.
- Replace placeholder links in projects with live case studies.
