/* eslint-disable */
"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import AuthForm from "@/components/AuthForm";
// 🔥 ThemeToggle import removed as it is now global in layout.tsx
import Logo from "@/components/logo";
import { 
  BookOpen, CheckCircle2, Target, ExternalLink, PlayCircle, 
  LogOut, Sparkles, Trophy, Clock, ArrowRight, MapPin
} from "lucide-react";

// 🔥 Magnetic Button Component
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

// 🔥 Optimized Cinematic Background Component
const CinematicBackground = ({ images, zoomType = "in" }: { images: string[], zoomType?: "in" | "out" }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((src, i) => (
        <img 
          key={src}
          src={src} 
          alt={`Cinematic BG ${i}`} 
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

// 🔥 Dynamic Background: Light = Images, Dark = CSS Space
const DynamicBackground = ({ images, zoomType = "in" }: { images: string[], zoomType?: "in" | "out" }) => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="dark:hidden absolute inset-0">
        <CinematicBackground images={images} zoomType={zoomType} />
      </div>
      <div className="hidden dark:block absolute inset-0">
        <div className="absolute inset-0 animate-nebula-shift" />
        <div className="absolute inset-0 space-stars" />
        <div className="absolute top-1/4 left-1/4 solar-orbit-1" />
        <div className="absolute bottom-1/3 right-1/4 solar-orbit-2" />
        <div className="absolute top-1/2 left-1/2 solar-orbit-3" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/85 to-slate-950/95" />
      </div>
    </div>
  );
};

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
        <stop offset="0%" stopColor="#FD5" /><stop offset="50%" stopColor="#FF543E" /><stop offset="100%" stopColor="#C837AB" />
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

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const fullText = "World of Concept";
  const typingRef = useRef<NodeJS.Timeout | null>(null);

  const heroBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
  const whyChooseBgImages = ["/gallery2.jpg", "/gallery4.jpg", "/gallery6.jpg"];
  const scrollingBgImages = ["/gallery4.jpg", "/gallery7.jpg", "/gallery9.jpg"];
  const liveClassBgImages = ["/gallery4.jpg", "/gallery2.jpg", "/gallery5.jpg"];
  const coursesBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
  const gallerySectionBgImages = ["/gallery3.jpg", "/gallery6.jpg", "/gallery8.jpg"];
  
  const row1Images = ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg", "/gallery4.jpg", "/gallery5.jpg"];
  const row2Images = ["/gallery6.jpg", "/gallery7.jpg", "/gallery8.jpg", "/gallery9.jpg", "/gallery10.jpg"];
  const courseImages = ["/course1.jpg", "/course2.jpg", "/course3.jpg", "/course4.jpg", "/course5.jpg"];

  useEffect(() => {
    const handleType = () => {
      setTypedText(prev => {
        if (!isDeleting) {
          if (prev.length < fullText.length) return fullText.substring(0, prev.length + 1);
          setTimeout(() => setIsDeleting(true), 2500);
          return prev;
        } else {
          if (prev.length > 0) return prev.substring(0, prev.length - 1);
          setTimeout(() => setIsDeleting(false), 500);
          return prev;
        }
      });
    };
    typingRef.current = setTimeout(handleType, isDeleting ? 50 : 100);
    return () => { if (typingRef.current) clearTimeout(typingRef.current); };
  }, [typedText, isDeleting]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const studentDoc = await getDoc(doc(db, "students", firebaseUser.uid));
          if (studentDoc.exists()) setStudent(studentDoc.data() as StudentData);
        } catch (error) { console.error("Error fetching student data:", error); }
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
      <main className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-white dark:bg-slate-950">
        <div className="text-center space-y-6 px-4">
          <PureLogo size="lg" />
          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-lg tracking-wide">World of Concept लोड हो रहा है...</p>
            <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full animate-[loading_1.5s_ease-in-out_infinite]" style={{ width: '60%' }} />
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // LOGGED OUT VIEW
  // ==========================================
  if (!user) {
    return (
      <main className="relative min-h-[100dvh] bg-white dark:bg-slate-950 overflow-x-hidden flex flex-col" itemScope itemType="https://schema.org/WebPage">
        <style jsx global>{`
          @keyframes tricolor-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
          .tricolor-text { background: linear-gradient(90deg, #FF9933 0%, #FFFFFF 30%, #FFFFFF 70%, #138808 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: tricolor-shimmer 4s linear infinite; }
          @keyframes tricolor-shimmer-reverse { 0% { background-position: 200% center; } 100% { background-position: -200% center; } }
          .tricolor-text-reverse { background: linear-gradient(90deg, #138808 0%, #FFFFFF 30%, #FFFFFF 70%, #FF9933 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: tricolor-shimmer-reverse 4s linear infinite; }
          @keyframes rainbow-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
          .rainbow-shimmer-bg { background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6); background-size: 200% auto; animation: rainbow-shimmer 3s linear infinite; }
          .rainbow-shimmer-bg:hover { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.3); }
          .rainbow-shimmer-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transform: translateX(-100%); transition: transform 0.7s; }
          .rainbow-shimmer-bg:hover::after { transform: translateX(100%); }
          .rainbow-shimmer-text { background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-shimmer 3s linear infinite; }
          @keyframes ken-burns-zoom-in { 0% { transform: translate3d(0, 0, 0) scale(1.0); } 100% { transform: translate3d(-1%, -1%, 0) scale(1.08); } }
          @keyframes ken-burns-zoom-out { 0% { transform: translate3d(1%, 1%, 0) scale(1.08); } 100% { transform: translate3d(0, 0, 0) scale(1.0); } }
          .animate-ken-burns-in { animation: ken-burns-zoom-in 60s ease-in-out infinite alternate; will-change: transform; }
          .animate-ken-burns-out { animation: ken-burns-zoom-out 60s ease-in-out infinite alternate; will-change: transform; }
          @media (max-width: 768px) { .animate-ken-burns-in { animation-duration: 40s; } .animate-ken-burns-out { animation-duration: 40s; } }
          @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
          @keyframes marquee-reverse { 0% { transform: translate3d(-50%, 0, 0); } 100% { transform: translate3d(0, 0, 0); } }
          @keyframes loading { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
          .animate-marquee { animation: marquee 60s linear infinite; will-change: transform; touch-action: pan-y; }
          .animate-marquee-reverse { animation: marquee-reverse 60s linear infinite; will-change: transform; touch-action: pan-y; }
          .animate-marquee:hover, .animate-marquee-reverse:hover { animation-play-state: paused; }
          @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
          @keyframes shimmer-text { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
          .animate-shimmer-text { background: linear-gradient(90deg, #94a3b8 0%, #ffffff 50%, #94a3b8 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer-text 3s linear infinite; }
          @keyframes nebula-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
          .animate-nebula-shift { background: linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e1b4b 50%, #312e81 75%, #020617 100%); background-size: 400% 400%; animation: nebula-shift 10s ease infinite; }
          @keyframes star-zoom { 0% { transform: translateZ(0) scale(0.2); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateZ(800px) scale(4); opacity: 0; } }
          .space-stars { position: absolute; inset: 0; background: transparent; overflow: hidden; perspective: 500px; }
          .space-stars::before, .space-stars::after { content: ''; position: absolute; top: 50%; left: 50%; width: 2px; height: 2px; border-radius: 50%; box-shadow: -20vw -20vh 0 0 #fff, 30vw -10vh 0 0 #a5b4fc, -10vw 30vh 0 0 #fff, 40vw 20vh 0 0 #f472b6, -30vw 40vh 0 0 #fff, 10vw -40vh 0 0 #60a5fa, 20vw 10vh 0 0 #fff, -40vw -10vh 0 0 #c084fc, 0vw 0vw 0 0 #fff; animation: star-zoom 3s linear infinite; }
          .space-stars::after { animation-delay: 1.5s; box-shadow: 15vw -25vh 0 0 #fff, -25vw 15vh 0 0 #fbbf24, 35vw 35vh 0 0 #fff, -15vw -35vh 0 0 #34d399, 25vw -15vh 0 0 #fff, -35vw 25vh 0 0 #f87171; }
          @keyframes orbit { 0% { transform: rotate(0deg) translateX(80px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
          @keyframes orbit-reverse { 0% { transform: rotate(360deg) translateX(120px) rotate(-360deg); } 100% { transform: rotate(0deg) translateX(120px) rotate(0deg); } }
          @keyframes orbit-slow { 0% { transform: rotate(0deg) translateX(180px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); } }
          .solar-orbit-1 { width: 10px; height: 10px; background: #fbbf24; border-radius: 50%; box-shadow: 0 0 20px #fbbf24, 0 0 40px #f59e0b; animation: orbit 8s linear infinite; }
          .solar-orbit-2 { width: 8px; height: 8px; background: #60a5fa; border-radius: 50%; box-shadow: 0 0 20px #3b82f6, 0 0 40px #2563eb; animation: orbit-reverse 12s linear infinite; }
          .solar-orbit-3 { width: 6px; height: 6px; background: #f472b6; border-radius: 50%; box-shadow: 0 0 15px #ec4899, 0 0 30px #db2777; animation: orbit-slow 18s linear infinite; }
        `}</style>

        {/* 🔥 Local header removed to avoid duplication with Global Layout Header */}
        
        {/* Added pt-20 to prevent content from hiding behind the fixed global header */}
        <div className="pt-20">
          {/* 1. HERO SECTION */}
          <section className="relative min-h-[90dvh] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
            <DynamicBackground images={heroBgImages} zoomType="in" />
            <div className="absolute inset-0 z-10 bg-slate-950/80 dark:bg-transparent" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent dark:via-slate-950/85" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-sm font-semibold shadow-sm mx-auto lg:mx-0">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  2027 बैच के लिए एडमिशन खुले
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-white flex items-center" itemProp="name">
                  <span className="inline-block relative">
                    <span className="tricolor-text-reverse absolute top-0 left-0 whitespace-nowrap">
                      {typedText}
                    </span>
                    <span className="invisible whitespace-nowrap">
                      {fullText}
                    </span>
                  </span>
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium" itemProp="description">
                  बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद प्लेटफॉर्म।
                  <span className="block mt-3 text-white font-bold">
                    RK Sir के साथ सफलता की अपनी नई यात्रा शुरू करें।
                  </span>
                </p>
              </div>
              
              <div className="flex-1 w-full max-w-md lg:max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <AuthForm />
              </div>
            </div>
          </section>

          {/* 2. WHY CHOOSE US SECTION */}
          <section className="relative py-24 overflow-hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <DynamicBackground images={whyChooseBgImages} zoomType="out" />
            <div className="absolute inset-0 z-10 bg-slate-950/90 dark:bg-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
                <span className="rainbow-shimmer-text">World of Concept</span> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">क्यों चुनें?</span>
              </h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-12">बिहार बोर्ड परीक्षाओं में टॉप करने के लिए RK Sir द्वारा तैयार किया गया सब कुछ।</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: "🎬", title: "HD वीडियो लेक्चर", desc: "स्टूडियो क्वालिटी में रिकॉर्ड किए गए स्पष्ट कॉन्सेप्ट-बेस्ड पाठ।" },
                  { icon: "📝", title: "स्मार्ट नोट्स", desc: "त्वरित और प्रभावी पुनरावृत्ति के लिए संरचित, हस्तलिखित नोट्स।" },
                  { icon: "📊", title: "टेस्ट सीरीज", desc: "विस्तृत प्रदर्शन विश्लेषण के साथ अध्याय-वार और पूर्ण मॉक टेस्ट।" },
                  { icon: "💬", title: "डाउट सपोर्ट", desc: "RK Sir और उनकी समर्पित मेंटर टीम से सीधी और त्वरित सहायता।" },
                ].map((feature, i) => (
                  <div key={i} className="group bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-6 text-center hover:bg-slate-200 dark:hover:bg-slate-800/80 hover:border-blue-500/50 hover:-translate-y-2 transition-all duration-300">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center text-3xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. CINEMATIC DUAL ROW SCROLLING */}
          <section className="relative py-16 overflow-hidden border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <DynamicBackground images={scrollingBgImages} zoomType="in" />
            <div className="absolute inset-0 z-10 bg-slate-950/90 dark:bg-transparent" />

            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

            <div className="relative z-10 flex gap-4 w-max animate-marquee mb-4">
              {[...row1Images, ...row1Images, ...row1Images].map((src, i) => (
                <div key={`m1-${i}`} className="relative w-80 h-52 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800 shadow-xl group">
                  <Image src={src} alt={`Marquee 1 ${i}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-sm drop-shadow-md flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" /> World of Concept क्लास
                  </div>
                </div>
              ))}
            </div>

            <div className="relative z-10 flex gap-4 w-max animate-marquee-reverse">
              {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
                <div key={`m2-${i}`} className="relative w-80 h-52 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-800 shadow-xl group">
                  <Image src={src} alt={`Marquee 2 ${i}`} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white font-bold text-sm drop-shadow-md flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-400" /> छात्र सफलता की कहानी
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. WORLD-CLASS FOOTER */}
          <footer className="relative bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 w-full overflow-hidden border-t border-slate-200 dark:border-slate-900">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
            
            <div className="absolute inset-0 z-0">
              <iframe
                src="https://www.google.com/maps?q=Alamnagar,+Madhepura,+Bihar,+India&output=embed"
                width="100%"
                height="100%"
                style={{ 
                  border: 0,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.3) saturate(0.6)',
                  opacity: 0.6
                }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                sandbox="allow-scripts allow-same-origin allow-popups"
                title="World of Concept Location"
                allowFullScreen
              />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-100/85 dark:from-slate-950/85 via-slate-100/75 dark:via-slate-950/75 to-slate-100/85 dark:to-slate-950/85" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
              <div className="mb-8 flex items-center justify-center">
                <MagneticButton 
                  href="https://www.google.com/maps/search/Alamnagar+Madhepura+Bihar" 
                  className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900/80 rounded-full border border-slate-300 dark:border-slate-700 hover:border-orange-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-orange-500/10 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                  </span>
                  <span className="text-sm font-extrabold tracking-wide text-slate-900 dark:text-white">
                    आलमनगर, बिहार
                  </span>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
                </MagneticButton>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
                <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
                  <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                    <PureLogo size="sm" />
                    <span className="font-extrabold text-lg sm:text-xl tracking-tight">World of Concept</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-slate-600 dark:text-slate-400">
                    बिहार के छात्रों को विश्व स्तरीय शिक्षा, संरचित मार्गदर्शन और सफलता का सिद्ध मार्ग प्रदान करना।
                  </p>
                  <div className="flex gap-3 sm:gap-4 pt-2">
                    <MagneticButton href="https://youtube.com/@JoinWorldofConcept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><YoutubeIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
                    <MagneticButton href="https://instagram.com/join_world_of_concept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
                    <MagneticButton href="https://facebook.com/worldofconcept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
                    <MagneticButton href="https://t.me/JoinWorldofConcept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-400 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
                  </div>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">प्लेटफॉर्म</h4>
                  <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <li><a href="#available-courses" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">सभी कोर्सेस</a></li>
                    <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">हमें क्यों चुनें</a></li>
                    <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">छात्र सफलता की कहानियां</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">कानूनी</h4>
                  <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <li><a href="/privacy" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">गोपनीयता नीति</a></li>
                    <li><a href="/terms" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">सेवा की शर्तें</a></li>
                    <li><a href="/refund" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">रिफंड नीति</a></li>
                    <li><a href="/contact" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">संपर्क करें</a></li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">सहायता</h4>
                  <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                    <li className="flex items-center gap-2 sm:gap-3"><span>📧</span> support@worldofconcept.in</li>
                    <li className="flex items-center gap-2 sm:gap-3"><span>📞</span> +91 7979096954</li>
                    <li className="flex items-center gap-2 sm:gap-3"><span>📍</span> अलमनगर, बिहार, भारत</li>
                  </ul>
                </div>
              </div>

              <div className="pt-6 sm:pt-8 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 px-2">
                <p>© {new Date().getFullYear()} World of Concept. सर्वाधिकार सुरक्षित।</p>
                <MagneticButton 
                  href="https://www.google.com/search?q=Mukesh+Kumar+Malakar" 
                  className="flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-all duration-300 group" 
                  title="Designed and Developed by Mukesh Kumar Malakar"
                >
                  <span>निर्मित</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 group-hover:text-orange-500 group-hover:scale-125 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>द्वारा <span className="font-bold text-slate-900 dark:text-white">Mukesh Kumar Malakar</span></span>
                </MagneticButton>
              </div>
            </div>
          </footer>
        </div>
      </main>
    );
  }

  // ==========================================
  // LOGGED IN VIEW (Dashboard)
  // ==========================================
  return (
    <main className="min-h-[100dvh] bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 flex flex-col relative overflow-x-hidden w-full transition-colors duration-300">
      <style jsx global>{`
        @keyframes rainbow-shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
        .rainbow-shimmer-bg { background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6); background-size: 200% auto; animation: rainbow-shimmer 3s linear infinite; }
        .rainbow-shimmer-bg:hover { box-shadow: 0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(236, 72, 153, 0.3); }
        .rainbow-shimmer-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); transform: translateX(-100%); transition: transform 0.7s; }
        .rainbow-shimmer-bg:hover::after { transform: translateX(100%); }
        .rainbow-shimmer-text { background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f43f5e, #3b82f6); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: rainbow-shimmer 3s linear infinite; }
        @keyframes marquee { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        @keyframes marquee-reverse { 0% { transform: translate3d(-50%, 0, 0); } 100% { transform: translate3d(0, 0, 0); } }
        .animate-marquee { animation: marquee 60s linear infinite; will-change: transform; touch-action: pan-y; }
        .animate-marquee-reverse { animation: marquee-reverse 60s linear infinite; will-change: transform; touch-action: pan-y; }
        .animate-marquee:hover, .animate-marquee-reverse:hover { animation-play-state: paused; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        @keyframes shimmer-text { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .animate-shimmer-text { background: linear-gradient(90deg, #60a5fa 0%, #ffffff 50%, #818cf8 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer-text 3s linear infinite; }
        @keyframes ken-burns-zoom-in { 0% { transform: translate3d(0, 0, 0) scale(1.0); } 100% { transform: translate3d(-1%, -1%, 0) scale(1.08); } }
        @keyframes ken-burns-zoom-out { 0% { transform: translate3d(1%, 1%, 0) scale(1.08); } 100% { transform: translate3d(0, 0, 0) scale(1.0); } }
        .animate-ken-burns-in { animation: ken-burns-zoom-in 60s ease-in-out infinite alternate; will-change: transform; }
        .animate-ken-burns-out { animation: ken-burns-zoom-out 60s ease-in-out infinite alternate; will-change: transform; }
        @media (max-width: 768px) { .animate-ken-burns-in { animation-duration: 40s; } .animate-ken-burns-out { animation-duration: 40s; } }
        @keyframes nebula-shift { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-nebula-shift { background: linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e1b4b 50%, #312e81 75%, #020617 100%); background-size: 400% 400%; animation: nebula-shift 10s ease infinite; }
        @keyframes star-zoom { 0% { transform: translateZ(0) scale(0.2); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateZ(800px) scale(4); opacity: 0; } }
        .space-stars { position: absolute; inset: 0; background: transparent; overflow: hidden; perspective: 500px; }
        .space-stars::before, .space-stars::after { content: ''; position: absolute; top: 50%; left: 50%; width: 2px; height: 2px; border-radius: 50%; box-shadow: -20vw -20vh 0 0 #fff, 30vw -10vh 0 0 #a5b4fc, -10vw 30vh 0 0 #fff, 40vw 20vh 0 0 #f472b6, -30vw 40vh 0 0 #fff, 10vw -40vh 0 0 #60a5fa, 20vw 10vh 0 0 #fff, -40vw -10vh 0 0 #c084fc, 0vw 0vw 0 0 #fff; animation: star-zoom 3s linear infinite; }
        .space-stars::after { animation-delay: 1.5s; box-shadow: 15vw -25vh 0 0 #fff, -25vw 15vh 0 0 #fbbf24, 35vw 35vh 0 0 #fff, -15vw -35vh 0 0 #34d399, 25vw -15vh 0 0 #fff, -35vw 25vh 0 0 #f87171; }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(80px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(80px) rotate(-360deg); } }
        @keyframes orbit-reverse { 0% { transform: rotate(360deg) translateX(120px) rotate(-360deg); } 100% { transform: rotate(0deg) translateX(120px) rotate(0deg); } }
        @keyframes orbit-slow { 0% { transform: rotate(0deg) translateX(180px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(180px) rotate(-360deg); } }
        .solar-orbit-1 { width: 10px; height: 10px; background: #fbbf24; border-radius: 50%; box-shadow: 0 0 20px #fbbf24, 0 0 40px #f59e0b; animation: orbit 8s linear infinite; }
        .solar-orbit-2 { width: 8px; height: 8px; background: #60a5fa; border-radius: 50%; box-shadow: 0 0 20px #3b82f6, 0 0 40px #2563eb; animation: orbit-reverse 12s linear infinite; }
        .solar-orbit-3 { width: 6px; height: 6px; background: #f472b6; border-radius: 50%; box-shadow: 0 0 15px #ec4899, 0 0 30px #db2777; animation: orbit-slow 18s linear infinite; }
      `}</style>

      {/* 🔥 LOGGED IN HEADER (Theme Toggle handled globally in layout.tsx) */}
      <header className="bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-all duration-300 w-full backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <Image src="/logo.png" alt="World of Concept" fill className="object-contain" priority />
              </div>
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">
                World of Concept
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{student?.fullName || "छात्र"}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{student?.email || user?.email}</p>
              </div>
              
              <MagneticButton 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-300 border border-red-200 dark:border-red-500/30 hover:border-red-300 dark:hover:border-red-400/50 hover:shadow-md"
              >
                <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">लॉगआउट</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 relative w-full">
        <div className="relative z-10 space-y-8 sm:space-y-12 lg:space-y-16 w-full">
          <div className="animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-2">
              वापसी पर स्वागत है, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">{student?.fullName?.split(" ")[0] || "छात्र"}</span> 👋
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें। आइए आज को उत्पादक बनाएं!</p>
          </div>

          {/* LIVE CLASS CARD */}
          <div className="animate-fade-in-up w-full relative overflow-hidden rounded-2xl border border-red-200 dark:border-red-800/50 hover:border-orange-500/50 transition-all duration-500 shadow-xl dark:shadow-red-950/40 group bg-white dark:bg-slate-900">
            <DynamicBackground images={liveClassBgImages} zoomType="out" />
            <div className="absolute inset-0 z-10 bg-gradient-to-br from-red-50/90 via-red-100/85 to-orange-50/80 dark:from-red-950/90 dark:via-red-900/85 dark:to-orange-900/80" />
            
            <div className="relative z-10 p-4 sm:p-8 flex flex-col sm:flex-row items-center text-center sm:text-left gap-6 w-full">
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 flex items-center gap-1.5 sm:gap-2 bg-red-600 text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold shadow-lg animate-pulse z-20 border-2 border-white/20">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-ping"></span>
                LIVE NOW
              </div>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-500 flex-shrink-0 shadow-2xl shadow-black/40">
                <span className="text-red-700">▶️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-2 w-full leading-tight">RK Sir के साथ दैनिक लाइव क्लास</h3>
                <p className="text-red-800/90 dark:text-orange-100/95 text-xs sm:text-base w-full max-w-xl font-medium">दैनिक लाइव सत्र में शामिल हों, रियल टाइम में अपने संदेह दूर करें।</p>
              </div>
              <MagneticButton 
                href="https://www.youtube.com/@JoinWorldofConcept" 
                className="inline-flex items-center justify-center gap-2 bg-red-600 dark:bg-white text-white dark:text-red-900 px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl text-sm sm:text-base font-extrabold hover:bg-red-700 dark:hover:bg-orange-50 transition-all duration-300 shadow-2xl shadow-black/40 whitespace-nowrap border-2 border-transparent dark:border-white/50 hover:border-orange-300"
              >
                <PlayCircle className="w-5 h-5" /> अभी जुड़ें
              </MagneticButton>
            </div>
          </div>

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full">
            {[
              { icon: "📚", label: "कुल कोर्सेस", value: "0", color: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20", delay: "0s" },
              { icon: "✅", label: "पूर्ण", value: "0", color: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-200 dark:border-green-500/20", delay: "0.1s" },
              { icon: "🎯", label: "प्रगति में", value: "0", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-500/20", delay: "0.2s" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 animate-fade-in-up hover:shadow-xl hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300" style={{ animationDelay: stat.delay }}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} border rounded-xl flex items-center justify-center shadow-sm`}>
                    <span className="text-xl sm:text-2xl">{stat.icon}</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* AVAILABLE COURSES RAIL */}
          <div id="available-courses" className="animate-fade-in-up w-full relative overflow-hidden rounded-3xl" style={{ animationDelay: "0.4s" }}>
            <DynamicBackground images={coursesBgImages} zoomType="in" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-50/85 via-slate-100/90 to-slate-50/95 dark:from-slate-950/85 dark:via-slate-950/90 dark:to-slate-950/95" />
            
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 px-2 pt-4">
                <div>
                  <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white rainbow-shimmer-text mb-2">उपलब्ध कोर्सेस</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base">बिहार बोर्ड परीक्षाओं के लिए RK Sir के साथ पूर्ण तैयारी</p>
                </div>
                <MagneticButton 
                  href="/courses" 
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm transition-colors group"
                >
                  सभी देखें <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </MagneticButton>
              </div>
              
              <div className="relative w-full overflow-hidden py-4">
                <div className="flex gap-4 sm:gap-5 w-max animate-marquee-reverse touch-pan-y">
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
                      <div key={`course-${i}`} className="relative w-[85vw] max-w-[300px] sm:w-72 md:w-80 lg:w-96 flex-shrink-0 group" style={{ animationDelay: `${(i % 5) * 0.1}s` }}>
                        <div className="bg-white dark:bg-slate-800/60 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 ease-out hover:-translate-y-2 h-full flex flex-col">
                          <div className="relative h-40 sm:h-56 overflow-hidden">
                            <Image src={src} alt={course.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                              <span className="bg-blue-600/90 text-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                                {course.badge}
                              </span>
                            </div>
                            <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                              <h3 className="text-white font-bold text-sm sm:text-lg drop-shadow-lg leading-tight line-clamp-2">{course.title}</h3>
                            </div>
                          </div>
                          <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
                            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{course.desc}</p>
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">{course.price}</span>
                              <MagneticButton 
                                href={`/test-payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`}
                                className="block w-full text-center rainbow-shimmer-bg text-white font-bold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm whitespace-nowrap"
                              >
                                <span className="relative z-10 flex items-center justify-center gap-1">
                                  अभी नामांकन करें <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </span>
                              </MagneticButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* CINEMATIC GALLERY */}
          <div className="animate-fade-in-up w-full relative overflow-hidden rounded-3xl" style={{ animationDelay: "0.6s" }}>
            <DynamicBackground images={gallerySectionBgImages} zoomType="out" />
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-50/85 via-slate-100/90 to-slate-50/95 dark:from-slate-950/85 dark:via-slate-950/90 dark:to-slate-950/95" />

            <div className="relative z-10">
              <div className="text-center mb-6 sm:mb-8 px-2 pt-4">
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white rainbow-shimmer-text mb-2">World of Concept में जीवन</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-xl mx-auto">हमारी कक्षाओं, सत्रों और छात्रों की सफलता की झलकियां</p>
              </div>

              <div className="relative w-full overflow-hidden py-4 sm:py-6">
                <div className="flex gap-4 w-max animate-marquee touch-pan-y mb-4 sm:mb-6">
                  {[...row1Images, ...row1Images, ...row1Images].map((src, i) => (
                    <div key={`row1-${i}`} className="relative w-[85vw] max-w-[300px] sm:w-64 md:w-72 h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden group flex-shrink-0 border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/50 transition-all duration-500 ease-out hover:-translate-y-2">
                      <Image src={src} alt={`Gallery Row 1 Image ${i}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                          <PlayCircle className="w-4 h-4" /> World of Concept क्लास
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 w-max animate-marquee-reverse touch-pan-y">
                  {[...row2Images, ...row2Images, ...row2Images].map((src, i) => (
                    <div key={`row2-${i}`} className="relative w-[85vw] max-w-[300px] sm:w-64 md:w-72 h-40 sm:h-48 md:h-56 rounded-2xl overflow-hidden group flex-shrink-0 border border-slate-200 dark:border-slate-700/50 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/20 hover:border-yellow-500/50 transition-all duration-500 ease-out hover:-translate-y-2">
                      <Image src={src} alt={`Gallery Row 2 Image ${i}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-yellow-400" /> छात्र सफलता की कहानी
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* WORLD-CLASS FOOTER */}
      <footer className="relative bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12 lg:mt-20 w-full overflow-hidden border-t border-slate-200 dark:border-slate-900">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="absolute inset-0 z-0">
          <iframe
            src="https://www.google.com/maps?q=Alamnagar,+Madhepura,+Bihar,+India&output=embed"
            width="100%"
            height="100%"
            style={{ 
              border: 0,
              position: 'absolute',
              top: 0,
              left: 0,
              filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.3) saturate(0.6)',
              opacity: 0.6
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups"
            title="World of Concept Location"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-100/85 dark:from-slate-950/85 via-slate-100/75 dark:via-slate-950/75 to-slate-100/85 dark:to-slate-950/85" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-8 flex items-center justify-center">
            <MagneticButton 
              href="https://www.google.com/maps/search/Alamnagar+Madhepura+Bihar" 
              className="group relative inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900/80 rounded-full border border-slate-300 dark:border-slate-700 hover:border-orange-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-orange-500/10 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <span className="text-sm font-extrabold tracking-wide text-slate-900 dark:text-white">
                आलमनगर, बिहार
              </span>
              <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-orange-400 transition-colors" />
            </MagneticButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-16">
            <div className="sm:col-span-2 lg:col-span-1 space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                <PureLogo size="sm" />
                <span className="font-extrabold text-lg sm:text-xl tracking-tight">World of Concept</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-xs text-slate-600 dark:text-slate-400">बिहार के छात्रों को विश्व स्तरीय शिक्षा, संरचित मार्गदर्शन और सफलता का सिद्ध मार्ग प्रदान करना।</p>
              <div className="flex gap-3 sm:gap-4 pt-2">
                <MagneticButton href="https://youtube.com/@JoinWorldofConcept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-red-600 hover:border-red-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><YoutubeIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
                <MagneticButton href="https://instagram.com/join_world_of_concept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-pink-600 hover:border-pink-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
                <MagneticButton href="https://facebook.com/worldofconcept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:border-blue-500 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><FacebookIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
                <MagneticButton href="https://t.me/JoinWorldofConcept" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 flex items-center justify-center hover:bg-sky-500 hover:border-sky-400 hover:text-white dark:hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-110"><TelegramIcon className="w-5 h-5 sm:w-6 sm:h-6" /></MagneticButton>
              </div>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">प्लेटफॉर्म</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li><a href="#available-courses" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">सभी कोर्सेस</a></li>
                <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">हमें क्यों चुनें</a></li>
                <li><a href="#" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">छात्र सफलता की कहानियां</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">कानूनी</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li><a href="/privacy" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">गोपनीयता नीति</a></li>
                <li><a href="/terms" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">सेवा की शर्तें</a></li>
                <li><a href="/refund" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">रिफंड नीति</a></li>
                <li><a href="/contact" className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300">संपर्क करें</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-4 sm:mb-6 text-xs sm:text-sm uppercase tracking-wider">सहायता</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
                <li className="flex items-center gap-2 sm:gap-3"><span>📧</span> support@worldofconcept.in</li>
                <li className="flex items-center gap-2 sm:gap-3"><span>📞</span> +91 7979096954</li>
                <li className="flex items-center gap-2 sm:gap-3"><span>📍</span> अलमनगर, बिहार, भारत</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 sm:pt-8 border-t border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 px-2">
            <p>© {new Date().getFullYear()} World of Concept. सर्वाधिकार सुरक्षित।</p>
            <MagneticButton 
              href="https://www.google.com/search?q=Mukesh+Kumar+Malakar" 
              className="flex items-center gap-1.5 sm:gap-2 hover:scale-105 transition-all duration-300 group" 
              title="Designed and Developed by Mukesh Kumar Malakar"
            >
              <span>निर्मित</span>
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 group-hover:text-orange-500 group-hover:scale-125 transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>द्वारा <span className="font-bold text-slate-900 dark:text-white">Mukesh Kumar Malakar</span></span>
            </MagneticButton>
          </div>
        </div>
      </footer>
    </main>
  );
}