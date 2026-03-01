import { connectDB } from "@/lib/mongodb";
import "@/models/Cats";
import { Stories } from "@/models/Stories";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();

  const stories = await Stories.find({ featured: true })
    .sort({ createdAt: -1, _id: -1 })
    .select("-__v")
    .populate("cats", "name")
    .lean();

  let nextCursor = null;

  const formattedStories = stories.map((story) => ({
    ...story,
    _id: story._id.toString(),
    cats: story.cats.map((cat: any) => ({
      ...cat,
      _id: cat._id.toString(),
    })),
  }));

  return NextResponse.json({
    data: formattedStories,
    nextCursor,
  });
}
