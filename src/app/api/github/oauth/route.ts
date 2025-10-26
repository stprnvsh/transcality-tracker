import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { ticketId, repo, pullNumber, branch } = body;

  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const link = await prisma.gitHubLink.upsert({
    where: {
      ticketId_repo_pullNumber: {
        ticketId,
        repo,
        pullNumber
      }
    },
    update: { branch },
    create: {
      ticketId,
      repo,
      pullNumber,
      branch
    }
  });

  return NextResponse.json({ link });
}
