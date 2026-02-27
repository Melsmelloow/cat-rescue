import { ALLOWED_TYPES, MAX_IMAGE_SIZE, MAX_IMAGES } from "@/app/constant/images";
import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();

    // ========================
    // 🔎 Extract Fields
    // ========================
    const name = (formData.get("name") as string)?.trim();
    const breed = (formData.get("breed") as string)?.trim();
    const story = (formData.get("story") as string)?.trim();
    const medicalStatus = (formData.get("medicalStatus") as string)?.trim();

    const personality = (formData.getAll("personality") as string[])
      .map((p) => p.trim())
      .filter(Boolean);

    const imageFiles = formData.getAll("images") as File[];

    // ========================
    // 🔒 Field Validation
    // ========================

    if (!name || name.length < 2 || name.length > 50) {
      return NextResponse.json(
        { error: "Invalid name (2-50 characters required)" },
        { status: 400 },
      );
    }

    if (!breed || breed.length < 2 || breed.length > 50) {
      return NextResponse.json(
        { error: "Invalid breed (2-50 characters required)" },
        { status: 400 },
      );
    }

    if (!story || story.length < 10 || story.length > 2000) {
      return NextResponse.json(
        { error: "Story must be 10-2000 characters" },
        { status: 400 },
      );
    }

    if (!medicalStatus || medicalStatus.length < 2) {
      return NextResponse.json(
        { error: "Medical status is required" },
        { status: 400 },
      );
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: "At least one image is required" },
        { status: 400 },
      );
    }

    if (imageFiles.length > MAX_IMAGES) {
      return NextResponse.json(
        { error: `Maximum ${MAX_IMAGES} images allowed` },
        { status: 400 },
      );
    }

    // ========================
    // 🔒 File Validation
    // ========================

    for (const file of imageFiles) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Only JPG, PNG, and WEBP allowed" },
          { status: 400 },
        );
      }

      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: "Each image must be under 5MB" },
          { status: 400 },
        );
      }
    }

    // ========================
    // ☁️ Upload to Cloudinary
    // ========================

    const uploadedImages: string[] = [];

    for (const file of imageFiles) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "cats" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(buffer);
      });

      console.log("Upload Result:", uploadResult);

      uploadedImages.push(uploadResult.secure_url);
    }

    // ========================
    // 💾 Save to MongoDB
    // ========================

    const newCat = await Cat.create({
      name,
      breed,
      story,
      medicalStatus,
      personality,
      images: uploadedImages,
      likes: 0,
    });

    console.log("New Cat Created:", newCat);

    return NextResponse.json({ success: true, data: newCat }, { status: 201 });
  } catch (error) {
    console.error("Create Cat Error:", error);

    return NextResponse.json(
      { error: "Server error while creating cat" },
      { status: 500 },
    );
  }
}
