import { NextResponse } from 'next/server';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const revalidate = 3600;

const escapeXml = (unsafe: string) => {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

export async function GET() {
  const SITE_URL = 'https://worldofconcept.in';
  const FOUNDER_NAME = 'Mukesh Kumar Malakar';
  const CURRENT_YEAR = new Date().getFullYear();

  let itemsXml = '';
  let hasItems = false;

  try {
    // 🔥 NO orderBy - Fetch all documents and sort in code
    const q = query(
      collection(db, 'updates'),
      limit(50) // Fetch more to ensure we get enough after sorting
    );
    
    const snapshot = await getDocs(q);
    
    // 🔥 Convert to array and sort by createdAt descending (client-side)
    const docsArray = snapshot.docs.map(doc => ({
      id: doc.id,
      data: doc.data()
    }));
    
    docsArray.sort((a, b) => {
      const dateA = a.data.createdAt?.toDate ? a.data.createdAt.toDate() : new Date(a.data.createdAt || 0);
      const dateB = b.data.createdAt?.toDate ? b.data.createdAt.toDate() : new Date(b.data.createdAt || 0);
      return dateB.getTime() - dateA.getTime(); // Descending order
    });
    
    // Take top 20 after sorting
    const sortedDocs = docsArray.slice(0, 20);
    
    sortedDocs.forEach((doc) => {
      hasItems = true;
      const data = doc.data;
      
      let pubDate = new Date().toUTCString();
      if (data.createdAt?.toDate) {
        pubDate = data.createdAt.toDate().toUTCString();
      } else if (data.createdAt) {
        const d = new Date(data.createdAt);
        if (!isNaN(d.getTime())) {
          pubDate = d.toUTCString();
        }
      }

      const title = escapeXml(data.title || 'New Update from World of Concept');
      const desc = escapeXml(data.description || 'Check out this amazing update!');
      const author = escapeXml('RK Sir');
      const category = escapeXml(data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Update');
      const imgUrl = escapeXml(data.imageUrl || `${SITE_URL}/logo.png`);

      itemsXml += `
    <item>
      <title><![CDATA[${title}]]></title>
      <link>${SITE_URL}</link>
      <guid isPermaLink="true">${SITE_URL}?id=${doc.id}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${desc}]]></description>
      <content:encoded><![CDATA[<p>${desc}</p><br/><p><strong>Read on World of Concept:</strong> <a href="${SITE_URL}">${SITE_URL}</a></p>]]></content:encoded>
      <author><![CDATA[${author}]]></author>
      <category><![CDATA[${category}]]></category>
      <media:thumbnail url="${imgUrl}" width="1200" height="630" />
    </item>`;
    });
  } catch (error) {
    console.error('⚠️ Firestore fetch failed (Fallback activated):', error);
  }

  if (!hasItems) {
    itemsXml = `
    <item>
      <title><![CDATA[Welcome to World of Concept]]></title>
      <link>${SITE_URL}</link>
      <guid isPermaLink="true">${SITE_URL}</guid>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <description><![CDATA[Discover the latest courses, updates, and educational content from World of Concept by RK Sir.]]></description>
      <media:thumbnail url="${SITE_URL}/logo.png" width="1200" height="630" />
    </item>`;
  }

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>World of Concept | RK Sir's Latest Updates</title>
    <link>${SITE_URL}</link>
    <description>Discover the latest courses, updates, and educational content from World of Concept by RK Sir.</description>
    <language>hi-IN</language>
    <copyright>© ${CURRENT_YEAR} World of Concept. All rights reserved.</copyright>
    <managingEditor>support@worldofconcept.in (${FOUNDER_NAME})</managingEditor>
    <webMaster>support@worldofconcept.in (${FOUNDER_NAME})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS Generator</generator>
    <image>
      <url>${SITE_URL}/logo.png</url>
      <title>World of Concept</title>
      <link>${SITE_URL}</link>
      <width>144</width>
      <height>144</height>
    </image>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}