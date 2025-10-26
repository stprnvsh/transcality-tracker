import { NextRequest, NextResponse } from "next/server";
import {
  exportFieldConfigurations,
  getFieldConfigurations,
  importFieldConfigurations,
  upsertFieldConfiguration
} from "@/lib/field-config";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  if (request.nextUrl.searchParams.get("mode") === "export") {
    const json = await exportFieldConfigurations();
    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": "attachment; filename=field-config.json"
      }
    });
  }

  const configs = await getFieldConfigurations();
  return NextResponse.json({ configs });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const result = await upsertFieldConfiguration(body);
  return NextResponse.json({ config: result });
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const raw = await request.text();
  await importFieldConfigurations(raw);
  return NextResponse.json({ success: true });
}
