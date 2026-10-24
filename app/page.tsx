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
import {
  PlayCircle,
  LogOut,
  Sparkles,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// ==============================
// CORE CONSTANTS
// ==============================

const SITE_URL = "https://worldofconcept.in";
const FULL_TITLE = "World of Concept";
const CURRENT_YEAR = new Date().getFullYear();
const BOARD_SESSION_YEAR = CURRENT_YEAR + 1;

// Deterministic fallback to avoid hydration mismatch.
// Agar tu build time env set करे, तो वो use होगा।
const LAST_UPDATED_ISO =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_BUILD_TIME) ||
  "2026-10-25T00:00:00.000Z";

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
  isPartOf: {
    "@id": `${SITE_URL}#website`,
  },
  publisher: {
    "@id": `${SITE_URL}#organization`,
  },
  about: [
    {
      "@id": `${SITE_URL}#organization`,
    },
    {
      "@id": `${SITE_URL}#instructor`,
    },
  ],
  hasPart: [
    {
      "@id": `${SITE_URL}#faq`,
    },
  ],
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
    cssSelector: [
      "h1",
      ".cinematic-hero-subtitle",
      "h2",
      "h3",
      "#faq h3",
      "#faq p",
      "main p",
      "p",
    ],
  },
  audience: {
    "@type": "PeopleAudience",
    audienceType:
      "Bihar Board / BSEB Class 9, 10, 11, 12 Matric & Inter students across India",
    geographicArea: {
      "@type": "Country",
      name: "India",
    },
  },
  typicalAgeRange: "14-22",
  isFamilyFriendly: true,
  accessMode: ["textual", "visual", "auditory"],
  accessibilityFeature: [
    "highContrastDisplay",
    "structuralNavigation",
    "alternativeText",
    "tableOfContents",
  ],
  accessibilityHazard: "none",
  accessibilitySummary:
    "This page provides Bihar Board coaching information with readable headings, alternative text for images, keyboard-accessible controls, and reduced-motion support.",
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

const ROW1_IMAGES = [
  "/gallery1.jpg",
  "/gallery2.jpg",
  "/gallery3.jpg",
  "/gallery4.jpg",
  "/gallery5.jpg",
];

const ROW2_IMAGES = [
  "/gallery6.jpg",
  "/gallery7.jpg",
  "/gallery8.jpg",
  "/gallery9.jpg",
  "/gallery10.jpg",
];

// Pre-duplicated loops for seamless marquee — avoids re-creating arrays every render
const ROW1_LOOP = [...ROW1_IMAGES, ...ROW1_IMAGES];
const ROW2_LOOP = [...ROW2_IMAGES, ...ROW2_IMAGES];

interface CourseItem {
  title: string;
  price: string;
  badge: string;
  desc: string;
  image: string;
}

const AVAILABLE_COURSES: CourseItem[] = [
  {
    title: "गणित: Objective Masterclass",
    price: "₹499",
    badge: "Class 10",
    desc: "Shortcuts के साथ संपूर्ण गणित।",
    image: "/course1.jpg",
  },
  {
    title: "विज्ञान: संपूर्ण Revision",
    price: "₹699",
    badge: "Class 10",
    desc: "Physics, Chemistry, Biology।",
    image: "/course2.jpg",
  },
  {
    title: "Inter: संपूर्ण Topper Batch",
    price: "₹999",
    badge: "Class 12",
    desc: "Mock tests के साथ सभी विषय।",
    image: "/course3.jpg",
  },
  {
    title: "अंग्रेजी: व्याकरण और लेखन",
    price: "₹399",
    badge: "All classes",
    desc: "अंग्रेजी में आसानी से महारत।",
    image: "/course4.jpg",
  },
  {
    title: "सामाजिक विज्ञान: पूर्ण Course",
    price: "₹599",
    badge: "Class 10",
    desc: "History, Geography और Civics।",
    image: "/course5.jpg",
  },
];

const COURSES_LOOP = [...AVAILABLE_COURSES, ...AVAILABLE_COURSES];

