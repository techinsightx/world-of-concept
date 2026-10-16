/* eslint-disable */
"use client";

import { useState, useEffect, useRef } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, PlayCircle } from "lucide-react";

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

// 🔥 5 Default Courses (Always Visible)
const defaultCourses = [
  { 
    id: "default-1",
    title: "गणित: ऑब्जेक्टिव मास्टरक्लास", 
    price: "₹499", 
    badge: "कक्षा 10", 
    description: "शॉर्टकट के साथ संपूर्ण गणित की तैयारी।", 
    imageUrl: "/course1.jpg"
  },
  { 
    id: "default-2",
    title: "विज्ञान: संपूर्ण रिवीजन", 
    price: "₹699", 
    badge: "कक्षा 10", 
    description: "भौतिकी, रसायन विज्ञान, जीव विज्ञान का पूर्ण कवरेज।", 
    imageUrl: "/course2.jpg"
  },
  { 
    id: "default-3",
    title: "इंटर: संपूर्ण टॉपर बैच", 
    price: "₹999", 
    badge: "कक्षा 12", 
    description: "मॉक टेस्ट के साथ सभी विषय शामिल।", 
    imageUrl: "/course3.jpg"
  },
  { 
    id: "default-4",
    title: "अंग्रेजी: व्याकरण और लेखन", 
    price: "₹399", 
    badge: "सभी कक्षाएं", 
    description: "अंग्रेजी भाषा में आसानी से महारत हासिल करें।", 
    imageUrl: "/course4.jpg"
  },
  { 
    id: "default-5",
    title: "सामाजिक विज्ञान: पूर्ण कोर्स", 
    price: "₹599", 
    badge: "कक्षा 10", 
    description: "इतिहास, भूगोल और नागरिक शास्त्र को सरल बनाया गया।", 
    imageUrl: "/course5.jpg"
  },
];

interface CourseData {
  id: string;
  title: string;
  price: string;
  badge: string;
  description: string;
  imageUrl: string;
}

export default function CoursesPage() {
  // Start with default courses, then prepend fetched courses
  const [courses, setCourses] = useState<CourseData[]>(defaultCourses);
  const [loading, setLoading] = useState(true);
  const coursesBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg", "/gallery7.jpg"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch courses added by Admin from Firestore
        const q = query(collection(db, "courses"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedCourses = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title || "कोर्स",
          price: doc.data().price || "₹0",
          badge: doc.data().badge || "सभी कक्षाएं",
          description: doc.data().description || "विवरण उपलब्ध नहीं",
          imageUrl: doc.data().imageUrl || "/course1.jpg"
        }));
        
        // Admin added courses will appear FIRST, followed by the 5 default courses
        setCourses([...fetchedCourses, ...defaultCourses]);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-[100dvh] bg-[#FFF9F0] dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative font-sans w-full overflow-x-hidden transition-colors duration-700">
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

        @keyframes gradient-pan {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-living-gradient {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.15) 100%);
          background-size: 200% 200%;
          animation: gradient-pan 15s ease infinite;
        }
        @keyframes shimmer-text {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .animate-shimmer-text {
          background: linear-gradient(90deg, #60a5fa 0%, #ffffff 50%, #818cf8 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-text 3s linear infinite;
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>

      {/* 🔥 CLEAN HEADER (Branding Removed) */}
      <header className="bg-[#FFF9F0]/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-orange-100 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-all duration-500 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 sm:h-20">
            <MagneticButton href="/dashboard" className="p-2 hover:bg-orange-100 dark:hover:bg-slate-800 rounded-full transition-colors group">
              <ArrowLeft className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:-translate-x-1 group-hover:text-slate-900 dark:group-hover:text-white transition-all" />
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* 🔥 MAIN CONTENT */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cinematic Background */}
        <CinematicBackground images={coursesBgImages} zoomType="in" />
        <div className="absolute inset-0 z-0 animate-living-gradient pointer-events-none dark:bg-transparent" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95 pointer-events-none dark:bg-transparent" />

        <div className="relative z-10">
          {/* Page Title */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white rainbow-shimmer-text tracking-tight mb-4">
              सभी उपलब्ध कोर्सेस
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
              बिहार बोर्ड परीक्षाओं के लिए RK Sir द्वारा तैयार किए गए premium courses। अपनी तैयारी को अगले स्तर पर ले जाएं।
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex items-center justify-center py-20 animate-fade-in-up">
              <div className="w-12 h-12 border-4 border-orange-500 dark:border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            /* Courses Grid (Fetched + Default Courses) */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {courses.map((course, i) => (
                <div 
                  key={course.id} 
                  className="bg-white dark:bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 border border-orange-100 dark:border-slate-700/50 hover:border-orange-300 dark:hover:border-blue-500/50 transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col animate-fade-in-up"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image src={course.imageUrl} alt={course.title} fill className="object-cover transition-transform duration-700 ease-out hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        {course.badge}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-lg drop-shadow-lg leading-tight line-clamp-2">{course.title}</h3>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50">
                    <div>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center gap-4 mb-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <PlayCircle className="w-4 h-4" />
                          <span>HD वीडियो लेक्चर</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          <span>स्मार्ट नोट्स</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-orange-100 dark:border-slate-700/50">
                      <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{course.price}</span>
                      <MagneticButton 
                        href={`/test-payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`}
                        className="rainbow-shimmer-bg text-white font-bold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 text-sm whitespace-nowrap"
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          नामांकन करें <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Back to Dashboard */}
          <div className="text-center pb-8 animate-fade-in-up">
            <MagneticButton 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800/60 hover:bg-orange-50 dark:hover:bg-slate-700/60 text-slate-900 dark:text-white font-bold py-3 px-8 rounded-xl border border-orange-100 dark:border-slate-700/50 hover:border-orange-300 dark:hover:border-slate-600 transition-all duration-500"
            >
              <ArrowLeft className="w-5 h-5" />
              डैशबोर्ड पर वापस जाएं
            </MagneticButton>
          </div>
        </div>
      </main>
    </div>
  );
}