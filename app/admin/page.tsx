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
import Logo from "@/components/logo";
import { 
  Sparkles, PlusCircle, Users, ArrowLeft, LogOut, 
  TrendingUp, DollarSign, Activity, Clock, BookOpen,
  Upload, X, CheckCircle, AlertCircle
} from "lucide-react";
import { 
  XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line,
  Legend, CartesianGrid
} from "recharts";

// 🔥 Magnetic Button Component for World-Class Interaction
const MagneticButton = ({ children, className, onClick, href, ...props }: any) => {
  const ref = useRef<HTMLButtonElement | HTMLAnchorElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    (ref.current as HTMLElement).style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) scale(1.03)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    (ref.current as HTMLElement).style.transform = `translate(0px, 0px) scale(1)`;
  };

  const baseClass = "transition-transform duration-200 ease-out relative overflow-hidden group";
  
  if (href) {
    return (
      <Link href={href} className={`${className} ${baseClass}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={ref as any} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={`${className} ${baseClass}`} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={ref as any} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

// 🔥 Optimized Cinematic Background Component (Large Display Friendly)
const CinematicBackground = ({ images, zoomType = "in" }: { images: string[], zoomType?: "in" | "out" }) => {
  const [index, setIndex] = useState(0);
  
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % images.length), 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((src, i) => (
        <img 
          key={src}
          src={src} 
          alt={`BG ${i}`} 
          loading={i === 0 ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[3000ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          } ${zoomType === 'in' ? 'animate-ken-burns-in' : 'animate-ken-burns-out'}`} 
        />
      ))}
    </div>
  );
};

