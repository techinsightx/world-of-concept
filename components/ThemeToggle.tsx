"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="group relative w-12 h-12 flex items-center justify-center rounded-2xl 
                 bg-white dark:bg-slate-900 
                 border-2 border-slate-200 dark:border-slate-700 
                 hover:border-blue-500 dark:hover:border-blue-400 
                 shadow-lg hover:shadow-blue-500/20 dark:hover:shadow-blue-400/30
                 transition-all duration-300 ease-out hover:scale-110 active:scale-95 overflow-hidden"
      aria-label="Toggle Theme"
    >
      {/* 🔥 Shimmer Effect on Hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/40 dark:via-white/10 to-transparent" />
      
      {/* 🔥 Magnetic Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-500" />

      {/* ☀️ Sun Icon (Visible in Light Mode) */}
      <Sun className="absolute w-6 h-6 text-orange-500 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
                      rotate-0 scale-100 opacity-100 
                      dark:-rotate-90 dark:scale-0 dark:opacity-0" />
      
      {/* 🌙 Moon Icon (Visible in Dark Mode) */}
      <Moon className="absolute w-6 h-6 text-blue-400 transition-all duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] 
                       rotate-90 scale-0 opacity-0 
                       dark:rotate-0 dark:scale-100 dark:opacity-100" />
      
      {/* ✨ Sparkle for extra premium feel */}
      <Sparkles className="absolute w-3 h-3 text-yellow-400 -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
    </button>
  );
}