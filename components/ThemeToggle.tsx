"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Hydration mismatch रोकने के लिए
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700" />; // Skeleton loader
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95 group"
      aria-label="Toggle Theme"
    >
      {/* Sun Icon (Light Mode के लिए) */}
      <Sun className="w-5 h-5 text-orange-500 transition-all duration-300 absolute inset-0 m-auto rotate-0 scale-100 dark:rotate-90 dark:scale-0" />
      
      {/* Moon Icon (Dark Mode के लिए) */}
      <Moon className="w-5 h-5 text-blue-400 transition-all duration-300 absolute inset-0 m-auto -rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}