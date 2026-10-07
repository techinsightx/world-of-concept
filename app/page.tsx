/* eslint-disable */
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import AuthForm from "@/components/AuthForm";
import Logo from "@/components/logo";

interface StudentData {
  fullName: string;
  email: string;
  mobile: string;
}

interface CourseItem {
  title: string;
  price: string;
  badge: string;
  desc: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  const row1Images = ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg", "/gallery4.jpg", "/gallery5.jpg"];
  const row2Images = ["/gallery6.jpg", "/gallery7.jpg", "/gallery8.jpg", "/gallery9.jpg", "/gallery10.jpg"];
  const courseImages = ["/course1.jpg", "/course2.jpg", "/course3.jpg", "/course4.jpg", "/course5.jpg"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const studentDoc = await getDoc(doc(db, "students", firebaseUser.uid));
          if (studentDoc.exists()) {
            setStudent(studentDoc.data() as StudentData);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/";
  };

  const PureLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
    const dimensions = size === "sm" ? "w-10 h-10" : size === "lg" ? "w-20 h-20" : "w-14 h-14";
    return (
      <div className={`relative ${dimensions} flex-shrink-0 transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110`}>
        <Image src="/logo.png" alt="World of Concept" fill className="object-contain" priority />
      </div>
    );
  };

