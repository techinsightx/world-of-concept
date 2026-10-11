import { MetadataRoute } from 'next';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const BASE_URL = 'https://worldofconcept.in';
const MAX_URLS_PER_SITEMAP = 45000;

// ✅ Sirf 'revalidate' valid hai sitemap mein.
export const revalidate = 3600; // 1 hour cache

// ============================================
// STATIC PAGES (World of Concept Specific)
// ============================================
const STATIC_PAGES: MetadataRoute.Sitemap = [
  {
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/courses`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.9,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/refund`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

// ============================================
// HELPERS
// ============================================
const toSafeDate = (timestamp: any): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  if (timestamp.toDate) return timestamp.toDate(); // Firestore Timestamp
  return new Date(timestamp);
};

const calculateFrequency = (createdAt: Date): MetadataRoute.Sitemap[0]['changeFrequency'] => {
  const daysOld = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  if (daysOld < 1) return 'hourly';
  if (daysOld < 7) return 'daily';
  if (daysOld < 30) return 'weekly';
  if (daysOld < 180) return 'monthly';
  return 'yearly';
};

// ============================================
// FETCHERS (Dynamic Content)
// ============================================
async function fetchCourses(): Promise<MetadataRoute.Sitemap> {
  try {
    const coursesQuery = query(
      collection(db, 'courses'),
      orderBy('createdAt', 'desc'),
      limit(5000)
    );

    const snapshot = await getDocs(coursesQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = toSafeDate(data.createdAt);

      return {
        // Note: Agar aapke paas individual course page hai (e.g., /courses/[id]), toh URL ko update kar lena
        url: `${BASE_URL}/courses`, 
        lastModified: createdAt,
        changeFrequency: calculateFrequency(createdAt),
        priority: 0.8,
        images: data.imageUrl ? [data.imageUrl] : [],
      };
    });
  } catch (error) {
    console.error('[Sitemap] Courses fetch failed:', error);
    return [];
  }
}

async function fetchUpdates(): Promise<MetadataRoute.Sitemap> {
  try {
    const updatesQuery = query(
      collection(db, 'updates'),
      orderBy('createdAt', 'desc'),
      limit(1000)
    );

    const snapshot = await getDocs(updatesQuery);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      const createdAt = toSafeDate(data.createdAt);

      return {
        url: `${BASE_URL}`, // Updates dashboard/home par dikhte hain
        lastModified: createdAt,
        changeFrequency: calculateFrequency(createdAt),
        priority: 0.7,
        images: data.imageUrl ? [data.imageUrl] : [],
      };
    });
  } catch (error) {
    console.error('[Sitemap] Updates fetch failed:', error);
    return [];
  }
}

// ============================================
// MAIN SITEMAP EXPORT
// ============================================
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, updates] = await Promise.all([
    fetchCourses(),
    fetchUpdates(),
  ]);

  const sitemap: MetadataRoute.Sitemap = [
    ...STATIC_PAGES,
    ...courses,
    ...updates,
  ];

  if (sitemap.length > MAX_URLS_PER_SITEMAP) {
    console.warn(`[Sitemap] Truncated from ${sitemap.length} to ${MAX_URLS_PER_SITEMAP}`);
    return sitemap.slice(0, MAX_URLS_PER_SITEMAP);
  }

  console.log(`[Sitemap] Successfully generated ${sitemap.length} URLs for worldofconcept.in`);
  return sitemap;
}