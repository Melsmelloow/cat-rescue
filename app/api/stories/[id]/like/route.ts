import { connectDB } from "@/lib/mongodb";
import { StoryLike } from "@/models/StoryLike";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { Stories } from "@/models/Stories";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;
  const body = await req.json();
  const { deviceId } = body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid story id" }, { status: 400 });
  }

  if (!deviceId) {
    return NextResponse.json({ error: "Device ID required" }, { status: 400 });
  }

  try {
    // Create like record
    await StoryLike.create({
      story: id,
      deviceId,
    });

    // Increment story like counter
    await Stories.findByIdAndUpdate(id, {
      $inc: { likes: 1 },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    // Duplicate like attempt
    if (err.code === 11000) {
      return NextResponse.json({ error: "Already liked" }, { status: 409 });
    }

    return NextResponse.json(
      { error: "Failed to like story" },
      { status: 500 },
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id } = await params;
  const deviceId = req.nextUrl.searchParams.get("deviceId");

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid story id" }, { status: 400 });
  }

  if (!deviceId) {
    return NextResponse.json({ liked: false });
  }

  const existing = await StoryLike.findOne({
    story: id,
    deviceId,
  }).lean();

  return NextResponse.json({
    liked: !!existing,
  });
}
