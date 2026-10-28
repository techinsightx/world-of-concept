/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronRight, Clock, CheckCircle2, Sparkles } from "lucide-react";

interface Ad {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  price: string;
  badge: string;
  cta: string;
}

export default function AdPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [progress, setProgress] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  // Updated Ads Data with consistent styling references
  const ads: Ad[] = [
    {
      id: 1,
      image: "/ad1.jpg",
      title: "गणित: ऑब्जेक्टिव मॉस्टरक्लास",
      subtitle: "RK Sir के शॉर्टकट ट्रिक्स के साथ",
      price: "₹499",
      badge: "🔥 बेस्टसेलर",
      cta: "अभी नामांकन करें",
    },
    {
      id: 2,
      image: "/ad2.jpg",
      title: "विज्ञान: सम्पूर्ण रिवीजन",
      subtitle: "भौतिकी, रसायन विज्ञान, जीव विज्ञान",
      price: "₹699",
      badge: "⚡ सीमित सीटें",
      cta: "अभी नामांकन करें",
    },
    {
      id: 3,
      image: "/ad3.jpg",
      title: "इंटर टॉपर बैच",
      subtitle: "कक्षा 12 की सम्पूर्ण तैयारी",
      price: "₹999",
      badge: "🏆 टॉपर स्पेशल",
      cta: "अभी नामांकन करें",
    },
  ];

  // 🔥 HOURLY POPUP LOGIC (हर 1 घंटे में दिखाएं)
  useEffect(() => {
    const ONE_HOUR = 60 * 60 * 1000; // 3600000 milliseconds
    
    // Initial delay before checking/showing
    const timer = setTimeout(() => {
      const lastShown = localStorage.getItem("adPopupLastShown");
      const now = Date.now();
      
      // अगर पहले कभी नहीं दिखा, या 1 घंटा बीत चुका है
      if (!lastShown || (now - parseInt(lastShown, 10)) > ONE_HOUR) {
        setIsOpen(true);
        localStorage.setItem("adPopupLastShown", now.toString());
      }
    }, 3000); // Site load होने के 3 सेकंड बाद चेक करें

    return () => clearTimeout(timer);
  }, []);

  // Auto-rotate ads every 5 seconds
  useEffect(() => {
    if (!isOpen) return;
    
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
      setProgress(0);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isOpen, ads.length]);

  // Progress bar animation (smooth linear update)
  useEffect(() => {
    if (!isOpen) return;
    
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + 2; // Increment by 2 for smoother visual (approx 5s duration)
      });
    }, 100);
    
    return () => clearInterval(progressInterval);
  }, [isOpen, currentAd]);

  const handleClose = () => setIsOpen(false);

  // 🔥 DYNAMIC PAYMENT REDIRECT
  const handleEnroll = (ad: Ad) => {
    setIsOpen(false);
    const paymentLink = `/test-payment?course=${encodeURIComponent(ad.title)}&price=${encodeURIComponent(ad.price)}`;
    window.location.href = paymentLink;
  };

  if (!isOpen) return null;

  const ad = ads[currentAd];
  const paymentLink = `/test-payment?course=${encodeURIComponent(ad.title)}&price=${encodeURIComponent(ad.price)}`;

  return (
    <>
      {/* Backdrop Blur - Deep & Cinematic */}
      <div
        className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Main Popup Container */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        
        {/* Animated Wrapper */}
        <div 
          ref={popupRef}
          className="relative w-full max-w-sm pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out"
        >
          
          {/* Outer Glow Effect (Subtle) */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-b from-white/10 to-transparent opacity-20 blur-xl pointer-events-none" />
          
          {/* Inner Card - Matte Dark Glass */}
          <div className="relative bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-black/5">
            
            {/* Top Progress Bar (Very Subtle) */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-800 z-20">
              <div
                className="h-full bg-white/80 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Close Button - Minimalist */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-30 w-8 h-8 bg-black/40 hover:bg-white/10 text-white/70 hover:text-white rounded-full flex items-center justify-center transition-all duration-200 border border-white/5 backdrop-blur-sm group"
              aria-label="बंद करें"
            >
              <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
            </button>

            {/* Ad Image Section */}
            <div className="relative h-48 overflow-hidden">
              <Image
                src={ad.image}
                alt={ad.title}
                fill
                className="object-cover scale-105 transition-transform duration-700"
                priority
              />
              
              {/* Heavy Gradient Overlay for Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
              <div className="absolute inset-0 bg-slate-900/20" />

              {/* Badge on Image - Matte Style */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20 shadow-lg uppercase tracking-wide">
                  <Sparkles className="w-3 h-3 text-yellow-400" />
                  {ad.badge}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <h3 className="text-white text-lg sm:text-xl font-black leading-tight drop-shadow-lg mb-1 line-clamp-2">
                  {ad.title}
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
                  <span className="truncate">{ad.subtitle}</span>
                </p>
              </div>
            </div>

            {/* Ad Content & CTA */}
            <div className="p-5 bg-slate-900/50">
              
              {/* Price & CTA Row */}
              <div className="flex items-center justify-between gap-4 mb-5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">Special Offer</span>
                  <span className="text-2xl font-black text-white tracking-tight">{ad.price}</span>
                </div>
                
                <a
                  href={paymentLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleEnroll(ad);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-white text-slate-900 text-sm font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 active:scale-95 group relative overflow-hidden"
                >
                  {/* Shine Effect on Hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  
                  <span className="relative z-10 whitespace-nowrap">{ad.cta}</span>
                  <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Navigation Dots - Minimalist */}
              <div className="flex items-center justify-center gap-2 pt-4 border-t border-white/5">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentAd(idx);
                      setProgress(0);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentAd
                        ? "w-6 h-1.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                        : "w-1.5 h-1.5 bg-slate-600 hover:bg-slate-400"
                    }`}
                    aria-label={`विज्ञापन ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Dismiss Link */}
              <button
                onClick={handleClose}
                className="w-full mt-4 text-[11px] text-slate-500 hover:text-slate-300 font-medium transition-colors flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3 h-3" />
                अभी नहीं, 1 घंटे बाद याद दिलाएं
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}