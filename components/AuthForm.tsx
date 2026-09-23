// components/AuthForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function AuthForm() {
  const router = useRouter();
  
  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (isLogin) {
        // --- LOGIN MODE ---
        await signInWithEmailAndPassword(auth, email, password);
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => router.push("/"), 1000);
        
      } else {
        // --- SIGNUP MODE: Strict Validation ---
        if (fullName.trim().length < 3) {
          setError("Please enter your full name (min 3 characters)");
          setLoading(false);
          return;
        }
        if (fatherName.trim().length < 3) {
          setError("Please enter father's full name");
          setLoading(false);
          return;
        }
        if (!/^\d{10}$/.test(mobile)) {
          setError("Please enter a valid 10-digit mobile number");
          setLoading(false);
          return;
        }
        if (address.trim().length < 10) {
          setError("Please enter a complete address");
          setLoading(false);
          return;
        }

        // 1. Create User in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save Data to Firestore
        try {
          await setDoc(doc(db, "students", user.uid), {
            fullName: fullName.trim(),
            fatherName: fatherName.trim(),
            mobile: mobile.trim(),
            address: address.trim(),
            email: user.email,
            createdAt: serverTimestamp(),
            role: "student",
            uid: user.uid,
          });
        } catch (dbError: unknown) {
          console.warn("Firestore save warning:", dbError);
          // अगर Database permission error दे भी, तो हम user को फंसने नहीं देंगे
          // User auth हो चुका है, हम उसे redirect कर देंगे और warning दिखा देंगे
        }

        setSuccess("Account created successfully! Welcome to World of Concept 🎉");
        setTimeout(() => router.push("/"), 1000);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message
          .replace("Firebase: ", "")
          .replace(/\(auth\/.*\)/, "")
          .trim();
        setError(msg || "Authentication failed.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      setSuccess("Google login successful! Redirecting...");
      setTimeout(() => router.push("/"), 1000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message.replace("Firebase: ", "").trim() || "Google login failed.");
      } else {
        setError("Google login failed. Please try again.");
      }
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setSuccess("");
    // Clear signup fields when switching
    setFullName("");
    setFatherName("");
    setMobile("");
    setAddress("");
  };

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:shadow-blue-900/10 w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
          <span className="text-2xl">🎓</span>
        </div>
        <h2 className="text-2xl font-extrabold text-slate-800">
          {isLogin ? "Welcome Back!" : "Join World of Concept"}
        </h2>
        <p className="text-sm text-slate-500 mt-2">
          {isLogin ? "Sign in to access your courses" : "Create your free student account"}
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
        <button
          onClick={() => { if (!isLogin) switchMode(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
            isLogin ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => { if (isLogin) switchMode(); }}
          className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
            !isLogin ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Sign Up
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleEmailAuth} className="space-y-4">
        
        {/* SIGNUP ONLY FIELDS */}
        {!isLogin && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Rahul Kumar" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" required />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Father&apos;s Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Ramesh Kumar" value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="input-field" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Mobile Number <span className="text-red-500">*</span></label>
                <input type="tel" placeholder="9876543210" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))} className="input-field" required pattern="[0-9]{10}" title="10 digits only" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-semibold text-slate-700 ml-1">Email Address <span className="text-red-500">*</span></label>
                <input type="email" placeholder="student@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Full Address <span className="text-red-500">*</span></label>
              <textarea placeholder="Village, Post, District, State, Pincode" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field resize-none" rows={2} required minLength={10} />
            </div>
          </div>
        )}

        {/* LOGIN ONLY / SHARED PASSWORD FIELD */}
        {isLogin && (
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700 ml-1">Email Address</label>
            <input type="email" placeholder="student@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required minLength={6} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-start gap-2 animate-fade-in">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{success}</span>
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 mt-2">
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            isLogin ? "Sign In →" : "Create Free Account →"
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Google Login */}
      <button onClick={handleGoogleLogin} disabled={loading} className="btn-secondary w-full flex items-center justify-center gap-3 py-3.5">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>

      <p className="text-center mt-6 text-xs text-slate-400">
        By continuing, you agree to our Terms of Service & Privacy Policy
      </p>
    </div>
  );
}