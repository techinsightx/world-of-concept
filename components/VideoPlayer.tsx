// components/VideoPlayer.tsx
"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  videoId: string; // Cloudinary video public ID
}

// TypeScript को बताएं कि window ऑब्जेक्ट में cloudinary प्रॉपर्टी होगी
// यह 'any' type के error को खत्म कर देता है
declare global {
  interface Window {
    cloudinary: {
      VideoPlayer: (
        element: HTMLVideoElement, 
        options: Record<string, unknown>
      ) => {
        source: (publicId: string) => void;
      };
    };
  }
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Cloudinary Video Player को dynamically load करें
    const script = document.createElement("script");
    script.src = "https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.js";
    script.async = true;
    document.body.appendChild(script);

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.css";
    document.head.appendChild(link);

    script.onload = () => {
      // अब window.cloudinary type-safe है
      if (videoRef.current && window.cloudinary) {
        const player = window.cloudinary.VideoPlayer(videoRef.current, {
          cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          secure: true,
          controls: true,
          autoplay: false,
        });
        player.source(videoId);
      }
    };

    // Cleanup function (safe removal)
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [videoId]);

  return (
    <div className="max-w-4xl mx-auto">
      <video
        ref={videoRef}
        className="cld-video-player w-full rounded-lg shadow-xl"
        controls
      />
    </div>
  );
}