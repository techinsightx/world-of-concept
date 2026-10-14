/* eslint-disable */
"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative min-h-[100dvh] w-full flex items-center justify-center overflow-hidden bg-slate-950">
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
      `}</style>

      {/* 🔥 CINEMATIC BACKGROUND (RK Sir Image) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/rk-sir.jpg" 
          alt="RK Sir Background" 
          fill 
          className="object-cover opacity-60" 
          priority
        />
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
      </div>

      {/* 🔥 AUTH FORM CARD */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            {/* 🔥 UPGRADED LOGO: Bigger size, no unnecessary white space */}
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden shadow-2xl shadow-blue-500/30 ring-2 ring-white/20 bg-white/10 backdrop-blur-md">
                <Image src="/logo.png" alt="World of Concept" fill className="object-contain p-2" priority />
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight mb-1">
                <span className="tricolor-text">World of Concept</span>
              </h2>
              <p className="text-blue-200/80 text-sm">
                {isLogin ? "अपने डैशबोर्ड तक पहुँचने के लिए लॉगिन करें" : "बिहार बोर्ड परीक्षाओं में टॉप करने की यात्रा शुरू करें"}
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
                <div className="space-y-1.5 animate-fade-in-up">
                  <label className="block text-sm font-semibold text-white/90">
                    पूरा नाम <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type="text"
                      placeholder="शुभम कुमार"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-white/90">
                  ईमेल पता <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    placeholder="students@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-white/90">
                  पासवर्ड <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="कम से कम 6 अक्षर"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
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
                      className="text-xs text-blue-300 hover:text-blue-200 hover:underline font-semibold transition-colors disabled:opacity-50"
                    >
                      पासवर्ड भूल गए?
                    </button>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500/20 backdrop-blur-sm border border-red-400/50 text-red-100 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in-up">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/50 text-green-100 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in-up">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-xl shadow-blue-500/30 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
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
    </div>
  );
}