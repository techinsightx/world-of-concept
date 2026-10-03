/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo";

interface StudentData {
  fullName: string;
  fatherName: string;
  mobile: string;
  email: string;
  address: string;
}

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthChecked(true);
      if (!user) {
        window.location.replace("/");
        return;
      }
      try {
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (studentDoc.exists()) {
          setStudent(studentDoc.data() as StudentData);
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        window.location.replace("/");
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.replace("/");
  };

  // Sample courses
  const myCourses = [
    {
      id: "math_class_10_001",
      title: "Math: Objective Masterclass",
      instructor: "RK Sir",
      progress: 35,
      driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      color: "from-blue-500 to-indigo-600",
      icon: "📐",
    },
    {
      id: "science_class_10_001",
      title: "Science: Complete Revision",
      instructor: "RK Sir",
      progress: 12,
      driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      color: "from-purple-500 to-pink-600",
      icon: "🔬",
    },
  ];

  // 🎬 ROW 1 IMAGES: Replace these with your actual file names in the public folder
  const row1Images = [
    "/class1.jpg",
    "/class2.jpg",
    "/class3.jpg",
    "/class4.jpg",
    "/class5.jpg",
  ];

  // 🎬 ROW 2 IMAGES: Replace these with your actual file names in the public folder
  const row2Images = [
    "/student1.jpg",
    "/student2.jpg",
    "/student3.jpg",
    "/student4.jpg",
    "/student5.jpg",
  ];

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-3xl">🎓</span>
          </div>
          <p className="text-slate-600 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Unable to load student data</p>
          <button onClick={() => window.location.replace("/")} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Custom Keyframes for Seamless Infinite Scroll */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 45s linear infinite;
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo size="medium" showText={true} />
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{student.fullName}</p>
                <p className="text-xs text-slate-500">{student.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 border border-red-200 hover:border-red-300 hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Welcome back, <span className="gradient-text">{student.fullName.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Continue your learning journey with RK Sir. Let us make today productive!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: "📚", label: "Total Courses", value: myCourses.length, color: "bg-blue-100", delay: "0s" },
            { icon: "✅", label: "Completed", value: "0", color: "bg-green-100", delay: "0.1s" },
            { icon: "🎯", label: "In Progress", value: myCourses.length, color: "bg-purple-100", delay: "0.2s" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="card animate-fade-in-up hover:scale-[1.03] hover:shadow-xl transition-all duration-300" 
              style={{ animationDelay: stat.delay }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Courses Section */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">My Courses</h2>
            <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors flex items-center gap-1 group">
              Browse All 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course, i) => (
              <div
                key={course.id}
                className="card-interactive group overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className={`h-36 bg-gradient-to-br ${course.color} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
                  <span className="text-6xl relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
                    {course.icon}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{course.title}</h3>
                <p className="text-sm text-slate-500 mb-4">By {course.instructor}</p>
                
                <div className="mb-5">
                  <div className="flex justify-between text-xs text-slate-600 mb-1.5 font-medium">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>

                <a
                  href={course.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 group-hover:shadow-lg transition-all duration-300"
                >
                  <span>Access Course</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 🎬 Cinematic Infinite Scrolling Gallery (TWO ROWS) */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">Life at World of Concept</h2>
            <p className="text-slate-500">Glimpses of our classrooms, sessions, and student success</p>
          </div>

          <div className="relative w-full overflow-hidden py-4">
            {/* Cinematic Fade Edges (Left & Right) */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            {/* ROW 1: Left to Right Scrolling */}
            <div className="flex gap-4 w-max animate-marquee mb-4">
              {[...row1Images, ...row1Images, ...row1Images].map((src, i) => (
                <div 
                  key={`row1-${i}`} 
                  className="relative w-72 sm:w-80 h-48 rounded-2xl overflow-hidden group flex-shrink-0 border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <Image 
                    src={src} 
                    alt={`Gallery Row 1 Image ${i}`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Hover Reveal Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">World of Concept Class</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ROW 2: Right to Left Scrolling */}
            <div className="flex gap-4 w-max animate-marquee-reverse">
              {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
                <div 
                  key={`row2-${i}`} 
                  className="relative w-72 sm:w-80 h-48 rounded-2xl overflow-hidden group flex-shrink-0 border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500"
                >
                  <Image 
                    src={src} 
                    alt={`Gallery Row 2 Image ${i}`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  {/* Hover Reveal Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md">Student Success Story</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RK Sir Guidance Section */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: "0.8s" }}>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Daily Motivation by RK Sir</h2>
          <div className="card text-center py-16 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <span className="text-7xl mb-6 block animate-bounce">🎬</span>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Coming Soon</h3>
              <p className="text-slate-600 max-w-md mx-auto leading-relaxed">
                Daily motivational videos and special guidelines by RK Sir for all Bihar Board students to keep you inspired and on track.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}