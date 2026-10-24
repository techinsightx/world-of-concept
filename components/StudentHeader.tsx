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

export default function StudentHeader({
  fullName,
  email,
  updatesCount,
  onNotifications,
  onLogout,
}: StudentHeaderProps) {
  const [hidden, setHidden] = useState(false);

  const lastYRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    lastYRef.current = window.scrollY;

    const handleScroll = () => {
      if (tickingRef.current) return;

      tickingRef.current = true;

      requestAnimationFrame(() => {
        const currentY = window.scrollY;

        // Top के पास हमेशा visible
        if (currentY < 72) {
          setHidden(false);
        }
        // नीचे scroll = page upar khisak raha hai -> hide
        else if (currentY > lastYRef.current + 8) {
          setHidden(true);
        }
        // ऊपर scroll = user वापस आ रहा है -> show
        else if (currentY < lastYRef.current - 8) {
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

  return (
    <header
      className="sticky top-16 sm:top-20 z-30 w-full bg-[#FFF9F0]/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-orange-100/50 dark:border-slate-800/50 shadow-sm"
      style={{
        transform: hidden ? "translateY(calc(-100% - 6rem))" : "translateY(0)",
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
          Left corner brand/logo/text पूरी तरह remove.
          सिर्फ right-side utility controls.
        */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 h-14 sm:h-16">
          {onNotifications ? (
            <button
              type="button"
              onClick={onNotifications}
              aria-label="RK Sir updates देखें"
              className="relative inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full text-slate-500 dark:text-slate-400 hover:bg-orange-100 dark:hover:bg-slate-800 transition-colors"
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
          <div className="hidden md:flex items-center gap-3 pl-4 border-l border-orange-200/50 dark:border-slate-800">
            <div className="text-right min-w-0">
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {fullName || "छात्र"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {email || ""}
              </p>
            </div>

            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-[#FFF9F0] dark:ring-slate-950 flex-shrink-0">
              {initial}
            </div>
          </div>

          {/*
            Logout:
            - Mobile पर icon-only but clearly visible
            - Desktop पर icon + text
            - Minimum 40px touch target
          */}
          <MagneticButton
            onClick={onLogout}
            aria-label="Logout"
            className="inline-flex items-center justify-center gap-2 min-h-10 min-w-10 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">Logout</span>
          </MagneticButton>
        </div>
      </div>
    </header>
  );
}