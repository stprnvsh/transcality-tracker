"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import clsx from "clsx";

type TicketType = "feature" | "bug";
type TicketStatus = "backlog" | "in_progress" | "in_review" | "blocked" | "done";

interface FieldConfig {
  ticketType: TicketType;
  fieldName: string;
  isRequired: boolean;
  isVisible: boolean;
}

const DEFAULT_FIELDS: Record<TicketType, FieldConfig[]> = {
  feature: [
    { ticketType: "feature", fieldName: "summary", isRequired: true, isVisible: true },
    { ticketType: "feature", fieldName: "acceptance_criteria", isRequired: true, isVisible: true },
    { ticketType: "feature", fieldName: "rollout_plan", isRequired: false, isVisible: true }
  ],
  bug: [
    { ticketType: "bug", fieldName: "summary", isRequired: true, isVisible: true },
    { ticketType: "bug", fieldName: "steps_to_reproduce", isRequired: true, isVisible: true },
    { ticketType: "bug", fieldName: "expected_behavior", isRequired: true, isVisible: true },
    { ticketType: "bug", fieldName: "actual_behavior", isRequired: true, isVisible: true }
  ]
};

interface TicketFormState {
  type: TicketType;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  severity: "minor" | "major" | "critical";
  status: TicketStatus;
  fields: Record<string, string>;
}

export function TicketForm() {
  const router = useRouter();
  const [type, setType] = useState<TicketType>("feature");
  const [configs, setConfigs] = useState<FieldConfig[]>([]);
  const [state, setState] = useState<TicketFormState>({
    type: "feature",
    title: "",
    description: "",
    priority: "medium",
    severity: "minor",
    status: "backlog",
    fields: {}
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetch("/api/field-config")
      .then((response) => response.json())
      .then(({ configs }) => setConfigs(configs));
  }, []);

  const activeConfigs = useMemo(() => {
    const custom = configs.filter((config) => config.ticketType === type);
    return custom.length > 0 ? custom : DEFAULT_FIELDS[type];
  }, [configs, type]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requiredFields = activeConfigs.filter((config) => config.isRequired);
    for (const field of requiredFields) {
      if (!state.fields[field.fieldName]) {
        toast.error(`${field.fieldName.replace(/_/g, " ")} is required`);
        return;
      }
    }

    startTransition(async () => {
      try {
        const response = await fetch("/api/tickets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state, type })
        });
        if (!response.ok) {
          throw new Error("Failed to create ticket");
        }
        toast.success("Ticket created");
        router.push("/tickets");
        router.refresh();
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  const setFieldValue = (name: string, value: string) => {
    setState((prev) => ({ ...prev, fields: { ...prev.fields, [name]: value } }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-wide text-slate-500">Ticket Type</span>
          <select
            value={type}
            onChange={(event) => {
              const nextType = event.target.value as TicketType;
              setType(nextType);
              setState((prev) => ({ ...prev, type: nextType }));
            }}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="feature">Feature</option>
            <option value="bug">Bug</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-wide text-slate-500">Priority</span>
          <select
            value={state.priority}
            onChange={(event) => setState((prev) => ({ ...prev, priority: event.target.value as TicketFormState["priority"] }))}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-wide text-slate-500">Severity</span>
          <select
            value={state.severity}
            onChange={(event) => setState((prev) => ({ ...prev, severity: event.target.value as TicketFormState["severity"] }))}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="minor">Minor</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-xs uppercase tracking-wide text-slate-500">Status</span>
          <select
            value={state.status}
            onChange={(event) => setState((prev) => ({ ...prev, status: event.target.value as TicketStatus }))}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          >
            <option value="backlog">Backlog</option>
            <option value="in_progress">In progress</option>
            <option value="in_review">In review</option>
            <option value="blocked">Blocked</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-wide text-slate-500">Title</span>
        <input
          value={state.title}
          onChange={(event) => setState((prev) => ({ ...prev, title: event.target.value }))}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          placeholder="Concise, action-oriented summary"
          required
        />
      </label>
      <label className="block text-sm">
        <span className="text-xs uppercase tracking-wide text-slate-500">Description</span>
        <textarea
          value={state.description}
          onChange={(event) => setState((prev) => ({ ...prev, description: event.target.value }))}
          className="mt-1 h-32 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          placeholder="Document context, goals, acceptance, and key stakeholders"
          required
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        {activeConfigs
          .filter((config) => config.isVisible)
          .map((config) => (
            <label key={config.fieldName} className="block text-sm">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                {config.fieldName.replace(/_/g, " ")}
                {config.isRequired && <span className="ml-1 text-rose-500">*</span>}
              </span>
              <input
                value={state.fields[config.fieldName] ?? ""}
                onChange={(event) => setFieldValue(config.fieldName, event.target.value)}
                className={clsx(
                  "mt-1 w-full rounded-md border px-3 py-2 text-slate-700 shadow-sm focus:border-brand focus:ring-brand dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200",
                  config.isRequired ? "border-brand/50" : "border-slate-300"
                )}
              />
            </label>
          ))}
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
      >
        Create ticket
      </button>
    </form>
  );
}
