"use client";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { TStory } from "@/types/story";
import { useEffect, useState } from "react";
import StoryCard from "./StoryCard";

const FeaturedStories = () => {
  const [stories, setStories] = useState<TStory[]>([]);

  const fetchFeaturedStories = async () => {
    try {
      const response = await fetch("/api/stories/view/featured");
      const data = await response.json();
      setStories(data.data);
    } catch (error) {
      console.error("Error fetching featured stories:", error);
    }
  };

  useEffect(() => {
    fetchFeaturedStories();
  }, []);

  if (!stories.length) return null;

  console.log(stories);

  return (
    <section className="bg-[#F3EFE6] py-15 p-6 grid place-items-center rounded-xl mt-6">
      <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-10">
        Featured Stories 🐾
      </h1>

      <Carousel
        opts={{
          align: "start",
        }}
        className="w-full text-center"
      >
        <CarouselContent className="m-0">
          {stories.map((story) => {
            return (
              <CarouselItem key={story._id} className="pr-4">
                <StoryCard story={story} />
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Arrows (desktop friendly) */}
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
      <Button variant="outline" className="mt-10">
        View more stories
      </Button>
    </section>
  );
};

export default FeaturedStories;
