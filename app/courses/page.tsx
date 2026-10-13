/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, PlayCircle } from "lucide-react";

// 🔥 Cinematic Background Component
const CinematicBackground = ({ images }: { images: string[] }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-[2500ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={src} 
            alt={`Cinematic BG ${i}`} 
            className="w-full h-full object-cover animate-ken-burns" 
          />
        </div>
      ))}
    </div>
  );
};

const availableCourses = [
  { 
    id: 1,
    title: "गणित: ऑब्जेक्टिव मास्टरक्लास", 
    price: "₹499", 
    badge: "कक्षा 10", 
    desc: "शॉर्टकट के साथ संपूर्ण गणित की तैयारी।", 
    image: "/course1.jpg",
    duration: "45 लेक्चर",
    students: "1,200+"
  },
  { 
    id: 2,
    title: "विज्ञान: संपूर्ण रिवीजन", 
    price: "₹699", 
    badge: "कक्षा 10", 
    desc: "भौतिकी, रसायन विज्ञान, जीव विज्ञान का पूर्ण कवरेज।", 
    image: "/course2.jpg",
    duration: "60 लेक्चर",
    students: "980+"
  },
  { 
    id: 3,
    title: "इंटर: संपूर्ण टॉपर बैच", 
    price: "₹999", 
    badge: "कक्षा 12", 
    desc: "मॉक टेस्ट के साथ सभी विषय शामिल।", 
    image: "/course3.jpg",
    duration: "80 लेक्चर",
    students: "750+"
  },
  { 
    id: 4,
    title: "अंग्रेजी: व्याकरण और लेखन", 
    price: "₹399", 
    badge: "सभी कक्षाएं", 
    desc: "अंग्रेजी भाषा में आसानी से महारत हासिल करें।", 
    image: "/course4.jpg",
    duration: "35 लेक्चर",
    students: "620+"
  },
  { 
    id: 5,
    title: "सामाजिक विज्ञान: पूर्ण कोर्स", 
    price: "₹599", 
    badge: "कक्षा 10", 
    desc: "इतिहास, भूगोल और नागरिक शास्त्र को सरल बनाया गया।", 
    image: "/course5.jpg",
    duration: "50 लेक्चर",
    students: "890+"
  },
];

export default function CoursesPage() {
  const coursesBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg", "/gallery7.jpg"];

  return (
    <div className="min-h-[100dvh] bg-slate-950 text-slate-50 relative font-sans w-full overflow-x-hidden">
      <style jsx global>{`
        @keyframes ken-burns {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(-2%, -2%); }
        }
        .animate-ken-burns {
          animation: ken-burns 8s ease-out forwards;
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

      {/* 🔥 HEADER */}
      <header className="bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50 shadow-sm transition-all duration-300 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="p-2 hover:bg-slate-800 rounded-full transition-colors group">
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:-translate-x-1 group-hover:text-white transition-all" />
              </Link>
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <Image src="/logo.png" alt="World of Concept" fill className="object-contain" priority />
              </div>
              <span className="text-lg sm:text-2xl font-extrabold tracking-tight animate-shimmer-text drop-shadow-lg">
                World of Concept
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* 🔥 MAIN CONTENT */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cinematic Background */}
        <CinematicBackground images={coursesBgImages} />
        <div className="absolute inset-0 z-0 animate-living-gradient pointer-events-none" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/85 via-slate-950/90 to-slate-950/95 pointer-events-none" />

        <div className="relative z-10">
          {/* Page Title */}
          <div className="mb-12 animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              सभी उपलब्ध कोर्सेस
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              बिहार बोर्ड परीक्षाओं के लिए RK Sir द्वारा तैयार किए गए premium courses। अपनी तैयारी को अगले स्तर पर ले जाएं।
            </p>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {availableCourses.map((course, i) => (
              <div 
                key={course.id} 
                className="bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image src={course.image} alt={course.title} fill className="object-cover transition-transform duration-700 ease-out hover:scale-110" />
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
                
                <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-800/50 to-slate-900/50">
                  <div>
                    <p className="text-slate-300 text-sm mb-4 line-clamp-2">{course.desc}</p>
                    
                    <div className="flex items-center gap-4 mb-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <PlayCircle className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.students} छात्र</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                    <span className="text-2xl font-extrabold text-white">{course.price}</span>
                    <Link 
                      href={`/test-payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 text-sm whitespace-nowrap"
                    >
                      नामांकन करें
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Back to Dashboard */}
          <div className="text-center">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 bg-slate-800/60 hover:bg-slate-700/60 text-white font-bold py-3 px-8 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5" />
              डैशबोर्ड पर वापस जाएं
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}