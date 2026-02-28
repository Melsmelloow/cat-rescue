"use client";
import { TStory } from "@/types/story";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface StoryCardProps {
  story: TStory;
}

const StoryCard: FC<StoryCardProps> = ({ story }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
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
    <div
      key={story._id as unknown as string}
      className="bg-white rounded-xl shadow border overflow-hidden"
      onClick={() => {
        const redirectUrl = session
          ? `/admin/stories/view/${story._id}`
          : `/stories/view/${story._id}`;
        router.push(redirectUrl);
      }}
    >
      <img
        src={story.coverImage}
        alt={story.caption}
        className="w-full h-60 object-cover"
      />

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

export default StoryCard;
