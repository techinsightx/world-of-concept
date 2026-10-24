/* eslint-disable */
"use client";

import Link from "next/link";
import { useRef } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    (ref.current as HTMLElement).style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    (ref.current as HTMLElement).style.transform = `translate(0px, 0px) scale(1)`;
  };

  const baseClass =
    "transition-all duration-300 ease-out relative overflow-hidden group";

  if (href) {
    return (
      <Link
        href={href}
        className={`${className} ${baseClass}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        ref={ref as any}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={`${className} ${baseClass}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref as any}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}