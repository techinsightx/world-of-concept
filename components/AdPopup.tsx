/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Sparkles, TrendingUp } from "lucide-react";

interface Ad {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  badge: string;
  cta: string;
  link: string;
  gradient: string;
}

export default function AdPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [progress, setProgress] = useState(0);

  const ads: Ad[] = [
    {
      id: 1,
      image: "/ad1.jpg",
      title: "गणित: ऑब्जेक्टिव मास्टरक्लास",
      subtitle: "बिहार बोर्ड मैट्रिक 2027 के लिए",
      badge: "🔥 अभी जॉइन करें",
      cta: "सिर्फ ₹499 में नामांकन करें",
      link: "#available-courses",
      gradient: "from-blue-600 via-indigo-600 to-purple-600",
    },
    {
      id: 2,
      image: "/ad2.jpg",
      title: "विज्ञान: संपूर्ण रिवीज़न",
      subtitle: "भौतिकी, रसायन विज्ञान, जीव विज्ञान",
      badge: "⚡ सीमित सीटें",
      cta: "सिर्फ ₹699 में नामांकन करें",
      link: "#available-courses",
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    },
    {
      id: 3,
      image: "/ad3.jpg",
      title: "इंटर टॉपर बैच",
      subtitle: "कक्षा 12 की संपूर्ण तैयारी",
      badge: "🏆 टॉपर स्पेशल",
      cta: "सिर्फ ₹999 में नामांकन करें",
      link: "#available-courses",
      gradient: "from-orange-500 via-red-500 to-pink-600",
    },
  ];

  // Site load होने पर 2 सेकंड बाद popup दिखाएं
  useEffect(() => {
    const timer = setTimeout(() => {
      // सिर्फ दिन में एक बार दिखाएं (localStorage check)
      const lastShown = localStorage.getItem("adPopupLastShown");
      const today = new Date().toDateString();
      
      if (lastShown !== today) {
        setIsOpen(true);
        localStorage.setItem("adPopupLastShown", today);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate ads every 6 seconds
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
      setProgress(0);
    }, 6000);

    return () => clearInterval(interval);
  }, [isOpen, ads.length]);

  // Progress bar animation
  useEffect(() => {
    if (!isOpen) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / 60); // 6 seconds = 60 steps
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [isOpen, currentAd]);

  const handleClose = () => setIsOpen(false);

  const nextAd = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
    setProgress(0);
  };

  const prevAd = () => {
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
    setProgress(0);
  };

  if (!isOpen) return null;

  const ad = ads[currentAd];

  return (
    <>
      {/* Backdrop Blur */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Main Popup Box */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div className="relative w-full max-w-md pointer-events-auto animate-popup-entrance">
          
          {/* ✨ Floating Sparkles (Decoration) */}
          <Sparkles className="absolute -top-4 -left-4 w-8 h-8 text-yellow-400 animate-sparkle" />
          <Sparkles className="absolute -top-4 -right-4 w-6 h-6 text-pink-400 animate-sparkle" style={{ animationDelay: "0.5s" }} />
          <Sparkles className="absolute -bottom-4 -left-4 w-6 h-6 text-cyan-400 animate-sparkle" style={{ animationDelay: "1s" }} />
          <Sparkles className="absolute -bottom-4 -right-4 w-8 h-8 text-purple-400 animate-sparkle" style={{ animationDelay: "1.5s" }} />

          {/* Popup Container with Rotating Gradient Border */}
          <div className="relative p-[3px] rounded-3xl overflow-hidden shadow-2xl shadow-purple-500/30">
            {/* Rotating Conic Gradient Border */}
            <div
              className="absolute inset-0 animate-conic-rotate"
              style={{
                background: `conic-gradient(from 0deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #3b82f6)`,
              }}
            />

            {/* Inner Card */}
            <div className="relative bg-white rounded-3xl overflow-hidden">
              
              {/* Top Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-20">
                <div
                  className={`h-full bg-gradient-to-r ${ad.gradient} transition-all duration-100 ease-linear`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-3 right-3 z-30 w-9 h-9 bg-white/90 backdrop-blur-md hover:bg-white text-slate-700 hover:text-slate-900 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 group"
                aria-label="बंद करें"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Ad Counter Badge */}
              <div className="absolute top-3 left-3 z-30 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{currentAd + 1} / {ads.length}</span>
              </div>

              {/* Ad Image */}
              <div className="relative h-64 sm:h-72 overflow-hidden">
                <Image
                  src={ad.image}
                  alt={ad.title}
                  fill
                  className="object-cover transition-transform duration-700"
                  priority
                />
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${ad.gradient} opacity-40`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badge on Image */}
                <div className="absolute top-12 left-3 z-10">
                  <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg animate-pulse">
                    {ad.badge}
                  </span>
                </div>

                {/* Title Overlay on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
                  <h3 className="text-white text-2xl sm:text-3xl font-extrabold leading-tight drop-shadow-2xl mb-1">
                    {ad.title}
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base font-medium drop-shadow-lg">
                    {ad.subtitle}
                  </p>
                </div>
              </div>

              {/* Ad Content */}
              <div className="p-5 sm:p-6 bg-white">
                {/* CTA Button */}
                <a
                  href={ad.link}
                  onClick={handleClose}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${ad.gradient} text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-4 relative overflow-hidden group`}
                >
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative">{ad.cta}</span>
                  <ChevronRight className="w-5 h-5 relative group-hover:translate-x-1 transition-transform" />
                </a>

                {/* Navigation Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={prevAd}
                    className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    aria-label="पिछला विज्ञापन"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Dot Indicators */}
                  <div className="flex gap-2">
                    {ads.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentAd(idx);
                          setProgress(0);
                        }}
                        className={`transition-all duration-300 rounded-full ${
                          idx === currentAd
                            ? "w-8 h-2 bg-slate-900"
                            : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                        }`}
                        aria-label={`विज्ञापन ${idx + 1} पर जाएं`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextAd}
                    className="w-10 h-10 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    aria-label="अगला विज्ञापन"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Skip Link */}
                <button
                  onClick={handleClose}
                  className="w-full mt-3 text-xs text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  अभी नहीं, बाद में देखूंगा →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}