/* eslint-disable */
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection, query, limit, getDocs } from "firebase/firestore";
import Image from "next/image";
import AdPopup from "@/components/AdPopup";
import MagneticButton from "@/components/MagneticButton";
import DynamicBackground from "@/components/DynamicBackground";
import SiteFooter from "@/components/SiteFooter";
import FaqSection from "@/components/FaqSection";
import {
  BookOpen,
  CheckCircle2,
  Target,
  PlayCircle,
  Bell,
  LogOut,
  Sparkles,
  Trophy,
  ArrowRight,
  Calendar,
  MessageCircle,
  RefreshCw,
} from "lucide-react";

const SITE_URL = "https://worldofconcept.in";
const CURRENT_YEAR = new Date().getFullYear();
const BOARD_SESSION_YEAR = CURRENT_YEAR + 1;
const BUILD_ISO = new Date().toISOString();

const dashboardSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/dashboard#dashboard-webpage`,
  url: `${SITE_URL}/dashboard`,
  name: `Student Dashboard | World of Concept Bihar Board & BSEB Coaching`,
  description: `Logged-in student dashboard for World of Concept. Access RK Sir live classes, Bihar Board notes, model paper ${BOARD_SESSION_YEAR}, subject-wise solutions, course enrollment and updates.`,
  inLanguage: "hi-IN",
  isPartOf: { "@id": `${SITE_URL}#website` },
  about: [
    { "@id": `${SITE_URL}#organization` },
    { "@id": `${SITE_URL}#instructor` },
  ],
  breadcrumb: "Dashboard",
  dateModified: BUILD_ISO,
  speakable: {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", "h2", "h3", "#faq h3", "#faq p", "p"],
  },
};

// ==============================
// YOUTUBE CACHE HELPERS
// ==============================

const YOUTUBE_CACHE_KEY = "worldofconcept_youtube_cache_v2";
const YOUTUBE_CACHE_TTL_MS = 30 * 60 * 1000;

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
    const payload: YoutubeCachePayload = {
      savedAt: Date.now(),
      videos,
    };

    window.sessionStorage.setItem(YOUTUBE_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage errors
  }
}

// ==============================
// ICONS
// ==============================

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      fill="#FF0000"
    />
    <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
  </svg>
);

// ==============================
// YOUTUBE CARD
// ==============================

const YouTubeVideoCard = ({ video }: { video: YoutubeVideo }) => {
  const [playing, setPlaying] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [thumbSrc, setThumbSrc] = useState(
    video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`
  );
  const [thumbFailed, setThumbFailed] = useState(false);

  useEffect(() => {
    setThumbSrc(video.thumbnail || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`);
    setThumbFailed(false);
    setImageLoaded(false);
  }, [video.id, video.thumbnail]);

  const fallbackThumb = `https://i.ytimg.com/vi/${video.id}/mqdefault.jpg`;

  const parsedDate = video.publishedAt ? new Date(video.publishedAt) : null;
  const publishedLabel =
    parsedDate && !isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString("hi-IN", {
          day: "numeric",
          month: "short",
        })
      : "NEW";

  return (
    <article className="relative w-[75vw] max-w-[280px] sm:w-72 md:w-80 flex-shrink-0 group">
      <div className="bg-white/90 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 border border-white/60 dark:border-slate-700/50">
        <div className="relative aspect-video bg-slate-100 dark:bg-slate-900">
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
              )}

              <img
                src={thumbSrc}
                alt={video.title}
                loading="lazy"
                decoding="async"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  if (!thumbFailed) {
                    setThumbFailed(true);
                    setThumbSrc(fallbackThumb);
                  }
                }}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />

              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`${video.title} play करें`}
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/10 dark:bg-black/30 group-hover:bg-black/20 transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <PlayCircle className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </button>

              <div className="absolute bottom-2 right-2 z-20 pointer-events-none bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md">
                {publishedLabel}
              </div>
            </>
          )}
        </div>

        <div className="p-3 sm:p-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
            {video.title}
          </h3>

          <div className="flex items-center gap-2 mt-1.5 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
            <YoutubeIcon className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>World of Concept</span>
          </div>
        </div>
      </div>
    </article>
  );
};

