import type { TicketStatus } from "@prisma/client";
import clsx from "clsx";

const STATUS_STYLE: Record<TicketStatus, string> = {
  backlog: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  in_review: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  blocked: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
  done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={clsx("rounded-full px-2 py-1 text-xs font-semibold uppercase", STATUS_STYLE[status])}>
      {status.replace("_", " ")}
    </span>
  );
}