  if (loading) {
    return (
      <main className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="text-center space-y-6">
          <PureLogo size="lg" />
          <div className="space-y-2">
            <p className="text-slate-800 font-semibold text-lg tracking-wide">World of Concept लोड हो रहा है...</p>
            <div className="w-48 h-1.5 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="relative min-h-screen bg-slate-50 overflow-x-hidden flex flex-col" itemScope itemType="https://schema.org/WebPage">
        {/* ✅ REMOVED: google_translate_element div */}

        <section className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/hero-bg.jpg" alt="Hero Background" fill className="object-cover object-center" priority />
            <div className="absolute inset-0 bg-slate-50/60 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pt-12 lg:pt-0">
            <div className="flex-1 text-center lg:text-left space-y-6 lg:space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-blue-50/80 border border-blue-100 text-blue-700 rounded-full text-sm font-semibold backdrop-blur-sm shadow-sm">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                2027 बैच के लिए एडमिशन खुले
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] tracking-tight text-center lg:text-left" itemProp="name">
                World of <span className="gradient-text">Concept</span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium" itemProp="description">
                बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद प्लेटफॉर्म।
                <span className="block mt-3 text-slate-800 font-bold">
                  RK Sir के साथ सफलता की अपनी नई यात्रा शुरू करें।
                </span>
              </p>
              
              {/* ✅ REMOVED: Custom Translation Button */}
            </div>
            
            <div className="flex-1 w-full max-w-md lg:max-w-lg animate-fade-in-up-delayed">
              <AuthForm />
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image src="/features-bg.jpg" alt="Features Background" fill className="object-cover" />
            <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[1px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                World of Concept <span className="gradient-text">क्यों चुनें?</span>
              </h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                बिहार बोर्ड परीक्षाओं में टॉप करने के लिए RK Sir द्वारा तैयार किया गया सब कुछ।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[
                { icon: "🎬", title: "HD वीडियो लेक्चर", desc: "स्टूडियो क्वालिटी में रिकॉर्ड किए गए स्पष्ट कॉन्सेप्ट-बेस्ड पाठ।" },
                { icon: "📝", title: "स्मार्ट नोट्स", desc: "त्वरित और प्रभावी पुनरावृत्ति के लिए संरचित, हस्तलिखित नोट्स।" },
                { icon: "📊", title: "टेस्ट सीरीज", desc: "विस्तृत प्रदर्शन विश्लेषण के साथ अध्याय-वार और पूर्ण मॉक टेस्ट।" },
                { icon: "💬", title: "डाउट सपोर्ट", desc: "RK Sir और उनकी समर्पित मेंटर टीम से सीधी और त्वरित सहायता।" },
              ].map((feature, i) => (
                <div key={i} className="group bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-8 text-center hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-2 transition-all duration-500 ease-out">
                  <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:bg-blue-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="relative bg-slate-950 text-slate-400 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 mt-auto">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-16">
              <div className="sm:col-span-2 lg:col-span-1 space-y-6">
                <div className="flex items-center gap-3 text-white">
                  <PureLogo size="sm" />
                  <span className="font-extrabold text-xl tracking-tight">World of Concept</span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs text-slate-400">
                  बिहार के छात्रों को विश्व स्तरीय शिक्षा, संरचित मार्गदर्शन और सफलता का सिद्ध मार्ग प्रदान करना।
                </p>
                <div className="flex gap-4 pt-2">
                  <a href="https://youtube.com/@JoinWorldofConcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:border-red-500 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="YouTube">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  </a>
                  <a href="https://instagram.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Instagram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
                  </a>
                  <a href="https://facebook.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Facebook">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://t.me/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:border-sky-400 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Telegram">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                  </a>
                </div>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">प्लेटफॉर्म</h4>
                <ul className="space-y-4 text-sm">
                  <li><a href="#available-courses" className="hover:text-blue-400 transition-colors duration-300">सभी कोर्सेस</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">हमें क्यों चुनें</a></li>
                  <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">छात्र सफलता की कहानियां</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">कानूनी</h4>
                <ul className="space-y-4 text-sm">
                  <li><a href="/privacy" className="hover:text-blue-400 transition-colors duration-300">गोपनीयता नीति</a></li>
                  <li><a href="/terms" className="hover:text-blue-400 transition-colors duration-300">सेवा की शर्तें</a></li>
                  <li><a href="/refund" className="hover:text-blue-400 transition-colors duration-300">रिफंड नीति</a></li>
                  <li><a href="/contact" className="hover:text-blue-400 transition-colors duration-300">संपर्क करें</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">सहायता</h4>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-center gap-3"><span>📧</span> support@worldofconcept.in</li>
                  <li className="flex items-center gap-3"><span>📞</span> +91 7979096954</li>
                  <li className="flex items-center gap-3"><span>📍</span> अलमनगर, बिहार, भारत</li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
              <p>© {new Date().getFullYear()} World of Concept. सर्वाधिकार सुरक्षित।</p>
              <a href="https://www.google.com/search?q=Mukesh+Kumar+Malakar" target="_blank" rel="noopener noreferrer author" className="flex items-center gap-2 hover:text-blue-400 transition-all duration-300 group" title="Designed and Developed by Mukesh Kumar Malakar">
                <span>निर्मित</span>
                <svg className="w-4 h-4 text-red-500 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                <span>द्वारा <span className="font-semibold text-slate-400 group-hover:text-blue-400">Mukesh Kumar Malakar</span></span>
              </a>
            </div>
          </div>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col relative overflow-x-hidden">
      {/* ✅ REMOVED: google_translate_element div */}

      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <Logo size="medium" showText={true} />
            <div className="flex items-center gap-2 sm:gap-4">
              {/* ✅ REMOVED: Custom Translation Button from Header */}

              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900">{student?.fullName || "छात्र"}</p>
                <p className="text-xs text-slate-500">{student?.email || user.email}</p>
              </div>
              <button onClick={handleLogout} className="px-2 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300 border border-red-200 hover:border-red-300 hover:shadow-md">
                लॉगआउट
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image src="/dashboard-bg.jpg" alt="Dashboard Background" fill className="object-cover opacity-20" />
        </div>

        <div className="relative z-10 space-y-6 sm:space-y-12 lg:space-y-16">
          <div className="animate-fade-in-up">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
              वापसी पर स्वागत है, <span className="gradient-text">{student?.fullName?.split(" ")[0] || "छात्र"}</span> 👋
            </h1>
            <p className="text-slate-600 text-sm sm:text-lg">RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें। आइए आज को उत्पादक बनाएं!</p>
          </div>

          {/* ✅ CINEMATIC LIVE CLASS CARD */}
          <div className="animate-fade-in-up w-full">
            <div className="card-interactive border-2 border-red-100 bg-gradient-to-br from-red-50 to-white relative overflow-hidden group rounded-2xl w-full hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1 transition-all duration-500 ease-out">
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1.5 sm:gap-2 bg-red-600 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg animate-pulse z-10">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></span> LIVE
              </div>
              <div className="p-4 sm:p-8 flex flex-col items-center text-center w-full">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center text-2xl sm:text-4xl group-hover:scale-110 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex-shrink-0 mb-3 sm:mb-4">▶️</div>
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 mb-2 w-full leading-tight">RK Sir के साथ दैनिक लाइव क्लास</h3>
                <p className="text-slate-600 text-xs sm:text-base mb-4 sm:mb-6 w-full max-w-xl">दैनिक लाइव सत्र में शामिल हों, रियल टाइम में अपने संदेह दूर करें, और हमारे आधिकारिक YouTube चैनल पर सीधे विशेष बोर्ड परीक्षा टिप्स प्राप्त करें।</p>
                
                <a href="https://www.youtube.com/@JoinWorldofConcept" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-red-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20 mx-auto">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                  अभी लाइव क्लास में शामिल हों
                </a>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            {[
              { icon: "📚", label: "कुल कोर्सेस", value: "0", color: "bg-blue-100 text-blue-600", delay: "0s" },
              { icon: "✅", label: "पूर्ण", value: "0", color: "bg-green-100 text-green-600", delay: "0.1s" },
              { icon: "🎯", label: "प्रगति में", value: "0", color: "bg-purple-100 text-purple-600", delay: "0.2s" },
            ].map((stat, i) => (
              <div key={i} className="card bg-white border border-slate-100 rounded-2xl p-4 sm:p-5 animate-fade-in-up hover:scale-[1.02] hover:shadow-xl transition-all duration-300" style={{ animationDelay: stat.delay }}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    <span className="text-xl sm:text-2xl">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</p>
                    <p className="text-xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full">
            <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 mb-3 sm:mb-6">मेरे कोर्सेस</h2>
            <div className="card bg-white border border-slate-100 rounded-2xl text-center py-8 sm:py-10 px-3 sm:px-4 w-full hover:shadow-lg transition-all duration-300">
              <span className="text-4xl sm:text-5xl mb-3 sm:mb-4 block">📚</span>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 mb-2">अभी तक कोई कोर्स नहीं</h3>
              <p className="text-slate-600 text-xs sm:text-sm mb-4 sm:mb-6 max-w-md mx-auto">बिहार बोर्ड के लिए बनाए गए कोर्स में नामांकन करके अपनी शिक्षा यात्रा शुरू करें।</p>
              
              <a href="#available-courses" className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm mx-auto">
                कोर्सेस देखें
              </a>
            </div>
          </div>

          {/* 🎓 CINEMATIC COURSES RAIL */}
          <div id="available-courses" className="animate-fade-in-up w-full" style={{ animationDelay: "0.4s" }}>
            <div className="text-center mb-6 sm:mb-8 px-2">
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-2">उपलब्ध कोर्सेस</h2>
              <p className="text-slate-500 text-xs sm:text-base">बिहार बोर्ड परीक्षाओं के लिए RK Sir के साथ पूर्ण तैयारी</p>
            </div>
            
            <div className="relative w-full overflow-hidden py-4 sm:py-6">
              <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-24 lg:w-40 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-24 lg:w-40 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

              <div className="flex gap-3 sm:gap-4 w-max animate-marquee-reverse touch-pan-y">
                {[...courseImages, ...courseImages, ...courseImages].map((src, i) => {
                  const courses: CourseItem[] = [
                    { title: "गणित: ऑब्जेक्टिव मास्टरक्लास", price: "₹499", badge: "कक्षा 10", desc: "शॉर्टकट के साथ संपूर्ण गणित की तैयारी।" },
                    { title: "विज्ञान: संपूर्ण रिवीजन", price: "₹699", badge: "कक्षा 10", desc: "भौतिकी, रसायन विज्ञान, जीव विज्ञान का पूर्ण कवरेज।" },
                    { title: "इंटर: संपूर्ण टॉपर बैच", price: "₹999", badge: "कक्षा 12", desc: "मॉक टेस्ट के साथ सभी विषय शामिल।" },
                    { title: "अंग्रेजी: व्याकरण और लेखन", price: "₹399", badge: "सभी कक्षाएं", desc: "अंग्रेजी भाषा में आसानी से महारत हासिल करें।" },
                    { title: "सामाजिक विज्ञान: पूर्ण कोर्स", price: "₹599", badge: "कक्षा 10", desc: "इतिहास, भूगोल और नागरिक शास्त्र को सरल बनाया गया।" },
                  ];
                  const course = courses[i % 5];
                  
                  return (
                    <div key={`course-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 lg:w-96 flex-shrink-0 group" style={{ animationDelay: `${(i % 5) * 0.1}s` }}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/10 border border-slate-100 hover:border-blue-300 transition-all duration-500 ease-out hover:-translate-y-2 h-full flex flex-col">
                        <div className="relative h-40 sm:h-56 overflow-hidden">
                          <Image src={src} alt={course.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                            <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                              {course.badge}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                            <h3 className="text-white font-bold text-sm sm:text-lg drop-shadow-lg leading-tight line-clamp-2">{course.title}</h3>
                          </div>
                        </div>
                        <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-white to-slate-50">
                          <p className="text-slate-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{course.desc}</p>
                          <div className="flex items-center justify-between mt-auto">
                            <span className="text-lg sm:text-2xl font-extrabold text-slate-900">{course.price}</span>
                            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 sm:py-2.5 sm:px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm whitespace-nowrap">
                              अभी नामांकन करें
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 🎬 CINEMATIC GALLERY */}
          <div className="animate-fade-in-up w-full" style={{ animationDelay: "0.6s" }}>
            <div className="text-center mb-6 sm:mb-8 px-2">
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-2">World of Concept में जीवन</h2>
              <p className="text-slate-500 text-xs sm:text-base">हमारी कक्षाओं, सत्रों और छात्रों की सफलता की झलकियां</p>
            </div>

            <div className="relative w-full overflow-hidden py-4 sm:py-6">
              <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-24 lg:w-40 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-24 lg:w-40 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />

              <div className="flex gap-3 sm:gap-4 w-max animate-marquee touch-pan-y mb-4 sm:mb-6">
                {[...row1Images, ...row1Images, ...row1Images].map((src, i) => (
                  <div key={`row1-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-64 md:w-72 h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden group flex-shrink-0 border border-white/60 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ease-out hover:-translate-y-2">
                    <Image src={src} alt={`Gallery Row 1 Image ${i}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md">World of Concept क्लास</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 sm:gap-4 w-max animate-marquee-reverse touch-pan-y">
                {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
                  <div key={`row2-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-64 md:w-72 h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden group flex-shrink-0 border border-white/60 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 ease-out hover:-translate-y-2">
                    <Image src={src} alt={`Gallery Row 2 Image ${i}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md">छात्र सफलता की कहानी</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <footer className="relative bg-slate-950 text-slate-400 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-20">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
            <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 text-white">
                <PureLogo size="sm" />
                <span className="font-extrabold text-lg sm:text-xl tracking-tight">World of Concept</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-slate-400">बिहार के छात्रों को विश्व स्तरीय शिक्षा, संरचित मार्गदर्शन और सफलता का सिद्ध मार्ग प्रदान करना।</p>
              <div className="flex gap-3 sm:gap-4 pt-2">
                <a href="https://youtube.com/@JoinWorldofConcept" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-red-600 hover:border-red-500 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="YouTube">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </a>
                <a href="https://instagram.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-pink-600 hover:border-pink-500 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Instagram">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069z"/></svg>
                </a>
                <a href="https://facebook.com/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Facebook">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://t.me/worldofconcept" target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:bg-sky-500 hover:border-sky-400 hover:text-white transition-all duration-300 hover:-translate-y-1" aria-label="Telegram">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
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

          <div className="pt-6 sm:pt-8 border-t border-slate-900 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500">
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
    </main>
  );
}