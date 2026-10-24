/* eslint-disable @next/next/no-head-element */
import type { Metadata, Viewport } from "next";
import { Inter, Noto_Sans_Devanagari } from "next/font/google";
import Image from "next/image";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

import "./globals.css";

// ==================== FONTS (Hindi + English Fallback) ====================
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-sans-devanagari",
  display: "swap",
  preload: true,
});

// ==================== CORE CONFIG ====================
const SITE_URL = "https://worldofconcept.in";
const SITE_NAME = "World of Concept";
const FOUNDER_NAME = "Mukesh Kumar Malakar";
const INSTRUCTOR_NAME = "RK Sir";
const CURRENT_YEAR = new Date().getFullYear();

const SUPPORT_EMAIL = "support@worldofconcept.in";
const SUPPORT_PHONE = "+91-7979096954";

const YOUTUBE_URL = "https://youtube.com/@JoinWorldofConcept";
const INSTAGRAM_URL = "https://instagram.com/join_world_of_concept";
const FACEBOOK_URL = "https://facebook.com/world.of.concept";
const TELEGRAM_URL = "https://t.me/JoinWorldofConcept";
const LINKEDIN_ORG_URL = "https://www.linkedin.com/company/joinworldofconcept";
const LINKEDIN_FOUNDER_URL = "https://www.linkedin.com/in/mukesh-kumar-malakar-one";
const GITHUB_FOUNDER_URL = "https://github.com/techinsightx";
const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/Alamnagar+Madhepura+Bihar";

// ==================== BIHAR LOCAL TARGETING ====================
const PRIORITY_DISTRICTS = [
  "Madhepura",
  "Alamnagar",
  "Saharsa",
  "Supaul",
  "Samastipur",
  "Darbhanga",
  "Muzaffarpur",
  "Patna",
  "Gaya",
  "Bhagalpur",
];

const districtKeywords = PRIORITY_DISTRICTS.flatMap((district) => [
  `${district} Bihar Board Coaching`,
  `Bihar Board Coaching in ${district}`,
  `${district} BSEB Classes`,
]);

const baseKeywords = [
  "World of Concept",
  "RK Sir",
  "RK Sir Classes",
  "RK Sir Maths",
  "RK Sir Math",
  "RK Sir Science",
  "RK Sir Bihar Board",
  "Dynamic Teacher Bihar Board",
  "Mukesh Kumar Malakar",
  "Full-Stack Developer",
  "EdTech Founder",
  "Bihar Board Coaching",
  "Bihar Board Matric Coaching",
  "Bihar Board Inter Coaching",
  "BSEB Coaching",
  "BSEB Matric Coaching",
  "BSEB Inter Coaching",
  "Bihar Board Online Classes",
  "BSEB Online Classes",
  "Bihar Board Live Classes",
  "BSEB Live Classes",
  "Bihar Board Class 9 Coaching",
  "Bihar Board Class 10 Coaching",
  "Bihar Board Class 11 Coaching",
  "Bihar Board Class 12 Coaching",
  "BSEB Class 10 Coaching",
  "BSEB Class 12 Coaching",
  "Bihar Board Hindi Medium Coaching",
  "Bihar Board English Medium Coaching",
  "Bihar Board Science Coaching",
  "Bihar Board Commerce Coaching",
  "Bihar Board Arts Coaching",
  "Bihar Board Maths Coaching",
  "Bihar Board Science Notes",
  "Bihar Board Maths Short Tricks",
  `BSEB Model Paper ${CURRENT_YEAR}`,
  `BSEB Model Paper ${CURRENT_YEAR + 1}`,
  `Bihar Board Model Paper ${CURRENT_YEAR}`,
  `Bihar Board Model Paper ${CURRENT_YEAR + 1}`,
  "BSEB Previous Year Papers",
  "Bihar Board Previous Year Questions",
  "Bihar Board Result",
  "BSEB Result",
  "Bihar Board 10th Result",
  "Bihar Board 12th Result",
  "Bihar Board Syllabus",
  "BSEB Syllabus",
  "Bihar Board Admit Card",
  "BSEB Admit Card",
  "Bihar Board Date Sheet",
  "BSEB Date Sheet",
  "Bihar Board Exam Preparation",
  "Bihar Board Topper Strategy",
  "Bihar Board Notes",
  "BSEB Notes",
  "Bihar Board Smart Notes",
  "Bihar Board HD Video Lectures",
  "Alamnagar Coaching Center",
  "Madhepura Coaching",
  "Madhepura Bihar Board Coaching",
  "Alamnagar Madhepura Coaching",
  "Best Coaching in Bihar",
  "Top Coaching in Bihar",
  "Bihar Board Toppers",
  "BSEB Toppers",
  "World of Concept Bihar",
  "World of Concept Madhepura",
  "World of Concept Alamnagar",
  "Bihar Board coaching online India",
  "BSEB online coaching across India",
  "बिहार बोर्ड कोचिंग",
  "बीएसईबी कोचिंग",
  "बिहार बोर्ड मैट्रिक कोचिंग",
  "बिहार बोर्ड इंटर कोचिंग",
  "आरके सर क्लासेस",
  "आरके सर मैथ्स",
  "आरके सर साइंस",
  "वर्ल्ड ऑफ कांसेप्ट",
  "मैट्रिक कोचिंग बिहार",
  "इंटर कोचिंग बिहार",
  "कक्षा 9 कोचिंग बिहार",
  "कक्षा 10 कोचिंग बिहार",
  "कक्षा 11 कोचिंग बिहार",
  "कक्षा 12 कोचिंग बिहार",
  "बिहार बोर्ड मॉडल पेपर",
  "बिहार बोर्ड रिजल्ट",
  "बिहार बोर्ड नोट्स",
  "बिहार बोर्ड स्मार्ट नोट्स",
  "बिहार बोर्ड लाइव क्लास",
  "बिहार बोर्ड वीडियो लेक्चर",
  "अलमनगर कोचिंग",
  "मधेपुरा कोचिंग",
  "बिहार बोर्ड टॉपर स्ट्रैटेजी",
  "बिहार बोर्ड परीक्षा तैयारी",
];

