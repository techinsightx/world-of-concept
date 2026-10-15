"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hydration mismatch रोकने के लिए skeleton
  if (!mounted) {
    return <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700/50" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Theme"
      className="group relative w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-800 border border-zinc-700/50 dark:border-zinc-600/50 shadow-lg hover:shadow-zinc-500/20 transition-all duration-300 hover:scale-110 active:scale-95 overflow-hidden"
    >
      {/* 🔥 1. Rainbow Shimmer Glow (Hover पर activate होगा) */}
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500 animate-rainbow-shift" />
      
      {/* 🔥 2. Inner Matte Base (ऊपर के glow को cover करने के लिए) */}
      <div className="absolute inset-0 rounded-full bg-zinc-900 dark:bg-zinc-800 z-10" />

      {/* 🔥 3. Micro-Level Inner Shimmer Sweep */}
      <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20 pointer-events-none bg-[linear-gradient(110deg,transparent_35%,rgba(255,255,255,0.1)_50%,transparent_65%)] bg-[length:200%_100%] group-hover:animate-shimmer-sweep" />

      {/* 🔥 4. 3D Flip Container */}
      <div className="relative z-30 w-full h-full [perspective:800px]">
        <div 
          className={`relative w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] [transform-style:preserve-3d] ${
            isDark ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* 🌙 Front Face: Light Mode में दिखेगा (Dark mode के लिए Force करेगा) */}
          <div className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center text-zinc-400 group-hover:text-purple-300 transition-colors duration-300">
            <Moon className="w-4 h-4" strokeWidth={2.5} />
          </div>

          {/* ☀️ Back Face: Dark Mode में दिखेगा (Light mode के लिए Force करेगा) */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] flex items-center justify-center text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300">
            <Sun className="w-4 h-4" strokeWidth={2.5} />
          </div>
        </div>
      </div>
    </button>
  );
}