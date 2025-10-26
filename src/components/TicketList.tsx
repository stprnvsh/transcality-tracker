import { listTickets } from "@/lib/tickets";
import Link from "next/link";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketTypeBadge } from "./TicketTypeBadge";
import type { ReactNode } from "react";

interface TicketListProps {
  variant?: "dashboard" | "default";
  filters?: {
    status?: string | null;
    priority?: string | null;
    type?: string | null;
    assignedToId?: string | null;
  };
}

export async function TicketList({ variant = "default", filters }: TicketListProps) {
  const tickets = await listTickets(filters);
  const isDashboard = variant === "dashboard";

  if (tickets.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900">
        No tickets match the selected filters.
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow dark:border-slate-800 dark:bg-slate-900 ${isDashboard ? "ring-1 ring-brand/10" : ""}`}
    >
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <thead className="bg-slate-50 dark:bg-slate-950/50">
          <tr>
            <Th>Ticket</Th>
            <Th>Status</Th>
            <Th>Priority</Th>
            <Th>Assignee</Th>
            <Th>Updated</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {tickets.map((ticket) => {
            const updatedAt = new Date(ticket.updatedAt);
            return (
              <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <Td>
                  <div className="space-y-1">
                  <Link href={`/tickets/${ticket.id}`} className="font-medium text-slate-900 dark:text-slate-50">
                    {ticket.title}
                  </Link>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <TicketTypeBadge type={ticket.type} />
                    <span>#{ticket.id.slice(0, 6)}</span>
                    {ticket.githubLinks[0] && (
                      <span className="truncate text-blue-500">PR #{ticket.githubLinks[0].pullNumber}</span>
                    )}
                    {ticket.jiraLinks[0] && <span className="truncate text-amber-500">{ticket.jiraLinks[0].jiraKey}</span>}
                    {!ticket.createdBy && (ticket.reporterName || ticket.reporterEmail) && (
                      <span className="truncate text-slate-400">
                        Reporter: {ticket.reporterName ?? ticket.reporterEmail}
                      </span>
                    )}
                  </div>
                </div>
              </Td>
              <Td>
                <TicketStatusBadge status={ticket.status} />
              </Td>
              <Td>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium uppercase text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {ticket.priority}
                </span>
              </Td>
              <Td>
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  {ticket.assignedTo?.name ?? "Unassigned"}
                </span>
              </Td>
                <Td>
                  <time dateTime={updatedAt.toISOString()} className="text-xs text-slate-500">
                    {updatedAt.toLocaleDateString()}
                  </time>
                </Td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th scope="col" className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
      {children}
    </th>
  );
}

function Td({ children }: { children: ReactNode }) {
  return <td className="px-4 py-3 align-top text-sm text-slate-700 dark:text-slate-200">{children}</td>;
}
