"use client";
import { IStory } from "@/models/Stories";
import React, { FC } from "react";

interface CatFeaturedStoryProps {
  story: IStory;
}

const CatFeaturedStory: FC<CatFeaturedStoryProps> = ({ story }) => {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/40 transition">
      {/* Thumbnail */}

      <img
        src={story.coverImage}
        alt={story.caption}
        className="w-12 h-12 rounded-full object-cover"
      />

      {/* Content */}
      <div className="flex-1">
        <p className="font-medium text-sm">{story.caption}</p>
        {story.slug && (
          <span className="text-xs text-muted-foreground">#{story.slug}</span>
        )}
      </div>
    </div>
  );
};

export default CatFeaturedStory;
