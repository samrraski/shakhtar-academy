# Shakhtar Academy Calgary

Marketing site + parent/player portal for a youth soccer academy in Calgary, AB.
Built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Supabase** (Auth + Postgres).

## Stack

- Next.js 14 · TypeScript · App Router (no `src/` directory)
- Tailwind CSS — orange/black "Shakhtar" brand palette in `tailwind.config.ts`
- Supabase — `@supabase/ssr` for auth, Postgres + Row Level Security for data
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy your project URL and anon key from **Project Settings → API**, and paste them into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Open the **SQL Editor** in your Supabase project and run [`supabase/schema.sql`](supabase/schema.sql). This creates:
   - `profiles` — auto-created for each new user via a trigger on `auth.users`
   - `programs` — the academy's age-group programs (seeded with the 4 launch programs)
   - `players` — parents' registered children
   - `registrations` — a player's sign-up for a program (`pending` → `active` → `cancelled`)
   - `events` — training sessions, games, and tournaments shown on the schedule
   - `inquiries` — public contact-form submissions
   
   All tables have Row Level Security enabled, scoped so parents can only see/manage their own players, registrations, and profile.
4. Sign up through `/sign-up` — a `profiles` row is created automatically, and you'll land in the parent portal at `/dashboard`.

## Site map

**Public**: `/`, `/about`, `/programs`, `/coaches`, `/schedule`, `/contact`

**Auth** (`(auth)` route group): `/sign-in`, `/sign-up`, `/forgot-password`, `/reset-password`

**Parent portal** (`(dashboard)` route group, requires sign-in):
- `/dashboard` — overview, stats, upcoming events
- `/dashboard/players` — manage your players
- `/dashboard/registrations` — register a player for a program, track status
- `/dashboard/schedule` — personalized schedule for your active programs
- `/dashboard/settings` — account details

## Notes

- Programs and events are managed directly in the Supabase table editor for now (no admin UI yet).
- Public marketing pages are fully static — they don't query Supabase at build or request time.
