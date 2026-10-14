import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
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

// ==================== WORLD-CLASS SEO META OPTIMIZATION ====================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `World of Concept | RK Sir - Best Bihar Board Matric & Inter Online Coaching ${CURRENT_YEAR}`,
    template: `%s | World of Concept by RK Sir`,
  },
  description: "Join World of Concept by RK Sir, the #1 rated online coaching for Bihar Board (BSEB) Matric (10th) & Inter (12th). Get HD video lectures, smart notes, mock test series, and live doubt solving. Enroll now for guaranteed success!",
  keywords: [
    "World of Concept", "RK Sir", "RK Sir Classes", "RK Sir Maths", 
    "Bihar Board Matric Coaching", "Bihar Board Inter Coaching", "BSEB Online Classes", 
    "Alamnagar Coaching Center", "Madhepura Coaching", "Mukesh Kumar Malakar", 
    "बिहार बोर्ड मैट्रिक कोचिंग", "बिहार बोर्ड इंटर कोचिंग", "आरके सर क्लासेस", 
    "वर्ल्ड ऑफ कॉन्सेप्ट", "Bihar Board 10th Online Class", "Bihar Board 12th Science Arts Commerce", 
    "Best Coaching in Alamnagar", "BSEB Model Paper 2027", "Bihar Board Topper Strategy"
  ],
  authors: [
    { name: INSTRUCTOR_NAME, url: "https://youtube.com/@JoinWorldofConcept" },
    { name: FOUNDER_NAME, url: "https://www.google.com/search?q=Mukesh+Kumar+Malakar" }
  ],
  creator: FOUNDER_NAME,
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
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: SITE_URL,
    title: `World of Concept | RK Sir - #1 Bihar Board Matric & Inter Coaching ${CURRENT_YEAR}`,
    description: "Join World of Concept by RK Sir. HD video lectures, smart notes, test series, and live doubt solving for Bihar Board 10th & 12th students.",
    siteName: "World of Concept",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "World of Concept - Best Bihar Board Coaching by RK Sir",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `World of Concept | RK Sir's Official Platform`,
    description: "The most trusted platform for Bihar Board Matric and Inter preparation. Learn with RK Sir.",
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
    // 🔥 ADVANCED LOCAL SEO DOMINATION TAGS (Corrected: Alamnagar is in Madhepura, not Patna)
    "geo.region": "IN-BR",
    "geo.placename": "Alamnagar, Madhepura, Bihar",
    "geo.position": "25.9333;86.1167",
    "ICBM": "25.9333, 86.1167",
    "rating": "5.0",
    "distribution": "global",
    "revisit-after": "1 days", // Signals Google to crawl more frequently
    "business:country": "India",
    "copyright": `© ${CURRENT_YEAR} World of Concept. All rights reserved.`,
    "og:site_name": "World of Concept",
    "article:author": INSTRUCTOR_NAME,
    "article:publisher": SITE_URL,
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
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

// ==================== WORLD-CLASS SCHEMA.ORG (JSON-LD @graph) ====================
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#founder`,
      "name": FOUNDER_NAME,
      "jobTitle": "Founder & EdTech Visionary",
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
      "description": "बिहार बोर्ड मैट्रिक और इंटर छात्रों के लिए बेस्ट ऑनलाइन कोचिंग प्लेटफॉर्म",
      "founder": { "@id": `${SITE_URL}#founder` },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Alamnagar",
        "addressLocality": "Madhepura", // FIXED: Alamnagar is in Madhepura district
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
      // 🔥 GOLDEN STAR RATING SCHEMA (Drastically improves CTR in Google Search)
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
        "https://t.me/JoinWorldofConcept"
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
    // 🔥 COURSE SCHEMA (Helps rank for specific course searches)
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
    // 🔥 BREADCRUMB SCHEMA (Helps Google understand site structure)
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
        {/* 🔥 CRITICAL: Native Hindi Language Declaration */}
        <meta httpEquiv="Content-Language" content="hi" />
        <meta name="language" content="Hindi" />

        {/* 🔥 Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* 🔥 SEO Canonical URL */}
        <link rel="canonical" href={SITE_URL} />
        
        {/* 🔥 PWA & Mobile Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* 🔥 Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 🔥 World-Class Structured Data Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={`antialiased bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-900 font-sans`}>
        {children}
      </body>
    </html>
  );
}