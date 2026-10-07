import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

// ==========================================
// WORLD-CLASS SEO META OPTIMIZATION
// ==========================================
export const metadata: Metadata = {
  metadataBase: new URL("https://worldofconcept.in"),
  title: {
    default: "World of Concept | Best Bihar Board Matric & Inter Coaching by RK Sir",
    template: "%s | World of Concept",
  },
  description: "Join World of Concept, the most trusted platform for Bihar Board Matric & Inter preparation. Get HD video lectures, smart notes, test series, and live doubt support with RK Sir. Start your journey to success today!",
  keywords: [
    "World of Concept",
    "RK Sir",
    "Bihar Board Matric Coaching",
    "Bihar Board Inter Coaching",
    "Online Classes Bihar",
    "Alamnagar Coaching",
    "Best Education Platform Bihar",
    "Bihar Board 10th Coaching",
    "Bihar Board 12th Coaching",
    "Matric Exam Preparation",
    "Inter Exam Preparation",
    "Bihar Board Topper Coaching",
    "RK Sir Classes",
    "World of Concept RK Sir",
    "Bihar Board Online Classes",
    "Bihar Board Video Lectures",
    "बिहार बोर्ड मैट्रिक कोचिंग",
    "बिहार बोर्ड इंटर कोचिंग",
    "आरके सर क्लासेस",
    "वर्ल्ड ऑफ कॉन्सेप्ट"
  ],
  authors: [
    { name: "RK Sir", url: "https://youtube.com/@JoinWorldofConcept" },
    { name: "Mukesh Kumar Malakar", url: "https://www.google.com/search?q=Mukesh+Kumar+Malakar" }
  ],
  creator: "Mukesh Kumar Malakar",
  publisher: "World of Concept",
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "World of Concept",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://worldofconcept.in",
    title: "World of Concept | Best Bihar Board Coaching by RK Sir",
    description: "Bihar Board Matric & Inter का सबसे trusted platform। RK Sir के साथ HD video lectures, smart notes, test series और live doubt support पाएं।",
    siteName: "World of Concept",
    images: [
      {
        url: "https://worldofconcept.in/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "World of Concept - Bihar Board Coaching by RK Sir",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "World of Concept | RK Sir's Official Platform",
    description: "Bihar Board Matric & Inter का सबसे trusted platform। RK Sir के साथ पढ़ें और टॉप करें!",
    images: ["https://worldofconcept.in/og-image.jpg"],
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
    google: "your-google-search-console-verification-code", // Google Search Console से कोड यहाँ डालें
  },
  category: "education",
  classification: "Educational Platform",
  alternates: {
    canonical: "https://worldofconcept.in",
  },
};

// ==========================================
// PERFECT MOBILE & PWA VIEWPORT
// ==========================================
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
};

// ==========================================
// SCHEMA.ORG STRUCTURED DATA (JSON-LD)
// Google Rich Snippets के लिए सबसे जरूरी
// ==========================================
const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "World of Concept",
  "alternateName": "RK Sir Coaching",
  "url": "https://worldofconcept.in",
  "logo": "https://worldofconcept.in/logo.png",
  "description": "Best online coaching platform for Bihar Board Matric and Inter students",
  "founder": {
    "@type": "Person",
    "name": "RK Sir"
  },
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Alamnagar",
    "addressLocality": "Patna",
    "addressRegion": "Bihar",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        {/* Performance Optimizations */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        {/* SEO Canonical URL */}
        <link rel="canonical" href="https://worldofconcept.in" />
        
        {/* Icons & PWA */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data Injection */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 min-h-screen w-full max-w-[100vw] overflow-x-hidden`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}