import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Stories } from "@/models/Stories";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid cat ID" }, { status: 400 });
    }

    // remove cat references from stories
    await Stories.updateMany({ cats: id }, { $pull: { cats: id } });

    // delete cat
    const result = await Cat.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ error: "Cat not found" }, { status: 404 });
    }

    // invalidate cats list page
revalidatePath("/cats/view");
    return NextResponse.json(
      { message: "Successfully deleted cat" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
