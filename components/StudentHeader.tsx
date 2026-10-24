/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut } from "lucide-react";
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
        {/*
          NOTIFICATION BELL REMOVE.
          LOGOUT CENTER ME.
          LEFT CORNER BRAND/TEXT COMPLETELY REMOVE.
        */}
        <div
          className="relative z-10"
          style={{ pointerEvents: hidden ? "none" : "auto" }}
        >
          <MagneticButton
            onClick={onLogout}
            aria-label={`Logout from ${firstName}`}
            className="group/logout relative inline-flex h-12 min-w-[142px] items-center justify-center gap-2 rounded-full border border-red-500/25 bg-white/85 px-5 text-sm font-extrabold text-red-600 shadow-lg shadow-red-500/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500/45 hover:bg-red-50 hover:shadow-xl hover:shadow-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F0] active:scale-95 dark:border-red-400/25 dark:bg-slate-950/80 dark:text-red-300 dark:shadow-red-500/10 dark:hover:border-red-400/45 dark:hover:bg-red-500/10 dark:hover:shadow-red-500/20 dark:focus-visible:ring-offset-slate-950 sm:min-w-[160px]"
          >
            <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/0 via-red-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover/logout:from-orange-500/10 group-hover/logout:via-red-500/10 group-hover/logout:to-purple-500/10 group-hover/logout:opacity-100" />

            <LogOut
              className="relative z-10 h-5 w-5 shrink-0"
              aria-hidden="true"
            />

            <span className="relative z-10">Logout</span>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}