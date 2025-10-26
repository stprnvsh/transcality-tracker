"use client";

import type { TicketHistory } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";

interface HistoryTimelineProps {
  history: TicketHistory[];
}

export function HistoryTimeline({ history }: HistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        No history yet. Updates will appear here when the ticket changes.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">History</h2>
      <ol className="mt-6 space-y-4">
        {history.map((item) => (
          <li key={item.id} className="flex items-start gap-3">
            <span className="mt-1 h-2 w-2 rounded-full bg-brand"></span>
            <div className="flex-1">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                <strong className="font-semibold">{item.fieldChanged}</strong> changed from
                <span className="ml-1 inline-flex items-center gap-1 rounded bg-slate-200/70 px-1.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {item.oldValue ?? "—"}
                </span>
                to
                <span className="ml-1 inline-flex items-center gap-1 rounded bg-emerald-200/60 px-1.5 text-xs text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
                  {item.newValue ?? "—"}
                </span>
              </p>
              <p className="text-xs text-slate-500">{formatDistanceToNow(new Date(item.createdAt))} ago</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
