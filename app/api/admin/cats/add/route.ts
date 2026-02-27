import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    // 🔐 Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await req.json();

    const { name, breed, story, images, medicalStatus, personality } = body;

    // 🛑 Basic validation
    if (!name || !breed || !story || !medicalStatus) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const newCat = await Cat.create({
      name,
      breed,
      story,
      images: images || [],
      medicalStatus,
      personality: personality || [],
    });

    return NextResponse.json(
      {
        message: "Cat added successfully",
        cat: newCat,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error adding cat:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
