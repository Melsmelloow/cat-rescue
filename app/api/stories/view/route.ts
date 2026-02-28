import { connectDB } from "@/lib/mongodb";
import { Stories } from "@/models/Stories";
import "@/models/Cats";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);

  const limit = Math.min(Number(searchParams.get("limit")) || 6, 50);
  const cursor = searchParams.get("cursor");

  let query: any = {};

  // ==============================
  // Cursor Pagination Logic
  // ==============================
  if (cursor) {
    const parsed = JSON.parse(Buffer.from(cursor, "base64").toString());

    query = {
      $or: [
        { createdAt: { $lt: new Date(parsed.createdAt) } },
        {
          createdAt: new Date(parsed.createdAt),
          _id: { $lt: new mongoose.Types.ObjectId(parsed._id) },
        },
      ],
    };
  }

  const stories = await Stories.find(query)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
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

  if (formattedStories.length > limit) {
    const last = formattedStories[limit - 1];

    nextCursor = Buffer.from(
      JSON.stringify({
        createdAt: last.createdAt,
        _id: last._id,
      }),
    ).toString("base64");

    formattedStories.splice(limit);
  }

  return NextResponse.json({
    data: formattedStories,
    nextCursor,
  });
}
