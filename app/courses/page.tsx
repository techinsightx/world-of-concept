/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import DynamicBackground from "@/components/DynamicBackground";
import MagneticButton from "@/components/MagneticButton";
import { ArrowLeft, BookOpen, PlayCircle, ShieldCheck, Sparkles } from "lucide-react";

// ==============================
// INJECTED STYLES FOR MATTE WAVES & PREMIUM LOOK
// ==============================
const COURSES_STYLES = `
@keyframes waveFlowLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes waveFlowRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.matte-section-wrapper {
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.wave-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen; /* Glows over dark bg */
  opacity: 0.35; /* Subtle but visible */
}

.wave-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 100%;
  background-size: 50% 100%;
  background-repeat: repeat-x;
}

.wave-left {
  animation: waveFlowLeft 22s linear infinite;
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(99, 102, 241, 0.15), transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.15), transparent 60%);
}

.wave-right {
  animation: waveFlowRight 28s linear infinite;
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.12), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(236, 72, 153, 0.12), transparent 60%);
}

.content-overlay {
  position: relative;
  z-index: 10;
}

/* Matte Typography Utilities */
.text-matte-primary {
  color: #f8fafc; /* slate-50 */
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
.text-matte-secondary {
  color: #cbd5e1; /* slate-300 */
}
`;

// ==============================
// TYPES & DATA
// ==============================

interface CourseData {
  id: string;
  title: string;
  price: string;
  badge: string;
  description: string;
  imageUrl: string;
}

// 🔥 5 Default Courses (Always Visible if Firestore fails or is empty)
const defaultCourses: CourseData[] = [
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

const COURSES_BG_IMAGES = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseData[]>(defaultCourses);
  const [loading, setLoading] = useState(true);

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
        if (fetchedCourses.length > 0) {
           setCourses([...fetchedCourses, ...defaultCourses]);
        } else {
           setCourses(defaultCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses(defaultCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="relative min-h-[100dvh] w-full bg-slate-950 text-slate-100 font-sans transition-colors duration-700 overflow-hidden">
      <style dangerouslySetInnerHTML={{ __html: COURSES_STYLES }} />

      {/* ==============================
          BACKGROUND ENGINE WITH DUAL WAVES
          ============================== */}
      <DynamicBackground images={COURSES_BG_IMAGES} zoomType="in" density={0.6} interactive={false} showGrid={false} />
      
      {/* Dark Overlay to ensure matte look */}
      <div className="absolute inset-0 z-[2] bg-slate-950/85 backdrop-blur-sm" />

      {/* --- INTERNAL DUAL WAVE ENGINE --- */}
      <div className="wave-container z-[3]">
        <div className="wave-layer wave-left" />
        <div className="wave-layer wave-right" />
      </div>

      {/* ==============================
          HEADER / NAVIGATION
          ============================== */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold tracking-wide">वापस जाएं</span>
          </Link>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
             <Sparkles className="w-3 h-3 text-yellow-400" />
             <span className="text-xs font-bold text-white/70">Premium Batches</span>
          </div>
        </div>
      </header>

      {/* ==============================
          MAIN CONTENT AREA
          ============================== */}
      <main className="content-overlay max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        {/* Page Hero Section */}
        <div className="mb-12 animate-fade-in-up">
          <h1 className="text-3xl sm:text-5xl font-black mb-4 text-matte-primary tracking-tight leading-none">
            सभी उपलब्ध कोर्सेज़
          </h1>
          <p className="text-matte-muted text-base sm:text-lg max-w-2xl leading-relaxed">
            बिहार बोर्ड परीक्षाओं के लिए RK Sir द्वारा तैयार किए गए प्रीमियम कोर्स। अपनी तैयारी को अगले स्तर पर ले जाएं।
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">कोर्स लोड हो रहे हैं...</p>
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course, i) => (
              <article 
                key={course.id} 
                className="group relative bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-white/10 transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col h-full"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Image Container */}
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <Image 
                    src={course.imageUrl} 
                    alt={course.title} 
                    fill 
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                  
                  {/* Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-blue-600/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg border border-blue-500/30">
                      {course.badge}
                    </span>
                  </div>
                </div>
                
                {/* Content Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col">
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2 line-clamp-2 leading-snug drop-shadow-md">
                    {course.title}
                  </h3>
                  
                  <p className="text-slate-400 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {course.description}
                  </p>
                  
                  {/* Features List */}
                  <div className="flex items-center gap-4 mb-5 text-xs sm:text-sm text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <PlayCircle className="w-4 h-4 text-blue-400" />
                      <span>HD वीडियो</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-purple-400" />
                      <span>स्मार्ट नोट्स</span>
                    </div>
                  </div>
                  
                  {/* Footer: Price & CTA */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">कीमत</p>
                      <span className="text-2xl font-black text-white drop-shadow-lg">{course.price}</span>
                    </div>
                    
                    <MagneticButton 
                      href={`/test-payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`}
                      className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold py-2.5 px-5 rounded-xl shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 text-sm whitespace-nowrap active:scale-95"
                    >
                      नामांकन करें 
                      <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                    </MagneticButton>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA / Info */}
        {!loading && courses.length > 0 && (
          <div className="mt-16 text-center p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
            <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">100% सुरक्षित पेमेंट</h3>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              आपके डेटा एन्क्रिप्टेड हैं। यदि आपको किसी समस्या का सामना करना पड़े, तो हमारे Telegram ग्रुप @JoinWorldofConcept पर संपर्क करें।
            </p>
          </div>
        )}
      </main>
    </div>
  );
}