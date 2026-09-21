// app/page.tsx
import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";

// SEO के लिए Metadata (Browser tab और Google search में यही दिखेगा)
export const metadata: Metadata = {
  title: "World of Concept | Bihar Board Topper Batch",
  description: "Join RK Sir's complete guidance program for Bihar Board Matric & Inter. Get access to exclusive video lectures, notes, and test series.",
};

export default function Home() {
  // Dynamic year for footer
  const currentYear = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center p-4 sm:p-8">
      {/* Header Section */}
      <div className="text-center mb-8 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">
          World of Concept
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 font-medium">
          Bihar Board Matric & Inter Topper Batch
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Powered by RK Sir | Complete Guidance
        </p>
      </div>

      {/* Auth Form Section */}
      <div className="w-full max-w-md">
        <AuthForm />
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-xs text-gray-400">
        <p>© {currentYear} World of Concept. All rights reserved.</p>
      </div>
    </main>
  );
}