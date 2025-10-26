# Transcality Tracker

Developer-first ticket management platform bringing GitHub PRs, Jira issues, realtime updates, and flexible field governance into a single Next.js 14 codebase.

## Tech Stack

- **Framework**: Next.js 14 (App Router, React Server Components)
- **Runtime**: TypeScript, React 18, Tailwind CSS, React Query
- **Database**: PostgreSQL via Prisma ORM (production) + SQLite via Prisma ORM (local testing)
- **Auth**: NextAuth.js with GitHub OAuth + Atlassian (Jira) OAuth 2.0
- **Realtime**: Built-in server-sent events bridge (swap in Supabase/Pusher if desired)
- **File uploads**: Local disk storage by default (S3 ready)

## Getting Started

1. Install dependencies (requires access to npm registry):

   ```bash
   npm install
   ```

2. Create a `.env.local` with the following secrets:

   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/transcality"
   SQLITE_DATABASE_URL="file:./dev.db"
   NEXTAUTH_SECRET="<generate>"
   NEXTAUTH_URL="http://localhost:3000"
   GITHUB_CLIENT_ID="..."
   GITHUB_CLIENT_SECRET="..."
   JIRA_CLIENT_ID="..."
   JIRA_CLIENT_SECRET="..."
   JIRA_ISSUER="https://auth.atlassian.com"
  ```

3. Generate Prisma client & run migrations:

   ```bash
   npx prisma migrate dev --name init
   ```

   For lightweight local development without PostgreSQL, switch to SQLite by pointing Prisma at the alternate schema:

   ```bash
   npx prisma migrate dev --schema prisma/schema.sqlite.prisma --name init-sqlite
   ```

   Both migration commands generate the same Prisma Client API, so swapping providers only requires setting `DATABASE_URL` or `SQLITE_DATABASE_URL` appropriately and running the matching migration command.

4. Start the dev server:

   ```bash
   npm run dev
   ```

   > Tip: OAuth credentials unlock user accounts and integrations, but they're not required for capturing work. Anonymous
   > submissions can raise tickets with optional contact details and you can link GitHub or Jira later from the ticket detail view.

## Feature Tour

| Area | Highlights |
| --- | --- |
| Tickets | CRUD API, server components for list/detail, inline workflow transitions, rich history tracking |
| Dynamic forms | Field configs from Prisma + defaults, real-time validation, severity/priority enums |
| Integrations | GitHub PR linking, Jira issue linking, branch-name helper |
| Files | Drag-and-drop uploader writing to `public/uploads` and persisting in Prisma |
| Admin settings | JSON export/import + toggle UI for field governance |
| Realtime | Server-sent events bridge protected by NextAuth session cookies |
| Guest submissions | Anonymous ticket intake with optional contact details—link GitHub/Jira later when ready |

## Repo Layout

```
src/
  app/
    api/               → Next.js Route Handlers for auth, tickets, integrations, uploads
    tickets/           → List, detail, and new ticket pages
    settings/          → Field configuration UI
    layout.tsx         → Global theming + providers
    page.tsx           → Dashboard overview
  components/          → Reusable UI building blocks (form, detail, integrations)
  lib/                 → Prisma, auth config, GitHub/Jira helpers, realtime client
  styles/              → Tailwind entrypoint
prisma/
  schema.prisma        → PostgreSQL schema for users, tickets, history, comments, attachments, configs, integrations
  schema.sqlite.prisma → SQLite schema for local-first workflows
```

## Testing Notes

- `npm run lint` leverages `next lint` (warnings allowed during CI bootstrapping).
- `npm run test` is not defined; add your preferred testing stack (Vitest/Playwright) once business rules stabilize.

## Roadmap Ideas

- Integrate a dedicated realtime backend (Supabase, Pusher, Ably, etc.) once ready.
- Build collaborative comments editor with optimistic updates.
- Add analytics dashboards (cycle time, deployment cadence, etc.).
- Automate branch provisioning via GitHub Apps.