interface AdminData { fullName: string; email: string; role?: string; }
interface CourseData { id: string; title: string; price: string; badge: string; description: string; imageUrl: string; createdAt: any; }
interface UpdateData { id: string; title: string; description: string; imageUrl?: string; type: "announcement" | "motivation" | "tip"; createdAt: any; }
interface ActivityData { id: string; action: string; details: string; timestamp: any; }

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

  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [courseBadge, setCourseBadge] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseImage, setCourseImage] = useState<File | null>(null);

  const [postTitle, setPostTitle] = useState("");
  const [postDesc, setPostDesc] = useState("");
  const [postType, setPostType] = useState<"announcement" | "motivation" | "tip">("announcement");
  const [postImage, setPostImage] = useState<File | null>(null);

  const adminBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg", "/gallery7.jpg"];
  const formBgImages = ["/gallery2.jpg", "/gallery4.jpg", "/gallery6.jpg"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) { window.location.replace("/"); return; }
      try {
        const userDoc = await getDoc(doc(db, "students", firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as AdminData;
          if (data.role?.trim().toLowerCase() !== "admin") { window.location.replace("/dashboard"); return; }
          setAdminData(data);
          await fetchAllData();
        } else { window.location.replace("/"); }
      } catch (error) {
        console.error("Error:", error);
        window.location.replace("/");
      } finally { setLoading(false); }
    });
    return () => unsubscribe();
  }, []);

  const fetchAllData = async () => {
    try {
      const studentsSnapshot = await getDocs(query(collection(db, "students")));
      setTotalStudents(studentsSnapshot.size);

      const coursesSnapshot = await getDocs(query(collection(db, "courses"), orderBy("createdAt", "desc")));
      const coursesData = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as CourseData[];
      setCourses(coursesData);
      setTotalCourses(coursesData.length);

      const revenue = coursesData.reduce((sum, course) => {
        const price = parseInt(course.price.replace(/[^0-9]/g, '')) || 0;
        return sum + (price * 50);
      }, 0);
      setTotalRevenue(revenue);

      const updatesSnapshot = await getDocs(query(collection(db, "updates"), orderBy("createdAt", "desc"), limit(10)));
      setUpdates(updatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as UpdateData[]);

      const activitiesSnapshot = await getDocs(query(collection(db, "activity"), orderBy("timestamp", "desc"), limit(10)));
      setRecentActivities(activitiesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ActivityData[]);

      setGrowthData([
        { month: "जन", revenue: 45000, students: 120 },
        { month: "फर", revenue: 52000, students: 145 },
        { month: "मार", revenue: 48000, students: 132 },
        { month: "अप्रै", revenue: 61000, students: 180 },
        { month: "मई", revenue: 75000, students: 210 },
        { month: "जून", revenue: 92000, students: 285 },
      ]);
    } catch (error) { console.error("Error fetching data:", error); }
  };

  const handleLogout = async () => { await auth.signOut(); window.location.replace("/"); };

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
    } catch (error) { console.error("Upload error:", error); throw error; }
    finally { setUploading(false); }
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
      await addDoc(collection(db, "courses"), { title: courseTitle, price: coursePrice, badge: courseBadge, description: courseDesc, imageUrl, createdAt: serverTimestamp() });
      await addDoc(collection(db, "activity"), { action: "नया कोर्स जोड़ा गया", details: courseTitle, timestamp: serverTimestamp() });
      setSuccessMsg("✅ कोर्स सफलतापूर्वक जोड़ा गया!");
      setCourseTitle(""); setCoursePrice(""); setCourseBadge(""); setCourseDesc(""); setCourseImage(null);
      setTimeout(() => { setShowCourseForm(false); setSuccessMsg(""); }, 2000);
      await fetchAllData();
    } catch (error) { setErrorMsg("❌ कोर्स जोड़ने में त्रुटि।"); }
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(""); setSuccessMsg("");
    if (!postTitle || !postDesc) { setErrorMsg("कृपया शीर्षक और विवरण भरें।"); return; }
    try {
      let imageUrl = "";
      if (postImage) imageUrl = await uploadToCloudinary(postImage);
      await addDoc(collection(db, "updates"), { title: postTitle, description: postDesc, imageUrl, type: postType, createdAt: serverTimestamp() });
      await addDoc(collection(db, "activity"), { action: "नई पोस्ट जोड़ी गई", details: postTitle, timestamp: serverTimestamp() });
      setSuccessMsg("✅ पोस्ट सफलतापूर्वक जोड़ी गई!");
      setPostTitle(""); setPostDesc(""); setPostType("announcement"); setPostImage(null);
      setTimeout(() => { setShowPostForm(false); setSuccessMsg(""); }, 2000);
      await fetchAllData();
    } catch (error) { setErrorMsg("❌ पोस्ट जोड़ने में त्रुटि।"); }
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
        /* 🔥 RAINBOW SHIMMER ANIMATION */
        @keyframes rainbow-shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .rainbow-shimmer-bg {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6);
          background-size: 200% auto;
          animation: rainbow-shimmer 3s linear infinite;
        }
        .rainbow-shimmer-bg:hover {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.3);
        }
        .rainbow-shimmer-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transform: translateX(-100%);
          transition: transform 0.7s;
        }
        .rainbow-shimmer-bg:hover::after {
          transform: translateX(100%);
        }
        .rainbow-shimmer-text {
          background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rainbow-shimmer 3s linear infinite;
        }

        /* 🔥 LARGE DISPLAY OPTIMIZED KEN BURNS */
        @keyframes ken-burns-zoom-in {
          0% { transform: translate3d(0, 0, 0) scale(1.0); }
          100% { transform: translate3d(-1%, -1%, 0) scale(1.08); }
        }
        @keyframes ken-burns-zoom-out {
          0% { transform: translate3d(1%, 1%, 0) scale(1.08); }
          100% { transform: translate3d(0, 0, 0) scale(1.0); }
        }
        .animate-ken-burns-in {
          animation: ken-burns-zoom-in 60s ease-in-out infinite alternate;
          will-change: transform;
        }
        .animate-ken-burns-out {
          animation: ken-burns-zoom-out 60s ease-in-out infinite alternate;
          will-change: transform;
        }
        @media (max-width: 768px) {
          .animate-ken-burns-in { animation-duration: 40s; }
          .animate-ken-burns-out { animation-duration: 40s; }
        }

        @keyframes gradient-pan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-living-gradient { background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%); background-size: 200% 200%; animation: gradient-pan 15s ease infinite; }
        
        @keyframes shimmer-text { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .animate-shimmer-text { background: linear-gradient(90deg, #60a5fa 0%, #ffffff 50%, #818cf8 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer-text 3s linear infinite; }
        
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
      `}</style>

      {/* 🔥 HEADER */}
      <header className="relative z-50 bg-slate-950/90 border-b border-slate-800 sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <MagneticButton href="/dashboard" className="p-2 hover:bg-slate-800 rounded-full transition-colors group" title="Student View">
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 group-hover:text-white transition-all" />
              </MagneticButton>
              <Logo size="medium" showText={false} />
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight animate-shimmer-text drop-shadow-lg">
                World of Concept
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
              <MagneticButton onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all border border-red-500/30 hover:border-red-400/50">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">लॉगआउट</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 MAIN CONTENT */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <CinematicBackground images={adminBgImages} zoomType="in" />
          <div className="absolute inset-0 animate-living-gradient" />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-slate-950/95" />
        </div>

        <div className="relative z-10">
          <div className="mb-8">
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
                <MagneticButton
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setShowCourseForm(false); setShowPostForm(false); setErrorMsg(""); setSuccessMsg(""); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap transition-all ${
                    activeTab === tab.id ? "rainbow-shimmer-bg text-white shadow-lg" : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </MagneticButton>
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
                  <div key={i} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-slate-600 transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl border ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
                      <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">{stat.change}</span>
                    </div>
                    <p className="text-sm text-slate-400 font-medium mb-1">{stat.label}</p>
                    <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-lg mb-8">
                <h3 className="text-xl font-bold rainbow-shimmer-text mb-6 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-indigo-400" /> राजस्व और छात्र वृद्धि (6 महीने)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="month" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc', borderRadius: '12px' }} itemStyle={{ color: '#f8fafc' }} labelStyle={{ color: '#94a3b8' }} />
                      <Legend wrapperStyle={{ color: '#94a3b8' }} />
                      <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} name="राजस्व (₹)" dot={{ r: 6, fill: '#3b82f6' }} />
                      <Line type="monotone" dataKey="students" stroke="#10b981" strokeWidth={3} name="छात्र" dot={{ r: 6, fill: '#10b981' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-slate-800/80 rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-lg">
                <h3 className="text-xl font-bold rainbow-shimmer-text mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-indigo-400" /> हाल की गतिविधियाँ</h3>
                <div className="space-y-4">
                  {recentActivities.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">कोई गतिविधि नहीं</p>
                  ) : (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-4 p-4 bg-slate-900/80 rounded-xl border border-slate-700/50">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0"><Activity className="w-5 h-5 text-indigo-400" /></div>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{activity.action}</p>
                          <p className="text-sm text-slate-300">{activity.details}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.timestamp?.toDate().toLocaleString("hi-IN")}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* 🔥 COURSES TAB */}
          {activeTab === "courses" && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold rainbow-shimmer-text">कोर्सेस प्रबंधन</h2>
                <MagneticButton 
                  onClick={() => { setShowCourseForm(!showCourseForm); setErrorMsg(""); setSuccessMsg(""); }} 
                  className="flex items-center gap-2 px-6 py-3 rainbow-shimmer-bg text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl border border-indigo-400/50"
                >
                  <PlusCircle className="w-5 h-5" /> {showCourseForm ? "फॉर्म बंद करें" : "नया कोर्स जोड़ें"}
                </MagneticButton>
              </div>

              {showCourseForm && (
                <div className="relative overflow-hidden rounded-3xl mb-8 animate-fade-in-up border border-slate-700/50 shadow-xl">
                  <div className="absolute inset-0 z-0">
                    <CinematicBackground images={formBgImages} zoomType="out" />
                    <div className="absolute inset-0 bg-slate-950/90" />
                  </div>
                  <div className="relative z-10 bg-slate-800/80 p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold rainbow-shimmer-text flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" /> नया कोर्स जोड़ें
                      </h3>
                      <MagneticButton onClick={() => setShowCourseForm(false)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                      </MagneticButton>
                    </div>
                    
                    {errorMsg && <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {errorMsg}</div>}
                    {successMsg && <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> {successMsg}</div>}
                    
                    <form onSubmit={handleAddCourse} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">कोर्स शीर्षक *</label>
                          <input type="text" value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" placeholder="जैसे: गणित मास्टरक्लास" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">बैज *</label>
                          <input type="text" value={courseBadge} onChange={(e) => setCourseBadge(e.target.value)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" placeholder="जैसे: कक्षा 10" required />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">मूल्य *</label>
                          <input type="text" value={coursePrice} onChange={(e) => setCoursePrice(e.target.value)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" placeholder="जैसे: ₹499" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-300 mb-2">कोर्स इमेज *</label>
                          <input type="file" accept="image/*" onChange={(e) => setCourseImage(e.target.files?.[0] || null)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all cursor-pointer" required />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">विवरण *</label>
                        <textarea value={courseDesc} onChange={(e) => setCourseDesc(e.target.value)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none" rows={3} placeholder="कोर्स का विस्तृत विवरण..." required />
                      </div>
                      <MagneticButton 
                        type="submit" 
                        disabled={uploading} 
                        className="w-full flex items-center justify-center gap-2 rainbow-shimmer-bg text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> अपलोड हो रहा है...</>) : (<><Upload className="w-5 h-5" /> कोर्स सेव करें</>)}
                      </MagneticButton>
                    </form>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-indigo-500/50 transition-all group">
                    <div className="relative h-48">
                      <Image src={course.imageUrl} alt={course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />
                    </div>
                    <div className="p-5">
                      <span className="inline-block px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold rounded-full mb-3">{course.badge}</span>
                      <h3 className="font-bold text-white mb-2 text-lg">{course.title}</h3>
                      <p className="text-sm text-slate-400 mb-4 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-extrabold text-indigo-400">{course.price}</p>
                        <MagneticButton className="text-xs text-slate-400 hover:text-white transition-colors">Edit</MagneticButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 🔥 POSTS TAB */}
          {activeTab === "posts" && (
            <>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold rainbow-shimmer-text">अपडेट्स प्रबंधन</h2>
                <MagneticButton 
                  onClick={() => { setShowPostForm(!showPostForm); setErrorMsg(""); setSuccessMsg(""); }} 
                  className="flex items-center gap-2 px-6 py-3 rainbow-shimmer-bg text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl border border-indigo-400/50"
                >
                  <PlusCircle className="w-5 h-5" /> {showPostForm ? "फॉर्म बंद करें" : "नई पोस्ट जोड़ें"}
                </MagneticButton>
              </div>

              {showPostForm && (
                <div className="relative overflow-hidden rounded-3xl mb-8 animate-fade-in-up border border-slate-700/50 shadow-xl">
                  <div className="absolute inset-0 z-0">
                    <CinematicBackground images={formBgImages} zoomType="in" />
                    <div className="absolute inset-0 bg-slate-950/90" />
                  </div>
                  <div className="relative z-10 bg-slate-800/80 p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold rainbow-shimmer-text flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-400" /> नई पोस्ट जोड़ें
                      </h3>
                      <MagneticButton onClick={() => setShowPostForm(false)} className="p-2 hover:bg-slate-700 rounded-full transition-colors">
                        <X className="w-5 h-5 text-slate-400" />
                      </MagneticButton>
                    </div>
                    
                    {errorMsg && <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5" /> {errorMsg}</div>}
                    {successMsg && <div className="bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> {successMsg}</div>}
                    
                    <form onSubmit={handleAddPost} className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">पोस्ट प्रकार</label>
                        <select value={postType} onChange={(e) => setPostType(e.target.value as any)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all cursor-pointer">
                          <option value="announcement">📢 घोषणा</option>
                          <option value="motivation">💪 प्रेरणा</option>
                          <option value="tip">💡 टिप</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">शीर्षक *</label>
                        <input type="text" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all" placeholder="पोस्ट का शीर्षक" required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">विवरण *</label>
                        <textarea value={postDesc} onChange={(e) => setPostDesc(e.target.value)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all resize-none" rows={4} placeholder="पोस्ट का विस्तृत विवरण..." required />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">इमेज (वैकल्पिक)</label>
                        <input type="file" accept="image/*" onChange={(e) => setPostImage(e.target.files?.[0] || null)} className="w-full px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 transition-all cursor-pointer" />
                      </div>
                      <MagneticButton 
                        type="submit" 
                        disabled={uploading} 
                        className="w-full flex items-center justify-center gap-2 rainbow-shimmer-bg text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? (<><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> अपलोड हो रहा है...</>) : (<><Upload className="w-5 h-5" /> पोस्ट सेव करें</>)}
                      </MagneticButton>
                    </form>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {updates.map((update) => (
                  <div key={update.id} className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700/50 shadow-lg hover:shadow-xl hover:border-indigo-500/30 transition-all group">
                    <div className="flex items-start gap-4">
                      {update.imageUrl && (
                        <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700 group-hover:border-indigo-500/50 transition-colors">
                          <Image src={update.imageUrl} alt={update.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                          update.type === "announcement" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                          update.type === "motivation" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                          "bg-green-500/10 text-green-400 border border-green-500/20"
                        }`}>
                          {update.type === "announcement" ? "📢 घोषणा" : update.type === "motivation" ? "💪 प्रेरणा" : "💡 टिप"}
                        </span>
                        <h3 className="font-bold text-white mb-2 text-lg">{update.title}</h3>
                        <p className="text-sm text-slate-300 mb-3">{update.description}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {update.createdAt?.toDate().toLocaleString("hi-IN")}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Students Tab */}
          {activeTab === "students" && (
            <div className="bg-slate-800/80 rounded-2xl p-8 border border-slate-700/50 shadow-lg text-center">
              <Users className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold rainbow-shimmer-text mb-2">कुल छात्र: <span className="text-indigo-400">{totalStudents}</span></h2>
              <p className="text-slate-400">विस्तृत छात्र प्रबंधन system जल्द ही उपलब्ध होगा।</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}