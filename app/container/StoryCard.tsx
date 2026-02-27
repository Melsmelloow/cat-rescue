"use client";
import { IStory } from "@/models/Stories";
import { TStory } from "@/types/story";
import { FC } from "react";

interface StoryCardProps {
  story: TStory;
}

const StoryCard: FC<StoryCardProps> = ({ story }) => {
  return (
    <div
      key={story._id as unknown as string}
      className="bg-white rounded-xl shadow border overflow-hidden"
    >
      <img
        src={story.coverImage}
        alt={story.caption}
        className="w-full h-60 object-cover"
      />

      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg">{story.caption}</h2>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600">
          {story.cats.map((cat) => (
            <span
              key={cat._id as unknown as string}
              className="bg-gray-100 px-2 py-1 rounded-full"
            >
              {cat.name}
            </span>
          ))}
        </div>

        {story.featured && (
          <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
            Featured ⭐
          </span>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
