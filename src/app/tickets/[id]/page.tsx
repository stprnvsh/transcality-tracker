import { notFound } from "next/navigation";
import { TicketDetail } from "@/components/TicketDetail";
import { getTicketById } from "@/lib/tickets";

interface TicketDetailPageProps {
  params: { id: string };
}

export default async function TicketDetailPage({ params }: TicketDetailPageProps) {
  const ticket = await getTicketById(params.id);

  if (!ticket) {
    notFound();
  }

  return <TicketDetail ticket={ticket} />;
}
