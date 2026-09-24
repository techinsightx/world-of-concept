// app/terms/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | World of Concept",
  description: "Read the terms and conditions for using World of Concept educational platform.",
};

export default function TermsPage() {
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
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Terms of Service</h1>
              <p className="text-sm text-slate-500 mt-1">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Welcome to World of Concept! By using our platform, you agree to these terms. Please read them carefully.
          </p>
        </div>

        <div className="space-y-6">
          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">1.</span> Acceptance of Terms
            </h2>
            <p className="text-slate-600">
              By creating an account or using World of Concept, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">2.</span> Student Responsibilities
            </h2>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Provide accurate and complete information during registration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Maintain the confidentiality of your account credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Use the platform only for lawful educational purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-1">✓</span>
                <span>Not share your account with others or attempt to access other accounts</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">3.</span> Course Access & Content
            </h2>
            <p className="text-slate-600 mb-3">When you enroll in a course:</p>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>You get access to video lectures, notes, and test series for the duration specified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>Content is for personal use only and cannot be downloaded, shared, or redistributed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">•</span>
                <span>We reserve the right to modify or discontinue courses with prior notice</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">4.</span> Prohibited Activities
            </h2>
            <p className="text-slate-600 mb-3">You agree not to:</p>
            <ul className="space-y-2 text-slate-600 ml-6">
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Record, screenshot, or distribute course content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Use the platform for any illegal or unauthorized purpose</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Attempt to hack, disrupt, or compromise the platform's security</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 mt-1">✗</span>
                <span>Create multiple accounts to abuse free trials or promotions</span>
              </li>
            </ul>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">5.</span> Account Termination
            </h2>
            <p className="text-slate-600">
              We reserve the right to suspend or terminate your account if you violate these terms. In such cases, you will not be entitled to a refund for any unused portion of your course.
            </p>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">6.</span> Limitation of Liability
            </h2>
            <p className="text-slate-600">
              World of Concept provides educational content to help students prepare for Bihar Board exams. While we strive for accuracy, we do not guarantee specific results or exam outcomes. Our liability is limited to the amount paid for the course.
            </p>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">7.</span> Changes to Terms
            </h2>
            <p className="text-slate-600">
              We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms. We will notify you of significant changes via email.
            </p>
          </section>

          <section className="card animate-fade-in-up">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-purple-600">8.</span> Contact Information
            </h2>
            <p className="text-slate-600">
              For questions about these Terms of Service, contact us at{" "}
              <a href="mailto:support@worldofconcept.in" className="text-purple-600 hover:underline font-semibold">
                support@worldofconcept.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}