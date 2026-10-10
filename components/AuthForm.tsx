/* eslint-disable */
"use client";

import { useState, FormEvent, useEffect } from "react";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/dashboard"; // Redirect to dashboard after login
      } else {
        if (fullName.trim().length < 3) throw new Error("कृपया अपना पूरा नाम दर्ज करें (कम से कम 3 अक्षर)");
        if (password.length < 6) throw new Error("पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।");

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        try {
          await setDoc(doc(db, "students", user.uid), {
            fullName: fullName.trim(),
            email: user.email,
            createdAt: serverTimestamp(),
            role: "student",
            uid: user.uid,
            isActive: true,
          });
        } catch (dbError) {
          console.warn("Firestore warning:", dbError);
        }

        window.location.href = "/dashboard";
      }
    } catch (err: unknown) {
      setLoading(false);
      let errorMessage = "प्रमाणीकरण विफल रहा। कृपया पुनः प्रयास करें।";
      
      if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes("email-already-in-use")) errorMessage = "यह ईमेल पहले से पंजीकृत है। कृपया लॉगिन करें।";
        else if (msg.includes("weak-password")) errorMessage = "पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।";
        else if (msg.includes("invalid-email")) errorMessage = "कृपया एक मान्य ईमेल पता दर्ज करें।";
        else if (msg.includes("wrong-password") || msg.includes("user-not-found")) errorMessage = "ईमेल या पासवर्ड गलत है। कृपया पुनः प्रयास करें।";
        else errorMessage = msg.replace("Firebase: ", "").replace(/\(auth\/.*\)/, "").trim();
      }
      setError(errorMessage);
    }
  };

  // 🔥 WORLD-CLASS: Actual Forgot Password Functionality
  const handleForgotPassword = async () => {
    if (!email) {
      setError("कृपया पहले अपना पंजीकृत ईमेल पता दर्ज करें।");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMsg("पासवर्ड रीसेट लिंक आपके ईमेल पर भेज दिया गया है।");
    } catch (err) {
      setError("ईमेल भेजने में त्रुटि। कृपया जांचें कि यह ईमेल पंजीकृत है।");
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccessMsg("");
    setFullName("");
    setPassword("");
  };

  // Preload the background image for smooth cinematic entry
  useEffect(() => {
    const img = new window.Image();
    img.src = "/rk-sir.jpg";
    img.onload = () => setImageLoaded(true);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* 🎬 CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950" />
        
        <img
          src="/rk-sir.jpg"
          alt="RK Sir - World of Concept"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{ transform: "scale(1.05)" }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-900/70 to-blue-950/60 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-950/90 to-transparent" />
        
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* 🎯 FLOATING GLASSMORPHISM FORM CARD */}
      {/* 🔥 FIX: max-w-[400px] ensures it looks premium and compact on desktop, while w-full handles mobile perfectly */}
      <div className="relative z-10 w-full max-w-[400px] mx-4 animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8">
          
          {/* ✅ PERFECT CIRCULAR LOGO */}
          <div className="text-center mb-6">
            <div className="relative w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden bg-white shadow-xl shadow-blue-500/30 transition-transform duration-500 hover:scale-110">
              <Image src="/logo.png" alt="World of Concept" fill className="object-contain p-3" priority />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
              {isLogin ? "वापसी पर स्वागत है" : "World of Concept से जुड़ें"}
            </h2>
            <p className="text-blue-200/80 text-sm">
              {isLogin 
                ? "अपने डैशबोर्ड तक पहुँचने के लिए लॉगिन करें" 
                : "बिहार बोर्ड परीक्षाओं में टॉप करने की यात्रा शुरू करें"}
            </p>
          </div>

          {/* Smooth Tab Switcher */}
          <div className="relative flex bg-white/10 backdrop-blur-sm p-1.5 rounded-xl mb-6 border border-white/10">
            <div 
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-lg transition-all duration-300 ease-out ${
                isLogin ? "left-1.5" : "left-[calc(50%+3px)]"
              }`} 
            />
            <button
              type="button"
              onClick={() => { if (!isLogin) switchMode(); }}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${
                isLogin ? "text-blue-600" : "text-white/70 hover:text-white"
              }`}
            >
              साइन इन
            </button>
            <button
              type="button"
              onClick={() => { if (isLogin) switchMode(); }}
              className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${
                !isLogin ? "text-blue-600" : "text-white/70 hover:text-white"
              }`}
            >
              साइन अप
            </button>
          </div>

          {/* Form Fields */}
          <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
            {!isLogin && (
              <div className="space-y-1.5 animate-fade-in">
                <label htmlFor="fullName" className="block text-sm font-semibold text-white/90">
                  पूरा नाम <span className="text-red-400">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="शुभम कुमार"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-semibold text-white/90">
                ईमेल पता <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                placeholder="students@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-semibold text-white/90">
                पासवर्ड <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="कम से कम 6 अक्षर"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all duration-200 pr-12"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors p-1"
                  aria-label={showPassword ? "पासवर्ड छिपाएं" : "पासवर्ड दिखाएं"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* 🔥 FORGOT PASSWORD LINK (Only shows on Login) */}
              {isLogin && (
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={loading}
                    className="text-xs text-blue-300 hover:text-blue-200 hover:underline font-semibold transition-colors disabled:opacity-50"
                  >
                    पासवर्ड भूल गए?
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-100 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{error}</span>
              </div>
            )}

            {/* Success Message (For Password Reset) */}
            {successMsg && (
              <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/50 text-green-100 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  प्रोसेसिंग...
                </>
              ) : (
                <>
                  {isLogin ? "डैशबोर्ड में प्रवेश करें" : "मुफ्त अकाउंट बनाएं"}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer Links */}
          <p className="text-center text-xs text-white/60 mt-6 leading-relaxed">
            जारी रखकर, आप हमारी{" "}
            <a href="/terms" className="text-blue-300 hover:text-blue-200 hover:underline font-semibold transition-colors">शर्तों</a>
            {" और "}
            <a href="/privacy" className="text-blue-300 hover:text-blue-200 hover:underline font-semibold transition-colors">गोपनीयता नीति</a> से सहमत होते हैं।
          </p>
        </div>
      </div>
    </div>
  );
}