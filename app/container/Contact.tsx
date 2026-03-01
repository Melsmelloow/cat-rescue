"use client";
import { Facebook, Instagram } from "lucide-react";
import { SiThreads } from "react-icons/si";
import Link from "next/link";

function Contact() {
  return (
    <section className="mt-10" id="contact">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-6">
          Connect with us
        </h1>

        <div className="flex justify-center gap-6">
          {/* Facebook */}
          <Link
            href="https://www.facebook.com/solemn.hiraya"
            target="_blank"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 text-white hover:scale-110 transition"
          >
            <Facebook className="w-5 h-5" />
          </Link>

          {/* Threads */}
          <Link
            href="https://www.threads.com/@hraya_a"
            target="_blank"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-black text-white hover:scale-110 transition"
          >
            <SiThreads className="w-5 h-5" />
          </Link>

          {/* Instagram */}
          <Link
            href="https://www.instagram.com/hraya_a/"
            target="_blank"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-500 text-white hover:scale-110 transition"
          >
            <Instagram className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Contact;
