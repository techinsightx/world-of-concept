/* eslint-disable */
"use client";

import {
  type ComponentType,
  type CSSProperties,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  limit,
  getDocs,
} from "firebase/firestore";
import Image from "next/image";
import AdPopup from "@/components/AdPopup";
import MagneticButton from "@/components/MagneticButton";
import DynamicBackground from "@/components/DynamicBackground";
import SiteFooter from "@/components/SiteFooter";
import FaqSection from "@/components/FaqSection";
import StudentHeader from "@/components/StudentHeader";
import {
  BookOpen,
  CheckCircle2,
  Target,
  PlayCircle,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Trophy,
  ArrowRight,
  Calendar,
  MessageCircle,
  RefreshCw,
  Flame,
  Zap,
  GraduationCap,
  MapPin,
  Clock,
  Award,
  Rocket,
  FileText,
  Users,
  Video,
  ListChecks,
} from "lucide-react";

// ==============================
// CORE CONSTANTS
// ==============================

const SITE_URL = "https://worldofconcept.in";
const CURRENT_YEAR = new Date().getFullYear();
const BOARD_SESSION_YEAR = CURRENT_YEAR + 1;

const LAST_UPDATED_ISO =
  (typeof process !== "undefined" &&
    process.env &&
    process.env.NEXT_PUBLIC_BUILD_TIME) ||
  "2026-10-29T00:00:00.000Z"; // Updated to current date

const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@JoinWorldofConcept";
const TELEGRAM_URL = "https://t.me/JoinWorldofConcept";
const INSTAGRAM_URL = "https://instagram.com/join_world_of_concept";

// Self-contained marquee keyframe name (injected below) → no globals.css dependency.
const MARQUEE_KEYFRAME = "wocMarqueeLTR";
function marqueeDuration(uniqueCount: number) {
  return Math.min(72, Math.max(34, uniqueCount * 6));
}

// ==============================
// ROTATING TAGLINES FOR DASHBOARD HERO
// ==============================
const DASH_TAGLINES = [
  "RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें। निरंतरता बनाए रखें — सफलता वहीं मिलती है जहाँ मेहनत रुकती नहीं।",
  "आज की छोटी प्रगति, कल की बड़ी जीत है। हर दिन एक नया कदम उठाएं।",
  "Board Exam सिर्फ परीक्षा नहीं, आपके संघर्ष की कहानी है। इसे अपने नाम करें।",
];

// ==============================
// INJECTED KEYFRAMES & GLOBAL STYLES
// ==============================

const DASH_STYLES = `
@keyframes wocMarqueeLTR{from{transform:translate3d(-50%,0,0)}to{transform:translate3d(0,0,0)}}
@keyframes wocWave{0%,100%{transform:rotate(0deg)}12%{transform:rotate(16deg)}24%{transform:rotate(-10deg)}36%{transform:rotate(14deg)}48%{transform:rotate(-7deg)}60%{transform:rotate(9deg)}72%{transform:rotate(-4deg)}84%{transform:rotate(5deg)}}
@keyframes wocWaveGlow{0%,100%{opacity:.30;transform:scale(.85)}50%{opacity:.85;transform:scale(1.15)}}
@keyframes wocPulseRing{0%{transform:scale(.7);opacity:.55}100%{transform:scale(1.7);opacity:0}}
@keyframes wocSparkle{0%{opacity:0;transform:translateY(2px) scale(.3) rotate(0)}25%{opacity:1}100%{opacity:0;transform:translateY(-12px) scale(1) rotate(140deg)}}
@keyframes wocSoundRing{0%{box-shadow:0 0 0 0 rgba(239,68,68,.50)}70%{box-shadow:0 0 0 12px rgba(239,68,68,0)}100%{box-shadow:0 0 0 0 rgba(239,68,68,0)}}

/* --- HOLLYWOOD GRADE MATTE WAVES ENGINE --- */
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
  isolation: isolate;
}

.wave-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen; /* Glows over dark bg */
  opacity: 0.4; /* Subtle but visible */
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

/* Matte Text Utilities */
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

/* EDGE TO EDGE RAIL STYLING */
.edge-rail-container {
  width: 100vw;
  margin-left: calc(-50vw + 50%); /* Breaks out of max-w container if nested */
  position: relative;
  overflow: hidden;
  padding: 0; /* No horizontal padding for true edge-to-edge */
}
.edge-rail-track {
  display: flex;
  gap: 1rem; /* Space between cards */
  width: max-content;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  will-change: transform;
}
.edge-rail-track.ltr {
  animation-name: marqueeLTR;
  animation-duration: 40s;
}
.edge-rail-track.rtl {
  animation-name: marqueeRTL;
  animation-duration: 40s;
}
@keyframes marqueeLTR {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
@keyframes marqueeRTL {
  0% { transform: translate3d(-50%, 0, 0); }
  100% { transform: translate3d(0, 0, 0); }
}
/* Pause on hover for better UX */
.edge-rail-container:hover .edge-rail-track {
  animation-play-state: paused;
}
`;

// ==============================
// TYPES
// ==============================

type IconType = ComponentType<{ className?: string }>;

interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
}

interface YoutubeCachePayload {
  savedAt: number;
  videos: YoutubeVideo[];
}

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
  timestamp?: any;
  createdAt?: any;
  type: "announcement" | "motivation" | "tip";
}

interface CourseItem {
  title: string;
  price: string;
  badge: string;
  desc: string;
  image: string;
}

interface StreakData {
  lastVisit: string;
  current: number;
  longest: number;
  visits: number;
}

// ==============================
// SCHEMA — DASHBOARD WEBPAGE
// ==============================

const dashboardSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/dashboard#dashboard-webpage`,
  url: `${SITE_URL}/dashboard`,
  name: "Student Dashboard | World of Concept Bihar Board & BSEB Coaching",
  alternateName: [
    "RK Sir Student Dashboard",
    "World of Concept Dashboard",
    "Bihar Board Student Dashboard",
  ],
  description: `Logged-in student dashboard for World of Concept. Access RK Sir live classes, Bihar Board notes, model paper ${BOARD_SESSION_YEAR}, subject-wise solutions, course enrollment, updates, study plan and progress snapshot.`,
  inLanguage: "hi-IN",
  keywords:
    "Bihar Board dashboard, BSEB student dashboard, RK Sir live class, Bihar Board notes, model paper 2027, solutions, updates, study plan, Madhepura coaching, Alamnagar coaching",
  isPartOf: { "@id": `${SITE_URL}#website` },
  publisher: { "@id": `${SITE_URL}#organization` },
  about: [{ "@id": `${SITE_URL}#organization` }, { "@id": `${SITE_URL}#instructor` }],
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: `${SITE_URL}/og-image.jpg`,
    caption: "World of Concept student dashboard by RK Sir",
  },
  breadcrumb: "Dashboard",
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
  accessibilityFeature: ["structuralNavigation", "alternativeText", "highContrastDisplay"],
  accessibilityHazard: "none",
  accessibilitySummary: "This dashboard provides Bihar Board student information with readable headings, keyboard-accessible controls, alternative text for images, and reduced-motion support.",
  educationalUse: "instructional",
  learningResourceType: "student dashboard",
  teaches: [
    "Bihar Board live class access",
    "Class 10 Maths revision",
    "Class 10 Science revision",
    "Class 12 board exam preparation",
    "Model paper practice",
    "Subject-wise solutions",
    "Daily study planning",
    "RK Sir updates",
  ],
  relatedLink: [YOUTUBE_CHANNEL_URL, TELEGRAM_URL, INSTAGRAM_URL],
  significantLink: [
    `${SITE_URL}/dashboard#youtube-videos`,
    `${SITE_URL}/dashboard#courses`,
    `${SITE_URL}/dashboard#updates`,
    `${SITE_URL}/dashboard#faq`,
  ],
};

