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
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

// 🔥 Custom Colorful Social Icons (Same as Dashboard)
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FD5" />
        <stop offset="50%" stopColor="#FF543E" />
        <stop offset="100%" stopColor="#C837AB" />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" fill="url(#insta-gradient)"/>
    <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#FFFFFF"/>
    <circle cx="18.406" cy="5.594" r="1.44" fill="#FFFFFF"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0z" fill="#0088CC"/>
    <path d="M4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#FFFFFF"/>
  </svg>
);

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  // 🔥 New States for Hero & Form Toggle
  const [showForm, setShowForm] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText = "World of Concept";

  // 🔥 Typing Effect
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/dashboard";
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

  // Background images for Hero (Replace with your actual hero images)
  const heroImages = ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg", "/gallery4.jpg", "/gallery5.jpg"];
  const marqueeRow1 = ["/gallery6.jpg", "/gallery7.jpg", "/gallery8.jpg", "/gallery9.jpg", "/gallery10.jpg"];
  const marqueeRow2 = ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg", "/gallery4.jpg", "/gallery5.jpg"];

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-50 relative overflow-x-hidden font-sans">
      
      <style jsx global>{`
        @keyframes tricolor-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .tricolor-text {
          background: linear-gradient(90deg, #FF9933 0%, #FFFFFF 30%, #FFFFFF 70%, #138808 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: tricolor-shimmer 4s linear infinite;
        }
        @keyframes fade-bg {
          0%, 100% { opacity: 0; transform: scale(1.05); }
          20%, 80% { opacity: 1; transform: scale(1); }
        }
        .hero-bg-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: fade-bg 25s infinite;
        }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee { animation: marquee 40s linear infinite; will-change: transform; }
        .animate-marquee-reverse { animation: marquee-reverse 40s linear infinite; will-change: transform; }
        
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer-text {
          background: linear-gradient(90deg, #94a3b8 0%, #ffffff 50%, #94a3b8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text 3s linear infinite;
        }
      `}</style>

      {/* ==========================================
          HERO SECTION (Visible when showForm is false)
          ========================================== */}
      {!showForm && (
        <>
          <div className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
            {/* 5 Cinematic Background Images with Fade */}
            <div className="absolute inset-0 z-0">
              {heroImages.map((src, i) => (
                <Image 
                  key={i} 
                  src={src} 
                  alt={`Hero Background ${i + 1}`} 
                  fill 
                  className="hero-bg-img"
                  style={{ animationDelay: `${i * 5}s` }}
                />
              ))}
              {/* Heavy Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
              {/* Logo */}
              <div className="relative w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden bg-white shadow-2xl shadow-blue-500/30 border-4 border-white/10">
                <Image src="/logo.png" alt="World of Concept" fill className="object-contain p-4" priority />
              </div>

              {/* Typing Tricolor Title */}
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none">
                <span className="tricolor-text">{typedText}</span>
                <span className="animate-pulse text-white">|</span>
              </h1>

              <p className="text-lg sm:text-2xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
                बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद प्लेटफॉर्म। <br className="hidden sm:block" />
                <span className="text-blue-400 font-bold">RK Sir</span> के साथ सफलता की नई यात्रा शुरू करें।
              </p>

              {/* Premium Login/Signup Button (Logout Button Style) */}
              <div className="pt-8">
                <button
                  onClick={() => setShowForm(true)}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-bold rounded-xl shadow-2xl shadow-blue-600/30 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-white/10"
                >
                  <span>लॉगिन / साइन अप करें</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* 🔥 Cinematic Marquee Section (Opposite Directions) */}
          <div className="relative py-12 bg-slate-950 border-t border-slate-800">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 w-max animate-marquee mb-4">
              {[...marqueeRow1, ...marqueeRow1, ...marqueeRow1].map((src, i) => (
                <div key={`m1-${i}`} className="relative w-80 h-52 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800 shadow-xl">
                  <Image src={src} alt={`Marquee 1 ${i}`} fill className="object-cover hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              ))}
            </div>

            <div className="flex gap-4 w-max animate-marquee-reverse">
              {[...marqueeRow2, ...marqueeRow2, ...marqueeRow2].map((src, i) => (
                <div key={`m2-${i}`} className="relative w-80 h-52 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800 shadow-xl">
                  <Image src={src} alt={`Marquee 2 ${i}`} fill className="object-cover hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ==========================================
          AUTH FORM SECTION (Visible when showForm is true)
          ========================================== */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-fade-in">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
          </div>

          <div className="relative w-full max-w-[420px] bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-6 sm:p-8 animate-fade-in-up">
            
            {/* Back Button (Premium Style) */}
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 border border-transparent hover:border-white/10"
            >
              <ArrowLeft className="w-4 h-4" /> वापस जाएं
            </button>

            {/* Logo & Title */}
            <div className="text-center mb-6 pt-6">
              <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden bg-white shadow-xl shadow-blue-500/20">
                <Image src="/logo.png" alt="World of Concept" fill className="object-contain p-3" />
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight mb-1">
                {isLogin ? "वापसी पर स्वागत है" : "World of Concept से जुड़ें"}
              </h2>
              <p className="text-slate-400 text-sm">
                {isLogin ? "अपने डैशबोर्ड तक पहुँचने के लिए लॉगिन करें" : "बिहार बोर्ड परीक्षाओं में टॉप करने की यात्रा शुरू करें"}
              </p>
            </div>

            {/* Smooth Tab Switcher */}
            <div className="relative flex bg-slate-900/50 backdrop-blur-sm p-1.5 rounded-xl mb-6 border border-white/5">
              <div 
                className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-lg transition-all duration-300 ease-out ${
                  isLogin ? "left-1.5" : "left-[calc(50%+3px)]"
                }`} 
              />
              <button
                type="button"
                onClick={() => { if (!isLogin) switchMode(); }}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${
                  isLogin ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                साइन इन
              </button>
              <button
                type="button"
                onClick={() => { if (isLogin) switchMode(); }}
                className={`relative z-10 flex-1 py-2.5 text-sm font-bold transition-colors duration-300 ${
                  !isLogin ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                साइन अप
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
              {!isLogin && (
                <div className="space-y-1.5 animate-fade-in">
                  <label className="block text-sm font-semibold text-slate-300">पूरा नाम <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      placeholder="शुभम कुमार"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300">ईमेल पता <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    placeholder="students@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-300">पासवर्ड <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="कम से कम 6 अक्षर"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                {isLogin && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="text-xs text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors disabled:opacity-50"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl text-sm flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" /> <span>{successMsg}</span>
                </div>
              )}

              {/* Premium Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-blue-600/20 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    प्रोसेसिंग...
                  </>
                ) : (
                  <>
                    {isLogin ? "डैशबोर्ड में प्रवेश करें" : "मुफ्त अकाउंट बनाएं"}
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-500 mt-6 leading-relaxed">
              जारी रखकर, आप हमारी{" "}
              <a href="/terms" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">शर्तों</a>
              {" और "}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">गोपनीयता नीति</a> से सहमत होते हैं।
            </p>
          </div>
        </div>
      )}

      {/* ==========================================
          WORLD-CLASS FOOTER (Same as Dashboard)
          ========================================== */}
      <footer className="relative bg-slate-950 text-slate-400 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full overflow-hidden border-t border-slate-900">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        {/* Dark Matte Map Background */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.google.com/maps?q=Alamnagar,+Madhepura,+Bihar,+India&output=embed"
            width="100%"
            height="100%"
            style={{ 
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              filter: 'invert(92%) hue-rotate(180deg) brightness(0.95) contrast(1.1) saturate(0.4)',
              opacity: 0.3
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups"
            title="World of Concept Location"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-center">
            <a 
              href="https://www.google.com/maps/search/Alamnagar+Madhepura+Bihar" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-800 hover:border-orange-400 hover:bg-slate-800 transition-all duration-300 hover:scale-105 group shadow-lg"
            >
              <svg className="w-4 h-4 text-red-500 group-hover:text-orange-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <span className="text-white text-sm font-semibold">आलमनगर पोस्ट ऑफिस चौक, मधेपुरा, बिहार</span>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
            <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 text-white">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src="/logo.png" alt="World of Concept" fill className="object-contain" />
                </div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight">World of Concept</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-slate-400">
                बिहार के छात्रों को विश्व स्तरीय शिक्षा, संरचित मार्गदर्शन और सफलता का सिद्ध मार्ग प्रदान करना।
              </p>
              <div className="flex gap-3 sm:gap-4 pt-2">
                <a href="https://youtube.com/@JoinWorldofConcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all duration-300 hover:-translate-y-1 hover:scale-110">
                  <YoutubeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://instagram.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 transition-all duration-300 hover:-translate-y-1 hover:scale-110">
                  <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://facebook.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 hover:scale-110">
                  <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://t.me/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-400 transition-all duration-300 hover:-translate-y-1 hover:scale-110">
                  <TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">प्लेटफॉर्म</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">सभी कोर्सेस</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">हमें क्यों चुनें</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">छात्र सफलता की कहानियां</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">कानूनी</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li><a href="/privacy" className="hover:text-blue-400 transition-colors duration-300">गोपनीयता नीति</a></li>
                <li><a href="/terms" className="hover:text-blue-400 transition-colors duration-300">सेवा की शर्तें</a></li>
                <li><a href="/refund" className="hover:text-blue-400 transition-colors duration-300">रिफंड नीति</a></li>
                <li><a href="/contact" className="hover:text-blue-400 transition-colors duration-300">संपर्क करें</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">सहायता</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li className="flex items-center gap-2 sm:gap-3"><span>📧</span> support@worldofconcept.in</li>
                <li className="flex items-center gap-2 sm:gap-3"><span>📞</span> +91 7979096954</li>
                <li className="flex items-center gap-2 sm:gap-3"><span>📍</span> अलमनगर, बिहार, भारत</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500 px-2">
            <p>© {new Date().getFullYear()} World of Concept. सर्वाधिकार सुरक्षित।</p>
            <a href="https://www.google.com/search?q=Mukesh+Kumar+Malakar" target="_blank" rel="noopener noreferrer author" className="flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-all duration-300 group" title="Designed and Developed by Mukesh Kumar Malakar">
              <span>निर्मित</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 group-hover:text-orange-500 group-hover:scale-125 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>द्वारा <span className="font-bold animate-shimmer-text">Mukesh Kumar Malakar</span></span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}