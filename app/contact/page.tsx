/* eslint-disable */
"use client";

import Link from "next/link";
import { 
  ArrowLeft, Mail, Phone, MessageCircle, MapPin, Clock, HelpCircle, 
  Send, ShieldCheck, Zap
} from "lucide-react";
import DynamicBackground from "@/components/DynamicBackground";
import SiteFooter from "@/components/SiteFooter";

// Static BG Images for this page (using existing gallery assets)
const CONTACT_BG_IMAGES = ["/gallery3.jpg", "/gallery6.jpg", "/gallery9.jpg"];

export default function ContactPage() {
  return (
    <div className="relative min-h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans overflow-x-hidden transition-colors duration-700">
      
      {/* ==============================
          BACKGROUND ENGINE WITH DUAL WAVES
          ============================== */}
      <DynamicBackground images={CONTACT_BG_IMAGES} zoomType="in" density={0.6} interactive={false} showGrid={false} />
      
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
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pb-24">
        
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
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0 ring-1 ring-white/10">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-none mb-2">
                Get in Touch
              </h1>
              <p className="text-slate-400 mt-2 text-base sm:text-lg leading-relaxed max-w-2xl">
                Have questions about our courses, need technical support, or want to provide feedback? 
                Reach out to us. We're here to help you succeed!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          
          {/* Email Support */}
          <div className="group relative p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800/60 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all duration-300">
                <Mail className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Email Support</h3>
                <p className="text-sm text-slate-500 mb-2">For general queries and support</p>
                <a href="mailto:support@worldofconcept.in" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors break-all">
                  support@worldofconcept.in
                </a>
              </div>
            </div>
          </div>

          {/* Phone Support */}
          <div className="group relative p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800/60 hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-green-500/20 transition-all duration-300">
                <Phone className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Phone Support</h3>
                <p className="text-sm text-slate-500 mb-2">Mon-Sat, 9 AM - 6 PM</p>
                <a href="tel:+917979096954" className="text-green-400 hover:text-green-300 font-semibold transition-colors">
                  +91 7979096954
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="group relative p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800/60 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">WhatsApp</h3>
                <p className="text-sm text-slate-500 mb-2">Quick responses</p>
                <a href="https://wa.me/917979096954" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors flex items-center gap-1">
                  Chat on WhatsApp <Send className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Office Address */}
          <div className="group relative p-6 rounded-2xl border border-white/5 bg-slate-900/50 backdrop-blur-md hover:bg-slate-800/60 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all duration-300">
                <MapPin className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Office Address</h3>
                <p className="text-sm text-slate-500 mb-2">Visit us in person</p>
                <p className="text-slate-300 font-semibold leading-relaxed">
                  Alamnagar, Madhepura,<br/>
                  Bihar, India - 852210
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time Stats */}
        <div className="relative p-8 rounded-3xl border border-white/5 bg-slate-900/40 backdrop-blur-xl mb-12 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="flex items-center gap-3 mb-6">
             <Zap className="w-6 h-6 text-yellow-400" />
             <h2 className="text-xl sm:text-2xl font-bold text-white">Expected Response Times</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-white/5 hover:border-blue-500/30 transition-colors duration-300 group">
              <div className="w-10 h-10 mx-auto mb-3 bg-blue-500/10 rounded-full flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Clock className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-2xl font-black text-white mb-1">24 Hours</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email Queries</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-white/5 hover:border-emerald-500/30 transition-colors duration-300 group">
              <div className="w-10 h-10 mx-auto mb-3 bg-emerald-500/10 rounded-full flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white mb-1">~2 Hours</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">WhatsApp Chats</p>
            </div>
            <div className="bg-slate-800/50 rounded-2xl p-5 text-center border border-white/5 hover:border-purple-500/30 transition-colors duration-300 group">
              <div className="w-10 h-10 mx-auto mb-3 bg-purple-500/10 rounded-full flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Phone className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white mb-1">Instant</p>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Direct Calls</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          
          {[
            {
              q: "How do I access my purchased course?",
              a: "After successful payment, you'll get instant access to your course. Simply login to your account and navigate to the 'My Courses' section in your dashboard."
            },
            {
              q: "Can I download videos for offline viewing?",
              a: "Currently, videos can only be streamed online to protect our premium content and ensure the best quality. We're working on an offline viewing feature for the future."
            },
            {
              q: "What if I face technical issues?",
              a: "Contact our support team via email or WhatsApp with your issue details and a screenshot. We'll resolve it within 24 hours or provide a refund if the issue persists."
            }
          ].map((faq, i) => (
            <div key={i} className="group p-6 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:bg-slate-800/50 hover:border-indigo-500/20 transition-all duration-300">
              <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors flex items-start gap-2">
                <span className="text-indigo-500 font-mono text-sm mt-0.5">Q{i+1}.</span>
                {faq.q}
              </h3>
              <p className="text-slate-400 leading-relaxed pl-7 text-sm sm:text-base">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

        {/* Trust Badge / Footer Note */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-300 text-xs font-bold mb-4">
             <ShieldCheck className="w-4 h-4" />
             Secure & Verified Platform
           </div>
           <p className="text-slate-500 text-sm">
             World of Concept is committed to providing transparent communication and reliable support for all Bihar Board students.
           </p>
        </div>

      </main>

      <SiteFooter />
    </div>
  );
}