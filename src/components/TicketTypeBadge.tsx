import type { TicketType } from "@prisma/client";

export function TicketTypeBadge({ type }: { type: TicketType }) {
  return (
    <span className="rounded-full bg-slate-200/60 px-2 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-700 dark:bg-slate-800/80 dark:text-slate-200">
      {type}
    </span>
  );
}
