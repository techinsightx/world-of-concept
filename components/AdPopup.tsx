/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";

interface Ad {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  price: string;
  badge: string;
  cta: string;
  gradient: string;
}

export default function AdPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [progress, setProgress] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  const ads: Ad[] = [
    {
      id: 1,
      image: "/ad1.jpg",
      title: "गणित: ऑब्जेक्टिव मास्टरक्लास",
      subtitle: "RK Sir के शॉर्टकट ट्रिक्स के साथ",
      price: "₹499",
      badge: "🔥 बेस्टसेलर",
      cta: "अभी नामांकन करें",
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      id: 2,
      image: "/ad2.jpg",
      title: "विज्ञान: संपूर्ण रिवीज़न",
      subtitle: "भौतिकी, रसायन विज्ञान, जीव विज्ञान",
      price: "₹699",
      badge: "⚡ सीमित सीटें",
      cta: "अभी नामांकन करें",
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      id: 3,
      image: "/ad3.jpg",
      title: "इंटर टॉपर बैच",
      subtitle: "कक्षा 12 की संपूर्ण तैयारी",
      price: "₹999",
      badge: "🏆 टॉपर स्पेशल",
      cta: "अभी नामांकन करें",
      gradient: "from-orange-500 to-red-600",
    },
  ];

  // 🔥 HOURLY POPUP LOGIC (हर 1 घंटे में दिखाए)
  useEffect(() => {
    const ONE_HOUR = 60 * 60 * 1000; // 3600000 milliseconds
    const timer = setTimeout(() => {
      const lastShown = localStorage.getItem("adPopupLastShown");
      const now = Date.now();
      
      // अगर पहले कभी नहीं दिखा, या 1 घंटा बीत चुका है
      if (!lastShown || (now - parseInt(lastShown, 10)) > ONE_HOUR) {
        setIsOpen(true);
        localStorage.setItem("adPopupLastShown", now.toString());
      }
    }, 3000); // Site load होने के 3 सेकंड बाद दिखाएं

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

  // Progress bar animation
  useEffect(() => {
    if (!isOpen) return;
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / 50); // 5 seconds = 50 steps
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
      {/* Backdrop Blur */}
      <div
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Main Popup Box - Compact & Professional */}
      <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
        <div 
          ref={popupRef}
          className="relative w-full max-w-sm pointer-events-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-500"
        >
          {/* Premium Gradient Border */}
          <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-75 blur-sm" />
          
          {/* Inner Card */}
          <div className="relative bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-700/50">
            
            {/* Top Progress Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 z-20">
              <div
                className={`h-full bg-gradient-to-r ${ad.gradient} transition-all duration-100 ease-linear`}
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-30 w-8 h-8 bg-black/40 backdrop-blur-md hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-all hover:scale-110 border border-white/10"
              aria-label="बंद करें"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Ad Image Section */}
            <div className="relative h-40 overflow-hidden">
              <Image
                src={ad.image}
                alt={ad.title}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                priority
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

              {/* Badge on Image */}
              <div className="absolute top-3 left-3 z-10">
                <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md text-slate-900 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
                  {ad.badge}
                </span>
              </div>

              {/* Title Overlay */}
              <div className="absolute bottom-3 left-4 right-4 z-10">
                <h3 className="text-white text-lg sm:text-xl font-extrabold leading-tight drop-shadow-md mb-0.5">
                  {ad.title}
                </h3>
                <p className="text-slate-200 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  {ad.subtitle}
                </p>
              </div>
            </div>

            {/* Ad Content & CTA */}
            <div className="p-4 sm:p-5 bg-slate-900">
              
              {/* Price & CTA Row */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Special Price</span>
                  <span className="text-2xl font-black text-white">{ad.price}</span>
                </div>
                
                <a
                  href={paymentLink}
                  onClick={(e) => {
                    e.preventDefault();
                    handleEnroll(ad);
                  }}
                  className={`flex-1 flex items-center justify-center gap-2 bg-gradient-to-r ${ad.gradient} text-white text-sm font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group`}
                >
                  <span className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative">{ad.cta}</span>
                  <ChevronRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Navigation Dots */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentAd(idx);
                      setProgress(0);
                    }}
                    className={`transition-all duration-300 rounded-full ${
                      idx === currentAd
                        ? "w-6 h-1.5 bg-white"
                        : "w-1.5 h-1.5 bg-slate-600 hover:bg-slate-500"
                    }`}
                    aria-label={`विज्ञापन ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Dismiss Link */}
              <button
                onClick={handleClose}
                className="w-full mt-3 text-[11px] text-slate-500 hover:text-slate-300 font-medium transition-colors flex items-center justify-center gap-1"
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