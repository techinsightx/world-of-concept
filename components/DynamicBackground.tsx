/* eslint-disable */
"use client";

import { useEffect, useState } from "react";

interface DynamicBackgroundProps {
  images: string[];
  zoomType?: "in" | "out";
}

export default function DynamicBackground({
  images,
  zoomType = "in",
}: DynamicBackgroundProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="dark:hidden absolute inset-0">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading={i === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            } ${zoomType === "in" ? "animate-ken-burns-in" : "animate-ken-burns-out"}`}
          />
        ))}
      </div>

      <div className="hidden dark:block absolute inset-0">
        <div className="absolute inset-0 animate-nebula-shift" />
        <div className="absolute inset-0 space-stars" />
        <div className="absolute top-1/4 left-1/4 solar-orbit-1" />
        <div className="absolute bottom-1/3 right-1/4 solar-orbit-2" />
        <div className="absolute top-1/2 left-1/2 solar-orbit-3" />
        <div className="absolute inset-0 bg-slate-950/30 backdrop-blur-[1px]" />
      </div>
    </div>
  );
}