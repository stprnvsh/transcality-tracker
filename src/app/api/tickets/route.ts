import { NextRequest, NextResponse } from "next/server";
import { createTicket, listTickets } from "@/lib/tickets";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tickets = await listTickets({
    status: searchParams.get("status"),
    priority: searchParams.get("priority"),
    type: searchParams.get("type"),
    assignedToId: searchParams.get("assignedToId")
  });
  return NextResponse.json({ tickets });
}

export async function POST(request: NextRequest) {
  const payload = await request.json();
  try {
    const ticket = await createTicket(payload);
    return NextResponse.json({ ticket }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
