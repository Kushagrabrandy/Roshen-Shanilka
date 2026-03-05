import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { professionalEndorsementUpdateSchema } from "@/lib/validation";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await prisma.professionalEndorsement.findUnique({
      where: { id: params.id },
    });

    if (!item) {
      return NextResponse.json({ error: "Endorsement not found" }, { status: 404 });
    }

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error fetching endorsement item", error);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = professionalEndorsementUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const item = await prisma.professionalEndorsement.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json(item, { status: 200 });
  } catch (error) {
    console.error("Error updating endorsement", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.professionalEndorsement.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Endorsement deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting endorsement", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
