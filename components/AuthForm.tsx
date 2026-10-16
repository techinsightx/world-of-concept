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

  const submitBtnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!submitBtnRef.current) return;
    const rect = submitBtnRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    submitBtnRef.current.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.02)`;
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
    <div className="relative w-full h-full flex items-center justify-center p-3 sm:p-4">
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
          from { opacity: 0; transform: translateY(15px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in-up { 
          animation: fade-in-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.05); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
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
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.4), 0 0 50px rgba(236, 72, 153, 0.2);
        }
        .rainbow-tab-active {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6);
          background-size: 200% auto;
          animation: rainbow-shimmer 3s linear infinite;
        }
      `}</style>

      {/* 🔥 CRYSTAL CLEAR GLASSMORPHISM CARD */}
      <div className="relative z-10 w-full max-w-[92vw] sm:max-w-sm mx-auto animate-fade-in-up">
        <div className="relative bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-black/5 dark:shadow-black/30 border border-white/60 dark:border-white/10 p-5 sm:p-6 overflow-hidden transition-all duration-500">
          
          {/* Subtle decorative glows for silky depth */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl pointer-events-none animate-float" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: '3s' }} />
          
          <div className="relative z-10">
            {/* 🔥 COMPACT & RESPONSIVE LOGO */}
            <div className="text-center mb-5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 drop-shadow-xl">
                <Image src="/logo.png" alt="World of Concept" fill className="object-contain" priority />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-1">
                <span className="tricolor-text">World of Concept</span>
              </h2>
              <p className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-medium flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
                {isLogin ? "अपने डैशबोर्ड में लॉगिन करें" : "टॉप करने की यात्रा शुरू करें"}
              </p>
            </div>

            {/* Smooth Premium Rainbow Tab Switcher */}
            <div className="relative flex bg-black/5 dark:bg-white/5 backdrop-blur-md p-1 rounded-xl mb-5 border border-black/5 dark:border-white/10">
              <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg shadow-md transition-all duration-300 ease-out rainbow-tab-active ${
                  isLogin ? "left-1" : "left-[calc(50%+2px)]"
                }`} 
              />
              <button
                type="button"
                onClick={() => { if (!isLogin) switchMode(); }}
                className={`relative z-10 flex-1 py-2 text-xs sm:text-sm font-bold transition-colors duration-300 rounded-lg ${
                  isLogin ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                साइन इन
              </button>
              <button
                type="button"
                onClick={() => { if (isLogin) switchMode(); }}
                className={`relative z-10 flex-1 py-2 text-xs sm:text-sm font-bold transition-colors duration-300 rounded-lg ${
                  !isLogin ? "text-white" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                साइन अप
              </button>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleEmailAuth} className="space-y-3.5" noValidate>
              {!isLogin && (
                <div className="space-y-1 animate-fade-in-up">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                    पूरा नाम <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                    <input
                      type="text"
                      placeholder="शुभम कुमार"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/80 dark:focus:bg-slate-900/80 transition-all duration-300"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  ईमेल पता <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                  <input
                    type="email"
                    placeholder="students@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/80 dark:focus:bg-slate-900/80 transition-all duration-300"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 ml-1">
                  पासवर्ड <span className="text-red-500">*</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500 transition-colors duration-300" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="कम से कम 6 अक्षर"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 focus:bg-white/80 dark:focus:bg-slate-900/80 transition-all duration-300"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors duration-300 p-1"
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
                      className="text-[11px] text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline font-semibold transition-colors disabled:opacity-50"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 dark:bg-red-500/10 border border-red-500/20 dark:border-red-500/30 text-red-600 dark:text-red-300 px-3 py-2.5 rounded-xl text-xs flex items-start gap-2 animate-fade-in-up backdrop-blur-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="bg-green-500/10 dark:bg-green-500/10 border border-green-500/20 dark:border-green-500/30 text-green-600 dark:text-green-300 px-3 py-2.5 rounded-xl text-xs flex items-start gap-2 animate-fade-in-up backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
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
                className="w-full mt-5 rainbow-shimmer-btn text-white font-bold py-3 rounded-xl shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm active:scale-95 transition-all duration-300"
                style={{ transform: 'translate(0px, 0px) scale(1)' }}
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
            <p className="text-center text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 mt-5 leading-relaxed">
              जारी रखकर, आप हमारी{" "}
              <a href="/terms" className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline font-semibold transition-colors">शर्तों</a>
              {" और "}
              <a href="/privacy" className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:underline font-semibold transition-colors">गोपनीयता नीति</a> से सहमत होते हैं।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}