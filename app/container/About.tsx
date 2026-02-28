"use client";
import React from "react";

function About() {
  return (
    <div className="mt-6 max-w-4xl text-center p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
        About Us
      </h1>

      <div className="space-y-6 text-amber-800 leading-relaxed text-lg">
        <p>
          This initiative started with one student, a big heart, and a deep love
          for cats.
        </p>

        <p>
          While balancing academic responsibilities, she began rescuing stray
          and abandoned cats using nothing but personal effort and the kindness
          of donors. What started as helping a few cats grew into a small but
          meaningful shelter built through compassion and community support.
        </p>

        <p>
          Every cat here has a story from surviving the streets to finding
          safety, warmth, and care. This platform was created to help share
          those stories, increase transparency, and allow supporters to feel
          more connected to each rescue.
        </p>

        <p>
          100% of donations go directly toward food, medical care, shelter
          maintenance, and improving the quality of life for every rescued cat.
        </p>

        <p className="font-semibold text-amber-900">
          This is not backed by a large organization just compassion,
          consistency, and a community that chooses to care.
        </p>

        <p>
          Thank you for being part of this journey. Whether you donate, share,
          or simply read their stories, you are helping change lives one cat
          at a time.
        </p>
      </div>
    </div>
  );
}

export default About;