const WHY_CHOOSE_FEATURES = [
  {
    icon: "🎬",
    title: "HD video lecture",
    desc: "Studio quality में record किए गए स्पष्ट concept-based पाठ।",
  },
  {
    icon: "📝",
    title: "Smart notes PDF",
    desc: "त्वरित और प्रभावी पुनरावृत्ति के लिए संरचित, हस्तलिखित notes।",
  },
  {
    icon: "📊",
    title: "Test series",
    desc: "विस्तृत प्रदर्शन विश्लेषण के साथ अध्यायवार और पूर्ण mock tests।",
  },
  {
    icon: "💬",
    title: "Doubt support",
    desc: "RK Sir और उनकी समर्पित mentor team से सीधी और त्वरित सहायता।",
  },
];

const PREP_CARDS = [
  {
    title: "Class 9 Foundation",
    desc: "Science, Maths, Social Science, English और Hindi के basic concepts strong करें।",
    keywords: "Class 9 Bihar Board, foundation, notes",
  },
  {
    title: "Class 10 Matric",
    desc: "BSEB Class 10 Maths, Science, Social Science solutions, model paper और live classes।",
    keywords: "Class 10 BSEB, matric coaching, solutions PDF",
  },
  {
    title: "Class 11 Intermediate",
    desc: "Physics, Chemistry, Biology, Maths और account/commerce basics के concept maps।",
    keywords: "Class 11 Bihar Board, concept maps, live class",
  },
  {
    title: "Class 12 Board Batch",
    desc: "Contemporary World Politics, History, Geography, Pol Science, Economics और English preparation।",
    keywords: `Class 12 BSEB, solutions, model paper ${BOARD_SESSION_YEAR}`,
  },
];

const BIHAR_DISTRICTS = [
  "Madhepura",
  "Alamnagar",
  "Saharsa",
  "Supaul",
  "Samastipur",
  "Darbhanga",
  "Muzaffarpur",
  "Sitamarhi",
  "Sheohar",
  "Vaishali",
  "Hajipur",
  "Begusarai",
  "Khagaria",
  "Munger",
  "Lakhisarai",
  "Sheikhpura",
  "Nalanda",
  "Patna",
  "Gaya",
  "Nawada",
  "Aurangabad",
  "Rohtas",
  "Bhojpur",
  "Buxar",
  "Kaimur",
  "Jehanabad",
  "Arwal",
  "Jamui",
  "Bhagalpur",
  "Banka",
  "Katihar",
  "Purnia",
  "Araria",
  "Kishanganj",
  "Madhubani",
  "Siwan",
  "Saran",
  "Gopalganj",
  "East Champaran",
  "West Champaran",
];

interface StudentData {
  fullName: string;
  email: string;
  mobile?: string;
}

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

    if (mq.addEventListener) {
      mq.addEventListener("change", update);
      return () => mq.removeEventListener("change", update);
    }

    // Legacy Safari fallback
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  return reduced;
}

