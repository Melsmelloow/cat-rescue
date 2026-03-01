"use client";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { ICat } from "@/models/Cats";
import { IStory } from "@/models/Stories";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import CatFeaturedStory from "./CatFeaturedStory";

interface CatViewProps extends Omit<ICat, "_id"> {
  _id: string;
  stories: IStory[];
}

const CatView: FC<CatViewProps> = ({
  _id,
  name,
  breed,
  story,
  images = [],
  likes,
  medicalStatus,
  personality,
  stories,
}) => {
  const hasImages = images.length > 0;
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [loading, setLoading] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

  // 🔐 Get or create deviceId
  const getDeviceId = () => {
    let deviceId = localStorage.getItem("device_id");

    if (!deviceId) {
      deviceId = crypto.randomUUID();
      localStorage.setItem("device_id", deviceId);
    }

    return deviceId;
  };

  useEffect(() => {
    const checkIfLiked = async () => {
      const deviceId = getDeviceId();

      const res = await fetch(`/api/cats/${_id}/like?deviceId=${deviceId}`);

      const data = await res.json();

      if (data.liked) {
        setLiked(true);
      }
    };

    checkIfLiked();
  }, [_id]);

  // ❤️ Handle Like
  const handleLike = async () => {
    if (liked || loading) return;

    setLoading(true);

    const deviceId = getDeviceId();

    // Optimistic update
    setLiked(true);
    setLikeCount((prev: number) => prev + 1);

    try {
      const res = await fetch(`/api/cats/${_id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      console.log(res.status);

      if (res.status === 409) {
        // Already liked
        setLiked(true);
        setLikeCount((prev) => prev - 1);
      }

      if (!res.ok && res.status !== 409) {
        throw new Error("Failed");
      }
    } catch (err) {
      // rollback optimistic update
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } finally {
      setLoading(false);
    }
  };

  console.log(stories);
  return (
    <>
      <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Floating Heart Animation (UNCHANGED LOGIC) */}
        <AnimatePresence>
          {animateHeart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0, rotate: -15 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.5, 1.8, 1.6],
                y: [0, -60, -120],
                rotate: [-15, 10, -5],
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
            >
              {/* SVG SAME AS YOURS */}
              <svg
                viewBox="0 0 24 24"
                className="w-24 h-24 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]"
              >
                <defs>
                  <linearGradient
                    id="heartGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#d946ef" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#heartGradient)"
                  d="M11.644 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-2.02-1.25 14.687 14.687 0 01-2.793-2.377C4.01 14.68 2 11.805 2 8.5 2 5.462 4.462 3 7.5 3c1.74 0 3.38.81 4.5 2.09A6.002 6.002 0 0116.5 3C19.538 3 22 5.462 22 8.5c0 3.305-2.01 6.18-4.802 8.768a14.687 14.687 0 01-2.793 2.377 15.247 15.247 0 01-2.02 1.25l-.022.012-.007.003a.75.75 0 01-.712 0z"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HERO IMAGE SECTION */}
        <div className="relative w-full overflow-hidden">
          <Carousel opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {(hasImages ? images : ["/placeholder-cat.jpg"]).map(
                (img, index) => (
                  <CarouselItem key={index}>
                    <div className="relative w-full aspect-[16/9] md:aspect-[2/1]">
                      <img
                        src={img}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ),
              )}
            </CarouselContent>

            {images.length > 1 && (
              <>
                <CarouselPrevious className="left-4 z-20" />
                <CarouselNext className="right-4 z-20" />
              </>
            )}
          </Carousel>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />

          {/* Name + Breed */}
          <div className="absolute bottom-6 left-6 text-white z-20">
            <h1 className="text-4xl font-bold">{name}</h1>
            <p className="text-lg opacity-90">{breed}</p>
          </div>

          {/* Floating Like Button */}
          <button
            onClick={() => {
              handleLike();
              if (!liked) {
                setAnimateHeart(true);
                setTimeout(() => setAnimateHeart(false), 900);
              }
            }}
            disabled={loading}
            className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md flex items-center gap-2 text-sm font-medium z-20"
          >
            <motion.div
              animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {liked ? (
                <HeartSolid className="w-5 h-5 text-rose-500" />
              ) : (
                <HeartOutline className="w-5 h-5 text-zinc-500 hover:text-rose-500 transition" />
              )}
            </motion.div>

            <span className={`${liked ? "text-rose-500" : "text-zinc-700"}`}>
              {likeCount}
            </span>
          </button>
        </div>

        {/* STORY SECTION */}
        <div className="max-w-3xl mx-auto px-6 py-12 text-center">
          <h2 className="text-2xl font-semibold text-amber-800 mb-4">
            {name}'s Story
          </h2>

          <p className="text-zinc-700 leading-relaxed text-lg whitespace-pre-line">
            {story}
          </p>
        </div>

        {/* INFO SECTION */}
        <div className="max-w-3xl mx-auto px-6 pb-12 grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold text-amber-800 mb-3">Personality</h3>
            <div className="flex flex-wrap gap-2">
              {personality?.map((trait, index) => (
                <span
                  key={index}
                  className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-amber-800 mb-3">
              Medical Status
            </h3>
            <p className="text-zinc-700 text-sm">🏥 {medicalStatus}</p>
          </div>
        </div>
      </div>
      {session && stories.length === 0 && (
        <>
          <Separator className="my-10" />
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-semibold text-amber-800 mb-4">
              No Stories Yet
            </h2>
            <div className="text-center mt-2">
              <Link href={`/admin/stories/add?catId=${_id}`}>
                <Button
                  variant="ghost"
                  className="p-0 h-auto text-amber-700 underline hover:no-underline hover:bg-transparent"
                >
                  Add the first story of {name} 🐾
                </Button>
              </Link>
            </div>
          </div>
        </>
      )}

      {stories.length > 0 && (
        <>
          <Separator className="my-10" />
          <div className="p-5 py-0">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">
              Related Stories of {name}
            </h3>
            <div className="space-y-2">
              {stories.map((story) => (
                <CatFeaturedStory
                  key={story._id?.toString() || story.caption}
                  story={story}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CatView;
