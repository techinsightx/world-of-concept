/* eslint-disable */
"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { 
  doc, getDoc, collection, addDoc, serverTimestamp, 
  query, orderBy, limit, getDocs
} from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import DynamicBackground from "@/components/DynamicBackground";
import MagneticButton from "@/components/MagneticButton";
import { 
  Sparkles, PlusCircle, Users, ArrowLeft, LogOut, 
  TrendingUp, DollarSign, Activity, Clock, BookOpen,
  Upload, X, CheckCircle, AlertCircle, ShieldCheck
} from "lucide-react";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  Legend, CartesianGrid
} from "recharts";

// ==============================
// TYPES & INTERFACES
// ==============================

interface AdminData { fullName: string; email: string; role?: string; }
interface CourseData { id: string; title: string; price: string; badge: string; description: string; imageUrl: string; createdAt: any; }
interface UpdateData { id: string; title: string; description: string; imageUrl?: string; type: "announcement" | "motivation" | "tip"; createdAt: any; }
interface ActivityData { id: string; action: string; details: string; timestamp: any; }

// ==============================
// STATIC ASSETS / DATA
// ==============================

const ADMIN_BG_IMAGES = ["/gallery2.jpg", "/gallery5.jpg", "/gallery8.jpg"];
const FORM_BG_IMAGES = ["/gallery1.jpg", "/gallery4.jpg", "/gallery7.jpg"];

