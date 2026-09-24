// app/privacy/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | World of Concept",
  description: "Learn how World of Concept protects your privacy and handles your personal information securely.",
};

export default function PrivacyPolicyPage() {
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
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔒</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
              <p className="text-sm text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            At World of Concept, we respect your privacy and are committed to protecting your personal information. This policy explains how we collect, use, and safeguard your data.
          </p>
        </div>

        <div className="space-y-6">
          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600">1.</span> Information We Collect
            </h2>
            <p className="text-slate-600 mb-3">We collect information that helps us provide you with the best learning experience:</p>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Personal Information:</strong> Name, father&apos;s name, email, mobile number, and address when you create an account.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Payment Information:</strong> Securely processed through Razorpay. We do not store your card details.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Usage Data:</strong> Course progress, video views, and test scores to personalize your learning.</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600">2.</span> How We Use Your Information
            </h2>
            <p className="text-slate-600 mb-3">We use your information to:</p>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Provide access to courses and track your progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Send important updates about your courses and batch</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Process payments and issue certificates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Improve our platform based on student feedback</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600">3.</span> Data Security
            </h2>
            <p className="text-slate-600">
              We use industry-standard encryption and security measures to protect your data. Your information is stored securely on Firebase servers with strict access controls. We never sell your personal data to third parties.
            </p>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600">4.</span> Your Rights
            </h2>
            <p className="text-slate-600 mb-3">You have the right to:</p>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Access your personal data that we hold</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Request correction of inaccurate information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Request deletion of your account and data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Opt-out of marketing communications</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-600">5.</span> Contact Us
            </h2>
            <p className="text-slate-600">
              If you have any questions about this Privacy Policy or your data, please contact us at{" "}
              <a href="mailto:support@worldofconcept.in" className="text-blue-600 hover:underline font-semibold">
                support@worldofconcept.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}