const YoutubeSkeletonCard = () => (
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

// ==============================
// UPDATE HELPERS
// ==============================

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

const getUpdateDate = (data: any): Date => {
  const candidate = data?.timestamp || data?.createdAt;

  if (!candidate) return new Date(0);

  if (typeof candidate.toDate === "function") {
    return candidate.toDate();
  }

  if (candidate instanceof Date) {
    return candidate;
  }

  const parsed = new Date(candidate);
  return isNaN(parsed.getTime()) ? new Date(0) : parsed;
};

const UpdatesSkeletonCard = () => (
  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm">
    <div className="relative h-36 sm:h-40 bg-slate-200 dark:bg-slate-800 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
    </div>
  </div>
);

// ==============================
// MAIN DASHBOARD PAGE
// ==============================

export default function DashboardPage() {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  const [updates, setUpdates] = useState<UpdateData[]>([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);

  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);
  const [ytLoading, setYtLoading] = useState(true);
  const [ytError, setYtError] = useState<string | null>(null);

  const mountedRef = useRef(true);
  const ytRequestIdRef = useRef(0);

  const welcomeBgImages = ["/gallery2.jpg", "/gallery4.jpg", "/gallery6.jpg"];
  const videosBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
  const statsBgImages = ["/gallery6.jpg", "/gallery8.jpg", "/gallery10.jpg"];
  const coursesBgImages = ["/gallery1.jpg", "/gallery3.jpg", "/gallery5.jpg"];
  const gallerySectionBgImages = ["/gallery3.jpg", "/gallery6.jpg", "/gallery8.jpg"];
  const updatesBgImages = ["/gallery5.jpg", "/gallery7.jpg", "/gallery9.jpg"];

  const row1Images = [
    "/gallery1.jpg",
    "/gallery2.jpg",
    "/gallery3.jpg",
    "/gallery4.jpg",
    "/gallery5.jpg",
  ];

  const row2Images = [
    "/gallery6.jpg",
    "/gallery7.jpg",
    "/gallery8.jpg",
    "/gallery9.jpg",
    "/gallery10.jpg",
  ];

  const availableCourses = [
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

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "सुप्रभात";
    if (hour < 17) return "नमस्कार";
    return "शुभ संध्या";
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ==============================
  // AUTH + UPDATES FETCH
  // ==============================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAuthChecked(true);

      if (!user) {
        window.location.replace("/");
        setLoading(false);
        setUpdatesLoading(false);
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
            const updatesSnapshot = await getDocs(
              query(collection(db, "updates"), limit(50))
            );

            const parsedUpdates: UpdateData[] = updatesSnapshot.docs.map((d) => {
              const data = d.data() as any;

              return {
                id: d.id,
                title: data.title || "New Update",
                description: data.description || "",
                imageUrl: data.imageUrl || undefined,
                timestamp: data.timestamp,
                createdAt: data.createdAt,
                type: data.type || "announcement",
              };
            });

            parsedUpdates.sort(
              (a, b) => getUpdateDate(b).getTime() - getUpdateDate(a).getTime()
            );

            setUpdates(parsedUpdates.slice(0, 6));
          } catch (e) {
            console.log("No updates yet", e);
            setUpdates([]);
          }
        } else {
          window.location.replace("/");
        }
      } catch (error) {
        console.error("Student fetch error", error);
        window.location.replace("/");
      } finally {
        setLoading(false);
        setUpdatesLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ==============================
  // REAL YOUTUBE API FETCH + CACHE
  // ==============================

  const loadYoutube = useCallback(async (showLoader = true) => {
    const requestId = ++ytRequestIdRef.current;

    if (showLoader) setYtLoading(true);
    setYtError(null);

    try {
      const res = await fetch("/api/youtube");
      const data = await res.json().catch(() => ({}));

      if (!mountedRef.current || requestId !== ytRequestIdRef.current) return;

      if (!res.ok) {
        throw new Error(data?.message || `YouTube API route failed with status ${res.status}`);
      }

      const videos = Array.isArray(data) ? data : data?.videos;

      if (Array.isArray(videos) && videos.length > 0) {
        setYoutubeVideos(videos);
        writeYoutubeCache(videos);
      } else {
        setYoutubeVideos((prev) => (prev.length > 0 ? prev : []));
        setYtError(data?.message || "YouTube videos load नहीं हो पाए।");
      }
    } catch (error) {
      if (!mountedRef.current || requestId !== ytRequestIdRef.current) return;

      console.error("YouTube fetch error:", error);
      setYtError(
        error instanceof Error
          ? error.message
          : "YouTube API fetch करने में network error आया।"
      );
    } finally {
      if (mountedRef.current && requestId === ytRequestIdRef.current) {
        setYtLoading(false);
      }
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

  const handleLogout = useCallback(async () => {
    await auth.signOut();
    window.location.replace("/");
  }, []);

  const scrollToUpdates = useCallback(() => {
    document.getElementById("updates")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  if (!authChecked || loading) {
    return (
      <div className="min-h-[100dvh] bg-[#FFF9F0] dark:bg-slate-950 flex items-center justify-center transition-colors duration-700">
        <div className="text-center space-y-4 px-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 bg-orange-500/20 rounded-full animate-ping" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl">🎓</span>
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-bold text-lg">
            World of Concept लोड हो रहा है...
          </p>
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
          <p className="text-slate-600 dark:text-slate-300 font-medium">
            छात्र डेटा लोड करने में असमर्थ
          </p>
          <MagneticButton
            onClick={() => window.location.replace("/")}
            className="px-6 py-2.5 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-lg"
          >
            Home पर जाएं
          </MagneticButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#FFF9F0] dark:bg-slate-950 text-slate-900 dark:text-slate-50 relative font-sans w-full overflow-x-hidden transition-colors duration-700">
      <AdPopup />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dashboardSchema) }}
      />

      {/* HEADER */}
      <header className="bg-[#FFF9F0]/90 dark:bg-slate-950/90 sticky top-16 sm:top-20 z-40 shadow-sm transition-all duration-500 w-full backdrop-blur-xl border-b border-orange-100/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 gap-3 sm:gap-6">
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src="/logo.png"
                alt="World of Concept"
                width={32}
                height={32}
                className="object-contain flex-shrink-0"
                sizes="32px"
              />
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  World of Concept
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  Student Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6">
              <button
                type="button"
                onClick={scrollToUpdates}
                aria-label="RK Sir updates देखें"
                className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-orange-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <Bell className="w-5 h-5" />
                {updates.length > 0 ? (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[#FFF9F0] dark:border-slate-950 flex items-center justify-center shadow">
                    {updates.length > 9 ? "9+" : updates.length}
                  </span>
                ) : (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#FFF9F0] dark:border-slate-950 animate-pulse" />
                )}
              </button>

              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-orange-200/50 dark:border-slate-800">
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {student.fullName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {student.email}
                  </p>
                </div>

                <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-[#FFF9F0] dark:ring-slate-950">
                  {(student.fullName || "छ").charAt(0).toUpperCase()}
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

      <main className="relative w-full pb-8">
        {/* 1. HERO */}
        <section className="animate-fade-in-up relative w-full overflow-hidden mb-6 sm:mb-10 group">
          <DynamicBackground images={welcomeBgImages} zoomType="in" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent dark:from-slate-950/50 dark:via-slate-950/30 dark:to-transparent" />
          <div className="absolute inset-0 z-0 shimmer-effect opacity-10" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-semibold mb-4 border border-white/30 shadow-lg text-white">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>छात्र डैशबोर्ड</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold mb-3 leading-tight text-white drop-shadow-2xl">
                  {greeting}, {student.fullName.split(" ")[0]} 👋
                </h1>

                <p className="text-white/90 text-base sm:text-xl max-w-xl drop-shadow-xl font-medium mb-6">
                  RK Sir के साथ अपनी शिक्षा यात्रा जारी रखें। निरंतरता बनाए रखें!
                </p>
              </div>

              <div className="w-full lg:w-auto flex-shrink-0">
                <div className="relative bg-white/10 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-sm w-full group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse z-20">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                    LIVE NOW
                  </div>

                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-lg">
                      <span className="text-red-700">▶️</span>
                    </div>

                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-white drop-shadow-md">
                        दैनिक live class
                      </h3>
                      <p className="text-white/80 text-xs sm:text-sm">
                        RK Sir के साथ अभी जुड़ें
                      </p>
                    </div>
                  </div>

                  <MagneticButton
                    href="https://www.youtube.com/@JoinWorldofConcept"
                    className="w-full inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg"
                  >
                    <PlayCircle className="w-5 h-5" />
                    अभी live देखें
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. STATS */}
        <section
          className="mb-6 sm:mb-10 animate-fade-in-up relative w-full overflow-hidden"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="absolute inset-0 z-0">
            <DynamicBackground images={statsBgImages} zoomType="out" />
            <div className="absolute inset-0 bg-slate-50/60 dark:bg-slate-950/30 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 py-8 sm:py-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl sm:text-2xl font-extrabold rainbow-shimmer-text mb-6 px-1">
                आपकी प्रगति
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  {
                    icon: BookOpen,
                    label: "उपलब्ध कोर्स",
                    value: availableCourses.length,
                    color:
                      "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20",
                    hoverColor: "hover:shadow-blue-500/20",
                  },
                  {
                    icon: CheckCircle2,
                    label: "पूर्ण किए",
                    value: "0",
                    color:
                      "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border-green-100 dark:border-green-500/20",
                    hoverColor: "hover:shadow-green-500/20",
                  },
                  {
                    icon: Target,
                    label: "प्रगति में",
                    value: "0",
                    color:
                      "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20",
                    hoverColor: "hover:shadow-purple-500/20",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border rounded-2xl p-4 sm:p-5 shadow-sm ${stat.hoverColor} hover:shadow-lg hover:-translate-y-1 transition-all duration-500`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.color} border rounded-xl flex items-center justify-center`}
                      >
                        <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
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
            </div>
          </div>
        </section>

        {/* 3. REAL YOUTUBE RAIL */}
        <section
          id="youtube-videos"
          className="mb-6 sm:mb-10 animate-fade-in-up relative w-full overflow-hidden"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="absolute inset-0 z-0">
            <DynamicBackground images={videosBgImages} zoomType="in" />
            <div className="absolute inset-0 bg-black/10 dark:bg-slate-950/30" />
          </div>

          <div className="relative z-10 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600/90 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                  <YoutubeIcon className="w-5 h-5 text-white" />
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold rainbow-shimmer-text drop-shadow-lg">
                  RK Sir के latest video
                </h2>
              </div>

              <MagneticButton
                href="https://www.youtube.com/@JoinWorldofConcept"
                className="text-white/90 hover:text-white font-semibold text-sm flex items-center gap-1 bg-black/20 hover:bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg transition-all border border-white/20"
              >
                देखें <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>

            <div className="relative w-full overflow-hidden py-2">
              {ytLoading ? (
                <div className="flex gap-3 sm:gap-4 w-max pl-4 sm:pl-6 lg:pl-8">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <YoutubeSkeletonCard key={`yt-skeleton-${i}`} />
                  ))}
                </div>
              ) : youtubeVideos.length > 0 ? (
                <>
                  <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-black/20 dark:from-slate-950/60 to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-black/20 dark:from-slate-950/60 to-transparent z-10 pointer-events-none" />

                  <div className="flex gap-3 sm:gap-4 w-max animate-marquee-seamless touch-pan-y pl-4 sm:pl-6 lg:pl-8">
                    {[...youtubeVideos, ...youtubeVideos].map((video, i) => (
                      <YouTubeVideoCard
                        key={`yt-${video.id}-${i}`}
                        video={video}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="mx-4 sm:mx-6 lg:mx-8">
                  <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl p-6 text-center shadow-sm">
                    <div className="w-14 h-14 mx-auto mb-3 bg-red-500/10 rounded-full flex items-center justify-center">
                      <YoutubeIcon className="w-7 h-7 text-red-500" />
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mb-1">
                      YouTube video load नहीं हो पाए
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mb-4">
                      {ytError ||
                        "फिलहाल YouTube API response खाली आया। आप RK Sir का YouTube channel visit कर सकते हैं।"}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <MagneticButton
                        onClick={() => loadYoutube(true)}
                        className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg hover:scale-105"
                      >
                        <RefreshCw className="w-4 h-4" />
                        फिर कोशिश करें
                      </MagneticButton>

                      <MagneticButton
                        href="https://www.youtube.com/@JoinWorldofConcept"
                        className="inline-flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-extrabold transition-all duration-300 shadow-lg"
                      >
                        <PlayCircle className="w-5 h-5" />
                        YouTube channel खोलें
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. COURSES RAIL */}
        <section
          id="courses"
          className="mb-6 sm:mb-10 animate-fade-in-up relative w-full overflow-hidden"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="absolute inset-0 z-0">
            <DynamicBackground images={coursesBgImages} zoomType="in" />
            <div className="absolute inset-0 bg-black/10 dark:bg-slate-950/30" />
          </div>

          <div className="relative z-10 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-xl sm:text-2xl font-extrabold rainbow-shimmer-text drop-shadow-lg">
                उपलब्ध कोर्स
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
                {[...availableCourses, ...availableCourses].map((course, i) => (
                  <article
                    key={`avail-course-${i}`}
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
        </section>

        {/* 5. GALLERY RAIL */}
        <section
          id="gallery"
          className="mb-6 sm:mb-10 animate-fade-in-up relative w-full overflow-hidden"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="absolute inset-0 z-0">
            <DynamicBackground images={gallerySectionBgImages} zoomType="out" />
            <div className="absolute inset-0 bg-black/10 dark:bg-slate-950/30" />
          </div>

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
                {[...row1Images, ...row1Images].map((src, i) => (
                  <div
                    key={`row1-${i}`}
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
                {[...row2Images, ...row2Images].map((src, i) => (
                  <div
                    key={`row2-${i}`}
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
        </section>

        {/* 6. RK SIR UPDATES */}
        <section
          id="updates"
          className="mb-8 sm:mb-12 animate-fade-in-up relative w-full overflow-hidden"
          style={{ animationDelay: "0.6s" }}
        >
          <div className="absolute inset-0 z-0">
            <DynamicBackground images={updatesBgImages} zoomType="in" />
            <div className="absolute inset-0 bg-slate-50/60 dark:bg-slate-950/30 backdrop-blur-sm" />
          </div>

          <div className="relative z-10 py-8 sm:py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-xl sm:text-2xl font-extrabold rainbow-shimmer-text flex items-center gap-2 mb-6">
                <MessageCircle className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
                RK Sir के updates
              </h2>

              {updatesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <UpdatesSkeletonCard key={`updates-skeleton-${i}`} />
                  ))}
                </div>
              ) : updates.length === 0 ? (
                <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl p-6 text-center shadow-sm">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    अभी कोई update नहीं है। जल्द ही RK Sir से नई updates आने वाली हैं!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {updates.map((update) => {
                    const updateDate = getUpdateDate(update);
                    const dateLabel =
                      updateDate.getTime() > 0
                        ? updateDate.toLocaleDateString("hi-IN", {
                            day: "numeric",
                            month: "short",
                          })
                        : "Recently";

                    const updateType = update.type || "announcement";

                    return (
                      <article
                        key={update.id}
                        className="group bg-white/80 dark:bg-slate-800/60 backdrop-blur-sm border border-orange-100 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 dark:hover:shadow-indigo-500/20 transition-all duration-500 hover:-translate-y-1"
                      >
                        {update.imageUrl && (
                          <div className="relative h-36 sm:h-40 overflow-hidden">
                            <img
                              src={update.imageUrl}
                              alt={update.title}
                              loading="lazy"
                              decoding="async"
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                            <div className="absolute top-2 left-2">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold text-white backdrop-blur-sm ${
                                  updateType === "announcement"
                                    ? "bg-blue-500/80"
                                    : updateType === "motivation"
                                    ? "bg-purple-500/80"
                                    : "bg-green-500/80"
                                }`}
                              >
                                {updateType === "announcement"
                                  ? "📢 घोषणा"
                                  : updateType === "motivation"
                                  ? "💪 प्रेरणा"
                                  : "💡 tip"}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-4">
                          <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2 text-sm sm:text-base">
                            {update.title}
                          </h3>

                          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mb-2 line-clamp-2">
                            {update.description}
                          </p>

                          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {dateLabel}
                          </p>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 7. FAQ SECTION — NOW VISIBLE ON DASHBOARD */}
        <FaqSection />
      </main>

      {/* FOOTER */}
      <SiteFooter />
    </div>
  );
}