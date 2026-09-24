// app/page.tsx
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "World of Concept | Bihar Board Topper Batch by RK Sir",
  description: "Join 10,000+ students in Bihar's most trusted educational platform. Premium video lectures, structured notes, and complete board exam guidance by RK Sir.",
};

export default function Home() {
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: "🎬", title: "HD Video Lectures", desc: "Crystal clear concept-based video lessons by RK Sir" },
    { icon: "📝", title: "Smart Notes", desc: "Handwritten-style structured notes for quick revision" },
    { icon: "📊", title: "Test Series", desc: "Chapter-wise & full syllabus mock tests with detailed analysis" },
    { icon: "💬", title: "Doubt Support", desc: "Get your doubts solved directly by RK Sir's expert team" },
  ];

  const stats = [
    { value: "10,000+", label: "Active Students" },
    { value: "500+", label: "Video Lectures" },
    { value: "4.9★", label: "Student Rating" },
    { value: "95%", label: "Selection Rate" },
  ];

  const socialLinks = [
    { name: "YouTube", icon: "▶" },
    { name: "Instagram", icon: "📷" },
    { name: "Facebook", icon: "f" },
    { name: "Telegram", icon: "✈" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-x-hidden">

      {/* ====== HERO SECTION ====== */}
      <section className="relative min-h-screen flex items-center justify-center p-4 sm:p-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Admissions Open for 2027 Batch
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              World of
              <br />
              <span className="gradient-text">Concept</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Bihar Board Matric & Inter का सबसे trusted platform। 
              <span className="font-bold text-slate-800"> RK Sir</span> के साथ अपनी तैयारी को दें एक नई दिशा।
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
              <a href="#courses" className="btn-primary inline-flex items-center gap-2">
                Explore Courses
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </a>
              <a href="#features" className="btn-secondary inline-flex items-center gap-2">
                Why Choose Us?
              </a>
            </div>
          </div>

          <div className="flex-1 w-full max-w-md animate-fade-in-up-delayed">
            <AuthForm />
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="relative z-10 -mt-8 px-4">
        <div className="max-w-5xl mx-auto glass rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-1">
                <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{stat.value}</p>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section id="features" className="py-20 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="badge badge-primary mb-4">WHY US</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Everything You Need to <span className="gradient-text">Top Your Board</span>
            </h2>
            <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">
              हम सिर्फ पढ़ाते नहीं, हर student को topper बनने का रास्ता दिखाते हैं।
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="card-interactive text-center group" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== FEATURED COURSES ====== */}
      <section id="courses" className="py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-50 to-blue-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="badge badge-success mb-4">🔥 TRENDING</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Featured <span className="gradient-text">Courses</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Math: Objective Masterclass", price: "₹499", oldPrice: "₹1,999", color: "from-blue-500 to-indigo-600", icon: "📐", badge: "Class 10" },
              { title: "Science: Complete Revision", price: "₹699", oldPrice: "₹2,499", color: "from-purple-500 to-pink-600", icon: "🔬", badge: "Class 10" },
              { title: "Inter: Complete Topper Batch", price: "₹999", oldPrice: "₹3,999", color: "from-green-500 to-emerald-600", icon: "📚", badge: "Class 12" },
            ].map((course, i) => (
              <div key={i} className="card-interactive group overflow-hidden">
                <div className={`h-44 bg-gradient-to-br ${course.color} rounded-xl mb-5 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">{course.icon}</span>
                </div>
                <span className="badge badge-primary mb-3">{course.badge}</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4">Complete preparation with tricks, notes & test series by RK Sir.</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900">{course.price}</span>
                    <span className="text-sm text-slate-400 line-through ml-2">{course.oldPrice}</span>
                  </div>
                  <button className="btn-primary text-sm py-2 px-4">Enroll Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== PREMIUM FOOTER ====== */}
      <footer className="relative bg-slate-950 text-slate-400 py-16 px-4 sm:px-8">
        {/* Top Glow Border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 text-white">
                <span className="text-3xl">🎓</span>
                <span className="font-extrabold text-xl tracking-tight">World of Concept</span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering Bihar&apos;s students with world-class education, structured guidance, and a proven path to success.
              </p>
              {/* Social Media Icons */}
              <div className="flex gap-3 pt-2">
                {socialLinks.map((social) => (
                  <a 
                    key={social.name} 
                    href={`#${social.name.toLowerCase()}`} 
                    className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 hover:-translate-y-1"
                    aria-label={social.name}
                  >
                    <span className="text-sm font-bold">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Platform</h4>
              <ul className="space-y-3 text-sm">
                <li><a href="#courses" className="hover:text-blue-400 transition-colors">All Courses</a></li>
                <li><a href="#features" className="hover:text-blue-400 transition-colors">Why Choose Us</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Student Success Stories</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Become an Educator</a></li>
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-3 text-sm">
                {legalLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="hover:text-blue-400 transition-colors">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <span>📧</span> support@worldofconcept.in
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span> +91 7979096954
                </li>
                <li className="flex items-center gap-2">
                  <span>📍</span> Alamnagar, Bihar, India
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar with Subtle Creator Credit */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
            <p>© {currentYear} World of Concept. All rights reserved.</p>
            
            {/* SEO-Friendly, Minimalist Creator Credit */}
            <a 
              href="https://www.google.com/search?q=Mukesh+Kumar+Malakar+Developer" 
              target="_blank" 
              rel="noopener noreferrer author"
              className="flex items-center gap-1.5 text-slate-600 hover:text-blue-400 transition-all duration-300 group"
              title="Designed and Developed by Mukesh Kumar Malakar"
            >
              <span>Crafted with</span>
              <svg className="w-3.5 h-3.5 text-red-500 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>by <span className="font-semibold text-slate-500 group-hover:text-blue-400">Mukesh Kumar Malakar</span></span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}