// ==============================
// YOUTUBE CACHE HELPERS
// ==============================

const YOUTUBE_CACHE_KEY = "worldofconcept_youtube_cache_v4";
const YOUTUBE_CACHE_TTL_MS = 30 * 60 * 1000;

function readYoutubeCache(): YoutubeVideo[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(YOUTUBE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as YoutubeCachePayload;
    if (!parsed?.videos || !Array.isArray(parsed.videos)) return null;
    if (Date.now() - parsed.savedAt > YOUTUBE_CACHE_TTL_MS) return null;
    return parsed.videos;
  } catch {
    return null;
  }
}

function writeYoutubeCache(videos: YoutubeVideo[]) {
  if (typeof window === "undefined") return;
  try {
    const payload: YoutubeCachePayload = { savedAt: Date.now(), videos };
    window.sessionStorage.setItem(YOUTUBE_CACHE_KEY, JSON.stringify(payload));
  } catch {}
}

// ==============================
// STREAK HELPERS
// ==============================

const STREAK_KEY = "worldofconcept_dashboard_streak_v1";
const DEFAULT_STREAK: StreakData = { lastVisit: "", current: 0, longest: 0, visits: 0 };

function getTodayKey(date: Date = new Date()): string {
  try { return date.toLocaleDateString("en-CA"); } catch { return date.toISOString().slice(0, 10); }
}
function getYesterdayKey(): string { return getTodayKey(new Date(Date.now() - 86400000)); }

function normalizeStreak(input: any): StreakData {
  if (!input || typeof input !== "object") return { ...DEFAULT_STREAK };
  return {
    lastVisit: typeof input.lastVisit === "string" ? input.lastVisit : "",
    current: Number.isFinite(input.current) ? Math.max(0, Number(input.current)) : 0,
    longest: Number.isFinite(input.longest) ? Math.max(0, Number(input.longest)) : 0,
    visits: Number.isFinite(input.visits) ? Math.max(0, Number(input.visits)) : 0,
  };
}

function readStreak(): StreakData {
  if (typeof window === "undefined") return { ...DEFAULT_STREAK };
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    if (!raw) return { ...DEFAULT_STREAK };
    return normalizeStreak(JSON.parse(raw));
  } catch { return { ...DEFAULT_STREAK }; }
}

function writeStreak(streak: StreakData) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(STREAK_KEY, JSON.stringify(streak)); } catch {}
}

function bumpStreak(): StreakData {
  const stored = readStreak();
  const today = getTodayKey();
  if (stored.lastVisit === today) return stored;
  const yesterday = getYesterdayKey();
  const current = stored.lastVisit === yesterday ? stored.current + 1 : 1;
  const next: StreakData = {
    lastVisit: today,
    current,
    longest: Math.max(stored.longest, current),
    visits: stored.visits + 1,
  };
  writeStreak(next);
  return next;
}

// ==============================
// UPDATE HELPERS
// ==============================

const getUpdateDate = (data: any): Date => {
  const candidate = data?.timestamp || data?.createdAt;
  if (!candidate) return new Date(0);
  if (typeof candidate.toDate === "function") return candidate.toDate();
  if (candidate instanceof Date) return candidate;
  const parsed = new Date(candidate);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

const formatDateHi = (date: Date): string => {
  if (!date || date.getTime() <= 0) return "Recently";
  try { return date.toLocaleDateString("hi-IN", { day: "numeric", month: "short" }); } catch { return "Recently"; }
};

const sanitizeUpdateType = (value: any): UpdateData["type"] => {
  if (value === "motivation") return "motivation";
  if (value === "tip") return "tip";
  return "announcement";
};

// ==============================
// STATIC ASSETS / DATA
// ==============================

const WELCOME_BG_IMAGES = ["/gallery2.jpg", "/gallery4.jpg", "/gallery6.jpg"];
const SNAPSHOT_BG_IMAGES = ["/gallery6.jpg", "/gallery8.jpg", "/gallery10.jpg"];
const PLAN_BG_IMAGES = ["/gallery3.jpg", "/gallery7.jpg", "/gallery9.jpg"];
const VIDEOS_BG_IMAGES = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
const COURSES_BG_IMAGES = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
const GALLERY_BG_IMAGES = ["/gallery3.jpg", "/gallery6.jpg", "/gallery8.jpg"];
const UPDATES_BG_IMAGES = ["/gallery5.jpg", "/gallery7.jpg", "/gallery9.jpg"];
const ACHIEVEMENT_BG_IMAGES = ["/gallery2.jpg", "/gallery5.jpg", "/gallery8.jpg"];

const ROW1_IMAGES = ["/gallery1.jpg", "/gallery2.jpg", "/gallery3.jpg", "/gallery4.jpg", "/gallery5.jpg"];
const ROW2_IMAGES = ["/gallery6.jpg", "/gallery7.jpg", "/gallery8.jpg", "/gallery9.jpg", "/gallery10.jpg"];
const ROW1_LOOP = [...ROW1_IMAGES, ...ROW1_IMAGES];
const ROW2_LOOP = [...ROW2_IMAGES, ...ROW2_IMAGES];

const AVAILABLE_COURSES: CourseItem[] = [
  { title: "गणित: Objective Masterclass", price: "₹499", badge: "Class 10", desc: "Shortcuts के साथ सम्पूर्ण गणित।", image: "/course1.jpg" },
  { title: "विज्ञान: सम्पूर्ण Revision", price: "₹699", badge: "Class 10", desc: "Physics, Chemistry, Biology।", image: "/course2.jpg" },
  { title: "Inter: सम्पूर्ण Topper Batch", price: "₹999", badge: "Class 12", desc: "Mock tests के साथ सभी विषय।", image: "/course3.jpg" },
  { title: "अंग्रेजी: व्याकरण और लेखन", price: "₹399", badge: "All classes", desc: "अंग्रेजी में आसानी से महारत।", image: "/course4.jpg" },
  { title: "सामाजिक विज्ञान: पूर्ण Course", price: "₹599", badge: "Class 10", desc: "History, Geography और Civics।", image: "/course5.jpg" },
];

const COURSES_LOOP = [...AVAILABLE_COURSES, ...AVAILABLE_COURSES];

const NAV_ITEMS = [
  { id: "overview", label: "Overview" },
  { id: "snapshot", label: "Snapshot" },
  { id: "study-plan", label: "Study Plan" },
  { id: "youtube-videos", label: "Videos" },
  { id: "courses", label: "Courses" },
  { id: "gallery", label: "Gallery" },
  { id: "updates", label: "Updates" },
  { id: "faq", label: "FAQ" },
];

type ToneKey = "red" | "blue" | "purple" | "orange" | "sky" | "green" | "indigo";

const TONE_CLASSES: Record<ToneKey, string> = {
  red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 hover:bg-red-500/20",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 hover:bg-blue-500/20",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 hover:bg-purple-500/20",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20 hover:bg-orange-500/20",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 hover:bg-sky-500/20",
  green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 hover:bg-green-500/20",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20",
};

interface QuickAction {
  id: string;
  label: string;
  icon: IconType;
  tone: ToneKey;
  href?: string;
  targetId?: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: "live", label: "Live Class", icon: PlayCircle, tone: "red", href: YOUTUBE_CHANNEL_URL },
  { id: "videos", label: "Videos", icon: Video, tone: "blue", targetId: "youtube-videos" },
  { id: "courses", label: "Courses", icon: BookOpen, tone: "purple", targetId: "courses" },
  { id: "updates", label: "Updates", icon: Bell, tone: "orange", targetId: "updates" },
  { id: "support", label: "Support", icon: MessageCircle, tone: "sky", href: TELEGRAM_URL },
];

