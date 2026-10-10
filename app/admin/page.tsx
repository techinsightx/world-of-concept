/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo";
import { 
  Sparkles, PlusCircle, Users, ArrowLeft, LogOut, 
  TrendingUp, DollarSign, Activity, Clock, Star, BookOpen
} from "lucide-react";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, 
  BarChart, Bar, Cell 
} from "recharts";

interface AdminData {
  fullName: string;
  email: string;
  role?: string;
}

// 🔥 Cinematic Mock Data for Impressive Results
const revenueData = [
  { month: "जन", revenue: 45000, students: 120 },
  { month: "फर", revenue: 52000, students: 145 },
  { month: "मार", revenue: 48000, students: 132 },
  { month: "अप्रै", revenue: 61000, students: 180 },
  { month: "मई", revenue: 75000, students: 210 },
  { month: "जून", revenue: 92000, students: 285 },
];

const recentActivity = [
  { id: 1, user: "आर्यन कुमार", action: "गणित मास्टरक्लास में नामांकन", time: "2 मिनट पहले", icon: "🎓" },
  { id: 2, user: "प्रिया सिंह", action: "विज्ञान मॉक टेस्ट पूरा किया", time: "15 मिनट पहले", icon: "✅" },
  { id: 3, user: "राहुल वर्मा", action: "नया अकाउंट बनाया", time: "1 घंटा पहले", icon: "👤" },
  { id: 4, user: "सिमरन कौर", action: "इंटर टॉपर बैच जॉइन किया", time: "2 घंटे पहले", icon: "🔥" },
];

const topCourses = [
  { title: "गणित: ऑब्जेक्टिव मास्टरक्लास", students: 1240, revenue: "₹6.2L", progress: 85, color: "bg-blue-500" },
  { title: "विज्ञान: संपूर्ण रिवीजन", students: 980, revenue: "₹6.8L", progress: 72, color: "bg-purple-500" },
  { title: "इंटर: संपूर्ण टॉपर बैच", students: 750, revenue: "₹7.4L", progress: 60, color: "bg-indigo-500" },
];

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        window.location.replace("/");
        return;
      }
      
      try {
        const userDoc = await getDoc(doc(db, "students", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as AdminData;
          if (data.role?.trim().toLowerCase() !== "admin") {
            window.location.replace("/dashboard");
            return;
          }
          setAdminData(data);
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        console.error("Error fetching admin data:", error);
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

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-indigo-500/30 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/50">
              <span className="text-5xl">🛡️</span>
            </div>
          </div>
          <p className="text-slate-300 font-medium animate-pulse tracking-wider">ADMIN COMMAND CENTER लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!adminData) return null;

  return (
    <div className="min-h-[100dvh] bg-slate-50 relative font-sans w-full overflow-x-hidden">
      
      {/* 🔥 Cinematic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-slate-50 to-slate-50" />
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Header */}
      <header className="relative z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-2 hover:bg-slate-100 rounded-full transition-colors group" title="Student View">
                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:-translate-x-1 transition-transform" />
              </Link>
              <Logo size="medium" showText={true} />
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full border border-indigo-200">
                <Sparkles className="w-3 h-3" /> ADMIN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 text-right">
                <div>
                  <p className="text-sm font-bold text-slate-900">{adminData.fullName}</p>
                  <p className="text-xs text-indigo-600 font-semibold">Super Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 ring-2 ring-white">
                  {adminData.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-100 hover:border-red-200">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Welcome & Action Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              स्वागत है, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{adminData.fullName}</span> 👋
            </h1>
            <p className="text-slate-500 mt-2 text-lg">यहाँ आपका प्लेटफ़ॉर्म का रियल-टाइम अवलोकन और एनालिटिक्स है।</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-xl shadow-indigo-500/30 hover:scale-105 active:scale-95 group">
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" /> 
            नया कोर्स / पोस्ट बनाएं
          </button>
        </div>

        {/* 🔥 Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "कुल नामांकित छात्र", value: "12,450+", change: "+12% इस महीने", icon: Users, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
            { label: "आज सक्रिय (Active)", value: "1,284", change: "अभी ऑनलाइन", icon: Activity, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
            { label: "अनुमानित राजस्व", value: "₹20.4L", change: "+8% पिछले माह", icon: DollarSign, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
            { label: "औसत पूर्णता दर", value: "68%", change: "सभी कोर्सेस", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bg} border ${stat.border}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-extrabold text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* 🔥 Main Content: Charts & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                राजस्व और छात्र वृद्धि (6 महीने)
              </h3>
              <select className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                <option>पिछले 6 महीने</option>
                <option>इस वर्ष</option>
              </select>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', background: '#fff'}}
                    formatter={(value) => [`₹${value}`, 'राजस्व']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              हाल की गतिविधियाँ
            </h3>
            <div className="space-y-6">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.user}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.action}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2.5 text-sm font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors">
              सभी गतिविधियाँ देखें
            </button>
          </div>
        </div>

        {/* 🔥 Top Performing Courses */}
        <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            टॉप परफॉर्मिंग कोर्सेस
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topCourses.map((course, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${course.color} bg-opacity-10 flex items-center justify-center`}>
                    <BookOpen className={`w-6 h-6 ${course.color.replace('bg-', 'text-')}`} />
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{course.students} छात्र</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{course.title}</h4>
                <p className="text-sm text-slate-500 mb-4">कुल राजस्व: <span className="font-semibold text-slate-900">{course.revenue}</span></p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-medium text-slate-600">
                    <span>सिलेबस कवरेज</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${course.color} rounded-full transition-all duration-1000`} style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}