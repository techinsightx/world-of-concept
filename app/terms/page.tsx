/* eslint-disable */
"use client";

import Link from "next/link";
import { 
  ArrowLeft, Scale, CheckCircle2, BookOpen, 
  XCircle, ShieldAlert, AlertTriangle, FileEdit, Mail, 
  Gavel, Users, Lock
} from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import SiteFooter from "@/components/SiteFooter";

// Static BG Images for this page
const TERMS_BG_IMAGES = ["/gallery6.jpg", "/gallery9.jpg", "/gallery2.jpg"];

export default function TermsPage() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden transition-colors duration-700">
      
      {/* ==============================
          SET TITLE FOR CLIENT COMPONENTS
          ============================== */}
      {/* Next.js allows setting document title in client components via head or simply relying on layout if needed, 
          but for standalone pages without server metadata, we can't export 'metadata'. 
          So we rely on the browser tab showing what's rendered or use a hook if strict SEO is needed. 
          For now, removing the export fixes the build error. */}

      {/* ==============================
          BACKGROUND ENGINE WITH DUAL WAVES
          ============================== */}
      <DynamicBackground images={TERMS_BG_IMAGES} zoomType="in" density={0.6} interactive={false} showGrid={false} />
      
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0 ring-1 ring-white/10">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
                Terms of Service
              </h1>
              <p className="text-slate-400 mt-2 text-base sm:text-lg leading-relaxed max-w-2xl">
                Welcome to World of Concept! By using our platform, you agree to these terms. Please read them carefully to understand your rights and responsibilities.
              </p>
              <p className="text-xs text-slate-500 mt-3 font-medium uppercase tracking-wider">
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. Acceptance of Terms */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-purple-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-lg">1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Acceptance of Terms</h2>
            </div>
            
            <div className="flex items-start gap-4 p-5 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <Gavel className="w-6 h-6 text-purple-400 mt-1 flex-shrink-0" />
              <p className="text-slate-300 leading-relaxed">
                By creating an account or using World of Concept, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform. These terms apply to all visitors, users, and others who access or use the service.
              </p>
            </div>
          </section>

          {/* 2. Student Responsibilities */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-green-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold text-lg">2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Student Responsibilities</h2>
            </div>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Provide accurate and complete information during registration",
                "Maintain the confidentiality of your account credentials",
                "Use the platform only for lawful educational purposes",
                "Not share your account with others or attempt to access other accounts"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-white/10 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Course Access & Content */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-blue-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-lg">3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Course Access & Content</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">When you enroll in a course:</p>
            
            <ul className="space-y-4">
              {[
                "You get access to video lectures, notes, and test series for the duration specified",
                "Content is for personal use only and cannot be downloaded, shared, or redistributed",
                "We reserve the right to modify or discontinue courses with prior notice"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-blue-500/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Prohibited Activities */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-red-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 font-bold text-lg">4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Prohibited Activities</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">You agree <strong className="text-white">NOT</strong> to:</p>
            
            <ul className="space-y-4">
              {[
                "Record, screenshot, or distribute course content",
                "Use the platform for any illegal or unauthorized purpose",
                "Attempt to hack, disrupt, or compromise the platform's security",
                "Create multiple accounts to abuse free trials or promotions"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-red-500/20 transition-colors">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Account Termination */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-amber-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-400 font-bold text-lg">5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Account Termination</h2>
            </div>
            
            <div className="flex items-start gap-4 p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <ShieldAlert className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
              <p className="text-slate-300 leading-relaxed">
                We reserve the right to suspend or terminate your account if you violate these terms. In such cases, you will <strong className="text-white">not be entitled to a refund</strong> for any unused portion of your course. Any fees paid are non-refundable unless explicitly stated in our Refund Policy.
              </p>
            </div>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-indigo-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-400 font-bold text-lg">6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Limitation of Liability</h2>
            </div>
            
            <div className="flex items-start gap-4 p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
              <AlertTriangle className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
              <p className="text-slate-300 leading-relaxed">
                World of Concept provides educational content to help students prepare for Bihar Board exams. While we strive for accuracy, we do not guarantee specific results or exam outcomes. Our liability is strictly limited to the amount paid for the course. We are not liable for any indirect, incidental, special, consequential, or punitive damages.
              </p>
            </div>
          </section>

          {/* 7. Changes to Terms */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-cyan-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-400 font-bold text-lg">7</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Changes to Terms</h2>
            </div>
            
            <div className="flex items-start gap-4 p-5 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
              <FileEdit className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
              <p className="text-slate-300 leading-relaxed">
                We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify you of significant changes via email or through our dashboard announcements. It is your responsibility to review these terms periodically.
              </p>
            </div>
          </section>

          {/* 8. Contact Information */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-purple-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-lg">8</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Contact Information</h2>
            </div>
            
            <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/10">
              <p className="text-slate-300 leading-relaxed mb-4">
                For questions about these Terms of Service, contact us at:
              </p>
              <a 
                href="mailto:support@worldofconcept.in" 
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-bold transition-colors"
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