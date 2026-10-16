/* eslint-disable */
"use client";

import { useEffect, useState, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ThemeToggle"; 
import AdPopup from "@/components/AdPopup"; 
import { 
  BookOpen, CheckCircle2, Target, ExternalLink, PlayCircle, 
  Bell, LogOut, Sparkles, Trophy, Clock, ArrowRight,
  Calendar, MessageCircle, MapPin
} from "lucide-react";

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

// 🔥 Dynamic Background: Light = Images, Dark = CSS Space (Zero Glitch, Ultra Smooth)
const DynamicBackground = ({ images, zoomType = "in" }: { images: string[], zoomType?: "in" | "out" }) => {
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
      {/* ☀️ LIGHT MODE: Cinematic Images */}
      <div className="dark:hidden absolute inset-0">
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

      {/* 🌙 DARK MODE: Pure CSS Space/Solar System (Ultra Smooth, Zero Network Load) */}
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

const YouTubeVideoCard = ({ video }: { video: { id: string; title: string } }) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (cardRef.current) observer.unobserve(cardRef.current);
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => {
      if (cardRef.current) observer.unobserve(cardRef.current);
    };
  }, []);

  return (
    <div ref={cardRef} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0 group">
      <div className="bg-white dark:bg-slate-800/40 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
          {!isIntersecting ? (
            <>
              {!imageLoaded && <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />}
              <Image
                src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                alt={video.title}
                fill
                className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 dark:bg-black/30 group-hover:bg-black/20 transition-all duration-300">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">NEW</div>
            </>
          ) : (
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&rel=0&modestbranding=1&loop=1&playlist=${video.id}`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          )}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
            <YoutubeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>World of Concept</span>
            <span>•</span>
            <span>Just now</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [updates, setUpdates] = useState<UpdateData[]>([]);

  const welcomeBgImages = ["/gallery2.jpg", "/gallery4.jpg", "/gallery6.jpg"];
  const liveClassBgImages = ["/gallery4.jpg", "/gallery2.jpg", "/gallery5.jpg"];
  const videosBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
  const statsBgImages = ["/gallery6.jpg", "/gallery8.jpg", "/gallery10.jpg"];
  const coursesBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
  const gallerySectionBgImages = ["/gallery3.jpg", "/gallery6.jpg", "/gallery8.jpg"];
  const updatesBgImages = ["/gallery5.jpg", "/gallery7.jpg", "/gallery9.jpg"];

  const row1Images = ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg", "/gallery4.jpg", "/gallery5.jpg"];
  const row2Images = ["/gallery6.jpg", "/gallery7.jpg", "/gallery8.jpg", "/gallery9.jpg", "/gallery10.jpg"];

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

  if (!authChecked || loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FFF9F0] dark:bg-slate-950 flex items-center justify-center transition-colors duration-700">
        <div className="text-center space-y-4 px-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-slate-600 dark:text-slate-300 font-bold text-lg tracking-wide">World of Concept</p>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm animate-pulse">आपका डैशबोर्ड लोड हो रहा है...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-[100dvh] bg-[#FFF9F0] dark:bg-slate-950 flex items-center justify-center transition-colors duration-700">
        <div className="text-center space-y-4 px-4">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-base font-medium">छात्र डेटा लोड करने में असमर्थ</p>
          <MagneticButton 
            onClick={() => window.location.replace("/")} 
            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            होम पर जाएं
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FFF9F0] dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative font-sans w-full overflow-x-hidden overscroll-y-auto transition-colors duration-700">
      <AdPopup />

      <style jsx global>{`
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
        
        @keyframes marquee-seamless { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-50%, 0, 0); } }
        .animate-marquee-seamless { animation: marquee-seamless 40s linear infinite; will-change: transform; touch-action: pan-y; }
        .animate-marquee-seamless:hover { animation-play-state: paused; }
        
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out forwards; }
        
        @keyframes shimmer { 0% { background-position: -1000px 0; } 100% { background-position: 1000px 0; } }
        @keyframes shimmer-reverse { 0% { background-position: 1000px 0; } 100% { background-position: -1000px 0; } }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(3deg); } }
        .animate-float { animation: float 4s ease-in-out infinite; }
        
        @keyframes shimmer-text { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        .animate-shimmer-text { background: linear-gradient(90deg, #60a5fa 0%, #ffffff 50%, #818cf8 100%); background-size: 200% auto; -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer-text 3s linear infinite; }
        
        .shimmer-effect { background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.4) 50%, rgba(255, 255, 255, 0) 100%); background-size: 1000px 100%; animation: shimmer 2s infinite linear; }
        .shimmer-effect-reverse { background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 100%); background-size: 1000px 100%; animation: shimmer-reverse 2.5s infinite linear; }
        
        @keyframes gradient-pan { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
        .animate-living-gradient { background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%); background-size: 200% 200%; animation: gradient-pan 15s ease infinite; }

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

      {/* 🔥 CLEAN HEADER (Branding Removed, Right-Aligned, Compact) */}
      <header className="bg-[#FFF9F0]/90 dark:bg-slate-950/90 sticky top-0 z-50 shadow-sm transition-all duration-500 w-full backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-end items-center h-14 sm:h-16 gap-3 sm:gap-6">
            <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-orange-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FFF9F0] dark:border-slate-950 animate-pulse"></span>
            </button>
            <div className="hidden sm:flex items-center gap-3 pl-4">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{student.fullName}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                {student.fullName.charAt(0).toUpperCase()}
              </div>
            </div>
            <MagneticButton 
              onClick={handleLogout} 
              className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300"
            >
              <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">लॉगआउट</span>
            </MagneticButton>
          </div>
        </div>
      </header>

      <main className="relative w-full">
        
        {/* 🔥 1. WELCOME CARD (Compact & Borderless) */}
        <div className="animate-fade-in-up relative overflow-hidden rounded-3xl shadow-xl max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8 mb-6 sm:mb-8">
          <DynamicBackground images={welcomeBgImages} zoomType="in" />
          <div className="absolute inset-0 z-0 animate-living-gradient dark:bg-transparent" />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-purple-950/80 dark:bg-transparent" />
          <div className="absolute inset-0 z-0 shimmer-effect opacity-40 dark:opacity-20" />
          
          <div className="relative z-10 p-4 sm:p-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-xs sm:text-sm font-semibold mb-3">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>छात्र डैशबोर्ड</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 leading-tight">
              वापसी पर स्वागत है, {student.fullName.split(" ")[0]} 👋
            </h1>
            <p className="text-blue-100 text-sm sm:text-lg max-w-2xl">
              RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें। निरंतरता बनाए रखें!
            </p>
          </div>
        </div>

        {/* 🔥 2. LIVE CLASS BANNER (Compact, Borderless, Floating Elements) */}
        <div className="animate-fade-in-up w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-10" style={{ animationDelay: "0.1s" }}>
          <div className="relative overflow-hidden rounded-2xl w-full shadow-xl group bg-white dark:bg-slate-900">
            <DynamicBackground images={liveClassBgImages} zoomType="out" />
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-red-950/85 via-red-900/80 to-orange-900/75 dark:bg-transparent" />
            <div className="absolute inset-0 z-0 shimmer-effect-reverse opacity-40 dark:opacity-20" />

            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
              <div className="absolute top-4 left-4 sm:top-8 sm:left-10 text-white/30 animate-float" style={{ animationDelay: '0s' }}>
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </div>
              <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 text-orange-200/20 animate-float" style={{ animationDelay: '1.5s' }}>
                <Sparkles className="w-6 h-6 sm:w-10 sm:h-10" />
              </div>
            </div>
            
            <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 w-full">
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg animate-pulse z-20">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                LIVE NOW
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-xl sm:text-3xl flex-shrink-0 shadow-xl">
                <span className="text-red-700">▶️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mb-1 w-full leading-tight">
                  RK Sir के साथ दैनिक लाइव क्लास
                </h3>
                <p className="text-red-800/90 dark:text-orange-100/95 text-xs sm:text-sm w-full max-w-xl">
                  दैनिक लाइव सत्र में शामिल हों, रियल टाइम में संदेह दूर करें।
                </p>
              </div>
              <MagneticButton 
                href="https://www.youtube.com/@JoinWorldofConcept" 
                className="inline-flex items-center justify-center gap-2 bg-red-600 dark:bg-white text-white dark:text-red-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm font-extrabold hover:bg-red-700 dark:hover:bg-orange-50 transition-all duration-300 shadow-lg whitespace-nowrap"
              >
                <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" /> अभी जुड़ें
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* 🔥 3. YOUTUBE VIDEO SECTION (TRUE EDGELESS & FRICTIONLESS) */}
        <div className="mb-6 sm:mb-10 animate-fade-in-up relative" style={{ animationDelay: "0.2s" }}>
          <DynamicBackground images={videosBgImages} zoomType="in" />
          <div className="absolute inset-0 z-0 animate-living-gradient dark:bg-transparent" />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95 dark:bg-transparent" />
          
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-4 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <YoutubeIcon className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white rainbow-shimmer-text">
                  RK Sir के लेटेस्ट वीडियो
                </h2>
              </div>
              <MagneticButton href="https://www.youtube.com/@JoinWorldofConcept" className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 font-semibold text-sm flex items-center gap-1">
                देखें <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
            
            {/* Edgeless Rail Container */}
            <div className="relative w-screen -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-2">
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              
              <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8" style={{ animationDirection: 'reverse' }}>
                {[...youtubeVideos, ...youtubeVideos].map((video, i) => (
                  <YouTubeVideoCard key={`yt-${i}`} video={video} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 4. STATS CARDS (NO BORDER, COMPACT, BORDERLESS) */}
        <div className="mb-6 sm:mb-10 animate-fade-in-up max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ animationDelay: "0.3s" }}>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mb-4 px-1 rainbow-shimmer-text">आपकी प्रगति</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {[
              { icon: BookOpen, label: "उपलब्ध कोर्सेस", value: availableCourses.length, color: "bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400", delay: "0.3s" },
              { icon: CheckCircle2, label: "पूर्ण किए", value: "0", color: "bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400", delay: "0.4s" },
              { icon: Target, label: "प्रगति में", value: "0", color: "bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400", delay: "0.5s" },
            ].map((stat, i) => (
              <div key={i} className="bg-white dark:bg-slate-800/40 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300" style={{ animationDelay: stat.delay }}>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                    <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 5. AVAILABLE COURSES (TRUE EDGELESS & FRICTIONLESS) */}
        <div className="mb-6 sm:mb-10 animate-fade-in-up relative" style={{ animationDelay: "0.6s" }}>
          <DynamicBackground images={coursesBgImages} zoomType="in" />
          <div className="absolute inset-0 z-0 animate-living-gradient dark:bg-transparent" />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95 dark:bg-transparent" />
          
          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between mb-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white rainbow-shimmer-text">उपलब्ध कोर्सेस</h2>
              <MagneticButton href="/courses" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-sm flex items-center gap-1">
                सभी देखें <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
            
            {/* Edgeless Rail Container */}
            <div className="relative w-screen -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-2">
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              
              <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
                {[...availableCourses, ...availableCourses].map((course, i) => (
                  <div key={`avail-course-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0 group">
                    <div className="bg-white dark:bg-slate-800/40 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 h-full flex flex-col">
                      <div className="relative h-36 sm:h-44 overflow-hidden">
                        <Image src={course.image} alt={course.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        <div className="absolute top-2 left-2">
                          <span className="bg-blue-600/90 text-white px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold">
                            {course.badge}
                          </span>
                        </div>
                        <div className="absolute bottom-2 left-2 right-2">
                          <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg leading-tight line-clamp-2">{course.title}</h3>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
                        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-3 line-clamp-2">{course.desc}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{course.price}</span>
                          <MagneticButton href={`/test-payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`} className="block text-center rainbow-shimmer-bg text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm whitespace-nowrap">
                            नामांकन करें
                          </MagneticButton>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 6. CINEMATIC GALLERY (TRUE EDGELESS & FRICTIONLESS) */}
        <div className="mb-6 sm:mb-10 animate-fade-in-up relative" style={{ animationDelay: "0.7s" }}>
          <DynamicBackground images={gallerySectionBgImages} zoomType="out" />
          <div className="absolute inset-0 z-0 animate-living-gradient dark:bg-transparent" />
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95 dark:bg-transparent" />

          <div className="relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-4 pt-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white rainbow-shimmer-text">World of Concept में जीवन</h2>
            </div>

            {/* Edgeless Rail Container */}
            <div className="relative w-screen -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-2">
              <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />

              <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y mb-3 sm:mb-4 pl-4 sm:pl-6 lg:pl-8" style={{ animationDirection: 'reverse' }}>
                {[...row1Images, ...row1Images].map((src, i) => (
                  <div key={`row1-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <Image src={src} alt={`Gallery Row 1 Image ${i}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                        <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" /> World of Concept क्लास
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
                {[...row2Images, ...row2Images].map((src, i) => (
                  <div key={`row2-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <Image src={src} alt={`Gallery Row 2 Image ${i}`} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" /> छात्र सफलता
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 7. RK SIR UPDATES (NO BORDER, COMPACT) */}
        <div className="mb-8 sm:mb-12 animate-fade-in-up max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" style={{ animationDelay: "0.8s" }}>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 rainbow-shimmer-text mb-4">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 dark:text-indigo-400" />
            RK Sir के अपडेट्स
          </h2>
          
          {updates.length === 0 ? (
            <div className="bg-white dark:bg-slate-800/40 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-slate-500 dark:text-slate-400 text-sm">अभी कोई अपडेट नहीं है। जल्द ही RK Sir से नई अपडेट्स आने वाली हैं!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {updates.map((update) => (
                <div key={update.id} className="group bg-white dark:bg-slate-800/40 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                  {update.imageUrl && (
                    <div className="relative h-36 sm:h-40 overflow-hidden">
                      <Image src={update.imageUrl} alt={update.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-white ${update.type === "announcement" ? "bg-blue-500/80" : update.type === "motivation" ? "bg-purple-500/80" : "bg-green-500/80"}`}>
                          {update.type === "announcement" ? "📢 घोषणा" : update.type === "motivation" ? "💪 प्रेरणा" : "💡 टिप"}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-sm sm:text-base">{update.title}</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-2 line-clamp-2">{update.description}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {update.timestamp?.toDate().toLocaleDateString("hi-IN", { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* 🔥 WORLD-CLASS FOOTER (Compact & Borderless) */}
      <footer className="relative bg-[#FFF9F0] dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 w-full overflow-hidden">
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
              opacity: 0.4
            }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            sandbox="allow-scripts allow-same-origin allow-popups"
            title="World of Concept Location"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F0]/90 dark:from-slate-950/90 via-[#FFF9F0]/80 dark:via-slate-950/80 to-[#FFF9F0]/90 dark:to-slate-950/90" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-center">
            <MagneticButton 
              href="https://www.google.com/maps/search/Alamnagar+Madhepura+Bihar" 
              className="group relative inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900/80 rounded-full shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-extrabold tracking-wide text-slate-900 dark:text-white">
                आलमनगर, बिहार
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500 dark:text-slate-400 group-hover:text-orange-500 transition-colors" />
            </MagneticButton>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
            <div className="col-span-2 sm:col-span-1 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Image src="/logo.png" alt="World of Concept" width={32} height={32} className="object-contain" />
                <span className="font-extrabold text-sm sm:text-base tracking-tight">World of Concept</span>
              </div>
              <p className="text-[10px] sm:text-xs leading-relaxed text-slate-600 dark:text-slate-400">बिहार के छात्रों को विश्व स्तरीय शिक्षा प्रदान करना।</p>
              <div className="flex gap-2 pt-1">
                <MagneticButton href="https://youtube.com/@JoinWorldofConcept" className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all duration-300 shadow-sm"><YoutubeIcon className="w-4 h-4" /></MagneticButton>
                <MagneticButton href="https://instagram.com/join_world_of_concept" className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-pink-600 hover:text-white transition-all duration-300 shadow-sm"><InstagramIcon className="w-4 h-4" /></MagneticButton>
                <MagneticButton href="https://facebook.com/worldofconcept" className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-sm"><FacebookIcon className="w-4 h-4" /></MagneticButton>
                <MagneticButton href="https://t.me/JoinWorldofConcept" className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all duration-300 shadow-sm"><TelegramIcon className="w-4 h-4" /></MagneticButton>
              </div>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-3 text-[10px] sm:text-xs uppercase tracking-wider">प्लेटफॉर्म</h4>
              <ul className="space-y-2 text-[10px] sm:text-xs">
                <li><a href="/courses" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">सभी कोर्सेस</a></li>
                <li><a href="#" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">हमें क्यों चुनें</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-3 text-[10px] sm:text-xs uppercase tracking-wider">कानूनी</h4>
              <ul className="space-y-2 text-[10px] sm:text-xs">
                <li><a href="/privacy" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">गोपनीयता नीति</a></li>
                <li><a href="/terms" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">सेवा की शर्तें</a></li>
                <li><a href="/refund" className="hover:text-orange-600 dark:hover:text-orange-400 transition-colors">रिफंड नीति</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 dark:text-white font-bold mb-3 text-[10px] sm:text-xs uppercase tracking-wider">सहायता</h4>
              <ul className="space-y-2 text-[10px] sm:text-xs">
                <li className="flex items-center gap-1.5"><span>📧</span> support@worldofconcept.in</li>
                <li className="flex items-center gap-1.5"><span>📞</span> +91 7979096954</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
            <p>© {new Date().getFullYear()} World of Concept. सर्वाधिकार सुरक्षित।</p>
            <MagneticButton 
              href="https://www.google.com/search?q=Mukesh+Kumar+Malakar" 
              className="flex items-center gap-1.5 hover:text-orange-500 transition-colors" 
              title="Designed and Developed by Mukesh Kumar Malakar"
            >
              <span>निर्मित</span>
              <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span>द्वारा <span className="font-bold">Mukesh Kumar Malakar</span></span>
            </MagneticButton>
          </div>
        </div>
      </footer>
    </div>
  );
}