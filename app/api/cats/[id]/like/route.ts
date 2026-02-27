import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";
import { CatLike } from "@/models/CatLike";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid cat ID" }, { status: 400 });
  }

  const deviceId = req.nextUrl.searchParams.get("deviceId");

  if (!deviceId) {
    return NextResponse.json(
      { error: "deviceId is required" },
      { status: 400 },
    );
  }

  const existingLike = await CatLike.findOne({
    catId: id,
    deviceId,
  }).lean();

  return NextResponse.json({
    liked: !!existingLike,
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;

  // 1️⃣ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid cat ID" }, { status: 400 });
  }

  // 2️⃣ Get deviceId from body
  const { deviceId } = await req.json();

  if (!deviceId || typeof deviceId !== "string") {
    return NextResponse.json(
      { error: "deviceId is required" },
      { status: 400 },
    );
  }

  try {
    // 3️⃣ Try inserting like (DB prevents duplicates)
    await CatLike.create({
      catId: id,
      deviceId,
    });

    // 4️⃣ Increment like counter only if insert succeeds
    const updatedCat = await Cat.findByIdAndUpdate(
      id,
      { $inc: { likes: 1 } },
      { new: true },
    ).lean();

    return NextResponse.json({
      success: true,
      likes: updatedCat?.likes ?? 0,
    });
  } catch (err: any) {
    // Duplicate key error (already liked)
    if (err.code === 11000) {
      return NextResponse.json({ error: "Already liked" }, { status: 409 });
    }

    console.error("Like error:", err);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
