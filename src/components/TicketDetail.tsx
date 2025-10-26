import type { Ticket, TicketHistory, Attachment, Comment, GitHubLink, JiraLink, User } from "@prisma/client";
import { HistoryTimeline } from "./HistoryTimeline";
import { StatusWorkflow } from "./StatusWorkflow";
import { FileUpload } from "./FileUpload";
import { GitHubLinker } from "./GitHubLink";
import { JiraLinker } from "./JiraLink";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketTypeBadge } from "./TicketTypeBadge";

interface TicketDetailProps {
  ticket: Ticket & {
    createdBy: User;
    assignedTo: User | null;
    comments: Array<Comment & { user: User }>;
    attachments: Attachment[];
    history: TicketHistory[];
    githubLinks: GitHubLink[];
    jiraLinks: JiraLink[];
  };
}

export function TicketDetail({ ticket }: TicketDetailProps) {
  const localTicket = ticket;

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <TicketTypeBadge type={localTicket.type} />
              <TicketStatusBadge status={localTicket.status} />
              <span>#{localTicket.id}</span>
            </div>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">{localTicket.title}</h1>
            <p className="text-sm text-slate-600 dark:text-slate-300">{localTicket.description}</p>
          </div>
          <StatusWorkflow ticket={localTicket} />
        </header>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TicketMeta label="Owner" value={localTicket.createdBy.name ?? localTicket.createdBy.email} />
          <TicketMeta label="Assignee" value={localTicket.assignedTo?.name ?? "Unassigned"} />
          <TicketMeta label="Priority" value={localTicket.priority} />
          <TicketMeta label="Severity" value={localTicket.severity} />
        </dl>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <HistoryTimeline history={localTicket.history} />
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Attachments</h2>
            <FileUpload ticketId={localTicket.id} attachments={localTicket.attachments} />
          </div>
        </div>
        <aside className="space-y-6">
          <GitHubLinker ticket={localTicket} />
          <JiraLinker ticket={localTicket} />
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Custom Fields</h3>
            <dl className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {Object.entries(localTicket.fields ?? {}).map(([key, value]) => (
                <div key={key} className="flex items-start justify-between gap-4">
                  <dt className="font-medium capitalize">{key.replace(/_/g, " ")}</dt>
                  <dd className="text-right">{String(value)}</dd>
                </div>
              ))}
              {Object.keys(localTicket.fields ?? {}).length === 0 && (
                <p className="text-slate-500">No custom fields configured.</p>
              )}
            </dl>
          </div>
        </aside>
      </section>
    </div>
  );
}

function TicketMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-200">
      <dt className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="mt-2 text-base font-medium text-slate-900 dark:text-white">{value}</dd>
    </div>
  );
}
