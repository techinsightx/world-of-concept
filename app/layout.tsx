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

// ==================== WORLD-CLASS SEO META OPTIMIZATION ====================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "World of Concept | RK Sir - बिहार बोर्ड मैट्रिक और इंटर की बेस्ट कोचिंग",
    template: "%s | World of Concept",
  },
  description: "World of Concept, RK Sir द्वारा संचालित, बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद प्लेटफॉर्म। HD वीडियो लेक्चर, स्मार्ट नोट्स, टेस्ट सीरीज और लाइव डाउट सपोर्ट प्राप्त करें।",
  keywords: [
    "World of Concept", "RK Sir", "RK Sir Classes", "Bihar Board Matric Coaching", 
    "Bihar Board Inter Coaching", "Online Classes Bihar", "Alamnagar Coaching", 
    "Mukesh Kumar Malakar", "बिहार बोर्ड मैट्रिक कोचिंग", "बिहार बोर्ड इंटर कोचिंग", 
    "आरके सर क्लासेस", "वर्ल्ड ऑफ कॉन्सेप्ट", "Bihar Board 10th Online Class", 
    "Bihar Board 12th Science Arts Commerce", "Best Coaching in Alamnagar"
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
    title: "World of Concept | RK Sir - बिहार बोर्ड की बेस्ट कोचिंग",
    description: "बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद प्लेटफॉर्म। RK Sir के साथ पढ़ें और टॉप करें।",
    siteName: "World of Concept",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "World of Concept - Bihar Board Coaching by RK Sir",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World of Concept | RK Sir's Official Platform",
    description: "बिहार बोर्ड मैट्रिक और इंटर की तैयारी के लिए सबसे भरोसेमंद प्लेटफॉर्म।",
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
    google: "your-google-search-console-verification-code", 
    // yandex: "your-yandex-verification-code", // Add later if needed
    // bing: "your-bing-verification-code",     // Add later if needed
  },
  category: "education",
  classification: "Educational Platform",
  alternates: {
    canonical: SITE_URL,
  },
  other: {
    // 🔥 LOCAL SEO DOMINATION TAGS (Makes you #1 in Bihar/Alamnagar searches)
    "geo.region": "IN-BR",
    "geo.placename": "Alamnagar, Patna, Bihar",
    "geo.position": "25.9333;86.1167",
    "ICBM": "25.9333, 86.1167",
    "rating": "general",
    "distribution": "global",
    "revisit-after": "3 days",
    "business:country": "India",
    "copyright": `© ${new Date().getFullYear()} World of Concept. All rights reserved.`,
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
// Combining Organization, Person, WebSite, and FAQ for maximum Rich Snippets in Google
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}#founder`,
      "name": FOUNDER_NAME,
      "jobTitle": "Founder & Tech Visionary",
      "url": "https://www.google.com/search?q=Mukesh+Kumar+Malakar",
      "sameAs": [
        "https://www.linkedin.com/in/mukesh-kumar-malakar-one", // Update with actual link
        "https://github.com/techinsightx" // Update with actual link
      ]
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}#organization`,
      "name": "World of Concept",
      "alternateName": "RK Sir Coaching",
      "url": SITE_URL,
      "logo": `${SITE_URL}/logo.png`,
      "description": "बिहार बोर्ड मैट्रिक और इंटर छात्रों के लिए बेस्ट ऑनलाइन कोचिंग प्लेटफॉर्म",
      "founder": { "@id": `${SITE_URL}#founder` },
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Alamnagar",
        "addressLocality": "Patna",
        "addressRegion": "Bihar",
        "postalCode": "852219/10",
        "addressCountry": "IN"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-7979096954",
        "contactType": "customer service",
        "email": "support@worldofconcept.in",
        "availableLanguage": ["Hindi", "English"]
      },
      "sameAs": [
        "https://youtube.com/@JoinWorldofConcept",
        "https://instagram.com/worldofconcept",
        "https://facebook.com/worldofconcept",
        "https://t.me/worldofconcept"
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
        {/* 🔥 CRITICAL: Native Hindi Language Declaration (Enables Browser Translation) */}
        <meta httpEquiv="Content-Language" content="hi" />
        <meta name="language" content="Hindi" />

        {/* 🔥 Performance Optimizations (Preconnect & DNS Prefetch) */}
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
        <meta name="theme-color" content="#f8fafc" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />

        {/* 🔥 Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* 🔥 World-Class Structured Data Injection (@graph) */}
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