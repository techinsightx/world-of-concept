/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, UserCircle2 } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

interface StudentHeaderProps {
  fullName?: string | null;
  email?: string | null;
  updatesCount?: number;
  onNotifications?: () => void;
  onLogout: () => void;
}

/**
 * Layout navbar का exact bottom offset detect करता है।
 * Priority:
 * 1. CSS variable: --site-navbar-height
 * 2. Element: [data-site-navbar]
 * 3. First fixed/sticky header/nav near top
 * 4. Fallback: mobile 64px, desktop 80px
 */
function getNavbarOffset(): number {
  if (typeof window === "undefined") return 64;

  try {
    const rootStyles = window.getComputedStyle(document.documentElement);
    const cssVar = rootStyles.getPropertyValue("--site-navbar-height").trim();

    if (cssVar) {
      const parsed = Number.parseFloat(cssVar);
      if (Number.isFinite(parsed) && parsed > 0) {
        return Math.round(parsed);
      }
    }
  } catch {
    // ignore
  }

  try {
    const markedNavbar = document.querySelector(
      "[data-site-navbar]",
    ) as HTMLElement | null;

    if (markedNavbar) {
      const styles = window.getComputedStyle(markedNavbar);
      const rect = markedNavbar.getBoundingClientRect();

      if (
        styles.position === "fixed" ||
        styles.position === "sticky" ||
        rect.top <= 8
      ) {
        return Math.round(rect.bottom);
      }

      return Math.round(markedNavbar.offsetHeight);
    }
  } catch {
    // ignore
  }

  try {
    const candidates = Array.from(
      document.querySelectorAll("header, nav"),
    ) as HTMLElement[];

    for (const el of candidates) {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      if (
        (styles.position === "fixed" || styles.position === "sticky") &&
        rect.top <= 8 &&
        rect.height > 0
      ) {
        return Math.round(rect.bottom);
      }
    }
  } catch {
    // ignore
  }

  return window.innerWidth < 640 ? 64 : 80;
}

export default function StudentHeader({
  fullName,
  onLogout,
}: StudentHeaderProps) {
  const headerRef = useRef<HTMLElement | null>(null);

  const [hidden, setHidden] = useState(false);
  const [offsetTop, setOffsetTop] = useState(64);
  const [headerHeight, setHeaderHeight] = useState(56);

  const offsetTopRef = useRef(64);
  const headerHeightRef = useRef(56);
  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  /* =====================================================
     MEASURE LAYOUT NAVBAR + HEADER HEIGHT
     ===================================================== */
  useEffect(() => {
    const measure = () => {
      const nextOffset = getNavbarOffset();
      const nextHeight = headerRef.current?.offsetHeight ?? 56;

      offsetTopRef.current = nextOffset;
      headerHeightRef.current = nextHeight;

      setOffsetTop(nextOffset);
      setHeaderHeight(nextHeight);
    };

    measure();

    // Late layout/fonts settle के लिए दोबारा measure
    const timer1 = window.setTimeout(measure, 120);
    const timer2 = window.setTimeout(measure, 400);

    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      window.clearTimeout(timer1);
      window.clearTimeout(timer2);
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, []);

  /* =====================================================
     SCROLL AWARE HIDE / SHOW
     - नीचे scroll = hide
     - ऊपर scroll = show
     - navbar के पास always show
     ===================================================== */
  useEffect(() => {
    if (typeof window === "undefined") return;

    lastYRef.current = window.scrollY;

    const handleScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      window.requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const showZone = offsetTopRef.current + 28;

        if (currentY < showZone) {
          setHidden(false);
        } else if (currentY > lastYRef.current + 8) {
          setHidden(true);
        } else if (currentY < lastYRef.current - 8) {
          setHidden(false);
        }

        lastYRef.current = currentY;
        tickingRef.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const firstName = fullName?.split(" ")[0] || "Student";
  const hideTranslateY = -(headerHeight + offsetTop + 24);

  return (
    <header
      ref={headerRef}
      data-student-header
      className="sticky z-40 w-full pointer-events-none"
      style={{
        top: `${offsetTop}px`,
        transform: hidden ? `translateY(${hideTranslateY}px)` : "translateY(0)",
        opacity: hidden ? 0 : 1,
        transition:
          "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease-out",
        willChange: "transform, opacity",
      }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-3 sm:h-16 sm:px-6 lg:px-8">
        
        {/* ==============================
            FLOATING MATTE GLASS BAR
            ============================== */}
        <div
          className="relative z-10 flex items-center gap-3 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-lg shadow-black/20 px-2 py-1 transition-all duration-300 hover:border-white/20 hover:bg-slate-800/70"
          style={{ pointerEvents: hidden ? "none" : "auto" }}
        >
          
          {/* User Avatar Placeholder (Static Icon for now) */}
          <div className="flex items-center gap-2 pl-2 pr-1">
             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-inner ring-1 ring-white/10">
               {firstName.charAt(0).toUpperCase()}
             </div>
             <span className="hidden sm:block text-xs font-medium text-slate-300 whitespace-nowrap">
               {firstName}
             </span>
          </div>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          {/* Logout Button */}
          <MagneticButton
            onClick={onLogout}
            aria-label={`Logout from ${firstName}`}
            className="group/logout relative inline-flex h-9 items-center justify-center gap-1.5 rounded-full border border-transparent bg-transparent px-3 text-xs font-bold text-slate-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 active:scale-95"
          >
            <LogOut
              className="h-4 w-4 shrink-0 transition-transform group-hover/logout:-rotate-12"
              aria-hidden="true"
            />
            <span className="hidden xs:inline">Logout</span>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}