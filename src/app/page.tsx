import { TicketList } from "@/components/TicketList";
import { Suspense } from "react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Transcality Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Monitor active work, review progress, and coordinate with GitHub & Jira in one place.
          </p>
        </div>
        <Link
          href="/tickets/new"
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark"
        >
          New Ticket
        </Link>
      </header>
      <Suspense fallback={<div className="text-slate-500">Loading tickets...</div>}>
        <TicketList variant="dashboard" />
      </Suspense>
    </div>
  );
}
