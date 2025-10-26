"use client";

import type { Ticket, TicketStatus } from "@prisma/client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const WORKFLOW: Record<TicketStatus, TicketStatus[]> = {
  backlog: ["in_progress", "blocked"],
  in_progress: ["in_review", "blocked"],
  in_review: ["in_progress", "done"],
  blocked: ["in_progress"],
  done: []
};

interface StatusWorkflowProps {
  ticket: Ticket;
}

export function StatusWorkflow({ ticket }: StatusWorkflowProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const available = WORKFLOW[ticket.status];

  const changeStatus = (status: TicketStatus) => {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/tickets/${ticket.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status })
        });
        if (!res.ok) {
          throw new Error("Failed to update status");
        }
        toast.success(`Status changed to ${status}`);
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/70">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workflow</span>
      <div className="flex flex-wrap gap-2">
        {available.length === 0 && <span className="text-slate-500">No forward transitions available.</span>}
        {available.map((status) => (
          <button
            key={status}
            disabled={isPending}
            onClick={() => changeStatus(status)}
            className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {status.replace("_", " ")}
          </button>
        ))}
      </div>
    </div>
  );
}
