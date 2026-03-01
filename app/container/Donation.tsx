"use client";
import { Star, Heart } from "lucide-react";
import Link from "next/link";

function Donation() {
  return (
    <section className="mt-16 p-6" id="donation">
      <div className="rounded-2xl bg-amber-50 border border-amber-200 shadow-md p-8 max-w-3xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
          Support the Rescue
        </h1>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-8">
          Every donation helps provide food, medical care, and shelter
          maintenance for rescued cats. Even small amounts make a big
          difference.
        </p>

        {/* CTA Button */}
        <Link
          href="https://linktr.ee/SolemnHiraya"
          target="_blank"
          className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition"
        >
          <Heart className="w-5 h-5" />
          Donate via Linktree
        </Link>

        {/* Footer Note */}
        <div className="mt-8 bg-amber-100 rounded-lg p-4 text-sm text-amber-900 flex items-start gap-2">
          <Star className="mt-1 w-4 h-4" />
          <p>
            100% of donations go directly to the rescued cats. Thank you for
            being part of their journey.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Donation;
