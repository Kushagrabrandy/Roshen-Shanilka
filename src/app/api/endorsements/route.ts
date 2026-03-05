import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { professionalEndorsementCreateSchema } from "@/lib/validation";

export async function GET() {
  try {
    const data = await prisma.professionalEndorsement.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching endorsements", error);
    return NextResponse.json({ error: "Failed to fetch endorsements" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = professionalEndorsementCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const item = await prisma.professionalEndorsement.create({
      data: parsed.data,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("Error creating endorsement", error);
    return NextResponse.json({ error: "Failed to create endorsement" }, { status: 500 });
  }
}
