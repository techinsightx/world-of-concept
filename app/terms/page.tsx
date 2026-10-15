import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, Scale, CheckCircle2, BookOpen, 
  XCircle, ShieldAlert, AlertTriangle, FileEdit, Mail 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | World of Concept",
  description: "Read the terms and conditions for using World of Concept educational platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* 🔥 Back Button */}
        <Link 
          href="/" 
          className="group inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold mb-8 transition-all duration-300 hover:translate-x-[-4px]"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:translate-x-[-4px]" />
          Back to Home
        </Link>

        {/* 🔥 Hero Section */}
        <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-10 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-xl animate-fade-in-up">
          {/* Subtle Background Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/10 dark:bg-pink-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20 flex-shrink-0">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Terms of Service
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg leading-relaxed max-w-2xl">
                Welcome to World of Concept! By using our platform, you agree to these terms. Please read them carefully to understand your rights and responsibilities.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-3 font-medium">
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. Acceptance of Terms */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">1</span>
              </div>
              Acceptance of Terms
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              By creating an account or using World of Concept, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          {/* 2. Student Responsibilities */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-green-500/50 dark:hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">2</span>
              </div>
              Student Responsibilities
            </h2>
            <ul className="space-y-3 mt-4">
              {[
                "Provide accurate and complete information during registration",
                "Maintain the confidentiality of your account credentials",
                "Use the platform only for lawful educational purposes",
                "Not share your account with others or attempt to access other accounts"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Course Access & Content */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">3</span>
              </div>
              Course Access & Content
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">When you enroll in a course:</p>
            <ul className="space-y-3">
              {[
                "You get access to video lectures, notes, and test series for the duration specified",
                "Content is for personal use only and cannot be downloaded, shared, or redistributed",
                "We reserve the right to modify or discontinue courses with prior notice"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Prohibited Activities */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 dark:hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 dark:text-red-400 font-bold text-sm">4</span>
              </div>
              Prohibited Activities
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">You agree <strong className="text-slate-900 dark:text-white">NOT</strong> to:</p>
            <ul className="space-y-3">
              {[
                "Record, screenshot, or distribute course content",
                "Use the platform for any illegal or unauthorized purpose",
                "Attempt to hack, disrupt, or compromise the platform's security",
                "Create multiple accounts to abuse free trials or promotions"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 5. Account Termination */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">5</span>
              </div>
              Account Termination
            </h2>
            <div className="flex items-start gap-4">
              <ShieldAlert className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We reserve the right to suspend or terminate your account if you violate these terms. In such cases, you will <strong className="text-slate-900 dark:text-white">not be entitled to a refund</strong> for any unused portion of your course.
              </p>
            </div>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold text-sm">6</span>
              </div>
              Limitation of Liability
            </h2>
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-indigo-600 dark:text-indigo-400 mt-1 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                World of Concept provides educational content to help students prepare for Bihar Board exams. While we strive for accuracy, we do not guarantee specific results or exam outcomes. Our liability is strictly limited to the amount paid for the course.
              </p>
            </div>
          </section>

          {/* 7. Changes to Terms */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold text-sm">7</span>
              </div>
              Changes to Terms
            </h2>
            <div className="flex items-start gap-4">
              <FileEdit className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mt-1 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify you of significant changes via email.
              </p>
            </div>
          </section>

          {/* 8. Contact Information */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">8</span>
              </div>
              Contact Information
            </h2>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-1 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                For questions about these Terms of Service, contact us at{" "}
                <a href="mailto:support@worldofconcept.in" className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold underline decoration-purple-500/30 hover:decoration-purple-500 transition-all">
                  support@worldofconcept.in
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}