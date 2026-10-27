/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import PaymentButton from "@/components/PaymentButton";
import Link from "next/link";
import DynamicBackground from "@/components/DynamicBackground";
import { ArrowLeft, ShieldCheck, CreditCard, Lock } from "lucide-react";

// Injected Keyframes for Dual Waves (Same as Home/Dashboard for consistency)
const PAYMENT_STYLES = `
@keyframes waveFlowLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes waveFlowRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.matte-section-wrapper {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.wave-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen; /* Glows over dark bg */
  opacity: 0.4;
}

.wave-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-size: 50% 100%;
  background-repeat: repeat-x;
}

.wave-left {
  animation: waveFlowLeft 22s linear infinite;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15), transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.15), transparent 60%),
    radial-gradient(circle at 50% 80%, rgba(167, 139, 250, 0.15), transparent 60%);
}

.wave-right {
  animation: waveFlowRight 28s linear infinite;
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.12), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(34, 197, 94, 0.12), transparent 60%),
    radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.12), transparent 60%);
}

.content-overlay {
  position: relative;
  z-index: 10;
}

/* Matte Text Utilities */
.text-matte-primary {
  color: #f8fafc; /* slate-50 */
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
.text-matte-secondary {
  color: #cbd5e1; /* slate-300 */
}
`;

// Static BG Images for this page (using existing gallery assets)
const PAYMENT_BG_IMAGES = ["/gallery2.jpg", "/gallery5.jpg", "/gallery8.jpg"];

export default function TestPaymentPage() {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch for animations/styles if needed, though mostly CSS driven here
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-950 text-slate-100 transition-colors duration-700">
      <style dangerouslySetInnerHTML={{ __html: PAYMENT_STYLES }} />

      {/* ==============================
          BACKGROUND ENGINE
          ============================== */}
      <DynamicBackground images={PAYMENT_BG_IMAGES} zoomType="in" density={0.6} interactive={false} showGrid={false} />
      
      {/* Dark Overlay to ensure matte look */}
      <div className="absolute inset-0 z-[2] bg-slate-950/85 backdrop-blur-sm" />

      {/* --- DUAL RAINBOW WAVE LAYERS --- */}
      <div className="wave-container z-[3]">
        <div className="wave-layer wave-left" />
        <div className="wave-layer wave-right" />
      </div>

      {/* ==============================
          MAIN CONTENT CARD
          ============================== */}
      <div className="content-overlay w-full max-w-md mx-auto animate-fade-in-up">
        
        {/* Back Link */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white text-xs sm:text-sm font-bold transition-all duration-300 backdrop-blur-md group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>

        {/* Payment Card Container */}
        <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-black/40 overflow-hidden">
          
          {/* Header Section of Card */}
          <div className="p-6 sm:p-8 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-matte-primary tracking-tight leading-none mb-2">
                  Secure Checkout
                </h1>
                <p className="text-matte-muted text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-400" />
                  Razorpay Test Environment
                </p>
              </div>
              
              {/* Course Badge */}
              <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Class 10
              </span>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Course Details */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                Class 10 Math Masterclass
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                By RK Sir | Complete Guidance & Shortcuts
              </p>
            </div>

            {/* Price Display */}
            <div className="flex items-end justify-between pt-2 pb-4 border-b border-white/5">
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-1">Total Amount</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-white drop-shadow-lg">₹499</span>
                  <span className="text-sm text-slate-500 font-medium line-through decoration-red-500/50">₹999</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-medium">One-time payment</p>
                <p className="text-[10px] text-green-400 font-bold">Lifetime Access</p>
              </div>
            </div>

            {/* Payment Button Component */}
            <div className="pt-2">
              <PaymentButton 
                courseId="math_class_10_001" 
                courseTitle="Class 10 Math: Objective Masterclass" 
                amountInRupees={499} 
              />
            </div>

            {/* Security Note */}
            <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-500 font-medium pt-2">
              <Lock className="w-3 h-3" />
              <span>Your data is encrypted and secure.</span>
            </div>
          </div>

          {/* Test Credentials Info Box (Subtle Warning) */}
          <div className="px-6 sm:px-8 pb-6 sm:pb-8">
            <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-amber-200 font-bold text-xs sm:text-sm mb-1">Test Mode Instructions</h3>
                  <p className="text-amber-100/70 text-[10px] sm:text-xs leading-relaxed mb-2">
                    Use these dummy details to simulate a successful transaction:
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 font-mono text-[10px] sm:text-xs text-amber-100/90 bg-black/20 p-2.5 rounded-lg border border-amber-500/10">
                    <div className="flex justify-between">
                      <span className="opacity-70">Card No:</span>
                      <span className="font-bold">4111 1111 1111 1111</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">Expiry:</span>
                      <span className="font-bold">Any Future Date</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-70">CVV:</span>
                      <span className="font-bold">Any 3 Digits</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}