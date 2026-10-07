/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo";
import AdPopup from "@/components/AdPopup"; // 🔥 Ad Popup Component Imported
import { 
  BookOpen, CheckCircle2, Target, ExternalLink, PlayCircle, 
  Bell, LogOut, Sparkles, Trophy, PlusCircle, Users 
} from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface StudentData {
  fullName: string;
  fatherName: string;
  mobile: string;
  email: string;
  address: string;
  role?: string;
}

const retentionData = [
  { day: "Mon", students: 120 }, { day: "Tue", students: 145 },
  { day: "Wed", students: 132 }, { day: "Thu", students: 180 },
  { day: "Fri", students: 210 }, { day: "Sat", students: 250 },
  { day: "Sun", students: 285 },
];

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
          const data = studentDoc.data() as StudentData;
          
          // 🔥 DEBUG: Console में देखें कि role क्या आ रहा है
          console.log("🔥 FIREBASE SE AAYA POORA DATA:", data);
          console.log("🔥 ROLE KI VALUE:", data.role);
          console.log("🔥 KYA ROLE 'admin' HAI?", data.role === "admin");
          
          setStudent(data);
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

  const myCourses = [
    {
      id: "math_class_10_001",
      title: "Math: Objective Masterclass",
      instructor: "RK Sir",
      progress: 35,
      totalLectures: 45,
      completedLectures: 16,
      driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      color: "from-blue-500 to-indigo-600",
      icon: "📐",
      nextClass: "Today, 5:00 PM"
    },
    {
      id: "science_class_10_001",
      title: "Science: Complete Revision",
      instructor: "RK Sir",
      progress: 12,
      totalLectures: 60,
      completedLectures: 7,
      driveLink: "https://drive.google.com/drive/folders/YOUR_FOLDER_ID",
      color: "from-purple-500 to-pink-600",
      icon: "🔬",
      nextClass: "Tomorrow, 4:00 PM"
    },
  ];

  const row1Images = ["/class1.jpg", "/class2.jpg", "/class3.jpg", "/class4.jpg", "/class5.jpg"];
  const row2Images = ["/student1.jpg", "/student2.jpg", "/student3.jpg", "/student4.jpg", "/student5.jpg"];

  if (!authChecked || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
          <p className="text-slate-600 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-slate-600 text-lg">Unable to load student data</p>
          <button 
            onClick={() => window.location.replace("/")} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden font-sans">
      
      {/* 🎯 AD POPUP COMPONENT (Site load hone par automatically aayega) */}
      <AdPopup />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee { animation: marquee 45s linear infinite; will-change: transform; }
        .animate-marquee-reverse { animation: marquee-reverse 45s linear infinite; will-change: transform; }
        .animate-marquee:hover, .animate-marquee-reverse:hover { animation-play-state: paused; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
      `}</style>

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Logo size="medium" showText={true} />
            <div className="flex items-center gap-3 sm:gap-6">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{student.fullName}</p>
                  <p className="text-xs text-slate-500">{student.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {student.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 border border-red-100 hover:border-red-200">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* 🚨 ADMIN DASHBOARD SECTION (Sirf Admin ko dikhega) */}
        {student?.role === "admin" && (
          <section className="mb-12 animate-fade-in-up bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold mb-3 border border-indigo-100">
                  <Sparkles className="w-4 h-4" /> Creator Mode
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h2>
                <p className="text-slate-500 text-sm">Welcome back, RK Sir. Here is your platform overview.</p>
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                <PlusCircle className="w-5 h-5" /> Create New Post / Class
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-slate-50 rounded-2xl p-4 sm:p-6 border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Student Retention & Daily Active Users</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={retentionData}>
                      <defs>
                        <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                      <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
                  <p className="text-blue-100 text-sm font-medium mb-1 flex items-center gap-2"><Users className="w-4 h-4"/> Total Enrolled Students</p>
                  <p className="text-3xl sm:text-4xl font-extrabold">12,450+</p>
                  <p className="text-blue-200 text-xs mt-2">↑ 12% from last month</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <p className="text-slate-500 text-sm font-medium mb-1">Active Courses</p>
                  <p className="text-3xl font-extrabold text-slate-900">8</p>
                  <p className="text-slate-400 text-xs mt-2">Matric & Inter Batches</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STUDENT DASHBOARD SECTION (Sabko dikhega) */}
        <div className="animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-4 border border-blue-100">
            <Sparkles className="w-4 h-4" />
            <span>Student Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-3 leading-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{student.fullName.split(" ")[0]}</span> 👋
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl">
            Continue your learning journey with RK Sir. Stay consistent, and let us make today productive!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {[
            { icon: BookOpen, label: "Total Courses", value: myCourses.length, color: "bg-blue-50 text-blue-600", delay: "0s" },
            { icon: CheckCircle2, label: "Completed", value: "0", color: "bg-green-50 text-green-600", delay: "0.1s" },
            { icon: Target, label: "In Progress", value: myCourses.length, color: "bg-purple-50 text-purple-600", delay: "0.2s" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" 
              style={{ animationDelay: stat.delay }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* My Courses Section */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">My Enrolled Courses</h2>
              <p className="text-slate-500 text-sm mt-1">Pick up where you left off</p>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors group bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl w-fit">
              Browse All Courses
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map((course, i) => (
              <div
                key={course.id}
                className="group bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 animate-fade-in-up"
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}
              >
                <div className={`h-40 bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all duration-500" />
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/30">
                    {course.nextClass}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-2xl filter">
                      {course.icon}
                    </span>
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-1 line-clamp-1">{course.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                    By {course.instructor}
                  </p>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-xs text-slate-600 mb-2 font-semibold">
                      <span>Course Progress</span>
                      <span className="text-blue-600">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${course.color} h-3 rounded-full transition-all duration-1000 ease-out relative`}
                        style={{ width: `${course.progress}%` }}
                      >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 text-right">
                      {course.completedLectures} / {course.totalLectures} Lectures
                    </p>
                  </div>

                  <a
                    href={course.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-semibold py-3.5 rounded-xl hover:bg-slate-800 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-slate-900/20"
                  >
                    <PlayCircle className="w-5 h-5" />
                    <span>Continue Learning</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🎬 Cinematic Infinite Scrolling Gallery */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">Life at World of Concept</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Glimpses of our classrooms, interactive sessions, and student success stories</p>
          </div>

          <div className="relative w-full overflow-hidden py-6">
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            {/* ROW 1 */}
            <div className="flex gap-5 w-max animate-marquee mb-6">
              {[...row1Images, ...row1Images, ...row1Images].map((src, i) => (
                <div 
                  key={`row1-${i}`} 
                  className="relative w-72 sm:w-80 h-52 rounded-2xl overflow-hidden group flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <Image 
                    src={src} 
                    alt={`Gallery Row 1 Image ${i}`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" /> World of Concept Class
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ROW 2 */}
            <div className="flex gap-5 w-max animate-marquee-reverse">
              {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
                <div 
                  key={`row2-${i}`} 
                  className="relative w-72 sm:w-80 h-52 rounded-2xl overflow-hidden group flex-shrink-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <Image 
                    src={src} 
                    alt={`Gallery Row 2 Image ${i}`} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" /> Student Success Story
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RK Sir Guidance Section */}
        <div className="animate-fade-in-up mb-12" style={{ animationDelay: "0.8s" }}>
          <div className="relative bg-gradient-to-br from-indigo-600 to-blue-700 rounded-3xl p-8 sm:p-12 text-center text-white overflow-hidden shadow-2xl shadow-indigo-900/20">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-xl">
                <PlayCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Daily Motivation by RK Sir</h2>
              <p className="text-blue-100 text-lg leading-relaxed mb-8">
                "Success is not final, failure is not fatal: it is the courage to continue that counts." 
                <br />
                <span className="text-sm font-semibold text-blue-200 mt-2 block">Special guidelines and motivational videos coming soon to keep you inspired!</span>
              </p>
              <button className="px-8 py-3.5 bg-white text-indigo-700 rounded-xl font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center gap-2 mx-auto">
                <Bell className="w-5 h-5" />
                Notify Me When Live
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}