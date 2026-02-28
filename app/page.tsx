"use client";
import { Separator } from "@/components/ui/separator";
import FeaturedStories from "./container/FeaturedStories";
import Hero from "./container/Hero";
import About from "./container/About";
import Donation from "./container/Donation";
import Contact from "./container/Contact";

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
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-10 px-1sm:items-start p-6">
        <Hero />
        <FeaturedStories />
        <Separator className="mt-10" />
        <About />
        <Donation />
        <Separator className="mt-10" />
        <Contact />
      </main>
    </div>
  );
}
