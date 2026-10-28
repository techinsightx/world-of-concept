/* eslint-disable */
"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  [key: string]: any;
}

export default function MagneticButton({
  children,
  className = "",
  onClick,
  href,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // State to track if the device supports hover (Desktop vs Mobile)
  const [isHoverDevice, setIsHoverDevice] = useState(true);
  
  // Check for reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Detect Hover Capability (True for Desktop, False for most Touch devices)
    const mqHover = window.matchMedia("(hover: hover)");
    setIsHoverDevice(mqHover.matches);

    // 2. Detect Reduced Motion Preference
    const mqReduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mqReduce.matches);

    const handleHoverChange = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    const handleReduceChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);

    mqHover.addEventListener("change", handleHoverChange);
    mqReduce.addEventListener("change", handleReduceChange);

    return () => {
      mqHover.removeEventListener("change", handleHoverChange);
      mqReduce.removeEventListener("change", handleReduceChange);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    // If it's a touch device OR user prefers reduced motion, do nothing
    if (!ref.current || !isHoverDevice || prefersReducedMotion) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    // Strength of the magnet effect (higher = more pull)
    const strength = 0.3; 
    
    setPosition({
      x: xPct * strength * width,
      y: yPct * strength * height,
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Apply transform via style prop for smoother rendering
  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: position.x === 0 && position.y === 0 
      ? "transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)" // Spring back effect
      : "transform 0.1s linear", // Follow mouse tightly
  };

  // Base classes for consistent styling across all buttons
  const baseClass = `
    relative inline-flex items-center justify-center
    transition-all duration-300 ease-out
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
    active:scale-95
    ${className}
  `;

  if (href) {
    return (
      <Link
        href={href}
        className={baseClass}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={ref as any}
        style={style}
        {...props}
      >
        {/* Subtle Glow Layer for Premium Feel */}
        <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        <span className="relative z-10 flex items-center gap-2">{children}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClass}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref as any}
      style={style}
      onClick={onClick}
      {...props}
    >
      {/* Subtle Glow Layer for Premium Feel */}
      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}