// ==================== SEO META OPTIMIZATION ====================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: "World of Concept | Bihar Board and BSEB Online Coaching by RK Sir",
    template: "%s | Bihar Board and BSEB Online Classes",
  },
  description:
    "Bihar Board (बिहार बोर्ड / BSEB) online coaching for Class 9-12 by RK Sir. HD lectures, smart notes, live classes, model papers. Based in Madhepura, Bihar. Available across India.",
  keywords: [...baseKeywords, ...districtKeywords],
  authors: [
    { name: INSTRUCTOR_NAME, url: YOUTUBE_URL },
    {
      name: FOUNDER_NAME,
      url: "https://www.google.com/search?q=Mukesh+Kumar+Malakar",
    },
  ],
  creator: `${FOUNDER_NAME} and ${INSTRUCTOR_NAME}`,
  publisher: SITE_NAME,
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: SITE_NAME,
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/logo.png", type: "image/png" },
    ],
    apple: "/logo.png",
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "hi-IN": SITE_URL,
      "en-IN": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `World of Concept | Bihar Board and BSEB Online Coaching ${CURRENT_YEAR}`,
    description:
      "Dedicated online coaching for Bihar Board and BSEB Class 9, 10, 11, and 12 students by RK Sir. HD video lectures, smart notes, live classes, model papers, and exam strategy. Based in Alamnagar, Madhepura, Bihar. Available online across India.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "World of Concept - Bihar Board and BSEB online coaching by RK Sir",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@JoinWorldofConcept",
    creator: "@JoinWorldofConcept",
    title: "World of Concept | Bihar Board and BSEB Online Coaching by RK Sir",
    description:
      "Trusted online coaching for Bihar Board Matric and Inter students. RK Sir provides HD lectures, smart notes, live classes, model papers, and exam strategy. Based in Madhepura, Bihar. Available across India.",
    images: [`${SITE_URL}/og-image.jpg`],
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
  classification: "Bihar Board Educational Platform",
  other: {
    "geo.region": "IN-BR",
    "geo.placename": "Alamnagar, Madhepura, Bihar, India",
    "geo.position": "25.9333;86.1167",
    ICBM: "25.9333, 86.1167",
    "geo.country": "IN",
    "business:country": "India",
    "business:region": "Bihar",
    "business:areaServed": "Bihar, India",
    "business:coverage": "All India Online",
    "business:online": "true",
    "business:serviceType": "Online Coaching",
    "business:audience": "Bihar Board Students",
    "business:contact:phone": SUPPORT_PHONE,
    "business:contact:email": SUPPORT_EMAIL,
    "business:slogan": "Bihar Board preparation, simplified by RK Sir",
    "content-language": "hi-IN, en-IN",
    "content-rating": "general",
    distribution: "India",
    "revisit-after": "7 days",
    copyright: `© ${CURRENT_YEAR} World of Concept. All rights reserved.`,
    "og:site_name": SITE_NAME,
    "og:locale": "hi_IN",
    "og:locale:alternate": "en_IN",
    "og:image:secure_url": `${SITE_URL}/og-image.jpg`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "World of Concept - Bihar Board and BSEB online coaching by RK Sir",
    "og:updated_time": new Date().toISOString(),
    "article:author": `${INSTRUCTOR_NAME} and ${FOUNDER_NAME}`,
    "article:publisher": SITE_URL,
    "article:section": "Education",
    "article:tag": "Bihar Board, BSEB, Matric, Inter, RK Sir, World of Concept",
    "linkedin:company": LINKEDIN_ORG_URL,
    "linkedin:profile": LINKEDIN_FOUNDER_URL,
  },
};

