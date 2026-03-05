import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { siteProjectUpdateSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.siteProject.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error fetching project item", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = siteProjectUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const item = await prisma.siteProject.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error updating project", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.siteProject.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting project", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
