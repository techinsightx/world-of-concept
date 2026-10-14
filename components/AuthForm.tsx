/* eslint-disable */
"use client";

import { useState, FormEvent, useRef, MouseEvent } from "react";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight, Sparkles } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 Magnetic Button Ref
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  // 🔥 Magnetic Effect Logic
  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!submitBtnRef.current) return;
    const rect = submitBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Subtle magnetic pull towards cursor
    submitBtnRef.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (!submitBtnRef.current) return;
    submitBtnRef.current.style.transform = `translate(0px, 0px) scale(1)`;
  };

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

        await setDoc(doc(db, "students", user.uid), {
          fullName: fullName.trim(),
          email: user.email,
          createdAt: serverTimestamp(),
          role: "student",
          uid: user.uid,
          isActive: true,
        });
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
        else if (msg.includes("wrong-password") || msg.includes("user-not-found")) errorMessage = "ईमेल या पासवर्ड गलत है।";
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

  return (
    <div className="relative w-full h-full flex items-center justify-center">
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
        @keyframes fade-in-up { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { 
          animation: fade-in-up 0.6s ease-out forwards; 
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        /* 🔥 RAINBOW SHIMMER ANIMATION */
        @keyframes rainbow-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .rainbow-shimmer-btn {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6);
          background-size: 200% auto;
          animation: rainbow-shimmer 3s linear infinite;
        }
        .rainbow-shimmer-btn:hover {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.3);
        }
        .rainbow-tab-active {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6);
          background-size: 200% auto;
          animation: rainbow-shimmer 3s linear infinite;
        }
      `}</style>

      {/* 🔥 COMPACT AUTH FORM CARD */}
      <div className="relative z-10 w-full max-w-sm mx-4 animate-fade-in-up">
        <div className="bg-slate-900/70 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/10 p-5 sm:p-6 relative overflow-hidden">
          
          {/* Subtle decorative glows */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none animate-float" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '3s' }} />
          
          <div className="relative z-10">
            {/* 🔥 COMPACT LOGO */}
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4 drop-shadow-2xl">
                <Image src="/logo.png" alt="World of Concept" fill className="object-contain" priority />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-1">
                <span className="tricolor-text">World of Concept</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-medium max-w-[16rem] mx-auto flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                {isLogin ? "अपने डैशबोर्ड में लॉगिन करें" : "टॉप करने की यात्रा शुरू करें"}
              </p>
            </div>

            {/* Smooth Premium Rainbow Tab Switcher */}
            <div className="relative flex bg-slate-800/50 p-1 rounded-xl mb-6 border border-white/5">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-lg transition-all duration-300 ease-out rainbow-tab-active ${
                  isLogin ? "left-1" : "left-[calc(50%+2px)]"
                }`} 
              />
              <button
                type="button"
                onClick={() => { if (!isLogin) switchMode(); }}
                className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-300 rounded-lg ${
                  isLogin ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                साइन इन
              </button>
              <button
                type="button"
                onClick={() => { if (isLogin) switchMode(); }}
                className={`relative z-10 flex-1 py-2.5 text-xs sm:text-sm font-bold transition-colors duration-300 rounded-lg ${
                  !isLogin ? "text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                साइन अप
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
              {!isLogin && (
                <div className="space-y-1.5 animate-fade-in-up">
                  <label className="block text-xs font-semibold text-slate-200">
                    पूरा नाम <span className="text-red-400">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="text"
                      placeholder="शुभम कुमार"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  ईमेल पता <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="email"
                    placeholder="students@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-200">
                  पासवर्ड <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="कम से कम 6 अक्षर"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                {isLogin && (
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors disabled:opacity-50"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-3 py-2 rounded-lg text-xs flex items-start gap-2 animate-fade-in-up">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="bg-green-500/10 border border-green-500/30 text-green-200 px-3 py-2 rounded-lg text-xs flex items-start gap-2 animate-fade-in-up">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-green-400" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* 🔥 MAGNETIC RAINBOW SUBMIT BUTTON */}
              <button
                ref={submitBtnRef}
                type="submit"
                disabled={loading}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full mt-5 rainbow-shimmer-btn text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                style={{ transform: 'translate(0px, 0px) scale(1)', transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    प्रोसेसिंग...
                  </>
                ) : (
                  <>
                    {isLogin ? "डैशबोर्ड में प्रवेश करें" : "मुफ्त अकाउंट बनाएं"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <p className="text-center text-[11px] text-slate-400 mt-6 leading-relaxed">
              जारी रखकर, आप हमारी{" "}
              <a href="/terms" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors">शर्तों</a>
              {" और "}
              <a href="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline font-semibold transition-colors">गोपनीयता नीति</a> से सहमत होते हैं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}