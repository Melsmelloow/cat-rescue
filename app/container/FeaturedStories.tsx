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
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const FeaturedStories = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const autoplay = useRef(
    Autoplay({
      delay: 4000, // 4 seconds
      stopOnInteraction: false, // keeps autoplay after swipe
    }),
  );
  const [stories, setStories] = useState<TStory[]>([]);

  const fetchFeaturedStories = async () => {
    try {
      const response = await fetch("/api/stories/view/featured");
      console.log(response);
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
    <section className="bg-[#F3EFE6] py-16 mt-6 w-full">
      <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-12 text-center w-full">
        Featured Stories 🐾
      </h1>

      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[autoplay.current]}
        className="max-w-70 mx-auto"
      >
        {/* THIS is the key wrapper */}
        <div className="max-w-lg mx-auto">
          <CarouselContent>
            {stories.map((story) => (
              <CarouselItem key={story._id}>
                <StoryCard story={story} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </div>
      </Carousel>

      <div className="text-center mt-2">
        <Button
          variant="ghost"
          className="p-0 h-auto text-amber-700 underline hover:no-underline hover:bg-transparent"
          onClick={() => {
            const redirectUrl = session
              ? "/admin/stories/view"
              : "stories/view";
              router.push(redirectUrl);
          }}
        >
          View more stories
        </Button>
      </div>
    </section>
  );
};

export default FeaturedStories;