function useTypewriter(text: string, enabled: boolean) {
  const [output, setOutput] = useState(enabled ? "" : text);
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    if (!enabled) {
      setOutput(text);
      setPhase("typing");
      return;
    }

    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (output.length < text.length) {
        timeout = setTimeout(() => {
          setOutput(text.slice(0, output.length + 1));
        }, 85);
      } else {
        timeout = setTimeout(() => {
          setPhase("deleting");
        }, 2400);
      }
    } else {
      if (output.length > 0) {
        timeout = setTimeout(() => {
          setOutput(output.slice(0, -1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setPhase("typing");
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [enabled, output, phase, text]);

  return output;
}

// ==============================
// MAIN HOME PAGE
// ==============================

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);

  const mountedRef = useRef(true);
  const reducedMotion = useReducedMotion();
  const typedText = useTypewriter(FULL_TITLE, !reducedMotion);

  useEffect(() => {
    mountedRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!mountedRef.current) return;

      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const studentDoc = await getDoc(doc(db, "students", firebaseUser.uid));

          if (studentDoc.exists() && mountedRef.current) {
            setStudent(studentDoc.data() as StudentData);
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      }

      if (mountedRef.current) {
        setLoading(false);
      }
    });

    return () => {
      mountedRef.current = false;
      unsubscribe();
    };
  }, []);

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    window.location.replace("/");
  }, []);

  // ==============================
  // LOADING STATE — NO BRAND LOGO
  // ==============================

  if (loading) {
    return (
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-[#FFF9F0] dark:bg-slate-950 transition-colors duration-700">
        <div className="text-center space-y-4 px-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🎓</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-slate-600 dark:text-slate-300 font-semibold text-base tracking-wide">
              World of Concept लोड हो रहा है...
            </p>

            <div className="w-40 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full w-1/2 bg-gradient-to-r from-orange-500 via-white to-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative min-h-[100dvh] bg-[#FFF9F0] dark:bg-slate-950 transition-colors duration-700 ${
        user ? "flex flex-col" : ""
      }`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />

      {!user ? (
        <>
          {/* ==============================
              1. HERO SECTION
              Cinematic title + opposite shimmer subtitle
              ============================== */}
          <section className="relative min-h-[86dvh] flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
            <DynamicBackground images={HERO_BG_IMAGES} zoomType="in" />

            <div className="absolute inset-0 z-10 bg-slate-950/40 dark:bg-slate-950/30" />
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent dark:via-slate-950/50" />

            <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-20">
              <div className="flex-1 text-center lg:text-left space-y-4 sm:space-y-6 animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-full text-xs sm:text-sm font-semibold shadow-sm mx-auto lg:mx-0">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {BOARD_SESSION_YEAR} बैच के लिए admission खुले
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight leading-none text-white flex items-center justify-center lg:justify-start">
                  {/* SEO + screen-reader friendly full title */}
                  <span className="sr-only">{FULL_TITLE}</span>

                  {/* Visual animated title */}
                  <span
                    aria-hidden="true"
                    className="relative inline-block align-top max-w-full"
                  >
                    <span className="invisible whitespace-nowrap">
                      {FULL_TITLE}
                    </span>

                    <span className="absolute left-0 top-0 whitespace-nowrap cinematic-hero-title cinematic-rainbow-title">
                      {typedText}
                    </span>
                  </span>
                </h1>

                <p className="cinematic-hero-subtitle cinematic-rainbow-subtitle text-base sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद platform।
                  RK Sir के साथ सफलता की अपनी नई यात्रा शुरू करें।
                </p>
              </div>

              <div
                className="flex-1 w-full max-w-md lg:max-w-lg animate-fade-in-up"
                style={{ animationDelay: "0.2s" }}
              >
                <AuthForm />
              </div>
            </div>
          </section>

          {/* ==============================
              2. WHY CHOOSE US
              ============================== */}
          <section
            id="why-choose-us"
            className="relative py-12 sm:py-24 overflow-hidden border-t border-orange-100 dark:border-slate-800 bg-[#FFF9F0] dark:bg-slate-950 transition-colors duration-700"
          >
            <DynamicBackground images={WHY_CHOOSE_BG_IMAGES} zoomType="out" />
            <div className="absolute inset-0 z-10 bg-slate-950/40 dark:bg-slate-950/30" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-5xl font-extrabold mb-3 sm:mb-4">
                <span className="rainbow-shimmer-text">World of Concept</span>{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-green-500">
                  क्यों चुनें?
                </span>
              </h2>

              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-12">
                बिहार बोर्ड परीक्षाओं में top करने के लिए RK Sir द्वारा तैयार किया गया सब कुछ।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {WHY_CHOOSE_FEATURES.map((feature, i) => (
                  <div
                    key={feature.title}
                    className="group bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl p-4 sm:p-6 text-center hover:bg-orange-50 dark:hover:bg-slate-800/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-blue-500/10 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl group-hover:bg-blue-500/20 group-hover:scale-110 transition-all duration-300">
                      {feature.icon}
                    </div>

                    <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                      {feature.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==============================
              3. BIHAR BOARD PREPARATION INTENT SECTION
              ============================== */}
          <section
            id="bihar-board-preparation"
            className="relative py-12 sm:py-20 overflow-hidden border-t border-orange-100 dark:border-slate-800 bg-[#FFF9F0] dark:bg-slate-950 transition-colors duration-700"
          >
            <DynamicBackground images={PREP_BG_IMAGES} zoomType="in" />
            <div className="absolute inset-0 z-10 bg-slate-950/45 dark:bg-slate-950/35" />

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
                <h2 className="text-2xl sm:text-5xl font-black mb-3">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-blue-500 to-purple-500">
                    Bihar Board Class 9 to 12
                  </span>{" "}
                  <span className="text-white drop-shadow-lg">Preparation</span>
                </h2>

                <p className="text-slate-200/90 dark:text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto">
                  Matric और Inter students के लिए subject-wise coaching, notes, solutions, model paper practice और live doubt solving — सब एक ही dedicated platform पर।
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {PREP_CARDS.map((card, i) => (
                  <div
                    key={card.title}
                    className="bg-white/85 dark:bg-slate-900/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl p-5 sm:p-6 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white font-black text-lg shadow-lg mb-4">
                      {i + 1}
                    </div>

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white mb-2">
                      {card.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-3">
                      {card.desc}
                    </p>

                    <p className="text-[10px] sm:text-xs font-semibold text-orange-600 dark:text-orange-400">
                      {card.keywords}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ==============================
              4. CINEMATIC DUAL ROW SCROLLING
              ============================== */}
          <section className="relative py-8 sm:py-16 overflow-hidden border-y border-orange-100 dark:border-slate-800 bg-[#FFF9F0] dark:bg-slate-950 transition-colors duration-700">
            <DynamicBackground images={SCROLLING_BG_IMAGES} zoomType="in" />
            <div className="absolute inset-0 z-10 bg-slate-950/40 dark:bg-slate-950/30" />

            <div className="relative z-10 w-full">
              {/* Row 1 */}
              <div className="relative w-full overflow-hidden mb-3 sm:mb-4">
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-8">
                  {ROW1_LOOP.map((src, i) => (
                    <div
                      key={`m1-${i}`}
                      className="relative w-[75vw] max-w-[280px] sm:w-80 h-44 sm:h-52 rounded-2xl overflow-hidden flex-shrink-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <Image
                        src={src}
                        alt={`World of Concept class gallery ${i}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 75vw, 320px"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      <div className="absolute bottom-3 left-3 text-white font-bold text-xs sm:text-sm drop-shadow-md flex items-center gap-2">
                        <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        World of Concept class
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2 */}
              <div className="relative w-full overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-r from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 bg-gradient-to-l from-[#FFF9F0] dark:from-slate-950 to-transparent z-10 pointer-events-none" />

                <div
                  className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-8"
                  style={{ animationDirection: "reverse" }}
                >
                  {ROW2_LOOP.map((src, i) => (
                    <div
                      key={`m2-${i}`}
                      className="relative w-[75vw] max-w-[280px] sm:w-80 h-44 sm:h-52 rounded-2xl overflow-hidden flex-shrink-0 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
                    >
                      <Image
                        src={src}
                        alt={`Student success gallery ${i}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 75vw, 320px"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                      <div className="absolute bottom-3 left-3 text-white font-bold text-xs sm:text-sm drop-shadow-md flex items-center gap-2">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                        छात्र सफलता की कहानी
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ==============================
              5. BIHAR DISTRICT COVERAGE
              Light mode: Bihar map background
              Dark mode: cinematic cosmic background
              ============================== */}
          <section
            id="bihar-districts"
            className="relative py-12 sm:py-20 overflow-hidden border-t border-orange-100 dark:border-slate-800 bg-[#FFF9F0] dark:bg-slate-950 transition-colors duration-700"
          >
            <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
              {/* Light mode map background */}
              <div className="dark:hidden absolute inset-0">
                <iframe
                  className="district-map-bg"
                  src="https://www.google.com/maps?q=Bihar,+India&z=7&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  sandbox="allow-scripts allow-same-origin allow-popups"
                  title="Bihar district map background"
                  tabIndex={-1}
                />

                <div className="absolute inset-0 bg-[#FFF9F0]/78" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F0]/85 via-[#FFF9F0]/55 to-[#FFF9F0]/92" />
              </div>

              {/* Dark mode cinematic background */}
              <div className="hidden dark:block absolute inset-0">
                <DynamicBackground images={DISTRICT_BG_IMAGES} zoomType="out" />
                <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-[1px]" />
              </div>
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-5xl font-black mb-3">
                <span className="text-slate-900 dark:text-white drop-shadow-lg">
                  Bihar के हर district के students के लिए
                </span>
              </h2>

              <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-lg max-w-3xl mx-auto mb-8">
                Alamnagar, Madhepura से शुरू — अब online coaching Bihar Board और BSEB students के लिए पूरे Bihar और पूरे India में available है।
              </p>

              <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                {BIHAR_DISTRICTS.map((district) => (
                  <span
                    key={district}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/70 border border-orange-100 dark:border-slate-700/50 backdrop-blur-sm text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 shadow-sm hover:scale-105 transition-transform"
                  >
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                    {district}
                  </span>
                ))}
              </div>

              <div className="mt-8">
                <MagneticButton
                  href="/courses"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl rainbow-shimmer-bg text-white font-extrabold shadow-lg"
                >
                  Courses देखें <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </div>
            </div>
          </section>

          {/* ==============================
              6. FAQ SECTION
              ============================== */}
          <FaqSection />

          {/* ==============================
              7. FOOTER
              ============================== */}
          <SiteFooter />
        </>
      ) : (
        <>
          {/* ==============================
              LOGGED IN HEADER — NO LOGO
              ============================== */}
          <header className="bg-[#FFF9F0]/90 dark:bg-slate-950/90 sticky top-16 sm:top-20 z-40 shadow-sm transition-all duration-500 w-full backdrop-blur-xl border-b border-orange-100/50 dark:border-slate-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-14 sm:h-16 gap-3 sm:gap-6">
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                    World of Concept
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    Student Home
                  </p>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-orange-200/50 dark:border-slate-800">
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {student?.fullName || "छात्र"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {student?.email || user?.email || ""}
                      </p>
                    </div>

                    <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-[#FFF9F0] dark:ring-slate-950">
                      {(student?.fullName || "छ").charAt(0).toUpperCase()}
                    </div>
                  </div>

                  <MagneticButton
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </MagneticButton>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 flex-1 relative w-full">
            <div className="relative z-10 space-y-6 sm:space-y-12 w-full">
              {/* WELCOME */}
              <div className="animate-fade-in-up">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-300 text-[10px] sm:text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  RK Sir Dashboard
                </div>

                <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-1 sm:mb-2">
                  वापसी पर स्वागत है,{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-blue-600 dark:from-orange-400 dark:to-blue-400">
                    {student?.fullName?.split(" ")[0] || "छात्र"}
                  </span>{" "}
                  👋
                </h1>

                <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-lg">
                  RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें।
                </p>
              </div>

              {/* LIVE CLASS CARD */}
              <div
                className="animate-fade-in-up w-full relative overflow-hidden rounded-2xl shadow-xl group bg-white dark:bg-slate-900 border border-orange-100/50 dark:border-slate-800/50"
                style={{ animationDelay: "0.1s" }}
              >
                <DynamicBackground images={LIVE_CLASS_BG_IMAGES} zoomType="out" />
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-red-950/85 via-red-900/80 to-orange-900/75 dark:bg-transparent" />

                <div className="relative z-10 p-4 sm:p-6 flex flex-col sm:flex-row items-center text-center sm:text-left gap-4 sm:gap-6 w-full">
                  <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-red-600 text-white px-2 py-1 rounded-full text-[10px] font-bold shadow-lg animate-pulse z-20">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    LIVE NOW
                  </div>

                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center text-xl sm:text-3xl flex-shrink-0 shadow-xl">
                    <span className="text-red-700">▶️</span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base sm:text-xl font-extrabold text-slate-900 dark:text-white mb-1 w-full leading-tight">
                      RK Sir के साथ दैनिक live class
                    </h3>

                    <p className="text-red-800/90 dark:text-orange-100/95 text-xs sm:text-sm w-full max-w-xl">
                      दैनिक live session में शामिल हों, real time में संदेह दूर करें।
                    </p>
                  </div>

                  <MagneticButton
                    href="https://www.youtube.com/@JoinWorldofConcept"
                    className="inline-flex items-center justify-center gap-2 bg-red-600 dark:bg-white text-white dark:text-red-900 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl text-sm font-extrabold hover:bg-red-700 dark:hover:bg-orange-50 transition-all duration-300 shadow-lg whitespace-nowrap"
                  >
                    <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    अभी जुड़ें
                  </MagneticButton>
                </div>
              </div>

              {/* STATS CARDS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 w-full">
                {[
                  {
                    icon: "📚",
                    label: "Total courses",
                    value: String(AVAILABLE_COURSES.length),
                    color:
                      "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
                  },
                  {
                    icon: "✅",
                    label: "Completed",
                    value: "0",
                    color:
                      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20",
                  },
                  {
                    icon: "🎯",
                    label: "In progress",
                    value: "0",
                    color:
                      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} border rounded-xl flex items-center justify-center`}
                      >
                        <span className="text-xl sm:text-2xl">{stat.icon}</span>
                      </div>

                      <div>
                        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                          {stat.label}
                        </p>

                        <p className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* AVAILABLE COURSES RAIL */}
              <div
                id="available-courses"
                className="animate-fade-in-up relative"
                style={{ animationDelay: "0.4s" }}
              >
                <DynamicBackground images={COURSES_BG_IMAGES} zoomType="in" />
                <div className="absolute inset-0 z-0 bg-black/10 dark:bg-slate-950/30" />

                <div className="relative z-10 py-8 sm:py-12">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold rainbow-shimmer-text drop-shadow-lg">
                      Available courses
                    </h2>

                    <MagneticButton
                      href="/courses"
                      className="text-white/90 hover:text-white font-semibold text-sm flex items-center gap-1 bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all border border-white/20"
                    >
                      सभी देखें <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </div>

                  <div className="relative w-full overflow-hidden py-2">
                    <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black/20 dark:from-slate-950/60 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black/20 dark:from-slate-950/60 to-transparent z-10 pointer-events-none" />

                    <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
                      {COURSES_LOOP.map((course, i) => (
                        <article
                          key={`home-course-${i}`}
                          className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0 group"
                        >
                          <div className="bg-white/90 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-500 ease-out hover:-translate-y-2 h-full flex flex-col border border-white/60 dark:border-slate-700/50">
                            <div className="relative h-36 sm:h-44 overflow-hidden">
                              <Image
                                src={course.image}
                                alt={course.title}
                                fill
                                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                              <div className="absolute top-2 left-2">
                                <span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold shadow-md">
                                  {course.badge}
                                </span>
                              </div>

                              <div className="absolute bottom-2 left-2 right-2">
                                <h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg leading-tight line-clamp-2">
                                  {course.title}
                                </h3>
                              </div>
                            </div>

                            <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-50/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-900/50">
                              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-3 line-clamp-2">
                                {course.desc}
                              </p>

                              <div className="flex items-center justify-between mt-auto">
                                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                                  {course.price}
                                </span>

                                <MagneticButton
                                  href={`/test-payment?course=${encodeURIComponent(
                                    course.title
                                  )}&price=${encodeURIComponent(course.price)}`}
                                  className="block text-center rainbow-shimmer-bg text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm whitespace-nowrap"
                                >
                                  Enrollment
                                </MagneticButton>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CINEMATIC GALLERY */}
              <div
                className="animate-fade-in-up relative"
                style={{ animationDelay: "0.6s" }}
              >
                <DynamicBackground images={GALLERY_BG_IMAGES} zoomType="out" />
                <div className="absolute inset-0 z-0 bg-black/10 dark:bg-slate-950/30" />

                <div className="relative z-10 py-8 sm:py-12">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold rainbow-shimmer-text drop-shadow-lg">
                      World of Concept में जीवन
                    </h2>
                  </div>

                  <div className="relative w-full overflow-hidden py-2">
                    <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black/20 dark:from-slate-950/60 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black/20 dark:from-slate-950/60 to-transparent z-10 pointer-events-none" />

                    <div
                      className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y mb-3 sm:mb-4 pl-4 sm:pl-6 lg:pl-8"
                      style={{ animationDirection: "reverse" }}
                    >
                      {ROW1_LOOP.map((src, i) => (
                        <div
                          key={`home-row1-${i}`}
                          className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30 transition-all duration-500 hover:-translate-y-2 border border-white/60 dark:border-slate-700/50"
                        >
                          <Image
                            src={src}
                            alt={`Gallery Row 1 Image ${i}`}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                              <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                              World of Concept class
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
                      {ROW2_LOOP.map((src, i) => (
                        <div
                          key={`home-row2-${i}`}
                          className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl hover:shadow-yellow-500/20 dark:hover:shadow-yellow-500/30 transition-all duration-500 hover:-translate-y-2 border border-white/60 dark:border-slate-700/50"
                        >
                          <Image
                            src={src}
                            alt={`Gallery Row 2 Image ${i}`}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px"
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2">
                              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                              छात्र सफलता
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

          {/* FAQ SECTION — VISIBLE ON LOGGED-IN HOME TOO */}
          <FaqSection />

          {/* FOOTER */}
          <SiteFooter />
        </>
      )}
    </div>
  );
}