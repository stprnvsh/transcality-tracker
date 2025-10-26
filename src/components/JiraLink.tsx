"use client";

import type { JiraLink, Ticket } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface JiraLinkerProps {
  ticket: Ticket & { jiraLinks: JiraLink[] };
}

export function JiraLinker({ ticket }: JiraLinkerProps) {
  const [jiraKey, setJiraKey] = useState(ticket.jiraLinks[0]?.jiraKey ?? "");
  const [jiraUrl, setJiraUrl] = useState(ticket.jiraLinks[0]?.jiraUrl ?? "");
  const [isSaving, setSaving] = useState(false);

  const onSave = async () => {
    if (!jiraKey || !jiraUrl) {
      toast.error("Jira key and URL are required");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/jira/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketId: ticket.id, jiraKey, jiraUrl })
      });
      if (!response.ok) {
        throw new Error("Failed to link Jira issue");
      }
      toast.success("Jira issue linked");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Jira</h3>
      <p className="mt-1 text-sm text-slate-500">
        Link tickets to Jira issues to track upstream planning and deployment.
      </p>
      <div className="mt-4 space-y-3 text-sm">
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-slate-500">Issue Key</span>
          <input
            value={jiraKey}
            onChange={(event) => setJiraKey(event.target.value.toUpperCase())}
            placeholder="ENG-123"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-slate-500">Issue URL</span>
          <input
            value={jiraUrl}
            onChange={(event) => setJiraUrl(event.target.value)}
            placeholder="https://your-domain.atlassian.net/browse/ENG-123"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>
      </div>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="mt-4 inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
      >
        {ticket.jiraLinks.length ? "Update link" : "Link issue"}
      </button>
      {ticket.jiraLinks[0] && (
        <a href={ticket.jiraLinks[0].jiraUrl} target="_blank" rel="noreferrer" className="mt-3 block text-sm text-blue-500 hover:underline">
          View {ticket.jiraLinks[0].jiraKey}
        </a>
      )}
    </div>
  );
}
