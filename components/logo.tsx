/* eslint-disable */
"use client";

import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

export default function Logo({ 
  size = "medium", 
  showText = true, 
  className 
}: LogoProps) {
  
  // Size Configurations for Icon and Text
  const config = {
    small: {
      icon: "w-8 h-8 sm:w-9 sm:h-9",
      textMain: "text-sm sm:text-base",
      textSub: "text-[9px] sm:text-[10px]",
      gap: "gap-2"
    },
    medium: {
      icon: "w-10 h-10 sm:w-11 sm:h-11",
      textMain: "text-lg sm:text-xl",
      textSub: "text-[10px] sm:text-xs",
      gap: "gap-3"
    },
    large: {
      icon: "w-14 h-14 sm:w-16 sm:h-16",
      textMain: "text-2xl sm:text-3xl",
      textSub: "text-xs sm:text-sm",
      gap: "gap-4"
    },
  };

  const currentSize = config[size];

  // Helper to join class names safely without external utils
  const cx = (...classes: (string | undefined | null | false)[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <Link 
      href="/" 
      className={cx(
        "flex items-center group relative no-underline outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 rounded-xl px-2 py-1 -mx-2 transition-all duration-300",
        className
      )}
      aria-label="World of Concept Home"
    >
      {/* ==============================
          ICON CONTAINER (GLASSMORPHISM)
          ============================== */}
      <div className={cx(
        "relative flex-shrink-0 rounded-full border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-lg overflow-hidden transition-all duration-500 group-hover:border-blue-500/30 group-hover:shadow-blue-500/10 group-hover:scale-105",
        currentSize.icon
      )}>
        
        {/* Inner Ring for Depth */}
        <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/5 pointer-events-none" />
        
        {/* Hover Shine Sweep */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out pointer-events-none" />

        <Image
          src="/logo.png"
          alt="World of Concept Logo"
          width={64}
          height={64}
          className="object-contain p-1 z-10 relative drop-shadow-sm"
          priority
          sizes="(max-width: 768px) 40px, 64px"
        />
      </div>
      
      {/* ==============================
          TEXT BRANDING
          ============================== */}
      {showText && (
        <div className={cx("flex flex-col justify-center min-w-0", currentSize.gap)}>
          <span className={cx(
            "font-black text-white tracking-tight leading-none whitespace-nowrap transition-colors duration-300 group-hover:text-blue-400",
            currentSize.textMain
          )}>
            World of Concept
          </span>
          
          <span className={cx(
            "text-slate-400 font-medium uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity duration-300",
            currentSize.textSub
          )}>
            By RK Sir
          </span>
        </div>
      )}
    </Link>
  );
}