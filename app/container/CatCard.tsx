"use client";
import { ICat } from "@/models/Cats";
import { FC } from "react";

const CatCard: FC<ICat> = ({
  name,
  breed,
  story,
  images,
  likes,
  medicalStatus,
  personality,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition duration-300">
      {/* Image */}

      <div className="relative w-full aspect-square bg-zinc-100">
        <img
          src={images?.[0] || "/placeholder-cat.jpg"}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div>
          <h2 className="text-xl font-bold text-amber-800">{name}</h2>
          <p className="text-sm text-zinc-500">{breed}</p>
        </div>

        <p className="text-sm text-zinc-700 line-clamp-3">{story}</p>

        <div className="flex flex-wrap gap-2">
          {personality?.map((trait, index) => (
            <span
              key={index}
              className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full"
            >
              {trait}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-sm text-zinc-600">🏥 {medicalStatus}</span>
          <span className="text-sm text-amber-700 font-medium">💛 {likes}</span>
        </div>
      </div>
    </div>
  );
};

export default CatCard;
