import { FieldConfigPanel } from "@/components/FieldConfigPanel";
import { getFieldConfigurations } from "@/lib/field-config";

export default async function SettingsPage() {
  const configs = await getFieldConfigurations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Field Configuration</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Adjust which fields are required or visible for each ticket type. Changes apply instantly to forms.
        </p>
      </div>
      <FieldConfigPanel initialConfigs={configs} />
    </div>
  );
}
