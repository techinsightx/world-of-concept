/* eslint-disable */
"use client";

import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, User, CreditCard, BarChart, 
  CheckCircle2, Lock, Eye, Trash2, MessageSquare, Mail
} from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import SiteFooter from "@/components/SiteFooter";

// Static BG Images for this page (using existing gallery assets)
const PRIVACY_BG_IMAGES = ["/gallery4.jpg", "/gallery7.jpg", "/gallery10.jpg"];

export default function PrivacyPolicyPage() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden transition-colors duration-700">
      
      {/* ==============================
          BACKGROUND ENGINE WITH DUAL WAVES
          ============================== */}
      <DynamicBackground images={PRIVACY_BG_IMAGES} zoomType="in" density={0.6} interactive={false} showGrid={false} />
      
      {/* Dark Overlay to ensure matte look */}
      <div className="absolute inset-0 z-[2] bg-slate-950/85 backdrop-blur-sm pointer-events-none" />

      {/* --- INTERNAL DUAL WAVE ENGINE --- */}
      <div className="wave-bg-engine z-[3] pointer-events-none">
        <div className="wave-layer-left" />
        <div className="wave-layer-right" />
      </div>

      {/* ==============================
          MAIN CONTENT AREA
          ============================== */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24">
        
        {/* Back Button */}
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-slate-400 hover:text-white font-semibold mb-8 transition-all duration-300 hover:-translate-x-1"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-12 border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl animate-fade-in-up">
          
          {/* Decorative Glows inside Card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0 ring-1 ring-white/10">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
                Privacy Policy
              </h1>
              <p className="text-slate-400 mt-2 text-base sm:text-lg leading-relaxed max-w-2xl">
                At World of Concept, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
              </p>
              <p className="text-xs text-slate-500 mt-3 font-medium uppercase tracking-wider">
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. Information We Collect */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-blue-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-lg">1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Information We Collect</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              We collect information that helps us provide you with the best learning experience:
            </p>
            
            <ul className="space-y-4">
              {[
                { icon: User, title: "Personal Information", desc: "Name, father's name, email, mobile number, and address when you create an account." },
                { icon: CreditCard, title: "Payment Information", desc: "Securely processed through Razorpay. We do not store your card details on our servers." },
                { icon: BarChart, title: "Usage Data", desc: "Course progress, video views, and test scores to personalize your learning journey." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-white/10 transition-colors">
                  <item.icon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div>
                    <strong className="text-white block mb-1">{item.title}:</strong>
                    <span className="text-slate-400 text-sm leading-relaxed">{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-green-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold text-lg">2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">How We Use Your Information</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              We use your information to:
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Provide access to courses and track academic progress",
                "Send important updates about batches and exams",
                "Process payments securely via Razorpay",
                "Issue completion certificates upon success",
                "Improve platform performance based on feedback",
                "Ensure security against unauthorized access"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Data Security */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-purple-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-lg">3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Data Security</h2>
            </div>
            
            <div className="flex items-start gap-4 p-5 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <Lock className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <p className="text-slate-300 leading-relaxed">
                We use industry-standard encryption and security measures to protect your data. Your information is stored securely on Firebase servers with strict access controls. We <strong className="text-white">never sell</strong> your personal data to third parties for marketing purposes.
              </p>
            </div>
          </section>

          {/* 4. Your Rights */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-indigo-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-400 font-bold text-lg">4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Your Rights</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              As a user, you have full control over your data. You have the right to:
            </p>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Eye, text: "Access your personal data that we hold" },
                { icon: MessageSquare, text: "Request correction of inaccurate information" },
                { icon: Trash2, text: "Request deletion of your account and data" },
                { icon: ShieldCheck, text: "Opt-out of marketing communications anytime" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-indigo-500/20 transition-colors">
                  <item.icon className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Contact Us */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-blue-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-lg">5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Us</h2>
            </div>
            
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-slate-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or your data, please don&apos;t hesitate to contact our support team.
              </p>
              <a 
                href="mailto:support@worldofconcept.in" 
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold transition-colors"
              >
                <Mail className="w-4 h-4" />
                support@worldofconcept.in
              </a>
            </div>
          </section>

        </div>
      </main>

      <SiteFooter />
    </div>
  );
}