const WEEKLY_FOCUS: { day: string; title: string; desc: string; icon: IconType }[] = [
  { day: "Sunday", title: "Full Revision + Weak Topics", desc: "पिछले हफ्ते की mistakes revise करें, सबसे कमजोर topic पर 1 extra practice करें।", icon: RefreshCw },
  { day: "Monday", title: "Maths Mastery", desc: "Class 10/12 maths के objective + subjective दोनों practice करें। Short tricks जरूर लगाएं।", icon: Zap },
  { day: "Tuesday", title: "Science Deep Dive", desc: "Physics numericals, Chemistry reactions, Biology diagrams — सबको board format में लिखें।", icon: FileText },
  { day: "Wednesday", title: "Social Science Mapping", desc: "History dates, Geography maps, Civics points और Political Science concepts को smart notes से revise करें।", icon: MapPin },
  { day: "Thursday", title: "English + Hindi Writing", desc: "Grammar rules, letter/email/application writing और essay practice पर focus करें।", icon: GraduationCap },
  { day: "Friday", title: "Previous Year Questions", desc: "Bihar Board PYQ solve करें। question pattern और answer length को board के अनुसार maintain करें।", icon: Target },
  { day: "Saturday", title: "Mock Test Analysis", desc: "एक full mock दें, फिर हर गलती का reason लिखें — concept mistake, silly mistake या time management।", icon: Trophy },
];

const DAILY_SLOTS: { id: string; label: string; title: string; desc: string; start: number; end: number; icon: IconType }[] = [
  { id: "morning", label: "सुबह 5:00 - 9:00", title: "Concept + Smart Notes", desc: "नया topic समझें, formulae/definitions लिखें, और RK Sir के notes revise करें।", start: 5, end: 9, icon: Sparkles },
  { id: "day", label: "दोपहर 9:00 - 14:00", title: "Practice Questions", desc: "Objective MCQs और subjective questions की timed practice करें।", start: 9, end: 14, icon: BookOpen },
  { id: "evening", label: "शाम 14:00 - 19:00", title: "Live / Recorded Class", desc: "RK Sir की live class join करें या latest YouTube lecture देखकर doubts note करें।", start: 14, end: 19, icon: PlayCircle },
  { id: "night", label: "रात 19:00 - 23:00", title: "Revision + Doubt Clearing", desc: "दिनभर का summary बनाएं, Telegram/mentor से doubts पूछें।", start: 19, end: 23, icon: MessageCircle },
  { id: "rest", label: "Rest 23:00 - 5:00", title: "Sleep for Memory", desc: "पर्याप्त नींद लें। revision याद रखने के लिए sleep सबसे powerful tool है।", start: 23, end: 5, icon: Clock },
];

const UPDATE_TYPE_META: Record<UpdateData["type"], { label: string; emoji: string; badge: string; dot: string }> = {
  announcement: { label: "घोषणा", emoji: "📢", badge: "bg-blue-500/80", dot: "bg-blue-500" },
  motivation: { label: "प्रेरणा", emoji: "💪", badge: "bg-purple-500/80", dot: "bg-purple-500" },
  tip: { label: "टिप", emoji: "💡", badge: "bg-green-500/80", dot: "bg-green-500" },
};

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

function isSlotActive(slot: { start: number; end: number }, hour: number) {
  if (slot.start <= slot.end) return hour >= slot.start && hour < slot.end;
  return hour >= slot.start || hour < slot.end;
}

// ==============================
// ICONS
// ==============================

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000" />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
  </svg>
);

// ==============================
// PURE-CSS WAVING HAND (live feeling)
// ==============================

const SKIN = "linear-gradient(150deg,#ffe3c6 0%,#ffc49b 46%,#f6a072 100%)";
const SKIN_SHADOW = "inset 0 -0.05em 0.1em rgba(168,86,48,.28), 0 0.05em 0.16em rgba(0,0,0,.28)";

const WavingHand = memo(function WavingHand() {
  const fingers = [
    { left: "0.05em", height: "0.30em", rotate: "-7deg" },
    { left: "0.21em", height: "0.37em", rotate: "-2deg" },
    { left: "0.37em", height: "0.35em", rotate: "3deg" },
    { left: "0.53em", height: "0.28em", rotate: "8deg" },
  ];

  return (
    <span aria-hidden="true" style={{ position: "relative", display: "inline-flex", alignItems: "flex-end", justifyContent: "center", width: "1.5em", height: "1.5em", marginLeft: "0.14em", verticalAlign: "-0.22em" }}>
      <span style={{ position: "absolute", inset: "-0.15em", borderRadius: "9999px", background: "radial-gradient(circle at 50% 60%, rgba(251,146,60,.55), rgba(236,72,153,.25) 45%, transparent 72%)", filter: "blur(2px)", animation: "wocWaveGlow 2.4s ease-in-out infinite" }} />
      <span style={{ position: "absolute", inset: "0.05em", borderRadius: "9999px", border: "1.5px solid rgba(251,146,60,.55)", animation: "wocPulseRing 2.4s ease-out infinite" }} />
      <span style={{ position: "relative", width: "0.74em", height: "0.96em", transformOrigin: "62% 94%", animation: "wocWave 2.6s ease-in-out infinite", filter: "drop-shadow(0 0.04em 0.1em rgba(0,0,0,.35))" }}>
        <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "0.62em", height: "0.46em", borderRadius: "0.2em 0.2em 0.26em 0.26em", background: SKIN, boxShadow: SKIN_SHADOW }} />
        {fingers.map((f, i) => (<span key={i} style={{ position: "absolute", bottom: "0.34em", left: f.left, width: "0.13em", height: f.height, borderRadius: "0.07em 0.07em 0.03em 0.03em", background: SKIN, boxShadow: SKIN_SHADOW, transform: `rotate(${f.rotate})`, transformOrigin: "bottom center" }} />))}
        <span style={{ position: "absolute", bottom: "0.16em", left: "-0.04em", width: "0.17em", height: "0.3em", borderRadius: "0.09em", background: SKIN, boxShadow: SKIN_SHADOW, transform: "rotate(-40deg)", transformOrigin: "bottom right" }} />
      </span>
      {[{ top: "0.05em", right: "0.02em", delay: "0s", size: "0.16em" }, { top: "0.32em", right: "-0.06em", delay: "0.6s", size: "0.12em" }, { top: "-0.04em", left: "0.18em", delay: "1.1s", size: "0.1em" }].map((s, i) => (
        <span key={i} style={{ position: "absolute", top: s.top, right: s.right, left: s.left, width: s.size, height: s.size, background: "linear-gradient(135deg,#fff7ed,#fdba74 45%,#f472b6)", borderRadius: "2px", transform: "rotate(45deg)", boxShadow: "0 0 6px rgba(251,146,60,.8)", animation: `wocSparkle 1.9s ease-out ${s.delay} infinite`, opacity: 0 }} />
      ))}
    </span>
  );
});

// ==============================
// UI COMPONENTS
// ==============================

