import { TicketList } from "@/components/TicketList";
import { TicketFilters } from "@/components/TicketFilters";

export const dynamic = "force-dynamic";

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">All Tickets</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Search, filter, and triage all feature and bug workstreams.
          </p>
        </div>
      </div>
      <TicketFilters />
      <TicketList />
    </div>
  );
}
