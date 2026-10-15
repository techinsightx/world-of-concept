import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, User, CreditCard, BarChart, 
  CheckCircle2, Lock, Eye, Trash2, MessageSquare 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | World of Concept",
  description: "Learn how World of Concept protects your privacy and handles your personal information securely.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* 🔥 Back Button */}
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold mb-8 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:translate-x-[-4px]" />
          Back to Home
        </Link>

        {/* 🔥 Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-xl animate-fade-in-up">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg leading-relaxed max-w-2xl">
                At World of Concept, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-3 font-medium">
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Information We Collect */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">1</span>
              </div>
              Information We Collect
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">We collect information that helps us provide you with the best learning experience:</p>
            <ul className="space-y-3">
              {[
                { icon: User, title: "Personal Information", desc: "Name, father's name, email, mobile number, and address when you create an account." },
                { icon: CreditCard, title: "Payment Information", desc: "Securely processed through Razorpay. We do not store your card details on our servers." },
                { icon: BarChart, title: "Usage Data", desc: "Course progress, video views, and test scores to personalize your learning journey." }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <item.icon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span><strong className="text-slate-900 dark:text-slate-200">{item.title}:</strong> {item.desc}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-green-500/50 dark:hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">2</span>
              </div>
              How We Use Your Information
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">We use your information to:</p>
            <ul className="space-y-3">
              {[
                "Provide access to courses and track your academic progress",
                "Send important updates about your courses, batches, and exams",
                "Process payments securely and issue completion certificates",
                "Improve our platform and content based on student feedback"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Data Security */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">3</span>
              </div>
              Data Security
            </h2>
            <div className="flex items-start gap-4">
              <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We use industry-standard encryption and security measures to protect your data. Your information is stored securely on Firebase servers with strict access controls. We <strong className="text-slate-900 dark:text-white">never sell</strong> your personal data to third parties for marketing purposes.
              </p>
            </div>
          </section>

          {/* 4. Your Rights */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">4</span>
              </div>
              Your Rights
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">As a user, you have full control over your data. You have the right to:</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Eye, text: "Access your personal data that we hold" },
                { icon: MessageSquare, text: "Request correction of inaccurate information" },
                { icon: Trash2, text: "Request deletion of your account and data" },
                { icon: ShieldCheck, text: "Opt-out of marketing communications anytime" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <item.icon className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Contact Us */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">5</span>
              </div>
              Contact Us
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If you have any questions about this Privacy Policy or your data, please don&apos;t hesitate to contact our support team at{" "}
              <a href="mailto:support@worldofconcept.in" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline decoration-blue-500/30 hover:decoration-blue-500 transition-all">
                support@worldofconcept.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}