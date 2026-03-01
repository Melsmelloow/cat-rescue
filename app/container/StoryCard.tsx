"use client";
import { TStory } from "@/types/story";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface StoryCardProps {
  story: TStory;
}

const StoryCard: FC<StoryCardProps> = ({ story }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes || 0);
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

      const res = await fetch(
        `/api/stories/${story._id}/like?deviceId=${deviceId}`,
      );

      const data = await res.json();

      if (data.liked) {
        setLiked(true);
      }
    };

    checkIfLiked();
  }, [story._id]);

  // ❤️ Handle Like
  const handleLike = async () => {
    if (liked || loading) return;

    setLoading(true);

    const deviceId = getDeviceId();

    // Optimistic update
    setLiked(true);
    setLikeCount((prev: number) => prev + 1);

    try {
      const res = await fetch(`/api/stories/${story._id}/like`, {
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

  return (
    <Link
      href={`/stories/view/${story._id}`}
      className="block bg-white rounded-xl shadow border overflow-hidden hover:shadow-lg transition"
    >
      <div className="relative">
        <img
          src={story.coverImage}
          alt={story.caption}
          className="w-full h-60 object-cover"
        />

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
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
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
      </div>

      <div className="p-4 space-y-2">
        <h2 className="font-semibold text-lg">{story.caption}</h2>

        <div className="flex flex-wrap gap-2 text-sm text-gray-600 items-center">
          {story.cats.map((cat) => (
            <span
              key={cat._id as unknown as string}
              className="bg-gray-100 px-2 py-1 rounded-full"
            >
              {cat.name}
            </span>
          ))}
          <h2 className="font-semibold text-sm">#{story.slug}</h2>
        </div>

        <div className="flex justify-between">
          <div>
            {story.featured && (
              <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                Featured ⭐
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
              if (!liked) {
                setAnimateHeart(true);
                setTimeout(() => setAnimateHeart(false), 900);
              }
            }}
            disabled={loading}
            className="relative flex items-center gap-1 text-sm font-medium"
          >
            <motion.div
              animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {liked ? (
                <HeartSolid className="w-5 h-5 text-rose-500" />
              ) : (
                <HeartOutline className="w-5 h-5 text-zinc-400 hover:text-rose-500 transition" />
              )}
            </motion.div>

            <span className={`${liked ? "text-rose-500" : "text-amber-700"}`}>
              {likeCount}
            </span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default StoryCard;
