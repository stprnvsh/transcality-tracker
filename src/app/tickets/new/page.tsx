import { TicketForm } from "@/components/TicketForm";

export default function NewTicketPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Create ticket</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Choose the ticket type to tailor the required fields. All validation rules are enforced in real time.
        </p>
      </div>
      <TicketForm />
    </div>
  );
}
