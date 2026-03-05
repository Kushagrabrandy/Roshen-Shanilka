import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { creativeShowcaseCreateSchema } from "@/lib/validation";

export async function GET() {
  try {
    const showcases = await prisma.creativeShowcase.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(showcases, { status: 200 });
  } catch (error) {
    console.error("Error fetching showcases", error);
    return NextResponse.json(
      { error: "Failed to fetch showcases" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = creativeShowcaseCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const data = parsed.data;

    const showcase = await prisma.creativeShowcase.create({
      data: {
        title: data.title,
        description: data.description,
        mediaUrl: data.mediaUrl,
      },
    });

    return NextResponse.json(showcase, { status: 201 });
  } catch (error) {
    console.error("Error creating showcase", error);
    return NextResponse.json(
      { error: "Failed to create showcase" },
      { status: 500 },
    );
  }
}

