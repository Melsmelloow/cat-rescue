"use client";
import { Heart, Star } from "lucide-react";
import Image from "next/image";

function Donation() {
  return (
    <section className="mt-16 p-6">
      <div className="rounded-2xl bg-amber-50 border border-amber-200 shadow-md p-8 max-w-3xl mx-auto text-center">
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900">
            Support the Rescue
          </h1>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-6 text-center">
          Every donation helps provide food, medical care, and shelter
          maintenance for rescued cats. Even small amounts make a big
          difference.
        </p>

        {/* Donation Accounts */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* PayPal */}
          <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition text-left">
            <h3 className="font-semibold text-lg text-gray-800 mb-2 flex items-center">
              <div className="w-10 h-10 relative shrink-0">
                <Image
                  src="/images/paypal.png"
                  alt="PayPal Logo"
                  fill
                  className="object-contain"
                />
              </div>
              PayPal
            </h3>
            <p className="text-sm text-gray-600 mb-3 ml-3">
              @Danna317 (umalidan017@gmail.com)
            </p>
          </div>

          {/* GCash */}
          <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition text-left">
            <div className="ml-3">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 flex gap-2 items-center">
                <Image
                  src="/images/gcash.png"
                  alt="GCash Logo"
                  width={20}
                  height={20}
                />
                GCash
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                0915-611-0813 JE**E M.
              </p>
            </div>
          </div>

          {/* Maya */}
          <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition text-left">
            <div className="ml-3">
              <h3 className="font-semibold text-lg text-gray-800 mb-2 flex gap-2 items-center">
                <Image
                  src="/images/maya.png"
                  alt="Maya Logo"
                  width={20}
                  height={20}
                />
                Maya
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                0915-611-0813 JE**E M.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 bg-amber-100 rounded-lg p-4 text-sm text-amber-900 flex items-start gap-2">
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
