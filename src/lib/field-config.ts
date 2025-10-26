import { prisma } from "@/lib/prisma";
import { TicketType } from "@prisma/client";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const fieldConfigSchema = z.object({
  id: z.string().optional(),
  ticketType: z.nativeEnum(TicketType),
  fieldName: z.string(),
  isRequired: z.boolean(),
  isVisible: z.boolean()
});

export type FieldConfiguration = z.infer<typeof fieldConfigSchema>;

export async function getFieldConfigurations() {
  return prisma.fieldConfig.findMany({
    orderBy: { fieldName: "asc" }
  });
}

export async function upsertFieldConfiguration(input: FieldConfiguration) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }
  const data = fieldConfigSchema.parse(input);

  return prisma.fieldConfig.upsert({
    where: {
      ticketType_fieldName: {
        ticketType: data.ticketType,
        fieldName: data.fieldName
      }
    },
    create: data,
    update: {
      isRequired: data.isRequired,
      isVisible: data.isVisible
    }
  });
}

export async function exportFieldConfigurations() {
  const configs = await getFieldConfigurations();
  return JSON.stringify(configs, null, 2);
}

export async function importFieldConfigurations(raw: string) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const items = z.array(fieldConfigSchema).parse(JSON.parse(raw));

  await prisma.fieldConfig.deleteMany();
  await prisma.fieldConfig.createMany({ data: items });
}
