import { NextRequest, NextResponse } from "next/server";
import { deleteTicket, getTicketById, updateTicket } from "@/lib/tickets";
import { auth } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const ticket = await getTicketById(params.id);
  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ticket });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const ticket = await updateTicket(params.id, payload);
    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteTicket(params.id);
  return NextResponse.json({ success: true });
}
