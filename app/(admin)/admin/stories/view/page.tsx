"use client";

import FloatingAddButton from "@/app/components/FloatingAddButton";
import StoryCard from "@/app/container/StoryCard";
import { TStory } from "@/types/story";
import { useCallback, useEffect, useRef, useState } from "react";

export default function StoryFeed() {
  const [stories, setStories] = useState<TStory[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadingRef = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchStories = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    const res = await fetch(
      `/api/admin/stories/view?limit=6${cursor ? `&cursor=${cursor}` : ""}`,
    );

    const data = await res.json();

    setStories((prev) => {
      const existingIds = new Set(prev.map((s) => s._id));
      const newStories = data.data.filter(
        (s: TStory) => !existingIds.has(s._id),
      );
      return [...prev, ...newStories];
    });

    setCursor(data.nextCursor);

    if (!data.nextCursor) {
      setHasMore(false);
    }

    setLoading(false);
    loadingRef.current = false;
  }, [cursor, hasMore]);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchStories();
        }
      },
      { rootMargin: "100px" },
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchStories]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
        {stories.map((story) => (
          <StoryCard story={story} />
        ))}
      </div>

      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <p className="text-gray-500">Loading more stories...</p>}
        </div>
      )}

      <FloatingAddButton path="/admin/stories/add" />
    </>
  );
}