// ==================== MOBILE AND PWA VIEWPORT ====================
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFF9F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

// ==================== STRUCTURED DATA / SCHEMA.ORG ====================
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": `${SITE_URL}#organization`,
      name: SITE_NAME,
      alternateName: [
        "RK Sir Coaching",
        "World of Concept Bihar Board Coaching",
        "BSEB Coaching by RK Sir",
        "World of Concept Madhepura",
        "Alamnagar Coaching Center",
        "आरके सर कोचिंग",
        "बिहार बोर्ड कोचिंग",
      ],
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      image: [`${SITE_URL}/og-image.jpg`, `${SITE_URL}/logo.png`],
      description:
        "World of Concept is a dedicated online coaching platform for Bihar Board (बिहार बोर्ड) and BSEB students. RK Sir teaches Class 9, 10, 11, and 12 Matric and Inter students through HD video lectures, smart notes, live classes, model paper practice, and exam strategy. The platform is based in Alamnagar, Madhepura, Bihar, and is available online for students across India.",
      slogan: "Bihar Board preparation, simplified by RK Sir",
      telephone: SUPPORT_PHONE,
      email: SUPPORT_EMAIL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Alamnagar",
        addressLocality: "Madhepura",
        addressRegion: "Bihar",
        postalCode: "852219",
        addressCountry: "IN",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 25.9333,
        longitude: 86.1167,
      },
      hasMap: GOOGLE_MAPS_URL,
      priceRange: "₹399 - ₹999",
      currenciesAccepted: "INR",
      areaServed: [
        {
          "@type": "Country",
          name: "India",
        },
        {
          "@type": "State",
          name: "Bihar",
        },
        ...PRIORITY_DISTRICTS.map((district) => ({
          "@type": "AdministrativeArea",
          name: `${district}, Bihar, India`,
        })),
      ],
      audience: {
        "@type": "PeopleAudience",
        audienceType:
          "Bihar Board, BSEB, Class 9, Class 10, Class 11, and Class 12 students",
        geographicArea: {
          "@type": "Country",
          name: "India",
        },
      },
      founder: {
        "@id": `${SITE_URL}#founder`,
      },
      employee: {
        "@id": `${SITE_URL}#instructor`,
      },
      knowsLanguage: ["Hindi", "English"],
      knowsAbout: [
        "Bihar School Examination Board",
        "BSEB",
        "Bihar Board Matriculation Examination",
        "Bihar Board Intermediate Examination",
        "Class 9 Bihar Board",
        "Class 10 Bihar Board",
        "Class 11 Bihar Board",
        "Class 12 Bihar Board",
        "BSEB Model Paper",
        "Bihar Board Result",
        "Bihar Board Syllabus",
        "Bihar Board Admit Card",
        "Bihar Board Date Sheet",
        "Mathematics",
        "Science",
        "Physics",
        "Chemistry",
        "Biology",
        "English Grammar",
        "English Writing Skills",
        "Social Science",
        "History",
        "Geography",
        "Civics",
        "Political Science",
        "Economics",
        "Commerce",
        "Arts",
        "Hindi Medium Education",
        "English Medium Education",
        "Bihar Board Topper Strategy",
        "Objective Question Practice",
        "Subjective Answer Writing",
        "Short Trick Mathematics",
        "Smart Notes for Bihar Board",
        "Live Doubt Solving Classes",
      ],
      makesOffer: [
        {
          "@type": "Offer",
          name: "Bihar Board Class 10 Mathematics Coaching",
          category: "Online Education",
          priceCurrency: "INR",
          price: "499",
          url: `${SITE_URL}/courses`,
          itemOffered: {
            "@id": `${SITE_URL}#course-math`,
          },
        },
        {
          "@type": "Offer",
          name: "Bihar Board Class 10 Science Coaching",
          category: "Online Education",
          priceCurrency: "INR",
          price: "699",
          url: `${SITE_URL}/courses`,
          itemOffered: {
            "@id": `${SITE_URL}#course-science`,
          },
        },
        {
          "@type": "Offer",
          name: "Bihar Board Class 12 Topper Batch",
          category: "Online Education",
          priceCurrency: "INR",
          price: "999",
          url: `${SITE_URL}/courses`,
          itemOffered: {
            "@id": `${SITE_URL}#course-inter-topper`,
          },
        },
        {
          "@type": "Offer",
          name: "English Grammar and Writing for Bihar Board",
          category: "Online Education",
          priceCurrency: "INR",
          price: "399",
          url: `${SITE_URL}/courses`,
          itemOffered: {
            "@id": `${SITE_URL}#course-english`,
          },
        },
        {
          "@type": "Offer",
          name: "Social Science Complete Course for Bihar Board",
          category: "Online Education",
          priceCurrency: "INR",
          price: "599",
          url: `${SITE_URL}/courses`,
          itemOffered: {
            "@id": `${SITE_URL}#course-social-science`,
          },
        },
      ],
      sameAs: [
        YOUTUBE_URL,
        INSTAGRAM_URL,
        FACEBOOK_URL,
        TELEGRAM_URL,
        LINKEDIN_ORG_URL,
      ],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SUPPORT_PHONE,
        contactType: "customer service",
        email: SUPPORT_EMAIL,
        availableLanguage: ["Hindi", "English"],
      },
      // AggregateRating सिर्फ तब enable करें जब real student reviews हों।
      // "aggregateRating": {
      //   "@type": "AggregateRating",
      //   "ratingValue": "4.9",
      //   "reviewCount": "1500",
      //   "bestRating": "5",
      //   "worstRating": "1",
      // },
    },

    {
      "@type": "Person",
      "@id": `${SITE_URL}#instructor`,
      name: INSTRUCTOR_NAME,
      jobTitle: "Dynamic Educator and Bihar Board Teacher",
      description:
        "RK Sir is a dedicated Bihar Board teacher for Class 9 to Class 12 Matric and Inter students. His teaching style focuses on HD video lectures, smart notes, live doubt solving, model paper practice, short tricks, and exam-oriented answer writing.",
      url: YOUTUBE_URL,
      telephone: SUPPORT_PHONE,
      email: SUPPORT_EMAIL,
      worksFor: {
        "@id": `${SITE_URL}#organization`,
      },
      knowsAbout: [
        "Bihar Board Mathematics",
        "Bihar Board Science",
        "BSEB Model Paper",
        "Bihar Board Exam Strategy",
        "Short Trick Maths",
        "Live Class Teaching",
      ],
      sameAs: [YOUTUBE_URL, INSTAGRAM_URL, FACEBOOK_URL, TELEGRAM_URL],
    },

    {
      "@type": "Person",
      "@id": `${SITE_URL}#founder`,
      name: FOUNDER_NAME,
      jobTitle: "Founder and Full-Stack Developer",
      description:
        "Mukesh Kumar Malakar is the founder and full-stack developer of World of Concept. He handles platform development, UI/UX, SEO, social media growth, and live class technology.",
      url: LINKEDIN_FOUNDER_URL,
      worksFor: {
        "@id": `${SITE_URL}#organization`,
      },
      knowsAbout: [
        "Full-Stack Development",
        "Next.js",
        "React",
        "TypeScript",
        "Firebase",
        "UI/UX Design",
        "EdTech Platform Development",
        "Social Media Marketing",
        "SEO Optimization",
      ],
      sameAs: [
        LINKEDIN_FOUNDER_URL,
        GITHUB_FOUNDER_URL,
        "https://www.google.com/search?q=Mukesh+Kumar+Malakar",
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: "World of Concept Bihar Board Coaching",
      description:
        "A dedicated online learning platform for Bihar Board and BSEB students. RK Sir provides live classes, HD video lectures, smart notes, model papers, and exam strategy for Class 9, 10, 11, and 12.",
      publisher: {
        "@id": `${SITE_URL}#organization`,
      },
      inLanguage: "hi-IN",
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-math`,
      name: "Bihar Board Class 10 Mathematics by RK Sir",
      description:
        "Complete preparation for Bihar Board Class 10 Mathematics. Covers objective and subjective question practice, short tricks, NCERT-based concepts, and exam-oriented answer writing.",
      provider: {
        "@id": `${SITE_URL}#organization`,
      },
      instructor: {
        "@id": `${SITE_URL}#instructor`,
      },
      educationalLevel: "Secondary",
      teaches: "Class 10 Mathematics for Bihar Board",
      inLanguage: "hi",
      courseMode: "Online",
      offers: {
        "@type": "Offer",
        price: "499",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-science`,
      name: "Bihar Board Class 10 Science by RK Sir",
      description:
        "Complete preparation for Bihar Board Class 10 Science. Covers Physics, Chemistry, and Biology concepts, numericals, diagrams, important questions, and board exam answer writing strategy.",
      provider: {
        "@id": `${SITE_URL}#organization`,
      },
      instructor: {
        "@id": `${SITE_URL}#instructor`,
      },
      educationalLevel: "Secondary",
      teaches: "Class 10 Science for Bihar Board",
      inLanguage: "hi",
      courseMode: "Online",
      offers: {
        "@type": "Offer",
        price: "699",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-inter-topper`,
      name: "Bihar Board Class 12 Complete Topper Batch by RK Sir",
      description:
        "Complete preparation for Bihar Board Class 12 Inter students. Covers important topics for Science, Commerce, and Arts streams with mock tests, model papers, and answer writing practice.",
      provider: {
        "@id": `${SITE_URL}#organization`,
      },
      instructor: {
        "@id": `${SITE_URL}#instructor`,
      },
      educationalLevel: "Higher Secondary",
      teaches: "Class 12 Bihar Board Preparation",
      inLanguage: "hi",
      courseMode: "Online",
      offers: {
        "@type": "Offer",
        price: "999",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-english`,
      name: "English Grammar and Writing Skills for Bihar Board",
      description:
        "Bihar Board Class 10 and Class 12 English preparation. Covers grammar, writing skills, comprehension, and exam-oriented answer formatting with simple tricks by RK Sir.",
      provider: {
        "@id": `${SITE_URL}#organization`,
      },
      instructor: {
        "@id": `${SITE_URL}#instructor`,
      },
      educationalLevel: "Secondary and Higher Secondary",
      teaches: "English for Bihar Board",
      inLanguage: "hi",
      courseMode: "Online",
      offers: {
        "@type": "Offer",
        price: "399",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-social-science`,
      name: "Social Science Complete Course for Bihar Board",
      description:
        "Bihar Board Social Science preparation covering History, Geography, Civics, and Political Science. Includes important questions, map work, definitions, and answer writing practice.",
      provider: {
        "@id": `${SITE_URL}#organization`,
      },
      instructor: {
        "@id": `${SITE_URL}#instructor`,
      },
      educationalLevel: "Secondary",
      teaches: "Social Science for Bihar Board",
      inLanguage: "hi",
      courseMode: "Online",
      offers: {
        "@type": "Offer",
        price: "599",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What is World of Concept?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "World of Concept is a dedicated online coaching platform for Bihar Board and BSEB students. RK Sir provides HD video lectures, smart notes, live classes, model paper practice, and exam strategy for Class 9, 10, 11, and 12 students.",
          },
        },
        {
          "@type": "Question",
          name: "Which classes and exams does World of Concept cover?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "World of Concept covers Bihar Board Matric and Inter preparation for Class 9, Class 10, Class 11, and Class 12 students. It is specially designed for BSEB exam pattern, Hindi medium understanding, and board-oriented answer writing.",
          },
        },
        {
          "@type": "Question",
          name: "Who is RK Sir?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "RK Sir is a dynamic Bihar Board teacher focused on Class 9 to Class 12 students. His teaching includes concept clarity, short tricks, smart notes, live doubt solving, model paper practice, and topper strategy for Bihar Board exams.",
          },
        },
        {
          "@type": "Question",
          name: "Are World of Concept classes available online across India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. World of Concept is based in Alamnagar, Madhepura, Bihar, but its online coaching platform is available for Bihar Board and BSEB students across India.",
          },
        },
        {
          "@type": "Question",
          name: "How can students join RK Sir live classes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Students can join live classes through the World of Concept dashboard. RK Sir also shares latest lectures and live session updates on the YouTube channel @JoinWorldofConcept.",
          },
        },
        {
          "@type": "Question",
          name: "Where can students get Bihar Board notes and model paper practice?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "World of Concept provides smart notes, important questions, model paper practice, previous year question patterns, and exam strategy for Bihar Board students. Logged-in students can access study material from the dashboard.",
          },
        },
        {
          "@type": "Question",
          name: "Does World of Concept cover Mathematics, Science, English, and Social Science?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. World of Concept covers key Bihar Board subjects including Mathematics, Science, English Grammar and Writing Skills, and Social Science. Class 12 stream-wise preparation is also available for eligible batches.",
          },
        },
        {
          "@type": "Question",
          name: "Is World of Concept suitable for Hindi medium Bihar Board students?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. The platform is specially designed for Bihar Board students, with Hindi medium understanding, simple explanations, board-focused notes, and exam-oriented practice.",
          },
        },
      ],
    },
  ],
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

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://i.ytimg.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />

        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>

      <body className="relative min-h-screen antialiased bg-[#FFF9F0] dark:bg-slate-950 text-slate-900 dark:text-slate-50 selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-orange-100 font-sans transition-colors duration-700 ease-in-out">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          मुख्य सामग्री पर जाएँ
        </a>

        {/* Crystal Educational Gradient Orbs */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-orange-400/10 dark:bg-orange-500/5 blur-[120px] animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-blue-400/10 dark:bg-blue-500/5 blur-[120px] animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "2s" }}
          />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-purple-400/5 dark:bg-purple-500/5 blur-[100px]" />
        </div>

        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#FFF9F0]/80 dark:bg-slate-950/80 border-b border-orange-100 dark:border-slate-800 transition-all duration-500 ease-in-out shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16 sm:h-20">
                <div className="flex items-center gap-3 transition-all duration-500 hover:scale-[1.02]">
                  <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 drop-shadow-md dark:drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-all duration-500">
                    <Image
                      src="/logo.png"
                      alt="World of Concept - Bihar Board and BSEB online coaching by RK Sir"
                      fill
                      className="object-contain"
                      priority
                      sizes="(max-width: 640px) 40px, 48px"
                    />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-blue-600 dark:from-orange-400 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-sm transition-all duration-500">
                      World of Concept
                    </span>
                    <span className="hidden sm:block text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                      Bihar Board and BSEB Online Coaching | Available Across India
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="fixed top-20 sm:top-6 right-4 sm:right-6 z-[9999] drop-shadow-2xl transition-all duration-500">
            <ThemeToggle />
          </div>

          <main
            id="main-content"
            className="pt-16 sm:pt-20 min-h-screen transition-all duration-500"
          >
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}