"use client";

import Image from "next/image";

const Loading = ({}) => {
  return (
    <div className="w-full h-full bg-black/50 fixed z-10">
      <Image
        src="/images/cat-loading.gif"
        alt="Loading..."
        width={250}
        height={250}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
      />
    </div>
  );
};

export default Loading;
