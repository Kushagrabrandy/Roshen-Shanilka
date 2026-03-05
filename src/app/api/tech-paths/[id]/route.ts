import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { techPathUpdateSchema } from "@/lib/validation";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const path = await prisma.techPath.findUnique({
      where: { id: params.id },
    });

    if (!path) {
      return NextResponse.json(
        { error: "Tech path not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(path, { status: 200 });
  } catch (error) {
    console.error("Error fetching tech path", error);
    return NextResponse.json(
      { error: "Failed to fetch tech path" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const parsed = techPathUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await prisma.techPath.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Tech path not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.techPath.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating tech path", error);
    return NextResponse.json(
      { error: "Failed to update tech path" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const existing = await prisma.techPath.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Tech path not found" },
        { status: 404 },
      );
    }

    await prisma.techPath.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting tech path", error);
    return NextResponse.json(
      { error: "Failed to delete tech path" },
      { status: 500 },
    );
  }
}

