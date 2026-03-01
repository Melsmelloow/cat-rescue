"use client";

import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface StoryViewProps {
  story: {
    _id: string;
    caption: string;
    slug: string;
    coverImage: string;
    likes: number;
    cats: {
      _id: string;
      name: string;
      images: string | null;
    }[];
  };
}

const StoryView: FC<StoryViewProps> = ({ story }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(story.likes || 0);
  const [loading, setLoading] = useState(false);
  const [animateHeart, setAnimateHeart] = useState(false);

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
      if (data.liked) setLiked(true);
    };
    checkIfLiked();
  }, [story._id]);

  const handleLike = async () => {
    if (liked || loading) return;
    setLoading(true);

    const deviceId = getDeviceId();

    setLiked(true);
    setLikeCount((prev) => prev + 1);
    setAnimateHeart(true);
    setTimeout(() => setAnimateHeart(false), 900);

    try {
      const res = await fetch(`/api/stories/${story._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId }),
      });

      if (res.status === 409) {
        setLikeCount((prev) => prev - 1);
      }

      if (!res.ok && res.status !== 409) throw new Error();
    } catch {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <article className="min-h-screen bg-white">
      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full aspect-[16/9] md:aspect-[2/1]">
          <img
            src={story.coverImage}
            alt={story.slug}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

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
        {/* Floating Heart Explosion */}
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
              <svg
                viewBox="0 0 24 24"
                className="w-24 h-24 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]"
              >
                <defs>
                  <linearGradient
                    id="heartGradientStory"
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
                  fill="url(#heartGradientStory)"
                  d="M11.644 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-2.02-1.25 14.687 14.687 0 01-2.793-2.377C4.01 14.68 2 11.805 2 8.5 2 5.462 4.462 3 7.5 3c1.74 0 3.38.81 4.5 2.09A6.002 6.002 0 0116.5 3C19.538 3 22 5.462 22 8.5c0 3.305-2.01 6.18-4.802 8.768a14.687 14.687 0 01-2.793 2.377 15.247 15.247 0 01-2.02 1.25l-.022.012-.007.003a.75.75 0 01-.712 0z"
                />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* CONTENT */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        {/* SLUG TITLE */}
        <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4 capitalize">
          {story.slug.replace(/-/g, " ")}
        </h1>

        {/* LIKE BUTTON */}

        {/* 🐱 Cats in this Story */}
        {story.cats.length > 0 && (
          <div className="mb-10">
            <h2 className="text-sm uppercase tracking-wide text-zinc-500 mb-4">
              Cats in this story
            </h2>

            <div className="flex flex-wrap gap-4">
              {story.cats.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/cats/view/${cat._id}`}
                  className="relative group"
                >
                  <div className="relative w-15 h-15 rounded-full overflow-hidden shadow-md">
                    <img
                      src={cat.images || "/placeholder-cat.jpg"}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay Text */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-[10px] text-center px-1">
                      Cat in story
                    </div>
                  </div>

                  <p className="text-sm text-center mt-2 text-amber-800 font-medium">
                    {cat.name}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* BLOG CONTENT */}
        <p className="whitespace-pre-line leading-relaxed text-lg text-zinc-700">
          {story.caption}
        </p>
      </section>
    </article>
  );
};

export default StoryView;