const StreakRing = memo(function StreakRing({ value, max = 7, label = "दिन" }: { value: number; max?: number; label?: string }) {
  const safeValue = Math.max(0, Math.min(value, max));
  const pct = max > 0 ? (safeValue / max) * 100 : 0;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
        <defs>
          <linearGradient id="dashboardStreakGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="8" className="stroke-slate-200 dark:stroke-slate-800" />
        <circle cx="40" cy="40" r={radius} fill="none" strokeWidth="8" strokeLinecap="round" stroke="url(#dashboardStreakGradient)" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-[stroke-dashoffset] duration-1000 ease-out" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{safeValue}</span>
        <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400">{label}</span>
      </div>
    </div>
  );
});

const YouTubeVideoCard = memo(function YouTubeVideoCard({ video, tileId, reducedMotion, isSounding, onToggleSound }: { video: YoutubeVideo; tileId: string; reducedMotion: boolean; isSounding: boolean; onToggleSound: (tileId: string) => void }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const unmountTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [inView, setInView] = useState(false);
  const [manualPlay, setManualPlay] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => {
    setThumbSrc(video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
    setThumbFailed(false);
    setImageLoaded(false);
  }, [video.id, video.thumbnail]);

  useEffect(() => { setIframeLoading(true); }, [isSounding, video.id]);

  useEffect(() => {
    if (reducedMotion) return;
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.3) {
        if (unmountTimer.current) { clearTimeout(unmountTimer.current); unmountTimer.current = null; }
        setInView(true);
      } else if (!entry.isIntersecting) {
        unmountTimer.current = setTimeout(() => setInView(false), 450);
      }
    }, { threshold: [0, 0.3, 0.6], rootMargin: "220px 0px" });
    io.observe(el);
    return () => { io.disconnect(); if (unmountTimer.current) clearTimeout(unmountTimer.current); };
  }, [reducedMotion]);

  const showIframe = reducedMotion ? manualPlay : inView;
  const fallbackThumb = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;
  const parsedDate = video.publishedAt ? new Date(video.publishedAt) : null;
  const publishedLabel = parsedDate && !isNaN(parsedDate.getTime()) ? parsedDate.toLocaleDateString("hi-IN", { day: "numeric", month: "short" }) : "NEW";
  const iframeSrc = `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=${isSounding ? 0 : 1}&loop=1&playlist=${video.id}&playsinline=1&controls=0&modestbranding=1&rel=0&iv_load_policy=3&fs=0`;

  const handleSound = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    if (reducedMotion) setManualPlay(true);
    onToggleSound(tileId);
  };

  return (
    <article ref={rootRef} className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0 group">
      <div className="relative bg-white/90 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 border border-white/60 dark:border-slate-700/50" style={isSounding ? { animation: "wocSoundRing 1.8s ease-out infinite" } : undefined}>
        <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
          {!imageLoaded && <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />}
          <img src={thumbSrc} alt={video.title} loading="lazy" decoding="async" onLoad={() => setImageLoaded(true)} onError={() => { if (!thumbFailed) { setThumbFailed(true); setThumbSrc(fallbackThumb); } }} className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"} ${showIframe ? "opacity-0" : ""}`} />
          {showIframe && (<>
            <iframe key={`${video.id}-${isSounding ? "s" : "m"}`} src={iframeSrc} title={video.title} loading="lazy" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 z-10 w-full h-full" onLoad={() => setIframeLoading(false)} />
            {iframeLoading && <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30"><RefreshCw className="w-6 h-6 text-white/90 animate-spin" /></div>}
          </>)}
          {reducedMotion && !manualPlay && (
            <button type="button" onClick={() => setManualPlay(true)} aria-label={`${video.title} play करें`} className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-all duration-300">
              <span className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300"><PlayCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" /></span>
            </button>
          )}
          <button type="button" onClick={handleSound} aria-label={isSounding ? `${video.title} mute करें` : `${video.title} sound on करें`} aria-pressed={isSounding} className={`absolute top-2 left-2 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-300 active:scale-95 ${isSounding ? "bg-red-600 text-white shadow-lg shadow-red-500/40" : "bg-black/55 text-white/90 hover:bg-black/70"}`}>
            {isSounding ? <Volume2 className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} /> : <VolumeX className="h-4.5 w-4.5" style={{ width: 18, height: 18 }} />}
          </button>
          {isSounding && <div className="absolute top-2 right-2 z-30 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black text-white shadow-lg"><span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" /> SOUND ON</div>}
          {!isSounding && <div className="absolute bottom-2 right-2 z-20 pointer-events-none bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md">{publishedLabel}</div>}
        </div>
        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-2 mt-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400"><YoutubeIcon className="w-3 h-3 sm:w-4 sm:h-4" /><span>World of Concept</span></div>
        </div>
      </div>
    </article>
  );
});

