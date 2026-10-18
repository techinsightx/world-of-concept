import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

import "./globals.css";

// ==================== FONTS (Hindi + English Fallback) ====================
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const notoSansDevanagari = Noto_Sans_Devanagari({ 
  subsets: ["devanagari"],
  variable: '--font-noto-sans-devanagari',
  display: 'swap',
  preload: true,
});

// ==================== CORE CONFIG ====================
const SITE_URL = 'https://worldofconcept.in';
const FOUNDER_NAME = 'Mukesh Kumar Malakar';
const INSTRUCTOR_NAME = 'RK Sir';
const CURRENT_YEAR = new Date().getFullYear();

// ==================== GOD-TIER SEO META OPTIMIZATION ====================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "World of Concept",
  title: {
    default: `World of Concept | Best Bihar Board Coaching ${CURRENT_YEAR}`,
    template: `%s | Bihar School Board Preparation (Class 9th, 10th, 11th, 12th)`,
  },
  description: "Experience EdTech Legacy: RK Sir, the dynamic teacher for Bihar Board preparation. Join the #1 online coaching for BSEB Matric & Inter.",
  keywords: [
    "World of Concept", "RK Sir", "RK Sir Classes", "RK Sir Maths", 
    "Dynamic Teacher Bihar Board", "Mukesh Kumar Malakar", "Full-Stack Developer", 
    "Tech Expert", "EdTech Founder", "Bihar Board Matric Coaching", "BSEB Matric & Inter Coaching",
    "Bihar Board Inter Coaching", "BSEB Online Classes", "Alamnagar Coaching Center", "Bihar government competitive exams",
    "Madhepura Coaching", "बिहार बोर्ड मैट्रिक कोचिंग", "बिहार बोर्ड इंटर कोचिंग", 
    "आरके सर क्लासेस", "वर्ल्ड ऑफ कॉन्सेप्ट", "BSEB Model Paper 2027", "Bihar Board Topper Strategy"
  ],
  authors: [
    { name: INSTRUCTOR_NAME, url: "https://youtube.com/@JoinWorldofConcept" },
    { name: FOUNDER_NAME, url: "https://www.google.com/search?q=Mukesh+Kumar+Malakar" }
  ],
  creator: `${FOUNDER_NAME} & ${INSTRUCTOR_NAME}`,
  publisher: "World of Concept",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "World of Concept",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: SITE_URL,
    title: `World of Concept | #1 Bihar Board Coaching ${CURRENT_YEAR}`,
    description: "A revolutionary EdTech legacy by RK Sir (Dynamic Educator). HD video lectures, smart notes, and viral educational content.",
    siteName: "World of Concept",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "World of Concept - RK Sir & Mukesh Kumar Malakar Legacy",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `World of Concept | #1 Bihar Board Coaching ${CURRENT_YEAR}`,
    description: "The most trusted platform for Bihar Board Matric and Inter preparation. Dynamic teaching by RK Sir, powered by Mukesh Kumar Malakar's tech expertise.",
    images: [`${SITE_URL}/og-image.jpg`],
    creator: "@JoinWorldofConcept",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "xr-ArXnA04yqFGsCP_jRANW1dxSQsw1TjExCYoCktXI", 
  },
  category: "education",
  classification: "Educational Platform",
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Alamnagar, Madhepura, Bihar",
    "geo.position": "25.9333;86.1167",
    "ICBM": "25.9333, 86.1167",
    "rating": "5.0",
    "distribution": "global",
    "revisit-after": "1 days",
    "business:country": "India",
    "copyright": `© ${CURRENT_YEAR} World of Concept. All rights reserved.`,
    "og:site_name": "World of Concept",
    "article:author": `${INSTRUCTOR_NAME} & ${FOUNDER_NAME}`,
    "article:publisher": SITE_URL,
    "linkedin:profile": "https://www.linkedin.com/in/joinworldofconcept", // 🔥 LinkedIn Integrated
  },
};

// ==================== PERFECT MOBILE & PWA VIEWPORT ====================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF9F0" }, // Kesaria tint for mobile browser
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

