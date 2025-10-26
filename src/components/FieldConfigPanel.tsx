"use client";

import type { FieldConfiguration } from "@/lib/field-config";
import { useState, useTransition } from "react";
import type { TicketType } from "@prisma/client";
import { toast } from "react-hot-toast";

interface FieldConfigPanelProps {
  initialConfigs: FieldConfiguration[];
}

export function FieldConfigPanel({ initialConfigs }: FieldConfigPanelProps) {
  const [configs, setConfigs] = useState(initialConfigs);
  const [isPending, startTransition] = useTransition();

  const toggle = (ticketType: TicketType, fieldName: string, key: "isRequired" | "isVisible") => {
    startTransition(async () => {
      const config = configs.find((item) => item.ticketType === ticketType && item.fieldName === fieldName);
      if (!config) return;
      const payload = { ...config, [key]: !config[key] };
      try {
        const response = await fetch("/api/field-config", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          throw new Error("Failed to update configuration");
        }
        setConfigs((prev) => prev.map((item) => (item.ticketType === ticketType && item.fieldName === fieldName ? payload : item)));
        toast.success(`Updated ${fieldName}`);
      } catch (error) {
        toast.error((error as Error).message);
      }
    });
  };

  const onExport = async () => {
    const response = await fetch("/api/field-config?mode=export");
    const text = await response.text();
    const blob = new Blob([text], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "field-config.json";
    link.click();
  };

  const onImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    await fetch("/api/field-config", {
      method: "PUT",
      body: text
    });
    const parsed = JSON.parse(text) as FieldConfiguration[];
    setConfigs(parsed);
    toast.success("Configuration imported");
  };

  const byType = configs.reduce<Record<TicketType, FieldConfiguration[]>>(
    (acc, config) => {
      acc[config.ticketType] = acc[config.ticketType] ?? [];
      acc[config.ticketType].push(config);
      return acc;
    },
    { feature: [], bug: [] }
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <button onClick={onExport} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          Export JSON
        </button>
        <label className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-brand hover:text-brand dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          Import JSON
          <input type="file" accept="application/json" className="hidden" onChange={onImport} />
        </label>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {Object.entries(byType).map(([type, items]) => (
          <section key={type} className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold capitalize text-slate-900 dark:text-white">{type}</h2>
            <table className="mt-4 w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="py-2">Field</th>
                  <th className="py-2">Required</th>
                  <th className="py-2">Visible</th>
                </tr>
              </thead>
              <tbody>
                {items.map((config) => (
                  <tr key={config.fieldName} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="py-2 capitalize text-slate-700 dark:text-slate-200">{config.fieldName.replace(/_/g, " ")}</td>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={config.isRequired}
                        disabled={isPending}
                        onChange={() => toggle(config.ticketType, config.fieldName, "isRequired")}
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="checkbox"
                        checked={config.isVisible}
                        disabled={isPending}
                        onChange={() => toggle(config.ticketType, config.fieldName, "isVisible")}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>
    </div>
  );
}
