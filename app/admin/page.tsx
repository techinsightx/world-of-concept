/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  doc, getDoc, collection, addDoc, serverTimestamp, 
  query, orderBy, limit, getDocs
} from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo";
import { 
  Sparkles, PlusCircle, Users, ArrowLeft, LogOut, 
  TrendingUp, DollarSign, Activity, Clock, Star, BookOpen,
  Upload, X, CheckCircle, AlertCircle
} from "lucide-react";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  Legend, CartesianGrid
} from "recharts";

interface AdminData {
  fullName: string;
  email: string;
  role?: string;
}

interface CourseData {
  id: string;
  title: string;
  price: string;
  badge: string;
  description: string;
  imageUrl: string;
  createdAt: any;
}

interface UpdateData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  type: "announcement" | "motivation" | "tip";
  createdAt: any;
}

interface ActivityData {
  id: string;
  action: string;
  details: string;
  timestamp: any;
}

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "posts" | "students">("overview");
  
  // Real-time stats
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [updates, setUpdates] = useState<UpdateData[]>([]);

  // Form states
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Course form
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseBadge, setCourseBadge] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseImage, setCourseImage] = useState<File | null>(null);

  // Post form
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postType, setPostType] = useState<"announcement" | "motivation" | "tip">("announcement");
  const [postImage, setPostImage] = useState<File | null>(null);

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
          await fetchAllData();
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

  const fetchAllData = async () => {
    try {
      const studentsQuery = query(collection(db, "students"));
      const studentsSnapshot = await getDocs(studentsQuery);
      setTotalStudents(studentsSnapshot.size);

      const coursesQuery = query(collection(db, "courses"), orderBy("createdAt", "desc"));
      const coursesSnapshot = await getDocs(coursesQuery);
      const coursesData = coursesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CourseData[];
      setCourses(coursesData);
      setTotalCourses(coursesData.length);

      const revenue = coursesData.reduce((sum, course) => {
        const price = parseInt(course.price.replace(/[^0-9]/g, '')) || 0;
        return sum + (price * 50);
      }, 0);
      setTotalRevenue(revenue);

      const updatesQuery = query(collection(db, "updates"), orderBy("createdAt", "desc"), limit(10));
      const updatesSnapshot = await getDocs(updatesQuery);
      const updatesData = updatesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as UpdateData[];
      setUpdates(updatesData);

      const activitiesQuery = query(collection(db, "activity"), orderBy("timestamp", "desc"), limit(10));
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activitiesData = activitiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ActivityData[];
      setRecentActivities(activitiesData);

      const mockGrowthData = [
        { month: "जन", revenue: 45000, students: 120 },
        { month: "फर", revenue: 52000, students: 145 },
        { month: "मार", revenue: 48000, students: 132 },
        { month: "अप्रै", revenue: 61000, students: 180 },
        { month: "मई", revenue: 75000, students: 210 },
        { month: "जून", revenue: 92000, students: 285 },
      ];
      setGrowthData(mockGrowthData);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    window.location.replace("/");
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "world_of_concept");
    
    setUploading(true);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!courseTitle || !coursePrice || !courseBadge || !courseDesc || !courseImage) {
      setErrorMsg("सभी फील्ड्स भरें और image upload करें।");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(courseImage);
      await addDoc(collection(db, "courses"), {
        title: courseTitle,
        price: coursePrice,
        badge: courseBadge,
        description: courseDesc,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, "activity"), {
        action: "नया कोर्स जोड़ा गया",
        details: courseTitle,
        timestamp: serverTimestamp(),
      });

      setSuccessMsg("कोर्स सफलतापूर्वक जोड़ा गया!");
      setCourseTitle(""); setCoursePrice(""); setCourseBadge(""); setCourseDesc(""); setCourseImage(null);
      setShowCourseForm(false);
      await fetchAllData();
    } catch (error) {
      console.error("Error adding course:", error);
      setErrorMsg("कोर्स जोड़ने में त्रुटि। कृपया पुनः प्रयास करें।");
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!postTitle || !postDesc) {
      setErrorMsg("शीर्षक और विवरण भरें।");
      return;
    }

    try {
      let imageUrl = "";
      if (postImage) {
        imageUrl = await uploadToCloudinary(postImage);
      }
      
      await addDoc(collection(db, "updates"), {
        title: postTitle,
        description: postDesc,
        imageUrl,
        type: postType,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(db, "activity"), {
        action: "नई पोस्ट जोड़ी गई",
        details: postTitle,
        timestamp: serverTimestamp(),
      });

      setSuccessMsg("पोस्ट सफलतापूर्वक जोड़ी गई!");
      setPostTitle(""); setPostDesc(""); setPostType("announcement"); setPostImage(null);
      setShowPostForm(false);
      await fetchAllData();
    } catch (error) {
      console.error("Error adding post:", error);
      setErrorMsg("पोस्ट जोड़ने में त्रुटि। कृपया पुनः प्रयास करें।");
    }
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
    <div className="min-h-[100dvh] bg-slate-950 text-slate-50 relative font-sans w-full overflow-x-hidden">
      
      <style jsx global>{`
        @keyframes ken-burns-right {
          0% { transform: translateX(0) scale(1.15); }
          100% { transform: translateX(-5%) scale(1.2); }
        }
        @keyframes ken-burns-left {
          0% { transform: translateX(-5%) scale(1.2); }
          100% { transform: translateX(0) scale(1.15); }
        }
        .bg-slide-right {
          animation: ken-burns-right 60s ease-in-out infinite alternate;
          will-change: transform;
        }
        .bg-slide-left {
          animation: ken-burns-left 65s ease-in-out infinite alternate;
          will-change: transform;
        }
      `}</style>

      {/* 🔥 DARK HEADER */}
      <header className="relative z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-full transition-colors group" title="Student View">
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 group-hover:text-white transition-all" />
              </Link>
              <Logo size="medium" showText={true} />
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold rounded-full border border-indigo-500/20">
                <Sparkles className="w-3 h-3" /> ADMIN
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3 text-right">
                <div>
                  <p className="text-sm font-bold text-white">{adminData.fullName}</p>
                  <p className="text-xs text-indigo-400 font-semibold">Super Administrator</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 ring-2 ring-slate-950">
                  {adminData.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/30 hover:border-red-400/50">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 MAIN CONTENT with CINEMATIC BACKGROUND */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Subtle Ken Burns Background for Main Area */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-slide-right">
            <Image src="/gallery2.jpg" alt="Admin Background" fill className="object-cover opacity-30" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/85 to-slate-950/95" />
        </div>

        {/* Welcome & Tabs */}
        <div className="relative z-10 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            स्वागत है, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{adminData.fullName}</span> 👋
          </h1>
          <p className="text-slate-400 text-lg">यहाँ आपका प्लेटफ़ॉर्म का complete management system है।</p>
          
          <div className="flex gap-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: "overview", label: "अवलोकन", icon: TrendingUp },
              { id: "courses", label: "कोर्सेस", icon: BookOpen },
              { id: "posts", label: "अपडेट्स", icon: Sparkles },
              { id: "students", label: "छात्र", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { label: "कुल छात्र", value: totalStudents.toLocaleString(), change: "+12%", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { label: "सक्रिय कोर्सेस", value: totalCourses.toString(), change: "+2", icon: BookOpen, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
                { label: "कुल राजस्व", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, change: "+8%", icon: DollarSign, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
                { label: "औसत वृद्धि", value: "68%", change: "+5%", icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              ].map((stat, i) => (
                <div key={i} className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl border ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">{stat.change}</span>
                  </div>
                  <p className="text-sm text-slate-400 font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-lg mb-8">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                राजस्व और छात्र वृद्धि (6 महीने)
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#f8fafc' }}
                      labelStyle={{ color: '#94a3b8' }}
                    />
                    <Legend wrapperStyle={{ color: '#94a3b8' }} />
                    <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="राजस्व (₹)" dot={{ r: 6, fill: '#3b82f6' }} />
                    <Line type="monotone" dataKey="students" stroke="#10b981" strokeWidth={3} name="छात्र" dot={{ r: 6, fill: '#10b981' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-indigo-400" />
                हाल की गतिविधियाँ
              </h3>
              <div className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">कोई गतिविधि नहीं</p>
                ) : (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-white">{activity.action}</p>
                        <p className="text-sm text-slate-300">{activity.details}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {activity.timestamp?.toDate().toLocaleString("hi-IN")}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Courses Tab */}
        {activeTab === "courses" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">कोर्सेस प्रबंधन</h2>
              
              {/* 🔥 HIGHLY VISIBLE GLOWING BUTTON */}
              <button
                onClick={() => setShowCourseForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] hover:scale-105 active:scale-95 border border-indigo-400/50"
              >
                <PlusCircle className="w-5 h-5" /> नया कोर्स जोड़ें
              </button>
            </div>

            {showCourseForm && (
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">नया कोर्स जोड़ें</h3>
                  <button onClick={() => setShowCourseForm(false)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> {successMsg}
                  </div>
                )}

                <form onSubmit={handleAddCourse} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">कोर्स शीर्षक</label>
                    <input
                      type="text"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="जैसे: गणित मास्टरक्लास"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">मूल्य</label>
                      <input
                        type="text"
                        value={coursePrice}
                        onChange={(e) => setCoursePrice(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                        placeholder="₹499"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">बैज</label>
                      <input
                        type="text"
                        value={courseBadge}
                        onChange={(e) => setCourseBadge(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                        placeholder="कक्षा 10"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">विवरण</label>
                    <textarea
                      value={courseDesc}
                      onChange={(e) => setCourseDesc(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      rows={3}
                      placeholder="कोर्स का विस्तृत विवरण..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">कोर्स इमेज</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCourseImage(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> अपलोड हो रहा है...</>
                    ) : (
                      <><Upload className="w-5 h-5" /> कोर्स जोड़ें</>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-indigo-500/50 transition-all">
                  <div className="relative h-48">
                    <Image src={course.imageUrl} alt={course.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                  </div>
                  <div className="p-5">
                    <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-full mb-2">
                      {course.badge}
                    </span>
                    <h3 className="font-bold text-white mb-2">{course.title}</h3>
                    <p className="text-sm text-slate-400 mb-3 line-clamp-2">{course.description}</p>
                    <p className="text-xl font-extrabold text-indigo-400">{course.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-white">अपडेट्स प्रबंधन</h2>
              
              {/* 🔥 HIGHLY VISIBLE GLOWING BUTTON */}
              <button
                onClick={() => setShowPostForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_30px_rgba(79,70,229,0.7)] hover:scale-105 active:scale-95 border border-indigo-400/50"
              >
                <PlusCircle className="w-5 h-5" /> नई पोस्ट जोड़ें
              </button>
            </div>

            {showPostForm && (
              <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-xl mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-white">नई पोस्ट जोड़ें</h3>
                  <button onClick={() => setShowPostForm(false)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" /> {errorMsg}
                  </div>
                )}
                {successMsg && (
                  <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" /> {successMsg}
                  </div>
                )}

                <form onSubmit={handleAddPost} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">पोस्ट प्रकार</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value as any)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="announcement">📢 घोषणा</option>
                      <option value="motivation">💪 प्रेरणा</option>
                      <option value="tip">💡 टिप</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">शीर्षक</label>
                    <input
                      type="text"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      placeholder="पोस्ट का शीर्षक"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">विवरण</label>
                    <textarea
                      value={postDesc}
                      onChange={(e) => setPostDesc(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all"
                      rows={4}
                      placeholder="पोस्ट का विस्तृत विवरण..."
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">इमेज (वैकल्पिक)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setPostImage(e.target.files?.[0] || null)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> अपलोड हो रहा है...</>
                    ) : (
                      <><Upload className="w-5 h-5" /> पोस्ट जोड़ें</>
                    )}
                  </button>
                </form>
              </div>
            )}

            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-indigo-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    {update.imageUrl && (
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700">
                        <Image src={update.imageUrl} alt={update.title} fill className="object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-2 ${
                        update.type === "announcement" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        update.type === "motivation" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                        "bg-green-500/10 text-green-400 border border-green-500/20"
                      }`}>
                        {update.type === "announcement" ? "📢 घोषणा" : update.type === "motivation" ? "💪 प्रेरणा" : "💡 टिप"}
                      </span>
                      <h3 className="font-bold text-white mb-1">{update.title}</h3>
                      <p className="text-sm text-slate-300">{update.description}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {update.createdAt?.toDate().toLocaleString("hi-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="bg-slate-800/60 backdrop-blur-md rounded-2xl p-6 border border-slate-700/50 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">कुल छात्र: <span className="text-indigo-400">{totalStudents}</span></h2>
            <p className="text-slate-400">छात्र प्रबंधन system जल्द ही उपलब्ध होगा।</p>
          </div>
        )}

      </main>
    </div>
  );
}