import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { TicketStatus, TicketType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const ticketSchema = z.object({
  type: z.nativeEnum(TicketType),
  title: z.string().min(3),
  description: z.string().min(10),
  status: z.nativeEnum(TicketStatus),
  priority: z.enum(["low", "medium", "high", "critical"]),
  severity: z.enum(["minor", "major", "critical"]),
  assignedToId: z.string().nullable(),
  fields: z.record(z.any()).default({})
});

export type TicketInput = z.infer<typeof ticketSchema>;

export async function listTickets(filters: {
  status?: string | null;
  priority?: string | null;
  type?: string | null;
  assignedToId?: string | null;
} = {}) {
  const { status, priority, type, assignedToId } = filters;

  return prisma.ticket.findMany({
    where: {
      ...(status ? { status: status as TicketStatus } : {}),
      ...(priority ? { priority } : {}),
      ...(type ? { type: type as TicketType } : {}),
      ...(assignedToId ? { assignedToId } : {})
    },
    include: {
      createdBy: true,
      assignedTo: true,
      githubLinks: true,
      jiraLinks: true
    },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getTicketById(id: string) {
  return prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: true,
      assignedTo: true,
      comments: {
        include: {
          user: true
        },
        orderBy: { createdAt: "asc" }
      },
      attachments: true,
      history: {
        orderBy: { createdAt: "desc" }
      },
      githubLinks: true,
      jiraLinks: true
    }
  });
}

export async function createTicket(payload: TicketInput) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  const data = ticketSchema.parse(payload);

  const ticket = await prisma.ticket.create({
    data: {
      type: data.type,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      severity: data.severity,
      createdById: session.user.id,
      assignedToId: data.assignedToId,
      fields: data.fields
    }
  });

  await prisma.ticketHistory.create({
    data: {
      ticketId: ticket.id,
      fieldChanged: "status",
      oldValue: null,
      newValue: ticket.status,
      changedById: session.user.id
    }
  });

  revalidatePath("/");
  revalidatePath("/tickets");
  return ticket;
}

export async function updateTicket(id: string, payload: Partial<TicketInput>) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) {
    throw new Error("Ticket not found");
  }

  const data = ticketSchema.partial().parse(payload);

  const updated = await prisma.ticket.update({
    where: { id },
    data
  });

  await logHistoryChanges(ticket, updated, session.user.id);

  revalidatePath(`/tickets/${id}`);
  revalidatePath("/tickets");
  return updated;
}

export async function deleteTicket(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await prisma.ticket.delete({ where: { id } });
  revalidatePath("/tickets");
}

async function logHistoryChanges(before: any, after: any, userId: string) {
  const fields: Array<keyof typeof before> = ["status", "priority", "severity", "assignedToId", "title"];
  const changes = fields
    .map((field) => {
      if (before[field] !== after[field]) {
        return {
          fieldChanged: field,
          oldValue: before[field] ? String(before[field]) : null,
          newValue: after[field] ? String(after[field]) : null
        };
      }
      return null;
    })
    .filter(Boolean);

  if (changes.length === 0) return;

  await prisma.ticketHistory.createMany({
    data: changes.map((change) => ({
      ticketId: before.id,
      fieldChanged: change!.fieldChanged,
      oldValue: change!.oldValue,
      newValue: change!.newValue,
      changedById: userId
    }))
  });
}
