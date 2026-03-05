import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { creativeShowcaseUpdateSchema } from "@/lib/validation";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const showcase = await prisma.creativeShowcase.findUnique({
      where: { id: params.id },
    });

    if (!showcase) {
      return NextResponse.json(
        { error: "Showcase not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(showcase, { status: 200 });
  } catch (error) {
    console.error("Error fetching showcase", error);
    return NextResponse.json(
      { error: "Failed to fetch showcase" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const body = await req.json();
    const parsed = creativeShowcaseUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existing = await prisma.creativeShowcase.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Showcase not found" },
        { status: 404 },
      );
    }

    const updated = await prisma.creativeShowcase.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error updating showcase", error);
    return NextResponse.json(
      { error: "Failed to update showcase" },
      { status: 500 },
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const existing = await prisma.creativeShowcase.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Showcase not found" },
        { status: 404 },
      );
    }

    await prisma.creativeShowcase.delete({
      where: { id: params.id },
    });

    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting showcase", error);
    return NextResponse.json(
      { error: "Failed to delete showcase" },
      { status: 500 },
    );
  }
}

