import StoryView from "@/app/container/StoryView";
import { connectDB } from "@/lib/mongodb";
import { Cat } from "@/models/Cats";
import { Stories } from "@/models/Stories";
import mongoose from "mongoose";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  if (id) {
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      // redirect to 404
      return <div>Invalid Id</div>;
    }

    const story = await Stories.findById(id)
      .populate({
        path: "cats",
        select: "_id name images",
        options: {
          slice: { images: 1 }, // only first image
        },
      })
      .lean();
    const formatStory = (story: any) => ({
      ...story,
      _id: story._id.toString(),
      cats: story.cats.map((cat: any) => ({
        ...cat,
        _id: cat._id.toString(),
        images: cat.images[0] || null, // get the first image or null if no images
      })),
    });

    console.log(formatStory(story));
    if (!story) {
      // redirect to 404
      return <div>Story not found</div>;
    }
    return <StoryView story={formatStory(story)} />;
  }
}
