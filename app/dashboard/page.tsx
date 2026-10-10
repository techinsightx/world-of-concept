/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/logo";
import AdPopup from "@/components/AdPopup"; 
import { 
  BookOpen, CheckCircle2, Target, ExternalLink, PlayCircle, 
  Bell, LogOut, Sparkles, Trophy, Clock, ArrowRight,
  Calendar, MessageCircle, MapPin
} from "lucide-react";

interface StudentData {
  fullName: string;
  email: string;
  role?: string;
}

interface UpdateData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  timestamp: any;
  type: "announcement" | "motivation" | "tip";
}

// 🔥 Custom Colorful Social Icons
const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/>
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="insta-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FD5" />
        <stop offset="50%" stopColor="#FF543E" />
        <stop offset="100%" stopColor="#C837AB" />
      </linearGradient>
    </defs>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z" fill="url(#insta-gradient)"/>
    <path d="M12 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#FFFFFF"/>
    <circle cx="18.406" cy="5.594" r="1.44" fill="#FFFFFF"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
  </svg>
);

const TelegramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0z" fill="#0088CC"/>
    <path d="M4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" fill="#FFFFFF"/>
  </svg>
);

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [updates, setUpdates] = useState<UpdateData[]>([]);

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
          
          if (data.role?.trim().toLowerCase() === "admin") {
            window.location.replace("/admin");
            return;
          }
          
          setStudent(data);
          
          try {
            const updatesQuery = query(
              collection(db, "updates"),
              orderBy("timestamp", "desc"),
              limit(6)
            );
            const updatesSnapshot = await getDocs(updatesQuery);
            const updatesData = updatesSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as UpdateData[];
            setUpdates(updatesData);
          } catch (updatesError) {
            console.log("No updates collection yet");
          }
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

  const availableCourses = [
    { title: "गणित: ऑब्जेक्टिव मास्टरक्लास", price: "₹499", badge: "कक्षा 10", desc: "शॉर्टकट के साथ संपूर्ण गणित की तैयारी।", image: "/course1.jpg" },
    { title: "विज्ञान: संपूर्ण रिवीजन", price: "₹699", badge: "कक्षा 10", desc: "भौतिकी, रसायन विज्ञान, जीव विज्ञान का पूर्ण कवरेज।", image: "/course2.jpg" },
    { title: "इंटर: संपूर्ण टॉपर बैच", price: "₹999", badge: "कक्षा 12", desc: "मॉक टेस्ट के साथ सभी विषय शामिल।", image: "/course3.jpg" },
    { title: "अंग्रेजी: व्याकरण और लेखन", price: "₹399", badge: "सभी कक्षाएं", desc: "अंग्रेजी भाषा में आसानी से महारत हासिल करें।", image: "/course4.jpg" },
    { title: "सामाजिक विज्ञान: पूर्ण कोर्स", price: "₹599", badge: "कक्षा 10", desc: "इतिहास, भूगोल और नागरिक शास्त्र को सरल बनाया गया।", image: "/course5.jpg" },
  ];

  const row1Images = ["/class1.jpg", "/class2.jpg", "/class3.jpg", "/class4.jpg", "/class5.jpg"];
  const row2Images = ["/student1.jpg", "/student2.jpg", "/student3.jpg", "/student4.jpg", "/student5.jpg"];

  // 🔥 10 Live Classes Videos with Autoplay
  const youtubeVideos = [
    { id: "dQw4w9WgXcQ", title: "गणित शॉर्टकट ट्रिक्स - पार्ट 1" },
    { id: "dQw4w9WgXcQ", title: "विज्ञान रिवीजन - भौतिकी" },
    { id: "dQw4w9WgXcQ", title: "टॉपर कैसे बनें? मोटिवेशनल" },
    { id: "dQw4w9WgXcQ", title: "गणित शॉर्टकट ट्रिक्स - पार्ट 2" },
    { id: "dQw4w9WgXcQ", title: "विज्ञान रिवीजन - रसायन" },
    { id: "dQw4w9WgXcQ", title: "English Grammar Masterclass" },
    { id: "dQw4w9WgXcQ", title: "Social Science Quick Revision" },
    { id: "dQw4w9WgXcQ", title: "Maths Formula Tricks" },
    { id: "dQw4w9WgXcQ", title: "Science Practical Guide" },
    { id: "dQw4w9WgXcQ", title: "Exam Preparation Strategy" },
  ];

  if (!authChecked || loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/30">
              <span className="text-5xl">🎓</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-800 font-bold text-xl tracking-wide">World of Concept</p>
            <p className="text-slate-500 font-medium animate-pulse">आपका डैशबोर्ड लोड हो रहा है...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">⚠️</span>
          </div>
          <p className="text-slate-600 text-lg font-medium">छात्र डेटा लोड करने में असमर्थ</p>
          <button 
            onClick={() => window.location.replace("/")} 
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95"
          >
            होम पर जाएं
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-slate-50 relative font-sans w-full overflow-x-hidden overscroll-y-auto">
      <AdPopup />

      <style jsx global>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .animate-marquee { 
          animation: marquee 45s linear infinite; 
          will-change: transform; 
          touch-action: pan-y; 
        }
        .animate-marquee-reverse { 
          animation: marquee-reverse 45s linear infinite; 
          will-change: transform; 
          touch-action: pan-y; 
        }
        .animate-marquee:hover, .animate-marquee-reverse:hover { 
          animation-play-state: paused; 
        }
        
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        
        .shimmer-effect {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          background-size: 1000px 100%;
          animation: shimmer 2s infinite linear;
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all duration-300 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Logo size="medium" showText={true} />
            <div className="flex items-center gap-3 sm:gap-6">
              <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{student.fullName}</p>
                  <p className="text-xs text-slate-500">{student.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
                  {student.fullName.charAt(0).toUpperCase()}
                </div>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 border border-red-100 hover:border-red-200 hover:shadow-md">
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">लॉगआउट</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 w-full">
        
        {/* 🔥 SHIMMERING WELCOME CARD */}
        <div className="animate-fade-in-up mb-8 relative overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
          <div className="absolute inset-0 shimmer-effect" />
          <div className="relative z-10 p-6 sm:p-10 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-semibold mb-4 border border-white/30">
              <Sparkles className="w-4 h-4" />
              <span>छात्र डैशबोर्ड</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight">
              वापसी पर स्वागत है, {student.fullName.split(" ")[0]} 👋
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें। निरंतरता बनाए रखें, और आइए आज को उत्पादक बनाएं!
            </p>
          </div>
        </div>

        {/* 🔥 Live Class Banner */}
        <div className="animate-fade-in-up mb-12 w-full" style={{ animationDelay: "0.1s" }}>
          <div className="card-interactive border-2 border-red-100 bg-gradient-to-br from-red-50 to-white relative overflow-hidden group rounded-2xl w-full hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-500 ease-out">
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1.5 sm:gap-2 bg-red-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg animate-pulse z-10">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span> LIVE
            </div>
            <div className="p-4 sm:p-8 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-shrink-0">▶️</div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mb-2 w-full leading-tight">RK Sir के साथ दैनिक लाइव क्लास</h3>
                <p className="text-slate-600 text-xs sm:text-base w-full max-w-xl">दैनिक लाइव सत्र में शामिल हों, रियल टाइम में अपने संदेह दूर करें।</p>
              </div>
              <a href="https://www.youtube.com/@JoinWorldofConcept" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20 whitespace-nowrap">
                <PlayCircle className="w-5 h-5" />
                अभी जुड़ें
              </a>
            </div>
          </div>
        </div>

        {/* 🔥 YouTube Video Scrolling Rail (LEFT TO RIGHT) */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-6 px-2">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <YoutubeIcon className="w-6 h-6" />
              RK Sir के लेटेस्ट वीडियो
            </h2>
            <a href="https://www.youtube.com/@JoinWorldofConcept" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm transition-colors group">
              चैनल देखें <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
          
          <div className="relative w-full py-4">
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 sm:gap-5 w-max animate-marquee-reverse touch-pan-y">
              {[...youtubeVideos, ...youtubeVideos, ...youtubeVideos].map((video, i) => (
                <div key={`yt-${i}`} className="relative w-[85vw] max-w-[400px] sm:w-96 flex-shrink-0 group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}`}
                        title={video.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-2">{video.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {[
            { icon: BookOpen, label: "उपलब्ध कोर्सेस", value: availableCourses.length, color: "bg-blue-50 text-blue-600", delay: "0.3s" },
            { icon: CheckCircle2, label: "पूर्ण किए", value: "0", color: "bg-green-50 text-green-600", delay: "0.4s" },
            { icon: Target, label: "प्रगति में", value: "0", color: "bg-purple-50 text-purple-600", delay: "0.5s" },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up" 
              style={{ animationDelay: stat.delay }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${stat.color} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Available Courses Scrolling Rail (RIGHT TO LEFT) */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">उपलब्ध कोर्सेस</h2>
              <p className="text-slate-500 text-sm mt-1">अपनी तैयारी को अगले स्तर पर ले जाएं</p>
            </div>
            <Link href="/courses" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors group">
              सभी देखें <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="relative w-full py-4">
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 sm:gap-5 w-max animate-marquee touch-pan-y">
              {[...availableCourses, ...availableCourses, ...availableCourses].map((course, i) => (
                <div key={`avail-course-${i}`} className="relative w-[85vw] max-w-[300px] sm:w-72 md:w-80 flex-shrink-0 group">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 hover:border-blue-300 transition-all duration-500 ease-out hover:-translate-y-2 h-full flex flex-col">
                    <div className="relative h-40 sm:h-48 overflow-hidden">
                      <Image src={course.image} alt={course.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                        <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                          {course.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                        <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg leading-tight line-clamp-2">{course.title}</h3>
                      </div>
                    </div>
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50">
                      <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{course.desc}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-lg sm:text-xl font-extrabold text-slate-900">{course.price}</span>
                        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm whitespace-nowrap">
                          नामांकन करें
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cinematic Gallery (Row 1: RIGHT TO LEFT, Row 2: LEFT TO RIGHT) */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <div className="text-center mb-10 px-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">World of Concept में जीवन</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">हमारी कक्षाओं, इंटरैक्टिव सत्रों और छात्रों की सफलता की कहानियों की झलकियां</p>
          </div>

          <div className="relative w-full py-4 sm:py-6">
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

            <div className="flex gap-4 sm:gap-5 w-max animate-marquee mb-4 sm:mb-6">
              {[...row1Images, ...row1Images, ...row1Images].map((src, i) => (
                <div 
                  key={`row1-${i}`} 
                  className="relative w-[85vw] max-w-[300px] sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden group flex-shrink-0 border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <Image src={src} alt={`Gallery Row 1 Image ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                      <PlayCircle className="w-4 h-4" /> World of Concept क्लास
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 sm:gap-5 w-max animate-marquee-reverse">
              {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
                <div 
                  key={`row2-${i}`} 
                  className="relative w-[85vw] max-w-[300px] sm:w-80 h-48 sm:h-52 rounded-2xl overflow-hidden group flex-shrink-0 border border-white/60 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <Image src={src} alt={`Gallery Row 2 Image ${i}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white font-bold text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-yellow-400" /> छात्र सफलता की कहानी
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 🔥 RK Sir Updates (Cloudinary Powered - Cinematic Cards) */}
        <div className="mb-16 animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
              RK Sir के अपडेट्स
            </h2>
          </div>
          
          {updates.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
              <p className="text-slate-500">अभी कोई अपडेट नहीं है। जल्द ही RK Sir से नई अपडेट्स आने वाली हैं!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {updates.map((update) => (
                <div key={update.id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  {update.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image 
                        src={update.imageUrl} 
                        alt={update.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold text-white backdrop-blur-md ${
                          update.type === "announcement" ? "bg-blue-500/80" :
                          update.type === "motivation" ? "bg-purple-500/80" :
                          "bg-green-500/80"
                        }`}>
                          {update.type === "announcement" ? "📢 घोषणा" : update.type === "motivation" ? "💪 प्रेरणा" : "💡 टिप"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{update.title}</h3>
                    <p className="text-slate-600 text-sm mb-3 line-clamp-3">{update.description}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {update.timestamp?.toDate().toLocaleDateString("hi-IN", { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* 🔥 COMPLETE FOOTER with MAP BACKGROUND */}
      <footer className="relative bg-slate-950 text-slate-400 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-20 w-full overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        {/* 🔥 MAP AS BACKGROUND */}
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3598.5!2d86.1167!3d25.9333!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU2JzAwLjAiTiA4NsKwMDcnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
            width="100%"
            height="100%"
            style={{ 
              border: 0, 
              filter: 'invert(90%) hue-rotate(180deg) brightness(0.6) contrast(1.3) saturate(0.3)',
              opacity: 0.15
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="World of Concept Location"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-slate-950/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          
          {/* Location Badge */}
          <div className="mb-8 flex items-center justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900/80 backdrop-blur-md rounded-full border border-slate-800">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-white text-sm font-semibold">आलमनगर पोस्ट ऑफिस चौक, बिहार</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
            
            <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 text-white">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image src="/logo.png" alt="World of Concept" fill className="object-contain" />
                </div>
                <span className="font-extrabold text-lg sm:text-xl tracking-tight">World of Concept</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-slate-400">
                बिहार के छात्रों को विश्व स्तरीय शिक्षा, संरित मार्गदर्शन और सफलता का सिद्ध मार्ग प्रदान करना।
              </p>
              <div className="flex gap-3 sm:gap-4 pt-2">
                <a href="https://youtube.com/@JoinWorldofConcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-500 transition-all duration-300 hover:-translate-y-1 hover:scale-110" aria-label="YouTube">
                  <YoutubeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://instagram.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 transition-all duration-300 hover:-translate-y-1 hover:scale-110" aria-label="Instagram">
                  <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://facebook.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 hover:scale-110" aria-label="Facebook">
                  <FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
                <a href="https://t.me/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-400 transition-all duration-300 hover:-translate-y-1 hover:scale-110" aria-label="Telegram">
                  <TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">प्लेटफॉर्म</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li><a href="#available-courses" className="hover:text-blue-400 transition-colors duration-300">सभी कोर्सेस</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">हमें क्यों चुनें</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">छात्र सफलता की कहानियां</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">कानूनी</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li><a href="/privacy" className="hover:text-blue-400 transition-colors duration-300">गोपनीयता नीति</a></li>
                <li><a href="/terms" className="hover:text-blue-400 transition-colors duration-300">सेवा की शर्तें</a></li>
                <li><a href="/refund" className="hover:text-blue-400 transition-colors duration-300">रिफंड नीति</a></li>
                <li><a href="/contact" className="hover:text-blue-400 transition-colors duration-300">संपर्क करें</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">सहायता</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li className="flex items-center gap-2 sm:gap-3"><span>📧</span> support@worldofconcept.in</li>
                <li className="flex items-center gap-2 sm:gap-3"><span>📞</span> +91 7979096954</li>
                <li className="flex items-center gap-2 sm:gap-3"><span>📍</span> अलमनगर, बिहार, भारत</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500 px-2">
            <p>© {new Date().getFullYear()} World of Concept. सर्वाधिकार सुरक्षित।</p>
            <a href="https://www.google.com/search?q=Mukesh+Kumar+Malakar" target="_blank" rel="noopener noreferrer author" className="flex items-center gap-1.5 sm:gap-2 hover:text-blue-400 transition-all duration-300 group" title="Designed and Developed by Mukesh Kumar Malakar">
              <span>निर्मित</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>द्वारा <span className="font-semibold text-slate-400 group-hover:text-blue-400">Mukesh Kumar Malakar</span></span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}