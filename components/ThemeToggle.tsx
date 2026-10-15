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

  // Hydration mismatch रोकने के लिए skeleton loader
  if (!mounted) {
    return <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 hover:scale-105 active:scale-95"
      aria-label="Toggle Theme"
    >
      {/* Sun Icon (Light Mode में दिखेगा) */}
      <Sun className="w-5 h-5 transition-all duration-300 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      
      {/* Moon Icon (Dark Mode में दिखेगा) */}
      <Moon className="w-5 h-5 absolute transition-all duration-300 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
    </button>
  );
}