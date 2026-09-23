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
    { icon: "📊", title: "Test Series", desc: "Chapter-wise & full syllabus mock tests with analysis" },
    { icon: "💬", title: "Doubt Support", desc: "Get your doubts solved directly by RK Sir's team" },
  ];

  const stats = [
    { value: "10,000+", label: "Active Students" },
    { value: "500+", label: "Video Lectures" },
    { value: "4.9★", label: "Student Rating" },
    { value: "95%", label: "Selection Rate" },
  ];

  return (
    <main className="relative min-h-screen bg-slate-50 overflow-hidden">

      {/* ====== HERO SECTION ====== */}
      <section className="relative min-h-screen flex items-center justify-center p-4 sm:p-8">
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-400/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -left-40 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute -bottom-32 right-1/4 w-[400px] h-[400px] bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
          <div className="absolute top-20 left-1/3 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl animate-float" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Left: Branding */}
          <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Admissions Open for 2025 Batch
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

          {/* Right: Auth Form */}
          <div className="flex-1 w-full max-w-md animate-fade-in-up-delayed">
            <AuthForm />
          </div>
        </div>
      </section>

      {/* ====== STATS BAR ====== */}
      <section className="relative z-10 -mt-8 px-4">
        <div className="max-w-5xl mx-auto glass rounded-2xl p-6 sm:p-8">
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
              <div
                key={i}
                className="card-interactive text-center group"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
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

      {/* ====== FEATURED COURSE ====== */}
      <section id="courses" className="py-20 px-4 sm:px-8 bg-gradient-to-b from-slate-50 to-blue-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14 animate-fade-in-up">
            <span className="badge badge-success mb-4">🔥 TRENDING</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
              Featured <span className="gradient-text">Courses</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Course Card 1 */}
            <div className="card-interactive group overflow-hidden">
              <div className="h-44 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl mb-5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
                <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">📐</span>
              </div>
              <span className="badge badge-primary mb-3">Class 10</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Math: Objective Masterclass</h3>
              <p className="text-sm text-slate-500 mb-4">Complete objective practice with tricks & shortcuts by RK Sir</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-2xl font-extrabold text-blue-600">₹499</span>
                  <span className="text-sm text-slate-400 line-through ml-2">₹1,999</span>
                </div>
                <button className="btn-primary text-sm py-2 px-4">Enroll Now</button>
              </div>
            </div>

            {/* Course Card 2 */}
            <div className="card-interactive group overflow-hidden">
              <div className="h-44 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl mb-5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
                <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">🔬</span>
              </div>
              <span className="badge badge-warning mb-3">Class 10</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Science: Complete Revision</h3>
              <p className="text-sm text-slate-500 mb-4">Physics, Chemistry & Biology - All in one comprehensive batch</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-2xl font-extrabold text-purple-600">₹699</span>
                  <span className="text-sm text-slate-400 line-through ml-2">₹2,499</span>
                </div>
                <button className="btn-primary text-sm py-2 px-4">Enroll Now</button>
              </div>
            </div>

            {/* Course Card 3 */}
            <div className="card-interactive group overflow-hidden">
              <div className="h-44 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl mb-5 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
                <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500">📚</span>
              </div>
              <span className="badge badge-success mb-3">Class 12</span>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Inter: Complete Topper Batch</h3>
              <p className="text-sm text-slate-500 mb-4">All subjects covered with board-level preparation strategy</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <span className="text-2xl font-extrabold text-green-600">₹999</span>
                  <span className="text-sm text-slate-400 line-through ml-2">₹3,999</span>
                </div>
                <button className="btn-primary text-sm py-2 px-4">Enroll Now</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                Ready to Become a <span className="gradient-text">Topper?</span>
              </h2>
              <p className="text-slate-600 text-lg mb-8 max-w-xl mx-auto">
                Join 10,000+ students who already trust RK Sir for their board exam preparation.
              </p>
              <a href="#" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4 animate-pulse-glow">
                Start Learning Today 🚀
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer className="py-10 px-4 border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="font-extrabold text-lg text-slate-800">World of Concept</span>
          </div>
          <p className="text-sm text-slate-400">
            © {currentYear} World of Concept. Crafted with ❤️ for Bihar&apos;s Students.
          </p>
        </div>
      </footer>
    </main>
  );
}