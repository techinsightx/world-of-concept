/* eslint-disable */
"use client";

import Link from "next/link";
import { 
  ArrowLeft, RefreshCcw, CheckCircle2, XCircle, 
  AlertTriangle, HelpCircle, Mail, ShieldCheck, Clock, FileText
} from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import SiteFooter from "@/components/SiteFooter";

// Static BG Images for this page (using existing gallery assets)
const REFUND_BG_IMAGES = ["/gallery5.jpg", "/gallery8.jpg", "/gallery1.jpg"];

export default function RefundPolicyPage() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden transition-colors duration-700">
      
      {/* ==============================
          BACKGROUND ENGINE WITH DUAL WAVES
          ============================== */}
      <DynamicBackground images={REFUND_BG_IMAGES} zoomType="in" density={0.6} interactive={false} showGrid={false} />
      
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0 ring-1 ring-white/10">
              <RefreshCcw className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
                Refund Policy
              </h1>
              <p className="text-slate-400 mt-2 text-base sm:text-lg leading-relaxed max-w-2xl">
                We want you to be completely satisfied with your learning experience. Here&apos;s our transparent and student-friendly refund policy.
              </p>
              <p className="text-xs text-slate-500 mt-3 font-medium uppercase tracking-wider">
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* 1. 7-Day Money-Back Guarantee */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-green-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 font-bold text-lg">1</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">7-Day Money-Back Guarantee</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">
              We offer a <strong className="text-white">7-day money-back guarantee</strong> on all course purchases. If you're not satisfied with the course quality, you can request a full refund within 7 days of purchase.
            </p>
            
            <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-5 flex items-start gap-4">
              <HelpCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-green-300 font-medium text-sm mb-1">How to Request?</p>
                <p className="text-slate-400 text-sm">
                  To request a refund, email us at{" "}
                  <a href="mailto:support@worldofconcept.in" className="text-green-400 hover:text-green-300 underline decoration-green-500/30 hover:decoration-green-400 transition-all">
                    support@worldofconcept.in
                  </a>{" "}
                  with your order details and reason for refund.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Eligibility for Refund */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-blue-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-lg">2</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Eligibility for Refund</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">You are eligible for a refund if:</p>
            
            <ul className="space-y-4">
              {[
                "Request is made within 7 days of purchase",
                "You have accessed less than 20% of the course content",
                "You provide a valid reason for the refund request"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-white/10 transition-colors">
                  <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Non-Refundable Cases */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-red-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 font-bold text-lg">3</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Non-Refundable Cases</h2>
            </div>
            
            <p className="text-slate-400 mb-6 leading-relaxed">Refunds will <strong className="text-white">NOT</strong> be provided if:</p>
            
            <ul className="space-y-4">
              {[
                "More than 7 days have passed since purchase",
                "You have accessed more than 20% of the course content",
                "The course was purchased during a special promotion with 'no refund' terms",
                "Your account was terminated due to violation of our Terms of Service"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-white/10 transition-colors">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-300 text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Refund Process */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-purple-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold text-lg">4</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Refund Process</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { step: "1", title: "Send an Email", desc: "Email us at support@worldofconcept.in with your registered email and order ID.", icon: Mail },
                { step: "2", title: "Review Period", desc: "Our team will review your request and verify your course access within 2-3 business days.", icon: Clock },
                { step: "3", title: "Approval", desc: "If approved, the refund will be initiated to your original payment method.", icon: CheckCircle2 },
                { step: "4", title: "Bank Processing", desc: "Refunds typically take 5-7 business days to reflect in your bank account, depending on your bank.", icon: ShieldCheck }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-purple-500/20 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-400 font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 flex items-center gap-2">
                      <item.icon className="w-4 h-4 text-purple-400" />
                      {item.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Technical Issues */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-amber-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-400 font-bold text-lg">5</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Technical Issues</h2>
            </div>
            
            <div className="flex items-start gap-4 p-5 rounded-xl bg-amber-500/5 border border-amber-500/10">
              <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
              <p className="text-slate-300 leading-relaxed">
                If you experience technical issues accessing your course (videos not loading, login problems, etc.), please contact our support team immediately. We will prioritize resolving the issue, or provide a full refund if the problem cannot be fixed on our end.
              </p>
            </div>
          </section>

          {/* 6. Contact for Refunds */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-blue-500/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold text-lg">6</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Contact for Refunds</h2>
            </div>
            
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/10">
              <p className="text-slate-300 leading-relaxed mb-4">
                For any refund-related queries, reach out to us at:
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