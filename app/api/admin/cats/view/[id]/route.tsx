import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const cat = await Cat.findById(id).lean();

  if (!cat) {
    return NextResponse.json({ error: "Cat not found" }, { status: 404 });
  }

  return NextResponse.json(cat);
}
