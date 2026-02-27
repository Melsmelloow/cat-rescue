"use client";
import { motion, Transition } from "motion/react";
import { FC } from "react";

interface HeroProps {}

const floatingTransition: Transition = {
  repeat: Infinity,
  repeatType: "mirror",
  duration: 4,
  ease: "easeInOut",
};

const Hero: FC<HeroProps> = () => {
  return (
    <section className="min-h-screen flex items-center px-6 md:px-16">
      <div className="grid md:grid-cols-2 gap-6 items-center w-full">
        {/* LEFT — Floating Cats */}
        <div className="relative h-100 md:h-125">
          {/* Large Cat */}
          <motion.img
            src="https://images.pexels.com/photos/279360/pexels-photo-279360.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Rescued Cat"
            className="absolute w-40 h-40 md:w-56 md:h-56 rounded-full object-cover shadow-xl top-10 left-10"
            animate={{ y: [0, -20, 0] }}
            transition={floatingTransition}
          />

          {/* Medium Cat */}
          <motion.img
            src="https://images.pexels.com/photos/1276553/pexels-photo-1276553.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Rescued Cat"
            className="absolute w-32 h-32 md:w-44 md:h-44 rounded-full object-cover shadow-lg bottom-10 left-32"
            animate={{ y: [0, 15, 0] }}
            transition={{ ...floatingTransition, duration: 5 }}
          />

          {/* Small Cat */}
          <motion.img
            src="https://images.pexels.com/photos/1404819/pexels-photo-1404819.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Rescued Cat"
            className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md top-20 right-0"
            animate={{ y: [0, -12, 0] }}
            transition={{ ...floatingTransition, duration: 6 }}
          />
          {/* Small Cat */}
          <motion.img
            src="https://images.pexels.com/photos/32631284/pexels-photo-32631284.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Rescued Cat"
            className="absolute w-24 h-24 md:w-32 md:h-32 rounded-full object-cover shadow-md top-50 left-0"
            animate={{ y: [0, -12, 0] }}
            transition={{ ...floatingTransition, duration: 6 }}
          />
        </div>

        {/* RIGHT — Text Section */}
        <div className="space-y-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900">
            Giving Cats a Second Chance 🐾
          </h1>

          <p className="text-lg text-amber-800 leading-relaxed">
            We are a community-driven cat rescue dedicated to saving abandoned,
            neglected, and vulnerable cats. Our mission is to provide medical
            care, shelter, and loving foster homes until every cat finds their
            forever family.
          </p>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-amber-900">Our Goal</h2>
            <p className="text-amber-800">
              To reduce stray cat populations through rescue, and
              rehabilitation while educating communities about compassion and
              proper animal care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
