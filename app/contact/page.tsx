import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MessageCircle, MapPin, Clock, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us | World of Concept",
  description: "Get in touch with World of Concept support team for any queries or assistance.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 py-12 px-4 sm:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
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
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Contact Us
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2 text-lg leading-relaxed max-w-2xl">
                Have questions about our courses, need technical support, or want to provide feedback? 
                Reach out to us. We&apos;re here to help you succeed!
              </p>
            </div>
          </div>
        </div>

        {/* 🔥 Contact Grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-10">
          {/* Email */}
          <div className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Email Support</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">For general queries and support</p>
                <a href="mailto:support@worldofconcept.in" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold transition-colors">
                  support@worldofconcept.in
                </a>
              </div>
            </div>
          </div>

          {/* Phone */}
          <div className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-green-500/50 dark:hover:border-green-500/50 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Phone Support</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Mon-Sat, 9 AM - 6 PM</p>
                <a href="tel:+917979096954" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors">
                  +91 7979096954
                </a>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">WhatsApp</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Quick responses</p>
                <a href="https://wa.me/917979096954" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors">
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="group relative p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500/50 dark:hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:-translate-y-1 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Office Address</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Visit us in person</p>
                <p className="text-slate-700 dark:text-slate-300 font-semibold">
                  Alamnagar, Madhepura, Bihar, India
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 Response Time */}
        <div className="relative p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 mb-10 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" /> 
            Expected Response Time
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-colors duration-300">
              <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 mb-1">24h</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Email Response</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 transition-colors duration-300">
              <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">2h</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">WhatsApp Response</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 text-center border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 transition-colors duration-300">
              <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400 mb-1">Instant</p>
              <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Phone Support</p>
            </div>
          </div>
        </div>

        {/* 🔥 FAQ Section */}
        <div className="space-y-4 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
            <HelpCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Frequently Asked Questions
          </h2>
          
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
            <div key={i} className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50 dark:hover:border-indigo-500/50 hover:shadow-lg transition-all duration-300">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {faq.q}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}