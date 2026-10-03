// app/refund/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy | World of Concept",
  description: "Understand our refund policy for course purchases at World of Concept.",
};

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-8 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="glass rounded-3xl p-8 sm:p-12 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Refund Policy</h1>
              <p className="text-sm text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            We want you to be completely satisfied with your learning experience. Here&apos;s our transparent refund policy.
          </p>
        </div>

        <div className="space-y-6">
          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-green-600">✓</span> 7-Day Money-Back Guarantee
            </h2>
            <p className="text-slate-600 mb-3">
              We offer a <strong>7-day money-back guarantee</strong> on all course purchases. If you&apos;re not satisfied with the course quality, you can request a full refund within 7 days of purchase.
            </p>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mt-4">
              <p className="text-green-800 font-semibold text-sm">
                💡 To request a refund, email us at support@worldofconcept.in with your order details.
              </p>
            </div>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Eligibility for Refund</h2>
            <p className="text-slate-600 mb-3">You are eligible for a refund if:</p>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Request is made within 7 days of purchase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>You have accessed less than 20% of the course content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>You provide a valid reason for the refund request</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Non-Refundable Cases</h2>
            <p className="text-slate-600 mb-3">Refunds will <strong>NOT</strong> be provided if:</p>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>More than 7 days have passed since purchase</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>You have accessed more than 20% of the course content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>The course was purchased during a special promotion with &quot;no refund&quot; terms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Your account was terminated due to violation of terms</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Refund Process</h2>
            <ol className="space-y-3 text-slate-600 ml-6 list-decimal">
              <li>Email us at <strong>support@worldofconcept.in</strong> with your registered email and order ID</li>
              <li>Our team will review your request within 2-3 business days</li>
              <li>If approved, the refund will be processed to your original payment method</li>
              <li>Refunds typically take 5-7 business days to reflect in your account</li>
            </ol>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Technical Issues</h2>
            <p className="text-slate-600">
              If you experience technical issues accessing your course (videos not loading, login problems, etc.), please contact our support team immediately. We will resolve the issue or provide a refund if the problem cannot be fixed.
            </p>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact for Refunds</h2>
            <p className="text-slate-600">
              For any refund-related queries, reach out to us at{" "}
              <a href="mailto:support@worldofconcept.in" className="text-green-600 hover:underline font-semibold">
                support@worldofconcept.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}