// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";

interface StudentData {
  fullName: string;
  fatherName: string;
  mobile: string;
  email: string;
  address: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase Auth Protection
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        // User not logged in, redirect to home
        router.push("/");
        return;
      }

      // Fetch student data from Firestore
      try {
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (studentDoc.exists()) {
          setStudent(studentDoc.data() as StudentData);
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <span className="text-3xl">🎓</span>
          </div>
          <p className="text-slate-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Unable to load student data</p>
          <button onClick={() => router.push("/")} className="btn-primary">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Sample courses (later we'll fetch from Firestore)
  const myCourses = [
    {
      id: "math_class_10_001",
      title: "Math: Objective Masterclass",
      instructor: "RK Sir",
      progress: 0,
      driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      color: "from-blue-500 to-indigo-600",
      icon: "📐",
    },
    {
      id: "science_class_10_001",
      title: "Science: Complete Revision",
      instructor: "RK Sir",
      progress: 0,
      driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      color: "from-purple-500 to-pink-600",
      icon: "🔬",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl">🎓</span>
                <span className="font-extrabold text-xl text-slate-900">World of Concept</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{student.fullName}</p>
                <p className="text-xs text-slate-500">{student.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            Welcome back, <span className="gradient-text">{student.fullName.split(" ")[0]}</span>! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Continue your learning journey with RK Sir. Let's make today productive!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="card animate-fade-in-up">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Courses</p>
                <p className="text-3xl font-extrabold text-slate-900">{myCourses.length}</p>
              </div>
            </div>
          </div>
          <div className="card animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Completed</p>
                <p className="text-3xl font-extrabold text-slate-900">0</p>
              </div>
            </div>
          </div>
          <div className="card animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">In Progress</p>
                <p className="text-3xl font-extrabold text-slate-900">{myCourses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900">My Courses</h2>
            <Link href="/courses" className="text-blue-600 hover:text-blue-700 font-semibold text-sm">
              Browse More →
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="card text-center py-12">
              <span className="text-6xl mb-4 block">📚</span>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No courses yet</h3>
              <p className="text-slate-600 mb-6">Start your learning journey by enrolling in a course</p>
              <Link href="/courses" className="btn-primary inline-flex">
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.map((course, i) => (
                <div
                  key={course.id}
                  className="card-interactive group overflow-hidden animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className={`h-32 bg-gradient-to-br ${course.color} rounded-xl mb-4 flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
                    <span className="text-5xl relative z-10 group-hover:scale-110 transition-transform duration-500">
                      {course.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">By {course.instructor}</p>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <a
                    href={course.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <span>Access Course</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RK Sir's Guidance Section */}
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-6">RK Sir's Daily Motivation</h2>
          <div className="card text-center py-12">
            <span className="text-6xl mb-4 block">🎬</span>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
            <p className="text-slate-600">
              Daily motivational videos and special guidelines by RK Sir for all Bihar Board students
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}