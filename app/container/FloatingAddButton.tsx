"use client";

import { PlusIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

const FloatingAddButton = ({ path }: { path: string }) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(path)}
      className="
        fixed 
        bottom-20 
        right-6 
        z-50
        flex 
        items-center 
        justify-center
        h-14 
        w-14 
        rounded-full 
        bg-black 
        text-white 
        shadow-lg 
        hover:scale-105 
        active:scale-95 
        transition-all
      "
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
};

export default FloatingAddButton;
