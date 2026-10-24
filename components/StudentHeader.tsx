/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, LogOut } from "lucide-react";
import MagneticButton from "@/components/MagneticButton";

interface StudentHeaderProps {
  fullName?: string | null;
  email?: string | null;
  updatesCount?: number;
  onNotifications?: () => void;
  onLogout: () => void;
}

/**
 * Layout navbar का exact height detect करता है ताकि
 * student header उसके ठीक नीचे stick हो।
 *
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
  email,
  updatesCount,
  onNotifications,
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

    // Fonts / late layout settle के लिए एक बार फिर measure
    const timer = window.setTimeout(measure, 120);
    const timer2 = window.setTimeout(measure, 400);

    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      window.clearTimeout(timer);
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

  const initial = (fullName || "छ").charAt(0).toUpperCase();
  const hasUpdates = typeof updatesCount === "number" && updatesCount > 0;

  // पूरी तरह ऊपर ले जाने के लिए translate distance
  const hideTranslateY = -(headerHeight + offsetTop + 18);

  return (
    <header
      ref={headerRef}
      data-student-header
      className="sticky z-40 w-full bg-[#FFF9F0]/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-orange-100/60 dark:border-slate-800/60 shadow-sm"
      style={{
        top: `${offsetTop}px`,
        transform: hidden ? `translateY(${hideTranslateY}px)` : "translateY(0)",
        opacity: hidden ? 0 : 1,
        pointerEvents: hidden ? "none" : "auto",
        transition:
          "transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 220ms ease-out",
        willChange: "transform, opacity",
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/*
          IMPORTANT:
          Left corner brand/logo/text completely removed.
          सिर्फ right-side utility controls.
        */}
        <div className="flex items-center justify-end gap-2 sm:gap-3 h-14 sm:h-16 min-w-0">
          {onNotifications ? (
            <button
              type="button"
              onClick={onNotifications}
              aria-label="RK Sir updates देखें"
              className="relative inline-flex shrink-0 items-center justify-center w-11 h-11 sm:w-11 sm:h-11 rounded-full text-slate-600 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-slate-800 active:scale-95 transition-all duration-200"
            >
              <Bell className="w-5 h-5" />

              {hasUpdates ? (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#FFF9F0] dark:border-slate-950 flex items-center justify-center shadow">
                  {updatesCount! > 9 ? "9+" : updatesCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FFF9F0] dark:border-slate-950 animate-pulse" />
              )}
            </button>
          ) : null}

          {/* Desktop/tablet user identity — mobile पर compact रखने के लिए hidden */}
          <div className="hidden md:flex shrink-0 items-center gap-3 pl-4 border-l border-orange-200/50 dark:border-slate-800">
            <div className="text-right min-w-0 max-w-[180px] lg:max-w-[240px]">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {fullName || "छात्र"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {email || ""}
              </p>
            </div>

            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-[#FFF9F0] dark:ring-slate-950 shrink-0">
              {initial}
            </div>
          </div>

          {/*
            LOGOUT FIX:
            - Mobile पर 44x44 touch target
            - Icon हमेशा visible
            - Desktop पर icon + text
            - shrink-0 से compress नहीं होगा
            - relative z-10 से नीचे छिपेगा नहीं
          */}
          <div className="relative z-10 shrink-0">
            <MagneticButton
              onClick={onLogout}
              aria-label="Logout"
              className="group/logout inline-flex items-center justify-center gap-2 h-11 w-11 sm:h-10 sm:w-auto sm:px-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 active:scale-95 transition-all duration-200 shadow-sm"
            >
              <LogOut className="w-5 h-5 shrink-0" aria-hidden="true" />

              {/* Mobile screen-reader label */}
              <span className="sr-only sm:hidden">Logout</span>

              {/* Desktop visible label */}
              <span className="hidden sm:inline">Logout</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </header>
  );
}