export default function AdminDashboardPage() {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "posts" | "students">("overview");
  
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [growthData, setGrowthData] = useState<any[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityData[]>([]);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [updates, setUpdates] = useState<UpdateData[]>([]);

  // Form States
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Course Form Fields
  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseBadge, setCourseBadge] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseImage, setCourseImage] = useState<File | null>(null);

  // Post Form Fields
  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postType, setPostType] = useState<"announcement" | "motivation" | "tip">("announcement");
  const [postImage, setPostImage] = useState<File | null>(null);

  // ==============================
  // AUTH GUARD & DATA FETCH
  // ==============================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { window.location.replace("/"); return; }
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
        console.error("Error:", error);
        window.location.replace("/");
      } finally { 
        setLoading(false); 
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    try {
      // Fetch Students Count
      const studentsSnapshot = await getDocs(query(collection(db, "students")));
      setTotalStudents(studentsSnapshot.size);

      // Fetch Courses
      const coursesSnapshot = await getDocs(query(collection(db, "courses"), orderBy("createdAt", "desc")));
      const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CourseData[];
      setCourses(coursesData);
      setTotalCourses(coursesData.length);

      // Calculate Revenue (Mock Logic: Price * Estimated Sales)
      const revenue = coursesData.reduce((sum, course) => {
        const price = parseInt(course.price.replace(/[^0-9]/g, '')) || 0;
        return sum + (price * 50); // Assuming avg 50 sales per course for demo
      }, 0);
      setTotalRevenue(revenue);

      // Fetch Updates
      const updatesSnapshot = await getDocs(query(collection(db, "updates"), orderBy("createdAt", "desc"), limit(10)));
      setUpdates(updatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UpdateData[]);

      // Fetch Recent Activities
      const activitiesSnapshot = await getDocs(query(collection(db, "activity"), orderBy("timestamp", "desc"), limit(10)));
      setRecentActivities(activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ActivityData[]);

      // Mock Growth Data for Chart
      setGrowthData([
        { month: "जन", revenue: 45000, students: 120 },
        { month: "फर", revenue: 52000, students: 145 },
        { month: "मार", revenue: 48000, students: 132 },
        { month: "अप्रै", revenue: 61000, students: 180 },
        { month: "मई", revenue: 75000, students: 210 },
        { month: "जून", revenue: 92000, students: 285 },
      ]);
    } catch (error) { 
      console.error("Error fetching data:", error); 
    }
  };

  const handleLogout = async () => { 
    await auth.signOut(); 
    window.location.replace("/"); 
  };

  // ==============================
  // UPLOAD & ADD LOGIC
  // ==============================

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "world_of_concept");
    setUploading(true);
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST", body: formData
      });
      const data = await response.json();
      return data.secure_url;
    } catch (error) { 
      console.error("Upload error:", error); 
      throw error; 
    }
    finally { 
      setUploading(false); 
    }
  };

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    if (!courseTitle || !coursePrice || !courseBadge || !courseDesc || !courseImage) {
      setErrorMsg("कृपया सभी फील्ड्स भरें और एक image select करें।");
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
        createdAt: serverTimestamp() 
      });
      await addDoc(collection(db, "activity"), { 
        action: "नया कोर्स जोड़ा गया", 
        details: courseTitle, 
        timestamp: serverTimestamp() 
      });
      
      setSuccessMsg("✅ कोर्स सफलतापूर्वक जोड़ा गया!");
      setCourseTitle(""); setCoursePrice(""); setCourseBadge(""); setCourseDesc(""); setCourseImage(null);
      setTimeout(() => { setShowCourseForm(false); setSuccessMsg(""); }, 2000);
      await fetchAllData();
    } catch (error) { 
      setErrorMsg("❌ कोर्स जोड़नने में त्रुटि।"); 
    }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    if (!postTitle || !postDesc) { 
      setErrorMsg("कृपया शीर्षक और विवरण भरें।"); 
      return; 
    }
    try {
      let imageUrl = "";
      if (postImage) imageUrl = await uploadToCloudinary(postImage);
      
      await addDoc(collection(db, "updates"), { 
        title: postTitle, 
        description: postDesc, 
        imageUrl, 
        type: postType, 
        createdAt: serverTimestamp() 
      });
      await addDoc(collection(db, "activity"), { 
        action: "नई पोस्ट जोड़ी गई", 
        details: postTitle, 
        timestamp: serverTimestamp() 
      });
      
      setSuccessMsg("✅ पोस्ट सफलतापूर्वक जोड़ी गई!");
      setPostTitle(""); setPostDesc(""); setPostType("announcement"); setPostImage(null);
      setTimeout(() => { setShowPostForm(false); setSuccessMsg(""); }, 2000);
      await fetchAllData();
    } catch (error) { 
      setErrorMsg("❌ पोस्ट जोड़नने में त्रुटि।"); 
    }
  };

  // ==============================
  // RENDER HELPERS
  // ==============================

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center transition-colors duration-700">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-white/10 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-slate-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-2xl">
              <ShieldCheck className="w-10 h-10 text-white" />
            </div>
          </div>
          <p className="text-slate-400 font-medium tracking-wider">ADMIN COMMAND CENTER लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (!adminData) return null;

  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-slate-100 font-sans overflow-x-hidden">
      
      {/* ==============================
          HEADER (STICKY MATTE GLASS)
          ============================== */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Back & Title */}
          <div className="flex items-center gap-4">
            <MagneticButton href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            </MagneticButton>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">Admin Panel</h1>
              <p className="text-xs text-slate-500 font-medium">World of Concept</p>
            </div>
          </div>

          {/* Right: User Info & Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-right mr-2">
              <div>
                <p className="text-sm font-bold text-white">{adminData.fullName}</p>
                <p className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-slate-800">
                {adminData.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            
            <MagneticButton onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/10 rounded-lg border border-red-500/20 transition-all active:scale-95">
              <LogOut className="w-4 h-4" /> 
              <span className="hidden sm:inline">Logout</span>
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* ==============================
          MAIN CONTENT AREA
          ============================== */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Global Background Engine */}
        <DynamicBackground images={ADMIN_BG_IMAGES} zoomType="in" density={0.5} interactive={false} showGrid={false} />
        <div className="absolute inset-0 z-[1] bg-slate-950/85 backdrop-blur-sm pointer-events-none" />
        
        {/* Dual Waves Overlay */}
        <div className="wave-bg-engine z-[2]">
          <div className="wave-layer-left" />
          <div className="wave-layer-right" />
        </div>

        <div className="relative z-10 space-y-8">
          
          {/* Navigation Tabs */}
          <nav className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {[
              { id: "overview", label: "Overview", icon: TrendingUp },
              { id: "courses", label: "Courses", icon: BookOpen },
              { id: "posts", label: "Updates", icon: Sparkles },
              { id: "students", label: "Students", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { 
                    setActiveTab(tab.id as any); 
                    setShowCourseForm(false); 
                    setShowPostForm(false); 
                    setErrorMsg(""); 
                    setSuccessMsg(""); 
                  }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-300 border ${
                    isActive 
                      ? "bg-white text-slate-900 border-white shadow-lg" 
                      : "bg-slate-900/50 text-slate-400 border-white/10 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" /> 
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* ==============================
              TAB: OVERVIEW
              ============================== */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { label: "कुल छात्र", value: totalStudents.toLocaleString(), change: "+12%", icon: Users, color: "text-blue-400" },
                  { label: "सक्रिय कोर्स", value: totalCourses.toString(), change: "+2", icon: BookOpen, color: "text-green-400" },
                  { label: "कुल राजस्व", value: `₹${(totalRevenue / 100000).toFixed(1)}L`, change: "+8%", icon: DollarSign, color: "text-purple-400" },
                  { label: "औसत वृद्धि", value: "68%", change: "+5%", icon: TrendingUp, color: "text-amber-400" },
                ].map((stat, i) => (
                  <div key={i} className="matte-card p-5 sm:p-6 group hover:border-white/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-slate-800/50 border border-white/5 ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mb-1 uppercase tracking-wide">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Growth Chart */}
              <div className="matte-card p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" /> 
                  Revenue & Student Growth (Last 6 Months)
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis 
                        dataKey="month" 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#94a3b8" 
                        fontSize={12} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `${value/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          borderColor: 'rgba(255,255,255,0.1)', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                        itemStyle={{ color: '#fff' }}
                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                      />
                      <Legend wrapperStyle={{ paddingTop: '20px', color: '#cbd5e1' }} />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#818cf8" 
                        strokeWidth={3} 
                        name="राजस्व (₹)" 
                        dot={{ r: 4, fill: '#818cf8', stroke: '#0f172a', strokeWidth: 2 }} 
                        activeDot={{ r: 6, stroke: '#818cf8', strokeWidth: 2 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="students" 
                        stroke="#34d399" 
                        strokeWidth={3} 
                        name="छात्र" 
                        dot={{ r: 4, fill: '#34d399', stroke: '#0f172a', strokeWidth: 2 }} 
                        activeDot={{ r: 6, stroke: '#34d399', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="matte-card p-6 sm:p-8">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-400" /> 
                  हाल की गतिविधियाँ
                </h3>
                <div className="space-y-4">
                  {recentActivities.length === 0 ? (
                    <p className="text-slate-500 text-center py-8 italic">कोई गतिविधि दर्ज नहीं हुई।</p>
                  ) : (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <Activity className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-white text-sm sm:text-base truncate">{activity.action}</p>
                          <p className="text-xs sm:text-sm text-slate-400 mt-0.5 line-clamp-1">{activity.details}</p>
                          <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> 
                            {activity.timestamp?.toDate().toLocaleString("hi-IN")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==============================
              TAB: COURSES
              ============================== */}
          {activeTab === "courses" && (
            <div className="space-y-6 animate-fade-in-up">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-black text-white">कोर्सेज प्रबंधन</h2>
                <MagneticButton 
                  onClick={() => { setShowCourseForm(!showCourseForm); setErrorMsg(""); setSuccessMsg(""); }} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" /> 
                  {showCourseForm ? "बंद करें" : "नया कोर्स जोड़ें"}
                </MagneticButton>
              </div>

              {/* Add Course Form Modal/Card */}
              {showCourseForm && (
                <div className="matte-card p-6 sm:p-8 relative overflow-hidden">
                  {/* Subtle BG for Form */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <DynamicBackground images={FORM_BG_IMAGES} zoomType="out" density={0.3} interactive={false} showGrid={false} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" /> नया कोर्स विवरण
                      </h3>
                      <button onClick={() => setShowCourseForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                    
                    {errorMsg && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                      </div>
                    )}
                    {successMsg && (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" /> {successMsg}
                      </div>
                    )}
                    
                    <form onSubmit={handleAddCourse} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">कोर्स शीर्षक *</label>
                          <input 
                            type="text" 
                            value={courseTitle} 
                            onChange={(e) => setCourseTitle(e.target.value)} 
                            className="input-matte" 
                            placeholder="जैसे: गणित मास्टरक्लास" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">बैज *</label>
                          <input 
                            type="text" 
                            value={courseBadge} 
                            onChange={(e) => setCourseBadge(e.target.value)} 
                            className="input-matte" 
                            placeholder="जैसे: कक्षा 10" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">मूल्य *</label>
                          <input 
                            type="text" 
                            value={coursePrice} 
                            onChange={(e) => setCoursePrice(e.target.value)} 
                            className="input-matte" 
                            placeholder="जैसे: ₹499" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">कोर्स इमेज *</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => setCourseImage(e.target.files?.[0] || null)} 
                            className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-gray-100 transition-all cursor-pointer" 
                            required 
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">विवरण *</label>
                        <textarea 
                          value={courseDesc} 
                          onChange={(e) => setCourseDesc(e.target.value)} 
                          className="input-matte resize-none h-24" 
                          rows={3} 
                          placeholder="कोर्स का विस्तृत विवरण..." 
                          required 
                        />
                      </div>
                      
                      <MagneticButton 
                        type="submit" 
                        disabled={uploading} 
                        className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> 
                            अपलोड हो रहा है...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" /> 
                            कोर्स सेव करें
                          </>
                        )}
                      </MagneticButton>
                    </form>
                  </div>
                </div>
              )}

              {/* Courses List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-slate-500">
                    अभी कोई कोर्स उपलब्ध नहीं है। ऊपर "नया कोर्स जोड़ें" दबाएं।
                  </div>
                ) : (
                  courses.map((course) => (
                    <div key={course.id} className="matte-card overflow-hidden group">
                      <div className="relative h-48 overflow-hidden">
                        <Image 
                          src={course.imageUrl} 
                          alt={course.title} 
                          fill 
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-[10px] font-bold shadow-md border border-blue-500/30">
                            {course.badge}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-white text-lg mb-2 line-clamp-1">{course.title}</h3>
                        <p className="text-slate-400 text-sm mb-4 line-clamp-2 h-10">{course.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <p className="text-xl font-black text-white">{course.price}</p>
                          <button className="text-xs font-bold text-slate-500 hover:text-white transition-colors">Edit</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==============================
              TAB: POSTS (UPDATES)
              ============================== */}
          {activeTab === "posts" && (
            <div className="space-y-6 animate-fade-in-up">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-black text-white">अपडेट्स प्रबंधन</h2>
                <MagneticButton 
                  onClick={() => { setShowPostForm(!showPostForm); setErrorMsg(""); setSuccessMsg(""); }} 
                  className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all active:scale-95"
                >
                  <PlusCircle className="w-5 h-5" /> 
                  {showPostForm ? "बंद करें" : "नई पोस्ट जोड़ें"}
                </MagneticButton>
              </div>

              {/* Add Post Form */}
              {showPostForm && (
                <div className="matte-card p-6 sm:p-8 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-10 pointer-events-none">
                     <DynamicBackground images={FORM_BG_IMAGES} zoomType="in" density={0.3} interactive={false} showGrid={false} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-400" /> नई पोस्ट विवरण
                      </h3>
                      <button onClick={() => setShowPostForm(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>
                    
                    {errorMsg && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4" /> {errorMsg}
                      </div>
                    )}
                    {successMsg && (
                      <div className="bg-green-500/10 border border-green-500/20 text-green-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4" /> {successMsg}
                      </div>
                    )}
                    
                    <form onSubmit={handleAddPost} className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">पोस्ट प्रकार</label>
                        <select 
                          value={postType} 
                          onChange={(e) => setPostType(e.target.value as any)} 
                          className="input-matte appearance-none cursor-pointer"
                        >
                          <option value="announcement">📢 घोषणा</option>
                          <option value="motivation">💪 प्रेरणा</option>
                          <option value="tip">💡 टिप</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">शीर्षक *</label>
                        <input 
                          type="text" 
                          value={postTitle} 
                          onChange={(e) => setPostTitle(e.target.value)} 
                          className="input-matte" 
                          placeholder="पोस्ट का शीर्षक" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">विवरण *</label>
                        <textarea 
                          value={postDesc} 
                          onChange={(e) => setPostDesc(e.target.value)} 
                          className="input-matte resize-none h-32" 
                          rows={4} 
                          placeholder="पोस्ट का विस्तृत विवरण..." 
                          required 
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">इमेज (वैकल्पिक)</label>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => setPostImage(e.target.files?.[0] || null)} 
                          className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white file:text-slate-900 hover:file:bg-gray-100 transition-all cursor-pointer" 
                        />
                      </div>
                      
                      <MagneticButton 
                        type="submit" 
                        disabled={uploading} 
                        className="w-full flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-3.5 rounded-xl shadow-lg hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                      >
                        {uploading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> 
                            अपलोड हो रहा है...
                          </>
                        ) : (
                          <>
                            <Upload className="w-5 h-5" /> 
                            पोस्ट सेव करें
                          </>
                        )}
                      </MagneticButton>
                    </form>
                  </div>
                </div>
              )}

              {/* Updates List */}
              <div className="space-y-4">
                {updates.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    अभी कोई अपडेट नहीं है।
                  </div>
                ) : (
                  updates.map((update) => (
                    <div key={update.id} className="matte-card p-5 sm:p-6 flex items-start gap-4 group hover:border-white/15 transition-all">
                      {update.imageUrl && (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-white/20 transition-colors">
                          <Image 
                            src={update.imageUrl} 
                            alt={update.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition-transform duration-500" 
                            sizes="100px"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            update.type === "announcement" ? "bg-blue-500/10 text-blue-300 border-blue-500/20" :
                            update.type === "motivation" ? "bg-purple-500/10 text-purple-300 border-purple-500/20" :
                            "bg-green-500/10 text-green-300 border-green-500/20"
                          }`}>
                            {update.type === "announcement" ? "📢 घोषणा" : update.type === "motivation" ? "💪 प्रेरणा" : "💡 टिप"}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {update.createdAt?.toDate().toLocaleDateString("hi-IN", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base sm:text-lg mb-1 line-clamp-1">{update.title}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2">{update.description}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ==============================
              TAB: STUDENTS
              ============================== */}
          {activeTab === "students" && (
            <div className="matte-card p-8 sm:p-12 text-center max-w-2xl mx-auto my-12">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">
                कुल छात्र: <span className="text-blue-400">{totalStudents}</span>
              </h2>
              <p className="text-slate-400 mb-8">
                विस्तृत छात्र प्रबंधन सिस्टम जल्द ही उपलब्ध होगा। वर्तमान में सभी रजिस्टर्ड यूज़र्स यहाँ दिखाए जा रहे हैं।
              </p>
              <MagneticButton 
                href="/dashboard" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> डैशबोर्ड पर वापस जाएं
              </MagneticButton>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}