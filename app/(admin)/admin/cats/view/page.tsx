"use client";

import CatList from "@/app/container/CatList";
import { ICat } from "@/models/Cats";
import { useCallback, useEffect, useRef, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Loading from "@/app/components/Loading";
import FloatingAddButton from "@/app/components/FloatingAddButton";

type Cat = {
  _id: string;
  name: string;
  images: string[];
};

export default function CatFeed() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const fetchCats = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);

    const res = await fetch(
      `/api/admin/cats/view?limit=6${cursor ? `&cursor=${cursor}` : ""}`,
    );

    const data = await res.json();

    setCats((prev) => {
      const existingIds = new Set(prev.map((cat) => cat._id));
      const newCats = data.data.filter((cat: Cat) => !existingIds.has(cat._id));
      return [...prev, ...newCats];
    });

    setCursor(data.nextCursor);

    if (!data.nextCursor) {
      setHasMore(false);
    }

    setLoading(false);
    loadingRef.current = false;
  }, [cursor, hasMore]);

  useEffect(() => {
    fetchCats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchCats();
        }
      },
      { rootMargin: "100px" },
    );

    const current = observerRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [fetchCats]);

  return (
    <>
      <CatList cats={cats as unknown as ICat[]} />{" "}
      {hasMore && (
        <div
          ref={observerRef}
          className="h-10 flex items-center justify-center"
        >
          {loading && <Loading />}
        </div>
      )}
      {/* Floating Add Button */}
      <FloatingAddButton />
    </>
  );
}
