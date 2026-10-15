import type { Metadata } from "next";
import Link from "next/link";
import { 
  ArrowLeft, RefreshCcw, CheckCircle2, XCircle, 
  AlertTriangle, HelpCircle 
} from "lucide-react";

export const metadata: Metadata = {
  title: "Refund Policy | World of Concept",
  description: "Understand our transparent refund policy for course purchases at World of Concept.",
};

export default function RefundPolicyPage() {
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
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 flex-shrink-0">
              <RefreshCcw className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Refund Policy
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg leading-relaxed max-w-2xl">
                We want you to be completely satisfied with your learning experience. Here&apos;s our transparent and student-friendly refund policy.
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-500 mt-3 font-medium">
                Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 1. 7-Day Money-Back Guarantee */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-green-500/50 dark:hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 dark:text-green-400 font-bold text-sm">1</span>
              </div>
              7-Day Money-Back Guarantee
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              We offer a <strong className="text-slate-900 dark:text-white">7-day money-back guarantee</strong> on all course purchases. If you&apos;re not satisfied with the course quality, you can request a full refund within 7 days of purchase.
            </p>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-green-800 dark:text-green-300 font-medium text-sm">
                To request a refund, email us at <a href="mailto:support@worldofconcept.in" className="underline hover:text-green-900 dark:hover:text-green-200">support@worldofconcept.in</a> with your order details.
              </p>
            </div>
          </section>

          {/* 2. Eligibility for Refund */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">2</span>
              </div>
              Eligibility for Refund
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">You are eligible for a refund if:</p>
            <ul className="space-y-3">
              {[
                "Request is made within 7 days of purchase",
                "You have accessed less than 20% of the course content",
                "You provide a valid reason for the refund request"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 3. Non-Refundable Cases */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-red-500/50 dark:hover:border-red-500/50 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 dark:text-red-400 font-bold text-sm">3</span>
              </div>
              Non-Refundable Cases
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4">Refunds will <strong className="text-slate-900 dark:text-white">NOT</strong> be provided if:</p>
            <ul className="space-y-3">
              {[
                "More than 7 days have passed since purchase",
                "You have accessed more than 20% of the course content",
                "The course was purchased during a special promotion with 'no refund' terms",
                "Your account was terminated due to violation of our Terms of Service"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 4. Refund Process */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">4</span>
              </div>
              Refund Process
            </h2>
            <div className="space-y-4">
              {[
                { step: "1", title: "Send an Email", desc: "Email us at support@worldofconcept.in with your registered email and order ID." },
                { step: "2", title: "Review Period", desc: "Our team will review your request and verify your course access within 2-3 business days." },
                { step: "3", title: "Approval", desc: "If approved, the refund will be initiated to your original payment method." },
                { step: "4", title: "Bank Processing", desc: "Refunds typically take 5-7 business days to reflect in your bank account, depending on your bank." }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-700 dark:text-purple-300 font-bold text-sm">{item.step}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Technical Issues */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-500/50 dark:hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">5</span>
              </div>
              Technical Issues
            </h2>
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                If you experience technical issues accessing your course (videos not loading, login problems, etc.), please contact our support team immediately. We will prioritize resolving the issue, or provide a full refund if the problem cannot be fixed on our end.
              </p>
            </div>
          </section>

          {/* 6. Contact for Refunds */}
          <section className="group relative p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">6</span>
              </div>
              Contact for Refunds
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For any refund-related queries, reach out to us at{" "}
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