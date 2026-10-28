/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import { PlayCircle, AlertTriangle, RefreshCcw, Loader2 } from "lucide-react";

interface VideoPlayerProps {
  videoId: string; // Cloudinary video public ID
  posterUrl?: string; // Optional thumbnail image
}

// TypeScript declaration for Cloudinary Global Object
declare global {
  interface Window {
    cloudinary?: {
      VideoPlayer: (
        element: HTMLVideoElement, 
        options: Record<string, unknown>
      ) => {
        source: (publicId: string) => void;
        destroy: () => void;
      };
    };
  }
}

export default function VideoPlayer({ videoId, posterUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerInstance = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // 1. Load Cloudinary Script & CSS Once Globally
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if already loaded
    if (window.cloudinary) {
      setIsScriptLoaded(true);
      return;
    }

    const scriptId = "cloudinary-video-player-script";
    const cssId = "cloudinary-video-player-css";

    // Inject Script
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.js";
      script.async = true;
      
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      
      script.onerror = () => {
        console.error("Failed to load Cloudinary Video Player script");
        setHasError(true);
        setIsLoading(false);
      };
      
      document.body.appendChild(script);
    } else {
      // If script exists but not yet initialized in window, wait a bit or check interval
      const checkInterval = setInterval(() => {
        if (window.cloudinary) {
          clearInterval(checkInterval);
          setIsScriptLoaded(true);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    // Inject CSS
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/cloudinary-video-player@1.10.6/dist/cld-video-player.min.css";
      document.head.appendChild(link);
    }

  }, []);

  // 2. Initialize Player when Script is Ready and Video Ref Exists
  useEffect(() => {
    if (!isScriptLoaded || !videoRef.current || !window.cloudinary) return;

    try {
      setIsLoading(true);
      setHasError(false);

      // Destroy previous instance if exists (cleanup)
      if (playerInstance.current && typeof playerInstance.current.destroy === 'function') {
        playerInstance.current.destroy();
      }

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      
      if (!cloudName) {
        throw new Error("Cloudinary Cloud Name missing in environment variables");
      }

      // Initialize Cloudinary Player
      playerInstance.current = window.cloudinary.VideoPlayer(videoRef.current, {
        cloud_name: cloudName,
        secure: true,
        controls: true,
        autoplay: false,
        muted: false,
        fluid: true, // Makes it responsive
        transformation: {
          quality: "auto",
          fetch_format: "auto",
        },
        // Custom UI tweaks for Dark Theme compatibility
        skin: "snow", // Or use custom CSS overrides below
      });

      // Set Source
      playerInstance.current.source(videoId);

      // Listen for events
      const videoEl = videoRef.current;
      
      const onCanPlay = () => {
        setIsLoading(false);
      };

      const onError = () => {
        setIsLoading(false);
        setHasError(true);
        console.error(`Video error for ID: ${videoId}`);
      };

      videoEl.addEventListener('canplay', onCanPlay);
      videoEl.addEventListener('error', onError);

      // Cleanup listeners
      return () => {
        videoEl.removeEventListener('canplay', onCanPlay);
        videoEl.removeEventListener('error', onError);
        if (playerInstance.current) {
           playerInstance.current.destroy();
           playerInstance.current = null;
        }
      };

    } catch (err) {
      console.error("Player Init Error:", err);
      setIsLoading(false);
      setHasError(true);
    }

  }, [isScriptLoaded, videoId]);

  // Retry Handler
  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    // Trigger re-initialization by toggling state or forcing update
    // Since useEffect depends on isScriptLoaded/videoId, we might need a key change or manual reset
    // For simplicity, reloading the component via parent is best, but here we try resetting internal state
    if (videoRef.current) {
       videoRef.current.load();
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto group">
      
      {/* ==============================
          CONTAINER WITH MATTE BORDER
          ============================== */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl ring-1 ring-black/5 transition-all duration-500 hover:border-white/20 hover:shadow-blue-500/10">
        
        {/* Actual Video Element */}
        <video
          ref={videoRef}
          className="cld-video-player w-full h-full object-cover z-10 relative"
          playsInline
          preload="metadata"
          poster={posterUrl || undefined}
        />

        {/* ==============================
            LOADING OVERLAY (SHIMMER)
            ============================== */}
        {isLoading && !hasError && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 animate-fade-in-up">
              <div className="relative">
                <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
              </div>
              <p className="text-slate-400 font-medium text-sm tracking-wide">
                Preparing Cinematic Experience...
              </p>
            </div>
          </div>
        )}

        {/* ==============================
            ERROR STATE CARD
            ============================== */}
        {hasError && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/95 backdrop-blur-md p-6">
            <div className="max-w-sm w-full bg-slate-900 border border-red-500/20 rounded-2xl p-6 text-center shadow-2xl animate-scale-in">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Playback Failed</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                We couldn't load this video right now. Please check your internet connection or try again later.
              </p>
              <button
                onClick={handleRetry}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-gray-100 transition-all active:scale-95 shadow-lg"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* ==============================
            PLAY BUTTON OVERLAY (Idle State)
            ============================== */}
        {!isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             {/* Note: Cloudinary player usually has its own big play button. 
                 This div is just for extra cinematic flair if needed. 
                 Keeping it minimal to avoid conflict with native controls. */}
          </div>
        )}

      </div>

      {/* ==============================
          VIDEO INFO FOOTER (Optional)
          ============================== */}
      <div className="mt-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-wider">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          HD Stream Active
        </div>
        <span className="text-xs text-slate-600">ID: {videoId.substring(0, 8)}...</span>
      </div>
    </div>
  );
}