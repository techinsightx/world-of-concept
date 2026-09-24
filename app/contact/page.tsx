// app/contact/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us | World of Concept",
  description: "Get in touch with World of Concept support team for any queries or assistance.",
};

export default function ContactPage() {
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
            <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📞</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Contact Us</h1>
              <p className="text-sm text-slate-500 mt-1">We&apos;re here to help you!</p>
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Have questions about our courses, need technical support, or want to provide feedback? Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-8">
          {/* Email */}
          <div className="card-interactive animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📧</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Email Support</h3>
                <p className="text-sm text-slate-500 mb-2">For general queries and support</p>
                <a href="mailto:support@worldofconcept.in" className="text-blue-600 hover:underline font-semibold">
                  support@worldofconcept.in
                </a>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="card-interactive animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📞</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Phone Support</h3>
                <p className="text-sm text-slate-500 mb-2">Mon-Sat, 9 AM - 6 PM</p>
                <a href="tel:+917979096954" className="text-green-600 hover:underline font-semibold">
                  +91 7979096954
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="card-interactive animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">WhatsApp</h3>
                <p className="text-sm text-slate-500 mb-2">Quick responses</p>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline font-semibold">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card-interactive animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">📍</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Office Address</h3>
                <p className="text-sm text-slate-500 mb-2">Visit us in person</p>
                <p className="text-slate-700 font-semibold">
                  Alamnagar, Bihar, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="card animate-fade-in-up">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span className="text-cyan-600">⏱</span> Response Time
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-extrabold text-blue-600 mb-1">24h</p>
              <p className="text-sm text-slate-600 font-medium">Email Response</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-extrabold text-green-600 mb-1">2h</p>
              <p className="text-sm text-slate-600 font-medium">WhatsApp Response</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-extrabold text-purple-600 mb-1">Instant</p>
              <p className="text-sm text-slate-600 font-medium">Phone Support</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 animate-fade-in-up">Frequently Asked Questions</h2>
          
          <div className="card animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-800 mb-2">How do I access my purchased course?</h3>
            <p className="text-slate-600">
              After successful payment, you&apos;ll get instant access to your course. Simply login to your account and navigate to the &quot;My Courses&quot; section.
            </p>
          </div>

          <div className="card animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Can I download videos for offline viewing?</h3>
            <p className="text-slate-600">
              Currently, videos can only be streamed online to protect our content. We&apos;re working on an offline viewing feature for the future.
            </p>
          </div>

          <div className="card animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-800 mb-2">What if I face technical issues?</h3>
            <p className="text-slate-600">
              Contact our support team via email or WhatsApp with your issue details. We&apos;ll resolve it within 24 hours or provide a refund if needed.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}