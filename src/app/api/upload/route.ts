import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await request.formData();
  const file = data.get("file") as File | null;
  const ticketId = data.get("ticketId") as string | null;

  if (!file || !ticketId) {
    return NextResponse.json({ error: "Missing file or ticket" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const filePath = path.join(uploadsDir, `${Date.now()}-${file.name}`);
  await fs.writeFile(filePath, buffer);

  const url = filePath.replace(process.cwd() + "/public", "");

  const attachment = await prisma.attachment.create({
    data: {
      ticketId,
      filename: file.name,
      url,
      uploadedById: session.user.id
    }
  });

  return NextResponse.json({ attachment }, { status: 201 });
}
