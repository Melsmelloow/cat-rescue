import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { ALLOWED_TYPES, MAX_IMAGE_SIZE } from "@/app/constant/images";
import { Stories } from "@/models/Stories";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    // ========================
    // 🔎 Extract Fields
    // ========================

    const caption = (formData.get("caption") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim();
    const featured = formData.get("featured") === "true";

    const cats = formData.getAll("cats") as string[];
    const tags = (formData.getAll("tags") as string[])
      .map((t) => t.trim())
      .filter(Boolean);

    const imageFile = formData.get("coverImage") as File | null;

    // ========================
    // 🔒 Field Validation
    // ========================

    if (!caption || caption.length < 5) {
      return NextResponse.json(
        { error: "Caption is required (min 5 characters)" },
        { status: 400 },
      );
    }

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    if (!cats || cats.length === 0) {
      return NextResponse.json(
        { error: "At least one cat reference is required" },
        { status: 400 },
      );
    }

    if (!imageFile) {
      return NextResponse.json(
        { error: "Cover image is required" },
        { status: 400 },
      );
    }

    // ========================
    // 🔒 Validate ObjectIds
    // ========================

    const invalidCat = cats.some((id) => !mongoose.Types.ObjectId.isValid(id));

    if (invalidCat) {
      return NextResponse.json(
        { error: "Invalid cat ID in cats array" },
        { status: 400 },
      );
    }

    // ========================
    // 🔒 File Validation
    // ========================

    if (!ALLOWED_TYPES.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, and WEBP allowed" },
        { status: 400 },
      );
    }

    if (imageFile.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image must be under 5MB" },
        { status: 400 },
      );
    }

    // ========================
    // ☁️ Upload to Cloudinary
    // ========================

    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "stories" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(buffer);
    });

    const imageUrl = uploadResult.secure_url;

    // ========================
    // 💾 Save to MongoDB
    // ========================

    const newStory = await Stories.create({
      cats,
      caption,
      tags,
      coverImage: imageUrl,
      slug,
      likes: 0,
      featured,
    });

    return NextResponse.json(
      { success: true, data: newStory },
      { status: 201 },
    );
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Slug already exists" },
        { status: 409 },
      );
    }

    console.error("Create Story Error:", err);

    return NextResponse.json(
      { error: "Server error while creating story" },
      { status: 500 },
    );
  }
}