const YoutubeSkeletonCard = memo(function YoutubeSkeletonCard() {
  return (
    <div className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0">
      <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg border border-white/60 dark:border-slate-700/50">
        <div className="relative aspect-video bg-slate-200 dark:bg-slate-800 animate-pulse" />
        <div className="p-3 sm:p-4 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  );
});

const UpdatesSkeletonCard = memo(function UpdatesSkeletonCard() {
  return (
    <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
      <div className="relative h-36 sm:h-40 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
      </div>
    </div>
  );
});

const CourseCard = memo(function CourseCard({ course }: { course: CourseItem }) {
  return (
    <article className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0 group">
      <div className="bg-white/90 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-500 ease-out hover:-translate-y-2 h-full flex flex-col border border-white/60 dark:border-slate-700/50">
        <div className="relative h-36 sm:h-44 overflow-hidden">
          <Image src={course.image} alt={course.title} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute top-2 left-2"><span className="bg-blue-600/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold shadow-md">{course.badge}</span></div>
          <div className="absolute bottom-2 left-2 right-2"><h3 className="text-white font-bold text-sm sm:text-base drop-shadow-lg leading-tight line-clamp-2">{course.title}</h3></div>
        </div>
        <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-slate-50/80 to-slate-100/80 dark:from-slate-800/50 dark:to-slate-900/50">
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-3 line-clamp-2">{course.desc}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">{course.price}</span>
            <MagneticButton href={`/test-payment?course=${encodeURIComponent(course.title)}&price=${encodeURIComponent(course.price)}`} className="block text-center rainbow-shimmer-bg text-white font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-xs sm:text-sm whitespace-nowrap">Enrollment</MagneticButton>
          </div>
        </div>
      </div>
    </article>
  );
});

const GalleryCard = memo(function GalleryCard({ src, alt, label, icon: Icon, hoverShadow }: { src: string; alt: string; label: string; icon: IconType; hoverShadow: string }) {
  return (
    <div className={`relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 h-40 sm:h-48 rounded-2xl overflow-hidden group flex-shrink-0 shadow-md hover:shadow-xl ${hoverShadow} transition-all duration-500 hover:-translate-y-2 border border-white/60 dark:border-slate-700/50`}>
      <Image src={src} alt={alt} fill className="object-cover transition-transform duration-700 ease-out group-hover:scale-110" sizes="(max-width: 640px) 75vw, (max-width: 768px) 280px, 320px" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-white font-bold text-xs sm:text-sm tracking-wide drop-shadow-md flex items-center gap-2"><Icon className="w-3 h-3 sm:w-4 sm:h-4" />{label}</span>
      </div>
    </div>
  );
});

const UpdateCard = memo(function UpdateCard({ update }: { update: UpdateData }) {
  const updateDate = getUpdateDate(update);
  const dateLabel = formatDateHi(updateDate);
  const meta = UPDATE_TYPE_META[update.type] ?? UPDATE_TYPE_META.announcement;

  return (
    <article className="group bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-1">
      {update.imageUrl && (
        <div className="relative h-36 sm:h-40 overflow-hidden">
          <img src={update.imageUrl} alt={update.title} loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute top-2 left-2"><span className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-white backdrop-blur-sm ${meta.badge}`}>{meta.emoji} {meta.label}</span></div>
        </div>
      )}
      <div className="p-4">
        {!update.imageUrl && (<div className="mb-2"><span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-white ${meta.badge}`}>{meta.emoji} {meta.label}</span></div>)}
        <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-sm sm:text-base">{update.title}</h3>
        <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-2 line-clamp-3">{update.description}</p>
        <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" />{dateLabel}</p>
      </div>
    </article>
  );
});

// Reusable Matte Section Wrapper
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
// MAIN DASHBOARD PAGE
// ==============================

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updateFilter, setUpdateFilter] = useState<"all" | UpdateData["type"]>("all");

  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [ytLoading, setYtLoading] = useState(true);
  const [ytError, setYtError] = useState<string | null>(null);

  const [streak, setStreak] = useState<StreakData | null>(null);
  const [now, setNow] = useState<Date | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  // NEW STATE FOR ROTATING TAGLINES
  const [dashTaglineIndex, setDashTaglineIndex] = useState(0);

  // YT rail controls — DEFAULT AUTO-PLAY, pause सिर्फ explicit button से
  const [ytRailManualPaused, setYtRailManualPaused] = useState(false);
  // जो tile sound पर है वही rail को focus-pause करता है
  const [soundKey, setSoundKey] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const ytRequestIdRef = useRef(0);
  const updatesRequestIdRef = useRef(0);
  const ytAbortRef = useRef<AbortController | null>(null);

  const reducedMotion = useReducedMotion();

  // ==============================
  // MOUNT GUARD
  // ==============================

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      ytAbortRef.current?.abort();
    };
  }, []);

  // ==============================
  // CLOCK / OFFLINE / STREAK
  // ==============================

  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const updateOnlineStatus = () => setIsOffline(!navigator.onLine);
    updateOnlineStatus();
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  useEffect(() => {
    if (!loading && student) setStreak(bumpStreak());
  }, [loading, student]);

  // ==============================
  // ROTATE TAGLINES EVERY 6 SECONDS
  // ==============================
  useEffect(() => {
    if (reducedMotion) return; // Stop rotation if user prefers reduced motion
    
    const interval = setInterval(() => {
      setDashTaglineIndex((prev) => (prev + 1) % DASH_TAGLINES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [reducedMotion]);

  // ==============================
  // SCROLL HELPERS
  // ==============================

  const scrollToId = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }, [reducedMotion]);

  const scrollToUpdates = useCallback(() => scrollToId("updates"), [scrollToId]);

  // ==============================
  // FETCH UPDATES
  // ==============================

  const fetchUpdates = useCallback(async () => {
    const requestId = ++updatesRequestIdRef.current;
    setUpdatesLoading(true);
    try {
      const updatesSnapshot = await getDocs(query(collection(db, "updates"), limit(50)));
      if (!mountedRef.current || requestId !== updatesRequestIdRef.current) return;
      const parsedUpdates: UpdateData[] = updatesSnapshot.docs.map((d) => {
        const data = d.data() as any;
        return {
          id: d.id,
          title: data.title || "New Update",
          description: data.description || "",
          imageUrl: data.imageUrl || undefined,
          timestamp: data.timestamp,
          createdAt: data.createdAt,
          type: sanitizeUpdateType(data.type),
        };
      });
      parsedUpdates.sort((a, b) => getUpdateDate(b).getTime() - getUpdateDate(a).getTime());
      setUpdates(parsedUpdates.slice(0, 6));
    } catch (e) {
      console.log("No updates yet", e);
      if (mountedRef.current && requestId === updatesRequestIdRef.current) setUpdates([]);
    } finally {
      if (mountedRef.current && requestId === updatesRequestIdRef.current) setUpdatesLoading(false);
    }
  }, []);

  // ==============================
  // AUTH + STUDENT FETCH
  // ==============================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthChecked(true);
      if (!user) {
        setLoading(false);
        setUpdatesLoading(false);
        window.location.replace("/");
        return;
      }
      try {
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (!mountedRef.current) return;
        if (studentDoc.exists()) {
          const data = studentDoc.data() as StudentData;
          if (data.role?.trim().toLowerCase() === "admin") {
            setLoading(false);
            setUpdatesLoading(false);
            window.location.replace("/admin");
            return;
          }
          setStudent(data);
          void fetchUpdates();
        } else {
          setLoading(false);
          setUpdatesLoading(false);
          window.location.replace("/");
        }
      } catch (error) {
        console.error("Student fetch error", error);
        setLoading(false);
        setUpdatesLoading(false);
        window.location.replace("/");
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [fetchUpdates]);

  // ==============================
  // YOUTUBE FETCH + CACHE
  // ==============================

  const loadYoutube = useCallback(async (showLoader = true) => {
    ytAbortRef.current?.abort();
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    ytAbortRef.current = controller;
    const requestId = ++ytRequestIdRef.current;
    if (showLoader) setYtLoading(true);
    setYtError(null);
    try {
      const res = await fetch("/api/youtube", controller ? { signal: controller.signal, cache: "no-store" } : { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!mountedRef.current || requestId !== ytRequestIdRef.current) return;
      if (!res.ok) throw new Error(data?.message || `YouTube API route failed with status ${res.status}`);
      const videos = Array.isArray(data) ? data : data?.videos;
      if (Array.isArray(videos) && videos.length > 0) {
        setYoutubeVideos(videos);
        writeYoutubeCache(videos);
      } else {
        setYoutubeVideos((prev) => (prev.length > 0 ? prev : []));
        setYtError(data?.message || "YouTube videos load नहीं हो पाए।");
      }
    } catch (error) {
      if (controller?.signal.aborted) return;
      if (!mountedRef.current || requestId !== ytRequestIdRef.current) return;
      console.error("YouTube fetch error:", error);
      setYtError(error instanceof Error ? error.message : "YouTube API fetch करने में network error आया।");
    } finally {
      if (mountedRef.current && requestId === ytRequestIdRef.current) setYtLoading(false);
    }
  }, []);

  useEffect(() => {
    const cached = readYoutubeCache();
    if (cached && cached.length > 0) {
      setYoutubeVideos(cached);
      setYtLoading(false);
      setYtError(null);
    }
    void loadYoutube(!(cached && cached.length > 0));
  }, [loadYoutube]);

  // ==============================
  // YT RAIL — AUTO-PLAY DEFAULT (no hover/focus pause)
  // ==============================

  const toggleSound = useCallback((tileId: string) => {
    setSoundKey((prev) => (prev === tileId ? null : tileId));
  }, []);

  const ytRailRunning = youtubeVideos.length > 0 && !reducedMotion && !ytRailManualPaused && soundKey === null;

  const ytRailStyle: CSSProperties = reducedMotion ? {} : {
    animation: `${MARQUEE_KEYFRAME} ${marqueeDuration(youtubeVideos.length)}s linear infinite`,
    animationPlayState: ytRailRunning ? "running" : "paused",
    willChange: "transform",
  };

  const ytRailVideos = useMemo(() => (youtubeVideos.length > 0 ? [...youtubeVideos, ...youtubeVideos] : []), [youtubeVideos]);

  const ytRailStatus = useMemo(() => {
    if (ytLoading) return "YouTube API से videos load हो रहे हैं...";
    if (youtubeVideos.length === 0) return "Videos sync नहीं हुए — retry available";
    if (reducedMotion) return "Reduced motion — manual scroll + tap to play";
    if (soundKey) return "🔊 Sound on — rail paused (specific video with sound)";
    if (ytRailManualPaused) return "⏸ Rail paused — Play दबाएं";
    return "▶ Auto play — left → right · muted videos autoplay";
  }, [ytLoading, youtubeVideos.length, reducedMotion, soundKey, ytRailManualPaused]);

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    window.location.replace("/");
  }, []);

  // ==============================
  // DERIVED VALUES
  // ==============================

  const greeting = useMemo(() => {
    const hour = now?.getHours() ?? 12;
    if (hour < 12) return "सुप्रभात";
    if (hour < 17) return "नमस्कार";
    return "शुभ संध्या";
  }, [now]);

  const dateLabel = useMemo(() => {
    if (!now) return "आज";
    try { return now.toLocaleDateString("hi-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); } catch { return "आज"; }
  }, [now]);

  const todayIndex = now?.getDay() ?? 0;
  const todayFocus = WEEKLY_FOCUS[todayIndex] ?? WEEKLY_FOCUS[0];
  const FocusIcon = todayFocus.icon;

  const activeSlotId = useMemo(() => {
    if (!now) return null;
    const hour = now.getHours();
    return DAILY_SLOTS.find((slot) => isSlotActive(slot, hour))?.id ?? null;
  }, [now]);

  const weekProgress = useMemo(() => Math.round(((todayIndex + 1) / 7) * 100), [todayIndex]);

  const updateCounts = useMemo(() => ({
    all: updates.length,
    announcement: updates.filter((u) => u.type === "announcement").length,
    motivation: updates.filter((u) => u.type === "motivation").length,
    tip: updates.filter((u) => u.type === "tip").length,
  }), [updates]);

  const filteredUpdates = useMemo(() => {
    if (updateFilter === "all") return updates;
    return updates.filter((u) => u.type === updateFilter);
  }, [updates, updateFilter]);

  const snapshotCards = useMemo(() => [
    { icon: BookOpen, label: "Courses", value: AVAILABLE_COURSES.length, sub: "Enrollment open", tone: "blue" as ToneKey },
    { icon: Video, label: "Videos", value: youtubeVideos.length, sub: ytLoading ? "Loading..." : ytError ? "Retry needed" : "Synced", tone: "red" as ToneKey },
    { icon: MessageCircle, label: "Updates", value: updates.length, sub: updatesLoading ? "Loading..." : "RK Sir", tone: "indigo" as ToneKey },
    { icon: Flame, label: "Streak", value: streak?.current ?? 0, sub: `Longest ${streak?.longest ?? 0}`, tone: "orange" as ToneKey },
  ], [youtubeVideos.length, ytLoading, ytError, updates.length, updatesLoading, streak]);

  const achievements = useMemo(() => [
    { icon: Sparkles, title: "Dashboard Unlocked", desc: "Student login successful", earned: true },
    { icon: Video, title: "Video Explorer", desc: "Latest YouTube videos loaded", earned: youtubeVideos.length > 0 },
    { icon: MessageCircle, title: "Update Follower", desc: "RK Sir updates synced", earned: updates.length > 0 },
    { icon: Flame, title: "Consistency Star", desc: "2+ दिन का streak", earned: (streak?.current ?? 0) >= 2 },
    { icon: Rocket, title: "Session Ready", desc: `${BOARD_SESSION_YEAR} batch focus`, earned: true },
    { icon: Users, title: "Bihar Wide", desc: "Alamnagar से पूरे Bihar", earned: true },
  ], [youtubeVideos.length, updates.length, streak]);

  // ==============================
  // LOADING STATE
  // ==============================

  if (!authChecked || loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center transition-colors duration-700">
        <div className="text-center space-y-4 px-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
          <p className="text-slate-400 font-bold text-lg">World of Concept लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  // ==============================
  // ERROR STATE
  // ==============================

  if (!student) {
    return (
      <div className="min-h-[100dvh] bg-slate-950 flex items-center justify-center transition-colors duration-700">
        <div className="text-center space-y-4 px-4">
          <div className="w-16 h-16 mx-auto bg-red-900/50 rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠️</span>
          </div>
          <p className="text-slate-400 font-medium">छात्र डेटा लोड करने में असमर्थ</p>
          <MagneticButton onClick={() => window.location.replace("/")} className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg">Home पर जाएं</MagneticButton>
        </div>
      </div>
    );
  }

  const firstName = student.fullName?.split(" ")[0] || "छात्र";

  return (
    <div className="relative min-h-[100dvh] bg-slate-950 text-slate-100 font-sans transition-colors duration-700">
      {/* Self-contained styles: YT rail + waving hand + LIVE MATTE WAVES */}
      <style dangerouslySetInnerHTML={{ __html: DASH_STYLES }} />

      <AdPopup />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dashboardSchema) }} />

      <StudentHeader
        fullName={student.fullName}
        email={student.email}
        updatesCount={updates.length}
        onNotifications={scrollToUpdates}
        onLogout={handleLogout}
      />

      <main className="relative w-full pb-8" aria-label="Student dashboard main content">
        
        {/* ==============================
            1. CINEMATIC HERO / OVERVIEW — UPGRADED WITH DUAL WAVES & ROTATING TAGLINES
            ============================== */}
        <section id="overview" className="animate-fade-in-up relative w-full overflow-hidden mb-6 sm:mb-10 group bg-slate-950">
          
          {/* Background Engine */}
          <DynamicBackground images={WELCOME_BG_IMAGES} zoomType="in" density={0.8} interactive showGrid={false} />
          
          {/* Dark Matte Overlay */}
          <div className="absolute inset-0 bg-slate-950/70 dark:bg-slate-950/80 backdrop-blur-sm z-10" />

          {/* --- DUAL RAINBOW WAVE LAYERS --- */}
          <div className="wave-container z-20">
            <div className="wave-layer wave-left" />
            <div className="wave-layer wave-right" />
          </div>

          <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-[1.35fr_0.65fr] gap-8 lg:gap-12 items-start">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold border border-white/10 shadow-lg text-white/80">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>छात्र डैशबोर्ड</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold border border-green-500/20 shadow-lg text-green-100">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{BOARD_SESSION_YEAR} Session</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 backdrop-blur-md rounded-full text-[10px] sm:text-xs font-bold border border-blue-500/20 shadow-lg text-blue-100">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dateLabel}</span>
                  </div>
                </div>

                {/* Main Title: Dark Matte Gradient */}
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-3 leading-[0.95] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-400 drop-shadow-2xl">
                  {greeting}, {firstName}
                  <WavingHand />
                </h1>

                {/* ROTATING TAGLINE IMPLEMENTATION */}
                <div className="h-16 flex items-center justify-start overflow-hidden mb-5">
                  <p 
                    key={dashTaglineIndex} 
                    className="cinematic-hero-subtitle text-base sm:text-xl max-w-2xl drop-shadow-xl text-gray-300 font-medium tagline-animate"
                  >
                    {DASH_TAGLINES[dashTaglineIndex]}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 shadow-xl mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white shadow-lg flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-white font-extrabold text-sm sm:text-base">
                        Alamnagar, Madhepura से World-Class Dashboard
                      </p>
                      <p className="text-white/75 text-xs sm:text-sm leading-relaxed">
                        प्रतिभा सिर्फ महानगरों में नहीं होती। सही platform, सही guidance
                        और रोज़ की मेहनत से गाँव का छात्र भी global standard बन सकता है।
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-6">
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon;
                    const className = `inline-flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border font-bold text-xs sm:text-sm shadow-sm ${TONE_CLASSES[action.tone]}`;
                    const content = (<><Icon className="w-4 h-4" /><span>{action.label}</span></>);
                    if (action.href) {
                      return (<MagneticButton key={action.id} href={action.href} target="_blank" rel="noopener noreferrer" className={className}>{content}</MagneticButton>);
                    }
                    return (<MagneticButton key={action.id} onClick={() => action.targetId && scrollToId(action.targetId)} className={className}>{content}</MagneticButton>);
                  })}
                </div>

                {/* Section Nav */}
                <nav aria-label="Dashboard sections" className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  {NAV_ITEMS.map((item) => (
                    <MagneticButton key={item.id} onClick={() => scrollToId(item.id)} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/85 hover:text-white hover:bg-white/20 text-[10px] sm:text-xs font-bold backdrop-blur-md transition-all">
                      {item.label}
                    </MagneticButton>
                  ))}
                </nav>
              </div>

              {/* Right Cards (Live Class & Streak) */}
              <div className="w-full space-y-4">
                <div className="relative bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-2xl group-hover:scale-[1.01] transition-transform duration-500">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg animate-pulse z-20">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    LIVE NOW
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
                      <span className="text-red-700">▶️</span>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white drop-shadow-md">दैनिक live class</h3>
                      <p className="text-white/80 text-xs sm:text-sm">RK Sir के साथ अभी जुड़ें</p>
                    </div>
                  </div>
                  <MagneticButton href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg">
                    <PlayCircle className="w-5 h-5" />
                    अभी live देखें
                  </MagneticButton>
                </div>

                <div className="relative bg-white/5 dark:bg-slate-900/40 backdrop-blur-xl border border-white/10 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm sm:text-base font-extrabold text-white">Daily Streak</h3>
                    <Flame className="w-5 h-5 text-orange-400" />
                  </div>
                  <div className="flex items-center gap-4">
                    <StreakRing value={streak?.current ?? 0} label="दिन" />
                    <div className="min-w-0">
                      <p className="text-white font-bold text-sm sm:text-base">Consistency = Result</p>
                      <p className="text-white/70 text-xs sm:text-sm">Longest: {streak?.longest ?? 0} दिन</p>
                      <p className="text-white/70 text-xs sm:text-sm">Total visits: {streak?.visits ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==============================
            2. LEARNING SNAPSHOT
            ============================== */}
        <MatteWaveSection bgImages={SNAPSHOT_BG_IMAGES} className="!py-8 !border-none">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-matte-primary mb-1">
                Learning Snapshot
              </h2>
              <p className="text-matte-muted text-xs sm:text-sm">
                आपका आज का dashboard summary — courses, videos, updates और consistency।
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-[10px] sm:text-xs font-bold text-slate-300 shadow-sm">
              <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
              {BOARD_SESSION_YEAR} Ready
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {snapshotCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className={`bg-slate-900/60 backdrop-blur-xl border rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ${TONE_CLASSES[card.tone]}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wide opacity-80">{card.label}</p>
                      <p className="text-xl sm:text-3xl font-black text-white">{card.value}</p>
                      <p className="text-[10px] sm:text-xs opacity-75 truncate">{card.sub}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm sm:text-base font-extrabold text-white">Weekly Consistency</p>
              <p className="text-sm sm:text-base font-black text-orange-400">{weekProgress}%</p>
            </div>
            <div className="progress-bar bg-slate-800">
              <div className="progress-bar-fill bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500" style={{ width: `${weekProgress}%` }} />
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
              आज {todayFocus.day} है। Weekly focus के साथ चलते रहो, board exam में confidence अपने आप बढ़ेगा।
            </p>
          </div>
        </MatteWaveSection>

        {/* ==============================
            3. STUDY PLAN / TODAY FOCUS
            ============================== */}
        <MatteWaveSection bgImages={PLAN_BG_IMAGES} className="!py-8 !border-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <ListChecks className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white drop-shadow-lg">Today&apos;s Study Plan</h2>
              <p className="text-white/75 text-xs sm:text-sm">RK Sir suggested routine — small daily steps, big board result.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-4 sm:gap-6">
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <FocusIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-wide">{todayFocus.day}</p>
                  <h3 className="text-white font-extrabold text-lg sm:text-xl leading-tight">{todayFocus.title}</h3>
                </div>
              </div>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-5">{todayFocus.desc}</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm text-white/75">
                  <span>Weekly progress</span>
                  <span className="font-black text-orange-300">{weekProgress}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-400 via-purple-500 to-blue-500 transition-[width] duration-1000 ease-out" style={{ width: `${weekProgress}%` }} />
                </div>
              </div>
              <MagneticButton href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 text-white px-4 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg border border-white/15">
                <MessageCircle className="w-5 h-5" />
                Doubt के लिए Telegram जुड़ें
              </MagneticButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {DAILY_SLOTS.map((slot) => {
                const Icon = slot.icon;
                const active = activeSlotId === slot.id;
                return (
                  <div key={slot.id} className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-500 ${active ? "border-orange-400/60 bg-orange-500/15 shadow-lg shadow-orange-500/10" : "border-slate-800 bg-slate-900/50 hover:bg-slate-900/80"}`}>
                    {active && (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] sm:text-[10px] font-black shadow">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        NOW
                      </div>
                    )}
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-orange-500 text-white" : "bg-slate-800 text-white/80"}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-white/60 text-[10px] sm:text-xs font-bold uppercase tracking-wide">{slot.label}</p>
                        <h4 className="text-white font-extrabold text-sm sm:text-base leading-tight mb-1">{slot.title}</h4>
                        <p className="text-white/70 text-xs sm:text-sm leading-relaxed line-clamp-2">{slot.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </MatteWaveSection>

        {/* ==============================
            4. REAL YOUTUBE RAIL — LEFT → RIGHT AUTO-PLAY
               + muted autoplay wall + per-video sound
            ============================== */}
        <MatteWaveSection bgImages={VIDEOS_BG_IMAGES} className="!py-8 !border-none">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                <YoutubeIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-3xl font-extrabold text-white drop-shadow-lg">RK Sir के latest video</h2>
                <p className="text-white/75 text-xs sm:text-sm" aria-live="polite">{ytRailStatus}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setYtRailManualPaused((v) => !v)} aria-label={ytRailManualPaused ? "Video rail play करें" : "Video rail pause करें"} aria-pressed={ytRailManualPaused} className="inline-flex h-10 min-w-10 items-center justify-center gap-2 rounded-xl border border-white/20 bg-black/20 px-3 text-xs font-bold text-white/90 backdrop-blur-sm transition-all hover:bg-black/30 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 active:scale-95 sm:text-sm">
                {ytRailManualPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                <span className="hidden sm:inline">{ytRailManualPaused ? "Play" : "Pause"}</span>
              </button>
              <MagneticButton href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white font-semibold text-sm flex items-center gap-1 bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all border border-white/20">
                देखें <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          {isOffline && youtubeVideos.length > 0 && (
            <div className="mx-4 sm:mx-6 lg:mx-8 mb-4">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/15 border border-amber-500/25 text-amber-100 text-xs sm:text-sm font-bold backdrop-blur-sm">
                <Zap className="w-4 h-4" />
                Offline mode: cached videos दिखाए जा रहे हैं।
              </div>
            </div>
          )}

          <div className={`relative w-full py-2 ${reducedMotion ? "overflow-x-auto no-scrollbar" : "overflow-hidden"}`} aria-roledescription="auto playing video rail">
            {ytLoading ? (
              <div className="flex gap-3 sm:gap-4 w-max pl-4 sm:pl-6 lg:pl-8">
                {Array.from({ length: 4 }).map((_, i) => (<YoutubeSkeletonCard key={`yt-skeleton-${i}`} />))}
              </div>
            ) : youtubeVideos.length > 0 ? (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
                <div className="flex gap-3 sm:gap-4 w-max touch-pan-y pl-4 sm:pl-6 lg:pl-8" style={reducedMotion ? undefined : ytRailStyle}>
                  {ytRailVideos.map((video, i) => {
                    const tileId = `yt-${video.id}-${i}`;
                    return (<YouTubeVideoCard key={tileId} video={video} tileId={tileId} reducedMotion={reducedMotion} isSounding={soundKey === tileId} onToggleSound={toggleSound} />);
                  })}
                </div>
                {soundKey && !reducedMotion && (
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-1">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600/85 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm shadow-lg">
                      <Volume2 className="w-3 h-3" /> Sound on — rail paused
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="mx-4 sm:mx-6 lg:mx-8">
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center shadow-sm">
                  <div className="w-14 h-14 mx-auto mb-3 bg-red-500/10 rounded-full flex items-center justify-center">
                    <YoutubeIcon className="w-7 h-7 text-red-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white mb-1">YouTube video load नहीं हो पाए</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-4">
                    {isOffline ? "अभी internet connection नहीं है। Cached videos भी नहीं मिले।" : ytError || "फिलहाल YouTube API response खाली आया। आप RK Sir का YouTube channel visit कर सकते हैं।"}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <MagneticButton onClick={() => loadYoutube(true)} className="inline-flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg hover:scale-105 border border-slate-700">
                      <RefreshCw className="w-4 h-4" />
                      फिर कोशिश करें
                    </MagneticButton>
                    <MagneticButton href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg">
                      <PlayCircle className="w-5 h-5" />
                      YouTube channel खोलें
                    </MagneticButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </MatteWaveSection>

        {/* ==============================
            5. COURSES RAIL
            ============================== */}
        <MatteWaveSection bgImages={COURSES_BG_IMAGES} className="!py-8 !border-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white drop-shadow-lg">उपलब्ध कोर्स</h2>
              <p className="text-white/75 text-xs sm:text-sm mt-1">Bihar Board Class 9-12 के लिए curated batches।</p>
            </div>
            <MagneticButton href="/courses" className="text-white/90 hover:text-white font-semibold text-sm flex items-center gap-1 bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all border border-white/20">
              सभी देखें <ArrowRight className="w-4 h-4" />
            </MagneticButton>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
              {COURSES_LOOP.map((course, i) => (<CourseCard key={`avail-course-${i}`} course={course} />))}
            </div>
          </div>
        </MatteWaveSection>

        {/* ==============================
            6. GALLERY RAIL
            ============================== */}
        <MatteWaveSection bgImages={GALLERY_BG_IMAGES} className="!py-8 !border-none">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white drop-shadow-lg">World of Concept में जीवन</h2>
            <p className="text-white/75 text-xs sm:text-sm mt-1">Classes, culture, competition और छात्र सफलता की झलकियाँ।</p>
          </div>

          <div className="relative w-full overflow-hidden py-2">
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y mb-3 sm:mb-4 pl-4 sm:pl-6 lg:pl-8" style={{ animationDirection: "reverse" }}>
              {ROW1_LOOP.map((src, i) => (
                <GalleryCard key={`row1-${i}`} src={src} alt={`Gallery Row 1 Image ${i}`} label="World of Concept class" icon={PlayCircle} hoverShadow="hover:shadow-indigo-500/20 dark:hover:shadow-indigo-500/30" />
              ))}
            </div>
            <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
              {ROW2_LOOP.map((src, i) => (
                <GalleryCard key={`row2-${i}`} src={src} alt={`Gallery Row 2 Image ${i}`} label="छात्र सफलता" icon={Trophy} hoverShadow="hover:shadow-yellow-500/20 dark:hover:shadow-yellow-500/30" />
              ))}
            </div>
          </div>
        </MatteWaveSection>

        {/* ==============================
            7. RK SIR UPDATES
            ============================== */}
        <MatteWaveSection bgImages={UPDATES_BG_IMAGES} className="!py-8 !border-none">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-indigo-400" />
              RK Sir के updates
            </h2>
            <MagneticButton onClick={() => fetchUpdates()} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs sm:text-sm font-bold text-slate-300 shadow-sm hover:shadow-md transition-all">
              <RefreshCw className={`w-4 h-4 ${updatesLoading ? "animate-spin" : ""}`} />
              Refresh
            </MagneticButton>
          </div>

          {updatesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (<UpdatesSkeletonCard key={`updates-skeleton-${i}`} />))}
            </div>
          ) : updates.length === 0 ? (
            <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-slate-400 text-sm">अभी कोई update नहीं है। जल्दी ही RK Sir से नई updates आने वाली हैं!</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-5">
                {[
                  { key: "all" as const, label: "सभी", count: updateCounts.all },
                  { key: "announcement" as const, label: "घोषणा", count: updateCounts.announcement },
                  { key: "motivation" as const, label: "प्रेरणा", count: updateCounts.motivation },
                  { key: "tip" as const, label: "टिप", count: updateCounts.tip },
                ].map((chip) => {
                  const active = updateFilter === chip.key;
                  return (
                    <button key={chip.key} type="button" onClick={() => setUpdateFilter(chip.key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold border transition-all ${active ? "bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20" : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-indigo-300"}`}>
                      {chip.label}
                      <span className={`min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[9px] sm:text-[10px] ${active ? "bg-white/20" : "bg-slate-800"}`}>{chip.count}</span>
                    </button>
                  );
                })}
              </div>

              {filteredUpdates.length === 0 ? (
                <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 text-center shadow-sm">
                  <p className="text-slate-400 text-sm">इस type का कोई update अभी नहीं है।</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredUpdates.map((update) => (<UpdateCard key={update.id} update={update} />))}
                </div>
              )}
            </>
          )}
        </MatteWaveSection>

        {/* ==============================
            8. ACHIEVEMENTS
            ============================== */}
        <MatteWaveSection bgImages={ACHIEVEMENT_BG_IMAGES} className="!py-8 !border-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-500/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-white">Achievements</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">छोटी-छोटी consistency badges — क्योंकि बड़ा result छोटे habits से ही बनता है।</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div key={achievement.title} className={`relative overflow-hidden rounded-2xl border p-4 sm:p-5 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg ${achievement.earned ? "bg-slate-900/75 border-slate-800" : "bg-slate-900/45 border-slate-800 opacity-70"}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${achievement.earned ? "bg-gradient-to-br from-orange-500 to-blue-600 text-white shadow-lg" : "bg-slate-800 text-slate-500"}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-extrabold text-white text-sm sm:text-base">{achievement.title}</h3>
                        {achievement.earned && (<CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />)}
                      </div>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{achievement.desc}</p>
                    </div>
                  </div>
                  {achievement.earned && (<div className="absolute -right-6 -bottom-6 w-20 h-20 rounded-full bg-orange-500/10 blur-2xl" />)}
                </div>
              );
            })}
          </div>
        </MatteWaveSection>

        {/* ==============================
            9. FAQ SECTION — VISIBLE
            ============================== */}
        <FaqSection />
      </main>

      {/* ==============================
          FOOTER
          ============================== */}
      <SiteFooter />
    </div>
  );
}