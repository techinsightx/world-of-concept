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
const BIHAR_LOCAL_AREAS = [
  "Alamnagar, Madhepura",
  "Madhepura",
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
  "Arrah",
  "Sasaram",
  "Purnia",
  "Katihar",
  "Vaishali",
  "Begusarai",
  "Khagaria",
  "Munger",
  "Nalanda",
  "Sitamarhi",
];

const districtKeywords = PRIORITY_DISTRICTS.flatMap((district) => [
  `${district} Bihar Board Coaching`,
  `${district} BSEB Classes`,
  `Bihar Board Coaching in ${district}`,
  `${district} Matric Inter Coaching`,
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
  "Tech Expert",
  "EdTech Founder",
  "Bihar Board Coaching",
  "Bihar Board Matric Coaching",
  "Bihar Board Inter Coaching",
  "BSEB Coaching",
  "BSEB Matric Coaching",
  "BSEB Inter Coaching",
  "BSEB Matric & Inter Coaching",
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
  "BSEB Model Paper",
  "BSEB Model Paper 2027",
  "Bihar Board Model Paper",
  "Bihar Board Model Paper 2027",
  "BSEB Previous Year Papers",
  "Bihar Board Previous Year Questions",
  "Bihar Board Result",
  "BSEB Result",
  "Bihar Board 10th Result",
  "Bihar Board 12th Result",
  "BSEB 10th Result",
  "BSEB 12th Result",
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
  "बिहार बोर्ड टॉपर स्ट्रेटेजी",
  "बिहार बोर्ड परीक्षा तैयारी",
];

// ==================== GOD-TIER SEO META OPTIMIZATION ====================
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  title: {
    default: `World of Concept | Bihar Board & BSEB Coaching by RK Sir`,
    template: `%s | Bihar Board, BSEB Matric & Inter Classes`,
  },
  description:
    "Bihar Board & BSEB online coaching for Class 9, 10, 11, 12 by RK Sir. Matric/Inter notes, live classes, model papers, result guidance. Alamnagar, Madhepura.",
  keywords: [...baseKeywords, ...districtKeywords],
  authors: [
    { name: INSTRUCTOR_NAME, url: YOUTUBE_URL },
    { name: FOUNDER_NAME, url: "https://www.google.com/search?q=Mukesh+Kumar+Malakar" },
  ],
  creator: `${FOUNDER_NAME} & ${INSTRUCTOR_NAME}`,
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
  alternates: {
    canonical: SITE_URL,
    languages: {
      "hi-IN": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `World of Concept | #1 Bihar Board & BSEB Coaching ${CURRENT_YEAR}`,
    description:
      "Bihar Board Matric aur Inter students ke liye RK Sir ka dedicated online coaching platform. HD lectures, smart notes, live classes, model papers aur topper strategy.",
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
    site: "@JoinWorldofConcept",
    creator: "@JoinWorldofConcept",
    title: `World of Concept | Bihar Board & BSEB Coaching by RK Sir`,
    description:
      "Trusted Bihar Board Matric & Inter preparation platform. RK Sir ke HD lectures, smart notes, live classes aur model papers. Based in Alamnagar, Madhepura, Bihar.",
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
    "ICBM": "25.9333, 86.1167",
    "geo.country": "IN",
    "business:country": "India",
    "business:region": "Bihar",
    "business:areaServed": "Bihar, India",
    "business:contact:phone": SUPPORT_PHONE,
    "business:contact:email": SUPPORT_EMAIL,
    "rating": "5.0",
    "distribution": "global",
    "revisit-after": "1 days",
    "copyright": `© ${CURRENT_YEAR} World of Concept. All rights reserved.`,
    "og:site_name": SITE_NAME,
    "og:locale": "hi_IN",
    "og:locale:alternate": "en_IN",
    "og:image:secure_url": `${SITE_URL}/og-image.jpg`,
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:alt": "World of Concept - Bihar Board Coaching by RK Sir",
    "article:author": `${INSTRUCTOR_NAME} & ${FOUNDER_NAME}`,
    "article:publisher": SITE_URL,
    "article:section": "Education",
    "article:tag": "Bihar Board, BSEB, Matric, Inter, RK Sir, World of Concept",
    "linkedin:company": LINKEDIN_ORG_URL,
    "linkedin:profile": LINKEDIN_FOUNDER_URL,
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
    { media: "(prefers-color-scheme: light)", color: "#FFF9F0" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "light dark",
};

// ==================== GOD-TIER BIHAR BOARD SCHEMA.ORG ====================
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": `${SITE_URL}#organization`,
      "name": SITE_NAME,
      "alternateName": [
        "RK Sir Coaching",
        "World of Concept Bihar Board Coaching",
        "BSEB Coaching by RK Sir",
        "World of Concept Madhepura",
        "Alamnagar Coaching Center",
      ],
      "url": SITE_URL,
      "logo": `${SITE_URL}/logo.png`,
      "image": [
        `${SITE_URL}/og-image.jpg`,
        `${SITE_URL}/logo.png`,
      ],
      "description":
        "World of Concept Bihar Board aur BSEB students ke liye dedicated online coaching platform hai. RK Sir Class 9, 10, 11, 12 ke Matric aur Inter students ke liye HD video lectures, smart notes, live classes, model papers aur topper strategy provide karte hain. Platform Alamnagar, Madhepura, Bihar se operate hota hai aur Mukesh Kumar Malakar dwara develop kiya gaya hai.",
      "slogan": "Bihar Board Students Ka Bharosemand Education Platform",
      "telephone": SUPPORT_PHONE,
      "email": SUPPORT_EMAIL,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Alamnagar",
        "addressLocality": "Madhepura",
        "addressRegion": "Bihar",
        "postalCode": "852219",
        "addressCountry": "IN",
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 25.9333,
        "longitude": 86.1167,
      },
      "hasMap": GOOGLE_MAPS_URL,
      "priceRange": "₹399 - ₹999",
      "currenciesAccepted": "INR",
      "areaServed": [
        {
          "@type": "Country",
          "name": "India",
        },
        {
          "@type": "State",
          "name": "Bihar",
        },
        ...BIHAR_LOCAL_AREAS.map((area) => ({
          "@type": "AdministrativeArea",
          "name": `${area}, Bihar`,
        })),
      ],
      "audience": {
        "@type": "PeopleAudience",
        "audienceType": "Bihar Board Students",
        "geographicArea": {
          "@type": "AdministrativeArea",
          "name": "Bihar, India",
        },
      },
      "founder": {
        "@id": `${SITE_URL}#founder`,
      },
      "employee": {
        "@id": `${SITE_URL}#instructor`,
      },
      "knowsAbout": [
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
      "makesOffer": [
        {
          "@type": "Offer",
          "name": "Bihar Board Class 10 Mathematics Coaching",
          "category": "Online Education",
          "priceCurrency": "INR",
          "price": "499",
          "url": `${SITE_URL}/courses`,
          "itemOffered": {
            "@id": `${SITE_URL}#course-math`,
          },
        },
        {
          "@type": "Offer",
          "name": "Bihar Board Class 10 Science Coaching",
          "category": "Online Education",
          "priceCurrency": "INR",
          "price": "699",
          "url": `${SITE_URL}/courses`,
          "itemOffered": {
            "@id": `${SITE_URL}#course-science`,
          },
        },
        {
          "@type": "Offer",
          "name": "Bihar Board Class 12 Topper Batch",
          "category": "Online Education",
          "priceCurrency": "INR",
          "price": "999",
          "url": `${SITE_URL}/courses`,
          "itemOffered": {
            "@id": `${SITE_URL}#course-inter-topper`,
          },
        },
        {
          "@type": "Offer",
          "name": "English Grammar and Writing for Bihar Board",
          "category": "Online Education",
          "priceCurrency": "INR",
          "price": "399",
          "url": `${SITE_URL}/courses`,
          "itemOffered": {
            "@id": `${SITE_URL}#course-english`,
          },
        },
        {
          "@type": "Offer",
          "name": "Social Science Complete Course for Bihar Board",
          "category": "Online Education",
          "priceCurrency": "INR",
          "price": "599",
          "url": `${SITE_URL}/courses`,
          "itemOffered": {
            "@id": `${SITE_URL}#course-social-science`,
          },
        },
      ],
      "sameAs": [
        YOUTUBE_URL,
        INSTAGRAM_URL,
        FACEBOOK_URL,
        TELEGRAM_URL,
        LINKEDIN_ORG_URL,
      ],
      // Aggregate rating sirf tab enable karein jab real reviews hon.
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
      "name": INSTRUCTOR_NAME,
      "jobTitle": "Dynamic Educator & Master Teacher for Bihar Board",
      "description":
        "RK Sir Bihar Board Matric aur Inter students ke liye dedicated teacher hain. Ye HD video lectures, smart notes, live doubt solving sessions aur topper strategy ke through students ki exam preparation karte hain.",
      "url": YOUTUBE_URL,
      "telephone": SUPPORT_PHONE,
      "email": SUPPORT_EMAIL,
      "worksFor": {
        "@id": `${SITE_URL}#organization`,
      },
      "knowsAbout": [
        "Bihar Board Mathematics",
        "Bihar Board Science",
        "BSEB Model Paper",
        "Bihar Board Exam Strategy",
        "Short Trick Maths",
        "Live Class Teaching",
      ],
      "sameAs": [
        YOUTUBE_URL,
        INSTAGRAM_URL,
        FACEBOOK_URL,
        TELEGRAM_URL,
      ],
    },

    {
      "@type": "Person",
      "@id": `${SITE_URL}#founder`,
      "name": FOUNDER_NAME,
      "jobTitle": "Full-Stack Developer, Tech Expert & Founder",
      "description":
        "Mukesh Kumar Malakar World of Concept platform ke founder aur developer hain. Ye UI/UX, platform development, social media growth, aur live telecast execution handle karte hain.",
      "url": "https://www.google.com/search?q=Mukesh+Kumar+Malakar",
      "worksFor": {
        "@id": `${SITE_URL}#organization`,
      },
      "knowsAbout": [
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
      "sameAs": [
        LINKEDIN_FOUNDER_URL,
        GITHUB_FOUNDER_URL,
        "https://www.google.com/search?q=Mukesh+Kumar+Malakar",
      ],
    },

    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      "url": SITE_URL,
      "name": SITE_NAME,
      "alternateName": "World of Concept Bihar Board Coaching",
      "description":
        "Bihar Board Matric aur Inter students ke liye trusted online learning platform. RK Sir ke live classes, notes, model papers aur exam strategy.",
      "publisher": {
        "@id": `${SITE_URL}#organization`,
      },
      "inLanguage": "hi-IN",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${SITE_URL}/search?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-math`,
      "name": "Bihar Board Class 10 Mathematics by RK Sir",
      "description":
        "Bihar Board Class 10 Mathematics ki complete preparation. Objective aur subjective dono types ke questions, short tricks, NCERT-based concepts aur exam-oriented practice.",
      "provider": {
        "@id": `${SITE_URL}#organization`,
      },
      "instructor": {
        "@id": `${SITE_URL}#instructor`,
      },
      "educationalLevel": "Secondary",
      "teaches": "Class 10 Mathematics for Bihar Board",
      "inLanguage": "hi",
      "courseMode": "Online",
      "offers": {
        "@type": "Offer",
        "price": "499",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-science`,
      "name": "Bihar Board Class 10 Science by RK Sir",
      "description":
        "Bihar Board Class 10 Science ki complete preparation. Physics, Chemistry aur Biology ke important concepts, numericals, diagrams aur board exam answer writing strategy.",
      "provider": {
        "@id": `${SITE_URL}#organization`,
      },
      "instructor": {
        "@id": `${SITE_URL}#instructor`,
      },
      "educationalLevel": "Secondary",
      "teaches": "Class 10 Science for Bihar Board",
      "inLanguage": "hi",
      "courseMode": "Online",
      "offers": {
        "@type": "Offer",
        "price": "699",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-inter-topper`,
      "name": "Bihar Board Class 12 Complete Topper Batch by RK Sir",
      "description":
        "Bihar Board Class 12 Inter students ke liye complete topper batch. Science, Commerce aur Arts stream ke important topics, mock tests, model papers aur answer writing practice.",
      "provider": {
        "@id": `${SITE_URL}#organization`,
      },
      "instructor": {
        "@id": `${SITE_URL}#instructor`,
      },
      "educationalLevel": "Higher Secondary",
      "teaches": "Class 12 Bihar Board Preparation",
      "inLanguage": "hi",
      "courseMode": "Online",
      "offers": {
        "@type": "Offer",
        "price": "999",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-english`,
      "name": "English Grammar and Writing Skills for Bihar Board",
      "description":
        "Bihar Board Class 10 aur Class 12 English grammar, writing skills, comprehension aur exam-oriented answer formatting. RK Sir ke simple tricks ke saath.",
      "provider": {
        "@id": `${SITE_URL}#organization`,
      },
      "instructor": {
        "@id": `${SITE_URL}#instructor`,
      },
      "educationalLevel": "Secondary and Higher Secondary",
      "teaches": "English for Bihar Board",
      "inLanguage": "hi",
      "courseMode": "Online",
      "offers": {
        "@type": "Offer",
        "price": "399",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "Course",
      "@id": `${SITE_URL}#course-social-science`,
      "name": "Social Science Complete Course for Bihar Board",
      "description":
        "Bihar Board Social Science preparation covering History, Geography, Civics aur Political Science. Important questions, maps, definitions aur answer writing practice.",
      "provider": {
        "@id": `${SITE_URL}#organization`,
      },
      "instructor": {
        "@id": `${SITE_URL}#instructor`,
      },
      "educationalLevel": "Secondary",
      "teaches": "Social Science for Bihar Board",
      "inLanguage": "hi",
      "courseMode": "Online",
      "offers": {
        "@type": "Offer",
        "price": "599",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "url": `${SITE_URL}/courses`,
      },
    },

    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "World of Concept Bihar Board students ke liye kyun best hai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "World of Concept specially Bihar Board aur BSEB students ke liye banaya gaya platform hai. Yahan RK Sir Class 9, 10, 11 aur 12 ke Matric aur Inter students ko HD video lectures, smart notes, live classes, model papers aur exam strategy provide karte hain.",
          },
        },
        {
          "@type": "Question",
          "name": "Kya World of Concept se BSEB Matric aur Inter ki preparation ho sakti hai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Haan, World of Concept par BSEB Matric aur Inter dono ke liye dedicated courses hain. Mathematics, Science, English, Social Science aur Class 12 streams ki preparation RK Sir ke board-oriented teaching method se ki jaati hai.",
          },
        },
        {
          "@type": "Question",
          "name": "RK Sir ki live classes kaise join karein?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Aap World of Concept website par login karke live class section se join kar sakte hain. Additionally, RK Sir ke latest lectures aur live sessions YouTube channel @JoinWorldofConcept par bhi available hote hain.",
          },
        },
        {
          "@type": "Question",
          "name": "Bihar Board model paper aur notes kahan se milenge?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "World of Concept par Bihar Board ke liye smart notes, important questions, model paper practice aur previous year question patterns ke basis par preparation material diya jata hai. Students dashboard se access kar sakte hain.",
          },
        },
        {
          "@type": "Question",
          "name": "Kya Alamnagar aur Madhepura ke students ke liye yeh platform suitable hai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Bilkul. World of Concept Alamnagar, Madhepura, Bihar se operate hota hai aur yeh platform specially Bihar board students ki local needs, Hindi medium understanding aur exam pattern ko dhyan mein rakhte banaya gaya hai.",
          },
        },
        {
          "@type": "Question",
          "name": "Class 9, 10, 11 aur 12 sab ke liye coaching available hai?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text":
              "Haan, World of Concept par Class 9, Class 10, Class 11 aur Class 12 Bihar Board students ke liye courses aur guidance available hai. Matric aur Inter dono ke liye subject-wise preparation di jati hai.",
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
        <meta name="geo.region" content="IN-BR" />
        <meta name="geo.placename" content="Alamnagar, Madhepura, Bihar, India" />
        <meta name="geo.position" content="25.9333;86.1167" />
        <meta name="ICBM" content="25.9333, 86.1167" />
        <meta name="theme-color" content="#FFF9F0" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0f172a" media="(prefers-color-scheme: dark)" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://firestore.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.youtube.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.linkedin.com" crossOrigin="anonymous" />
        
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="hi-IN" href={SITE_URL} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
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
        
        {/* Accessibility Skip Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-orange-600 focus:text-white focus:rounded-lg focus:shadow-lg"
        >
          मुख्य सामग्री पर जाएं
        </a>

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
                    <img src="/logo.png" alt="World of Concept - Bihar Board Coaching by RK Sir" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-blue-600 dark:from-orange-400 dark:to-blue-400 bg-clip-text text-transparent drop-shadow-sm transition-all duration-500">
                      World of Concept
                    </span>
                    <span className="hidden sm:block text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide">
                      Bihar Board & BSEB Coaching by RK Sir
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* 🔥 FIXED: Mobile पर Toggle अब Header के नीचे (top-20) दिखेगा, Overlap नहीं होगा */}
          <div className="fixed top-20 sm:top-6 right-4 sm:right-6 z-[9999] drop-shadow-2xl transition-all duration-500">
            <ThemeToggle />
          </div>

          {/* Main Content Wrapper with Top Padding for Fixed Header */}
          <main id="main-content" className="pt-16 sm:pt-20 min-h-screen transition-all duration-500">
            {children}
          </main>
          
        </ThemeProvider>
      </body>
    </html>
  );
}