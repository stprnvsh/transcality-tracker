"use client";

import type { Ticket, GitHubLink } from "@prisma/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { buildBranchName } from "@/lib/github";

interface GitHubLinkerProps {
  ticket: Ticket & { githubLinks: GitHubLink[] };
}

export function GitHubLinker({ ticket }: GitHubLinkerProps) {
  const [repo, setRepo] = useState(ticket.githubLinks[0]?.repo ?? "");
  const [pullNumber, setPullNumber] = useState(ticket.githubLinks[0]?.pullNumber?.toString() ?? "");
  const [branch, setBranch] = useState(ticket.githubLinks[0]?.branch ?? buildBranchName(ticket.type, ticket.title));
  const [isSaving, setSaving] = useState(false);

  const onSave = async () => {
    if (!repo || !pullNumber) {
      toast.error("Repository and PR number are required");
      return;
    }
    setSaving(true);
    try {
      const response = await fetch("/api/github/oauth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticketId: ticket.id,
          repo,
          pullNumber: Number(pullNumber),
          branch
        })
      });
      if (!response.ok) {
        throw new Error("Failed to link pull request");
      }
      toast.success("GitHub pull request linked");
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">GitHub</h3>
      <p className="mt-1 text-sm text-slate-500">
        Link a pull request to show deployment readiness alongside ticket updates.
      </p>
      <div className="mt-4 space-y-3 text-sm">
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-slate-500">Repository</span>
          <input
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
            placeholder="owner/repo"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-slate-500">PR Number</span>
          <input
            value={pullNumber}
            onChange={(event) => setPullNumber(event.target.value)}
            type="number"
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-slate-500">Branch</span>
          <input
            value={branch}
            onChange={(event) => setBranch(event.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          />
        </label>
      </div>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="mt-4 inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
      >
        {ticket.githubLinks.length ? "Update PR" : "Link PR"}
      </button>
      {ticket.githubLinks[0] && (
        <a
          href={`https://github.com/${ticket.githubLinks[0].repo}/pull/${ticket.githubLinks[0].pullNumber}`}
          target="_blank"
          rel="noreferrer"
          className="mt-3 block text-sm text-blue-500 hover:underline"
        >
          View PR #{ticket.githubLinks[0].pullNumber}
        </a>
      )}
    </div>
  );
}
