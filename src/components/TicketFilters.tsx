"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import clsx from "clsx";

const STATUS = ["backlog", "in_progress", "in_review", "blocked", "done"];
const PRIORITY = ["low", "medium", "high", "critical"];
const TYPE = ["feature", "bug"];

export function TicketFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const currentFilters = useMemo(() => {
    return {
      status: params.get("status") ?? "",
      priority: params.get("priority") ?? "",
      type: params.get("type") ?? ""
    };
  }, [params]);

  const updateFilter = (name: string, value: string) => {
    const newParams = new URLSearchParams(params.toString());
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    const query = newParams.toString();
    router.replace(query ? `/tickets?${query}` : "/tickets");
  };

  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <FilterGroup
        label="Status"
        values={STATUS}
        active={currentFilters.status}
        onChange={(value) => updateFilter("status", value)}
      />
      <FilterGroup
        label="Priority"
        values={PRIORITY}
        active={currentFilters.priority}
        onChange={(value) => updateFilter("priority", value)}
      />
      <FilterGroup
        label="Type"
        values={TYPE}
        active={currentFilters.type}
        onChange={(value) => updateFilter("type", value)}
      />
    </div>
  );
}

interface FilterGroupProps {
  label: string;
  values: string[];
  active: string;
  onChange: (value: string) => void;
}

function FilterGroup({ label, values, active, onChange }: FilterGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <button
        onClick={() => onChange("")}
        className={clsx(
          "rounded-full border px-3 py-1 capitalize",
          active === ""
            ? "border-brand bg-brand/10 text-brand-dark"
            : "border-slate-200 text-slate-500 hover:border-brand"
        )}
      >
        Any
      </button>
      {values.map((value) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={clsx(
            "rounded-full border px-3 py-1 capitalize",
            active === value
              ? "border-brand bg-brand/10 text-brand-dark"
              : "border-slate-200 text-slate-600 hover:border-brand"
          )}
        >
          {value.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