// ==================== GOD-TIER SCHEMA.ORG (JSON-LD @graph) ====================
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#instructor`,
      "name": INSTRUCTOR_NAME,
      "jobTitle": "Dynamic Educator & Master Teacher for Bihar Board",
      "description": "Dedicated teacher providing complete content, live telecasts, and proven strategies for Bihar Board Matric and Inter students.",
      "url": "https://youtube.com/@JoinWorldofConcept",
      "sameAs": [
        "https://youtube.com/@JoinWorldofConcept",
        "https://instagram.com/join_world_of_concept",
        "https://facebook.com/world.of.concept"
      ]
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}#founder`,
      "name": FOUNDER_NAME,
      "jobTitle": "Full-Stack Developer, Tech Expert & Founder",
      "description": "The tech visionary handling UI/UX, platform development, social media virality, and live telecast execution from scratch.",
      "url": "https://www.google.com/search?q=Mukesh+Kumar+Malakar",
      "sameAs": [
        "https://www.linkedin.com/in/mukesh-kumar-malakar-one",
        "https://github.com/techinsightx"
      ]
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}#organization`,
      "name": "World of Concept",
      "alternateName": "RK Sir Coaching",
      "url": SITE_URL,
      "logo": `${SITE_URL}/logo.png`,
      "image": `${SITE_URL}/og-image.jpg`,
      "description": "बिहार बोर्ड मैट्रिक और इंटर छात्रों के लिए बेस्ट ऑनलाइन कोचिंग प्लेटफॉर्म, RK Sir और Mukesh Kumar Malakar द्वारा संचालित।",
      "founder": { "@id": `${SITE_URL}#founder` },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Alamnagar",
        "addressLocality": "Madhepura",
        "addressRegion": "Bihar",
        "postalCode": "852219",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.9333,
        "longitude": 86.1167
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7979096954",
        "contactType": "customer service",
        "email": "support@worldofconcept.in",
        "availableLanguage": ["Hindi", "English"]
      },
      "knowsAbout": [
        "Bihar School Examination Board",
        "BSEB Matriculation Examination",
        "BSEB Intermediate Examination",
        "Mathematics",
        "Science",
        "English",
        "Social Science"
      ],
      "makesOffer": {
        "@type": "Offer",
        "category": "Online Education",
        "priceCurrency": "INR",
        "price": "499",
        "description": "Affordable online coaching for Bihar Board students"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1500",
        "bestRating": "5",
        "worstRating": "1"
      },
      "sameAs": [
        "https://youtube.com/@JoinWorldofConcept",
        "https://instagram.com/join_world_of_concept",
        "https://facebook.com/world.of.concept",
        "https://t.me/JoinWorldofConcept",
        "https://www.linkedin.com/in/joinworldofconcept" // 🔥 LinkedIn Handle Integrated
      ]
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      "url": SITE_URL,
      "name": "World of Concept",
      "description": "बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद प्लेटफॉर्म।",
      "publisher": { "@id": `${SITE_URL}#organization` },
      "inLanguage": "hi-IN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-math`,
      "name": "Bihar Board Class 10 Mathematics by RK Sir",
      "description": "Complete objective and subjective mathematics preparation with shortcut tricks.",
      "provider": { "@id": `${SITE_URL}#organization` },
      "educationalLevel": "Secondary",
      "inLanguage": "hi",
      "offers": {
        "@type": "Offer",
        "price": "499",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/courses`
      }
    },
    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-science`,
      "name": "Bihar Board Class 10 Science by RK Sir",
      "description": "Complete physics, chemistry, and biology preparation with practical guides.",
      "provider": { "@id": `${SITE_URL}#organization` },
      "educationalLevel": "Secondary",
      "inLanguage": "hi",
      "offers": {
        "@type": "Offer",
        "price": "699",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/courses`
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "World of Concept में एडमिशन कैसे लें?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "आप हमारी वेबसाइट worldofconcept.in पर जाकर 'Sign Up' बटन पर क्लिक करके आसानी से अपना अकाउंट बना सकते हैं और RK Sir के कोर्सेस में नामांकन कर सकते हैं।"
          }
        },
        {
          "@type": "Question",
          "name": "क्या World of Concept बिहार बोर्ड के लिए सही है?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "जी हाँ, World of Concept विशेष रूप से बिहार बोर्ड (BSEB) मैट्रिक और इंटर छात्रों की जरूरतों को ध्यान में रखकर RK Sir द्वारा डिज़ाइन किया गया है।"
          }
        },
        {
          "@type": "Question",
          "name": "RK Sir की क्लासेस ऑनलाइन कैसे जॉइन करें?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "आप हमारे YouTube चैनल @JoinWorldofConcept पर फ्री लेक्चर्स देख सकते हैं या वेबसाइट पर प्रीमियम कोर्सेस में एनरोल कर सकते हैं।"
          }
        }
      ]
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE_URL}#breadcrumbs`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": SITE_URL
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Courses",
          "item": `${SITE_URL}/courses`
        }
      ]
    }
  ]
};

// ==================== ROOT LAYOUT ====================
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="hi" 
      dir="ltr"
      className={`${inter.variable} ${notoSansDevanagari.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta httpEquiv="Content-Language" content="hi" />
        <meta name="language" content="Hindi" />
        <meta name="theme-color" content="#FFF9F0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <link rel="canonical" href={SITE_URL} />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="World of Concept" />
        
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      
      {/* 🔥 KESARIA LIGHT MODE + CRYSTAL GRADIENT BACKGROUND */}
      <body className="relative min-h-screen antialiased bg-[#FFF9F0] dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-orange-100 font-sans transition-colors duration-700 ease-in-out">
        
        {/* 🔥 CRYSTAL EDUCATIONAL GRADIENT ORBS (Visible, Subtle, Premium) */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          {/* Kesaria / Orange Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-orange-400/10 dark:bg-orange-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
          {/* Education / Blue Glow */}
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-[120px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          {/* Center Accent */}
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-purple-400/5 dark:bg-purple-500/5 blur-[100px]" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          
          {/* 🔥 CINEMATIC HEADER WITH SMOOTH TRANSITIONS */}
          <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FFF9F0]/80 dark:bg-slate-950/80 border-b border-orange-100 dark:border-slate-800 transition-all duration-500 ease-in-out shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 sm:h-20">
                {/* Logo Section with Cinematic Visibility */}
                <div className="flex items-center gap-3 transition-all duration-500 hover:scale-[1.02]">
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 drop-shadow-md dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-all duration-500">
                    <img src="/logo.png" alt="World of Concept" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-blue-600 dark:from-orange-400 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-sm transition-all duration-500">
                    World of Concept
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* 🔥 FIXED: Mobile पर Toggle अब Header के नीचे (top-20) दिखेगा, Overlap नहीं होगा */}
          <div className="fixed top-20 sm:top-6 right-4 sm:right-6 z-[9999] drop-shadow-2xl transition-all duration-500">
            <ThemeToggle />
          </div>

          {/* Main Content Wrapper with Top Padding for Fixed Header */}
          <main className="pt-16 sm:pt-20 min-h-screen transition-all duration-500">
            {children}
          </main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}