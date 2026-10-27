/* eslint-disable */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import AuthForm from "@/components/AuthForm";
import MagneticButton from "@/components/MagneticButton";
import DynamicBackground from "@/components/DynamicBackground";
import SiteFooter from "@/components/SiteFooter";
import FaqSection from "@/components/FaqSection";
import StudentHeader from "@/components/StudentHeader";
import {
  PlayCircle,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Target,
  MessageCircle,
} from "lucide-react";

// ==============================
// CORE CONSTANTS
// ==============================

const SITE_URL = "https://worldofconcept.in";
const FULL_TITLE = "World of Concept";
const CURRENT_YEAR = new Date().getFullYear();
const BOARD_SESSION_YEAR = CURRENT_YEAR + 1;

const LAST_UPDATED_ISO =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_BUILD_TIME) ||
  "2026-10-25T00:00:00.000Z";

// Rotating Taglines for Hero
const HERO_TAGLINES = [
  "बिहार बोर्ड की सबसे भरोसेमंद ऑनलाइन तैयारी",
  "RK Sir के साथ सफलता की नई यात्रा शुरू करें",
  "Class 9 से 12 तक — हर विषय, हर टॉपिक, एक प्लेटफॉर्म",
];

// Injected Keyframes for Dual Waves & Matte Text Effects
const GLOBAL_STYLES = `
@keyframes waveFlowLeft {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes waveFlowRight {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}
@keyframes fadeInOut {
  0%, 100% { opacity: 0; transform: translateY(8px); }
  10%, 90% { opacity: 1; transform: translateY(0); }
}
.matte-section-wrapper {
  position: relative;
  overflow: hidden;
  isolation: isolate; /* Creates stacking context for z-index safety */
}
.wave-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen; /* Glows over dark bg */
  opacity: 0.5;
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
    radial-gradient(circle at 20% 50%, rgba(239, 68, 68, 0.15), transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.15), transparent 60%),
    radial-gradient(circle at 50% 80%, rgba(167, 139, 250, 0.15), transparent 60%);
}
.wave-right {
  animation: waveFlowRight 28s linear infinite;
  background-image: 
    radial-gradient(circle at 30% 30%, rgba(249, 115, 22, 0.12), transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(34, 197, 94, 0.12), transparent 60%),
    radial-gradient(circle at 50% 10%, rgba(59, 130, 246, 0.12), transparent 60%);
}
.content-overlay {
  position: relative;
  z-index: 10;
}
.tagline-animate {
  animation: fadeInOut 6s ease-in-out infinite;
}
/* Matte Typography Utilities */
.text-matte-primary {
  color: #f8fafc; /* slate-50 */
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}
.text-matte-secondary {
  color: #cbd5e1; /* slate-300 */
}
.text-matte-muted {
  color: #94a3b8; /* slate-400 */
}
`;

// ==============================
// PAGE SCHEMA — MICRO-SEO ENHANCED
// ==============================

const homeSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}#home-webpage`,
  url: SITE_URL,
  name: `${FULL_TITLE} | Bihar Board & BSEB Coaching, Notes, Solutions & Live Classes by RK Sir`,
  alternateName: [
    "RK Sir Coaching",
    "World of Concept Bihar Board Coaching",
    "BSEB Coaching by RK Sir",
    "Alamnagar Coaching Center",
  ],
  description: `Bihar Board (बिहार बोर्ड / BSEB) online coaching for Class 9-12 by RK Sir. HD live classes, smart notes PDF, model paper ${BOARD_SESSION_YEAR}, subject-wise solutions. Based in Alamnagar, Madhepura, Bihar. Available online across India.`,
  inLanguage: "hi-IN",
  keywords:
    "Bihar Board coaching, BSEB coaching, RK Sir, Class 10 notes, Class 12 solutions, model paper 2027, Alamnagar Madhepura, Bihar district coaching, Bihar Board live classes",
  isPartOf: { "@id": `${SITE_URL}#website` },
  publisher: { "@id": `${SITE_URL}#organization` },
  about: [{ "@id": `${SITE_URL}#organization` }, { "@id": `${SITE_URL}#instructor` }],
  hasPart: [{ "@id": `${SITE_URL}#faq` }],
  image: `${SITE_URL}/og-image.jpg`,
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og-image.jpg`,
    caption: `${FULL_TITLE} Bihar Board coaching by RK Sir`,
  },
  breadcrumb: "Home",
  dateModified: LAST_UPDATED_ISO,
  lastReviewed: LAST_UPDATED_ISO,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".cinematic-hero-subtitle", "h2", "h3", "#faq h3", "#faq p", "main p", "p"],
  },
  audience: {
    "@type": "PeopleAudience",
    audienceType: "Bihar Board / BSEB Class 9, 10, 11, 12 Matric & Inter students across India",
    geographicArea: { "@type": "Country", name: "India" },
  },
  typicalAgeRange: "14-22",
  isFamilyFriendly: true,
  accessMode: ["textual", "visual", "auditory"],
  accessibilityFeature: ["highContrastDisplay", "structuralNavigation", "alternativeText", "tableOfContents"],
  accessibilityHazard: "none",
  accessibilitySummary: "This page provides Bihar Board coaching information with readable headings, alternative text for images, keyboard-accessible controls, and reduced-motion support.",
  educationalUse: "instructional",
  learningResourceType: "online course",
  teaches: [
    "Class 9 Bihar Board foundation",
    "Class 10 Matric Mathematics",
    "Class 10 Matric Science",
    "Class 10 Matric Social Science",
    "Class 11 Intermediate Physics",
    "Class 11 Intermediate Chemistry",
    "Class 11 Intermediate Biology",
    "Class 12 Contemporary World Politics",
    "Class 12 History",
    "Class 12 Geography",
    "Class 12 Political Science",
    "Class 12 Economics",
    "English grammar and writing skills",
    "Hindi medium board exam preparation",
  ],
};

// ==============================
// STATIC ASSETS / DATA
// ==============================

const HERO_BG_IMAGES = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
const WHY_CHOOSE_BG_IMAGES = ["/gallery2.jpg", "/gallery4.jpg", "/gallery6.jpg"];
const SCROLLING_BG_IMAGES = ["/gallery4.jpg", "/gallery7.jpg", "/gallery9.jpg"];
const LIVE_CLASS_BG_IMAGES = ["/gallery4.jpg", "/gallery2.jpg", "/gallery5.jpg"];
const COURSES_BG_IMAGES = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
const GALLERY_BG_IMAGES = ["/gallery3.jpg", "/gallery6.jpg", "/gallery8.jpg"];
const PREP_BG_IMAGES = ["/gallery2.jpg", "/gallery5.jpg", "/gallery8.jpg"];
const DISTRICT_BG_IMAGES = ["/gallery7.jpg", "/gallery9.jpg", "/gallery10.jpg"];

const ROW1_IMAGES = ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg", "/gallery4.jpg", "/gallery5.jpg"];
const ROW2_IMAGES = ["/gallery6.jpg", "/gallery7.jpg", "/gallery8.jpg", "/gallery9.jpg", "/gallery10.jpg"];
const ROW1_LOOP = [...ROW1_IMAGES, ...ROW1_IMAGES];
const ROW2_LOOP = [...ROW2_IMAGES, ...ROW2_IMAGES];

interface CourseItem { title: string; price: string; badge: string; desc: string; image: string; }

const AVAILABLE_COURSES: CourseItem[] = [
  { title: "गणित: Objective Masterclass", price: "₹499", badge: "Class 10", desc: "Shortcuts के साथ सम्पूर्ण गणित।", image: "/course1.jpg" },
  { title: "विज्ञान: सम्पूर्ण Revision", price: "₹699", badge: "Class 10", desc: "Physics, Chemistry, Biology।", image: "/course2.jpg" },
  { title: "Inter: सम्पूर्ण Topper Batch", price: "₹999", badge: "Class 12", desc: "Mock tests के साथ सभी विषय।", image: "/course3.jpg" },
  { title: "अंग्रेजी: व्याकरण और लेखन", price: "₹399", badge: "All classes", desc: "अंग्रेजी में आसानी से महारत।", image: "/course4.jpg" },
  { title: "सामाजिक विज्ञान: पूर्ण Course", price: "₹599", badge: "Class 10", desc: "History, Geography और Civics।", image: "/course5.jpg" },
];

const COURSES_LOOP = [...AVAILABLE_COURSES, ...AVAILABLE_COURSES];

const WHY_CHOOSE_FEATURES = [
  { icon: "🎬", title: "HD video lecture", desc: "Studio quality में record किए गए स्पष्ट concept-based पाठ।" },
  { icon: "📝", title: "Smart notes PDF", desc: "त्वरित और प्रभावी पुनरावृत्ति के लिए संरचित, हस्तलिखित notes।" },
  { icon: "📊", title: "Test series", desc: "विस्तृत प्रदर्शन विश्लेषण के साथ अध्यायवार और पूर्ण mock tests।" },
  { icon: "💬", title: "Doubt support", desc: "RK Sir और उनकी समर्पित mentor team से सीधी और त्वरित सहायता।" },
];

const PREP_CARDS = [
  { title: "Class 9 Foundation", desc: "Science, Maths, Social Science, English और Hindi के basic concepts strong करें।", keywords: "Class 9 Bihar Board, foundation, notes" },
  { title: "Class 10 Matric", desc: "BSEB Class 10 Maths, Science, Social Science solutions, model paper और live classes।", keywords: "Class 10 BSEB, matric coaching, solutions PDF" },
  { title: "Class 11 Intermediate", desc: "Physics, Chemistry, Biology, Maths और account/commerce basics के concept maps।", keywords: "Class 11 Bihar Board, concept maps, live class" },
  { title: "Class 12 Board Batch", desc: "Contemporary World Politics, History, Geography, Pol Science, Economics और English preparation।", keywords: `Class 12 BSEB, solutions, model paper ${BOARD_SESSION_YEAR}` },
];

const BIHAR_DISTRICTS = ["Madhepura", "Alamnagar", "Saharsa", "Supaul", "Samastipur", "Darbhanga", "Muzaffarpur", "Sitamarhi", "Sheohar", "Vaishali", "Hajipur", "Begusarai", "Khagaria", "Munger", "Lakhisarai", "Sheikhpura", "Nalanda", "Patna", "Gaya", "Nawada", "Aurangabad", "Rohtas", "Bhojpur", "Buxar", "Kaimur", "Jehanabad", "Arwal", "Jamui", "Bhagalpur", "Banka", "Katihar", "Purnia", "Araria", "Kishanganj", "Madhubani", "Siwan", "Saran", "Gopalganj", "East Champaran", "West Champaran"];

interface StudentData { fullName: string; email: string; mobile?: string; }

// ==============================
// HOOKS
// ==============================

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    if (mq.addEventListener) { mq.addEventListener("change", update); return () => mq.removeEventListener("change", update); }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);
  return reduced;
}

// Simple Typewriter Hook
function useTypewriter(text: string, enabled: boolean) {
  const [output, setOutput] = useState(enabled ? "" : text);
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");
  useEffect(() => {
    if (!enabled) { setOutput(text); setPhase("typing"); return; }
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (output.length < text.length) timeout = setTimeout(() => setOutput(text.slice(0, output.length + 1)), 85);
      else timeout = setTimeout(() => setPhase("deleting"), 2400);
    } else {
      if (output.length > 0) timeout = setTimeout(() => setOutput(output.slice(0, -1)), 40);
      else timeout = setTimeout(() => setPhase("typing"), 500);
    }
    return () => clearTimeout(timeout);
  }, [enabled, output, phase, text]);
  return output;
}

// Reusable Component for Matte Sections with Dual Waves
const MatteWaveSection = ({ children, className = "", bgImages }: { children: React.ReactNode; className?: string; bgImages: string[] }) => {
  return (
    <section className={`matte-section-wrapper relative py-12 sm:py-20 border-t border-slate-800/50 bg-slate-950 ${className}`}>
      {/* Background Engine */}
      <DynamicBackground images={bgImages} zoomType="in" density={0.6} interactive={false} showGrid={false} />
      
      {/* Dark Overlay to ensure matte look */}
      <div className="absolute inset-0 z-[2] bg-slate-950/80 backdrop-blur-sm" />

      {/* Dual Rainbow Waves */}
      <div className="wave-container z-[3]">
        <div className="wave-layer wave-left" />
        <div className="wave-layer wave-right" />
      </div>

      {/* Content */}
      <div className="content-overlay max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
};

// ==============================
// MAIN HOME PAGE
// ==============================

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [taglineIndex, setTaglineIndex] = useState(0);

  const mountedRef = useRef(true);
  const reducedMotion = useReducedMotion();
  const typedText = useTypewriter(FULL_TITLE, !reducedMotion);

  // Rotate Taglines every 6 seconds
  useEffect(() => {
    if (reducedMotion) return;
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % HERO_TAGLINES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [reducedMotion]);

  useEffect(() => {
    mountedRef.current = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mountedRef.current) return;
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const studentDoc = await getDoc(doc(db, "students", firebaseUser.uid));
          if (studentDoc.exists() && mountedRef.current) setStudent(studentDoc.data() as StudentData);
        } catch (error) { console.error("Error fetching student data:", error); }
      }
      if (mountedRef.current) setLoading(false);
    });
    return () => { mountedRef.current = false; unsubscribe(); };
  }, []);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    window.location.replace("/");
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-slate-950 transition-colors duration-700">
        <div className="text-center space-y-4 px-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-slate-400 font-semibold text-base tracking-wide">World of Concept लोड हो रहा है...</p>
            <div className="w-40 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-600 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-[100dvh] bg-slate-950 text-slate-100 transition-colors duration-700 ${user ? "flex flex-col" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }} />

      {!user ? (
        <>
          {/* ==============================
              1. HERO SECTION — HOLLYWOOD GRADE DARK MATTE + DUAL WAVES
              NOTE: Buttons removed as per request.
              ============================== */}
          <section className="matte-section-wrapper relative min-h-[90dvh] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-slate-950">
            
            {/* Background Engine */}
            <DynamicBackground images={HERO_BG_IMAGES} zoomType="in" density={0.8} interactive showGrid={false} />

            {/* Dark Matte Overlay */}
            <div className="absolute inset-0 z-[2] bg-slate-950/75 backdrop-blur-md" />

            {/* --- THE MAGIC: DUAL RAINBOW WAVE LAYERS --- */}
            <div className="wave-container z-[3]">
              <div className="wave-layer wave-left" />
              <div className="wave-layer wave-right" />
            </div>

            <div className="content-overlay w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
              <div className="flex-1 text-center lg:text-left space-y-6 animate-fade-in-up">
                
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white/80 rounded-full text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md mx-auto lg:mx-0">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {BOARD_SESSION_YEAR} बैच के लिए admission खुले
                </div>

                {/* Main Title: Dark Matte White/Grey, NOT Colorful */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none text-matte-primary drop-shadow-2xl">
                  <span className="sr-only">{FULL_TITLE}</span>
                  <span aria-hidden="true" className="relative inline-block align-top max-w-full">
                    <span className="invisible whitespace-nowrap">{FULL_TITLE}</span>
                    <span className="absolute left-0 top-0 whitespace-nowrap text-white">
                      {typedText}
                    </span>
                  </span>
                </h1>

                {/* Rotating Tagline: Strong & Clear */}
                <div className="h-16 flex items-center justify-center lg:justify-start overflow-hidden">
                  <p 
                    key={taglineIndex} 
                    className="cinematic-hero-subtitle text-lg sm:text-2xl font-bold text-matte-secondary leading-relaxed tagline-animate"
                  >
                    {HERO_TAGLINES[taglineIndex]}
                  </p>
                </div>

                {/* REMOVED BUTTONS START HERE -> NO CODE BELOW THIS LINE IN THIS DIV */}
              </div>

              <div className="flex-1 w-full max-w-md lg:max-w-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                <AuthForm />
              </div>
            </div>
          </section>

          {/* ==============================
              2. WHY CHOOSE US
              ============================== */}
          <MatteWaveSection bgImages={WHY_CHOOSE_BG_IMAGES}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-5xl font-extrabold mb-3 text-matte-primary">
                World of Concept क्यों चुनें?
              </h2>
              <p className="text-matte-muted text-sm sm:text-lg max-w-2xl mx-auto">
                बिहार बोर्ड परीक्षाओं में top करने के लिए RK Sir द्वारा तैयार किया गया सब कुछ।
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {WHY_CHOOSE_FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-2xl p-6 text-center hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-600"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:bg-slate-700 group-hover:scale-110 transition-all duration-300 border border-slate-700">
                    {feature.icon}
                  </div>
                  <h3 className="text-base sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </MatteWaveSection>

          {/* ==============================
              3. BIHAR BOARD PREPARATION INTENT SECTION
              ============================== */}
          <MatteWaveSection bgImages={PREP_BG_IMAGES}>
            <div className="text-center mb-12 animate-fade-in-up">
              <h2 className="text-2xl sm:text-5xl font-black mb-3 text-matte-primary">
                Bihar Board Class 9 to 12 Preparation
              </h2>
              <p className="text-matte-muted text-sm sm:text-lg max-w-3xl mx-auto">
                Matric और Inter students के लिए subject-wise coaching, notes, solutions, model paper practice और live doubt solving — सब एक ही dedicated platform पर।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {PREP_CARDS.map((card, i) => (
                <div
                  key={card.title}
                  className="bg-slate-900/70 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-black text-lg shadow-lg mb-4 group-hover:bg-blue-600 group-hover:border-blue-500 transition-colors">
                    {i + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">{card.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{card.desc}</p>
                  <p className="text-[10px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.keywords}
                  </p>
                </div>
              ))}
            </div>
          </MatteWaveSection>

          {/* ==============================
              4. CINEMATIC DUAL ROW SCROLLING
              ============================== */}
          <MatteWaveSection bgImages={SCROLLING_BG_IMAGES} className="!py-16">
             <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-4xl font-black text-matte-primary">Life at World of Concept</h2>
                <p className="text-matte-muted mt-2">Classes, culture, competition और छात्र सफलता की झलकियाँ।</p>
             </div>
             
             <div className="w-full">
              {/* Row 1 */}
              <div className="relative w-full overflow-hidden mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-8">
                  {ROW1_LOOP.map((src, i) => (
                    <div
                      key={`m1-${i}`}
                      className="relative w-[75vw] max-w-[280px] sm:w-80 h-44 sm:h-52 rounded-2xl overflow-hidden flex-shrink-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-slate-800"
                    >
                      <Image src={src} alt={`World of Concept class gallery ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 75vw, 320px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white font-bold text-xs sm:text-sm drop-shadow-md flex items-center gap-2">
                        <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" /> World of Concept class
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="relative w-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-8" style={{ animationDirection: "reverse" }}>
                  {ROW2_LOOP.map((src, i) => (
                    <div
                      key={`m2-${i}`}
                      className="relative w-[75vw] max-w-[280px] sm:w-80 h-44 sm:h-52 rounded-2xl overflow-hidden flex-shrink-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border border-slate-800"
                    >
                      <Image src={src} alt={`Student success gallery ${i}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 75vw, 320px" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-3 left-3 text-white font-bold text-xs sm:text-sm drop-shadow-md flex items-center gap-2">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" /> छात्र सफलता की कहानी
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MatteWaveSection>

          {/* ==============================
              5. BIHAR DISTRICT COVERAGE
              ============================== */}
          <MatteWaveSection bgImages={DISTRICT_BG_IMAGES}>
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-5xl font-black mb-3 text-matte-primary">
                Bihar के हर district के students के लिए
              </h2>
              <p className="text-matte-muted text-sm sm:text-lg max-w-3xl mx-auto">
                Alamnagar, Madhepura से शुरू — अब online coaching Bihar Board और BSEB students के लिए पूरे Bihar और पूरे India में available है।
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8">
              {BIHAR_DISTRICTS.map((district) => (
                <span
                  key={district}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] sm:text-xs font-bold text-slate-300 shadow-sm hover:scale-105 hover:bg-slate-800 hover:text-white transition-all cursor-default"
                >
                  <CheckCircle2 className="w-3 h-3 text-green-500" />
                  {district}
                </span>
              ))}
            </div>

            <div className="text-center">
              <MagneticButton
                href="/courses"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-extrabold shadow-lg hover:bg-gray-100 transition-all"
              >
                Courses देखें <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </MatteWaveSection>

          <FaqSection />
          <SiteFooter />
        </>
      ) : (
        <>
          <StudentHeader fullName={student?.fullName ?? null} email={student?.email ?? user?.email ?? null} onLogout={handleLogout} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 relative w-full">
            <div className="relative z-10 space-y-6 sm:space-y-12 w-full">
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[10px] sm:text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> RK Sir Dashboard
                </div>
                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-white mb-1 sm:mb-2">
                  वापसी पर स्वागत है,{" "}
                  <span className="text-slate-300">{student?.fullName?.split(" ")[0] || "छात्र"}</span> 👋
                </h1>
                <p className="text-slate-400 text-sm sm:text-lg">RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें।</p>
              </div>

              {/* LIVE CLASS CARD */}
              <div className="animate-fade-in-up w-full relative overflow-hidden rounded-2xl shadow-xl group bg-slate-900 border border-slate-800" style={{ animationDelay: "0.1s" }}>
                <DynamicBackground images={LIVE_CLASS_BG_IMAGES} zoomType="out" density={0.5} interactive={false} showGrid={false} />
                <div className="absolute inset-0 z-10 bg-slate-950/80 backdrop-blur-sm" />
                
                <div className="relative z-20 p-4 sm:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 w-full">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg animate-pulse z-30">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> LIVE NOW
                  </div>
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-xl sm:text-3xl flex-shrink-0 shadow-xl">
                    <span className="text-red-500">▶️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-xl font-extrabold text-white mb-1 w-full leading-tight">RK Sir के साथ दैनिक live class</h3>
                    <p className="text-slate-400 text-xs sm:text-sm w-full max-w-xl">दैनिक live session में शामिल हों, real time में संदेह दूर करें।</p>
                  </div>
                  <MagneticButton href="https://www.youtube.com/@JoinWorldofConcept" className="inline-flex items-center justify-center gap-2 bg-red-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm font-extrabold hover:bg-red-700 transition-all duration-300 shadow-lg whitespace-nowrap">
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" /> अभी जुड़ें
                  </MagneticButton>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full">
                {[
                  { icon: "📚", label: "Total courses", value: String(AVAILABLE_COURSES.length), color: "text-blue-400" },
                  { icon: "✅", label: "Completed", value: "0", color: "text-green-400" },
                  { icon: "🎯", label: "In progress", value: "0", color: "text-purple-400" },
                ].map((stat, i) => (
                  <div key={i} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center ${stat.color}`}>
                        <span className="text-xl sm:text-2xl">{stat.icon}</span>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</p>
                        <p className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AVAILABLE COURSES RAIL */}
              <div id="available-courses" className="animate-fade-in-up relative" style={{ animationDelay: "0.4s" }}>
                 <MatteWaveSection bgImages={COURSES_BG_IMAGES} className="!py-8 !border-none">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-lg">Available courses</h2>
                      <MagneticButton href="/courses" className="text-white/90 hover:text-white font-semibold text-sm flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all border border-white/20">
                        सभी देखें <ArrowRight className="w-4 h-4" />
                      </MagneticButton>
                    </div>
                    
                    <div className="relative w-full overflow-hidden py-2">
                      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
                      
                      <div className="flex gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
                        {COURSES_LOOP.map((course, i) => (
                          <article key={`home-course-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0 group">
                            <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 ease-out hover:-translate-y-2 h-full flex flex-col border border-slate-800">
                              <div className="relative h-36 sm:h-44 overflow-hidden">
                                <Image src={course.image} alt={course.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                                <div className="absolute top-2 left-2">
                                  <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold shadow-md">{course.badge}</span>
                                </div>
                                <div className="absolute bottom-2 left-2 right-2">
                                  <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg leading-tight line-clamp-2">{course.title}</h3>
                                </div>
                              </div>
                              <div className="p-4 flex-1 flex flex-col justify-between bg-slate-900/50">
                                <p className="text-slate-400 text-xs sm:text-sm mb-3 line-clamp-2">{course.desc}</p>
                                <div className="flex items-center justify-between mt-auto">
                                  <span className="text-lg font-extrabold text-white">{course.price}</span>
                                  <MagneticButton href={`/test-payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`} className="block text-center bg-white text-slate-900 font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm whitespace-nowrap">
                                    Enrollment
                                  </MagneticButton>
                                </div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </div>
                 </MatteWaveSection>
              </div>

              {/* CINEMATIC GALLERY */}
              <div className="animate-fade-in-up relative" style={{ animationDelay: "0.6s" }}>
                 <MatteWaveSection bgImages={GALLERY_BG_IMAGES} className="!py-8 !border-none">
                    <div className="text-center mb-6">
                      <h2 className="text-xl sm:text-2xl font-extrabold text-white drop-shadow-lg">World of Concept में जीवन</h2>
                    </div>
                    <div className="relative w-full overflow-hidden py-2">
                      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
                      
                      <div className="flex gap-4 w-max animate-marquee-seamless touch-pan-y mb-4 pl-4 sm:pl-6 lg:pl-8" style={{ animationDirection: "reverse" }}>
                        {ROW1_LOOP.map((src, i) => (
                          <div key={`home-row1-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2 border border-slate-800">
                            <Image src={src} alt={`Gallery Row 1 Image ${i}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2"><PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" /> World of Concept class</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
                        {ROW2_LOOP.map((src, i) => (
                          <div key={`home-row2-${i}`} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-500 hover:-translate-y-2 border border-slate-800">
                            <Image src={src} alt={`Gallery Row 2 Image ${i}`} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                              <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2"><Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" /> छात्र सफलता</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                 </MatteWaveSection>
              </div>
            </div>
          </div>
          <FaqSection />
          <SiteFooter />
        </>
      )}
    </div>
  );
}