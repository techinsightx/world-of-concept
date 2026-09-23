// app/page.tsx
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "World of Concept | Bihar Board Topper Batch",
  description: "Join RK Sir's complete guidance program for Bihar Board Matric & Inter.",
};

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-hidden bg-slate-50">
      
      {/* Dynamic Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute -bottom-40 right-1/3 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        
        {/* Left Side: Branding & Info */}
        <div className="flex-1 text-center lg:text-left space-y-6 animate-[fadeInUp_0.8s_ease-out]">
          <div className="inline-block px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold tracking-wide mb-2 shadow-sm">
            🚀 #1 Educational Platform in Bihar
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
            World of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500">
              Concept
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Bihar Board Matric & Inter Topper Batch by <span className="font-bold text-slate-800">RK Sir</span>. 
            Get access to premium video lectures, structured notes, and complete guidance.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100">
              <span className="text-2xl">🎓</span>
              <div className="text-left">
                <p className="text-xs text-slate-500 font-medium">Students</p>
                <p className="text-sm font-bold text-slate-800">10,000+</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-100">
              <span className="text-2xl">⭐</span>
              <div className="text-left">
                <p className="text-xs text-slate-500 font-medium">Rating</p>
                <p className="text-sm font-bold text-slate-800">4.9/5.0</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form (Glassmorphism) */}
        <div className="flex-1 w-full max-w-md animate-[fadeInUp_1s_ease-out_0.2s_both]">
          <AuthForm />
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 text-center text-sm text-slate-400">
        <p>© {currentYear} World of Concept. Crafted with ❤️ for Students.</p>
      </div>

      {/* Custom Keyframe Animation for Tailwind */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}