"use client";
import FeaturedStories from "./container/FeaturedStories";
import Hero from "./container/Hero";

export default function Home() {
  return (
    <div
      className="flex min-h-screen items-center justify-center 
bg-linear-to-b 
from-zinc-100
via-zinc-50 
to-amber-50
font-sans"
    >
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-10 px-1sm:items-start">
        <Hero />
        <FeaturedStories/>
        {/* Feature stories */}
        {/* About */}
        {/* Donation */}
        {/* Contact */}
      </main>
    </div>
  );
}
