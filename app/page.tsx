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
      <main className="flex min-h-screen w-full flex-col py-10">
        <Hero />
        <FeaturedStories />
        <About />
        <Donation />
        <Separator className="mt-10" />
        <Contact />
      </main>
    </div>
  );
}
