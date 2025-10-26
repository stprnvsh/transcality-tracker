import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { ticketId, jiraKey, jiraUrl } = body;

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const link = await prisma.jiraLink.upsert({
    where: {
      ticketId_jiraKey: {
        ticketId,
        jiraKey
      }
    },
    update: { jiraUrl },
    create: {
      ticketId,
      jiraKey,
      jiraUrl
    }
  });

  return NextResponse.json({ link });
}
