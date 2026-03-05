import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteProjectCreateSchema } from "@/lib/validation";

export async function GET() {
  try {
    const data = await prisma.siteProject.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching projects", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = siteProjectCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const item = await prisma.siteProject.create({
      data: parsed.data,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating project", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
