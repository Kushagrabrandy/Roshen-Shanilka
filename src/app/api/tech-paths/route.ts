import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { techPathCreateSchema } from "@/lib/validation";

export async function GET() {
  try {
    const paths = await prisma.techPath.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(paths, { status: 200 });
  } catch (error) {
    console.error("Error fetching tech paths", error);
    return NextResponse.json(
      { error: "Failed to fetch tech paths" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = techPathCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const path = await prisma.techPath.create({
      data: {
        title: data.title,
        description: data.description,
      },
    });

    return NextResponse.json(path, { status: 201 });
  } catch (error) {
    console.error("Error creating tech path", error);
    return NextResponse.json(
      { error: "Failed to create tech path" },
      { status: 500 },
    );
  }
}

