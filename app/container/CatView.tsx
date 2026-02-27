"use client";

import { ICat } from "@/models/Cats";
import { FC, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { motion, AnimatePresence } from "framer-motion";

interface CatViewProps extends ICat {
  _id: string;
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
}) => {
  const hasImages = images.length > 0;

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

  return (
    <div className="relative bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
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
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <HeartSolid className="w-24 h-24 drop-shadow-xl bg-gradient-to-br from-rose-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent" />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Carousel */}
      <Carousel opts={{ loop: true }} className="w-full">
        <CarouselContent>
          {(hasImages ? images : ["/placeholder-cat.jpg"]).map((img, index) => (
            <CarouselItem key={index}>
              <div className="relative w-full aspect-square bg-zinc-100">
                <img
                  src={img}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-3" />
            <CarouselNext className="right-3" />
          </>
        )}
      </Carousel>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-amber-800">{name}</h2>
          <p className="text-sm text-zinc-500">{breed}</p>
        </div>

        <p className="text-sm text-zinc-700 line-clamp-3">{story}</p>

        <div className="flex flex-wrap gap-2">
          {personality?.map((trait, index) => (
            <span
              key={index}
              className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-sm text-zinc-600">🏥 {medicalStatus}</span>
          <button
            onClick={() => {
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
    </div>
  );
};

export default CatView;
