import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const revalidate = 3600; // 1 hour cache

// 🔥 Helper to safely escape XML attributes (prevents parsing errors from special characters like &)
const escapeXml = (unsafe: string) => {
  return String(unsafe).replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
};

export async function GET() {
  const SITE_URL = 'https://worldofconcept.in';
  const FOUNDER_NAME = 'Mukesh Kumar Malakar';
  const CURRENT_YEAR = new Date().getFullYear();

  let itemsXml = '';

  try {
    // 🔥 Nested Try-Catch: Isolates Firestore errors so the main function ALWAYS returns valid XML
    try {
      const q = query(
        collection(db, 'updates'),
        orderBy('createdAt', 'desc'),
        limit(20)
      );
      
      const snapshot = await getDocs(q);

      snapshot.forEach((doc) => {
        const data = doc.data();
        
        // 🔥 1. Bulletproof Date Handling (Prevents "Invalid Date" parsing errors)
        let pubDate = new Date().toUTCString();
        if (data.createdAt) {
          try {
            const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
            if (!isNaN(dateObj.getTime())) {
              pubDate = dateObj.toUTCString();
            }
          } catch (e) {
            // Fallback to current date if parsing fails
          }
        }

        const postUrl = `${SITE_URL}`; 
        const rawThumbnail = data.imageUrl || `${SITE_URL}/logo.png`;
        const thumbnail = escapeXml(rawThumbnail);
        
        const rawTitle = data.title || 'New Update from World of Concept';
        const rawDesc = data.description || 'Check out this amazing update from World of Concept!';
        const author = 'RK Sir';
        const category = data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Update';

        itemsXml += `
        <item>
          <title><![CDATA[${rawTitle}]]></title>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}?id=${doc.id}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${rawDesc}]]></description>
          <content:encoded><![CDATA[
            <p>${rawDesc}</p>
            <br/>
            <p><strong>Read more on World of Concept:</strong> <a href="${postUrl}">${postUrl}</a></p>
          ]]></content:encoded>
          <author><![CDATA[${author}]]></author>
          <category><![CDATA[${category}]]></category>
          ${data.imageUrl ? `<media:content url="${thumbnail}" type="image/jpeg" />` : ''}
          <media:thumbnail url="${thumbnail}" width="1200" height="630" />
        </item>
      `;
      });
    } catch (firestoreError) {
      console.error('⚠️ Firestore fetch failed (returning empty valid RSS to prevent HTTP 500):', firestoreError);
      // We continue execution to return a valid RSS feed, just with 0 items.
    }

    // 🔥 2. Pure, Valid RSS 2.0 Structure
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>World of Concept | RK Sir's Latest Updates & Courses</title>
    <link>${SITE_URL}</link>
    <description>Discover the latest courses, updates, motivational posts, and educational content from World of Concept by RK Sir.</description>
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

  } catch (criticalError) {
    console.error('❌ Critical RSS Generation Error:', criticalError);
    
    // 🔥 3. Ultimate Fallback: Return a valid, minimal XML instead of plain text or HTML error
    // This guarantees Google NEVER sees a "Parsing Error" or "HTTP Error"
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>World of Concept</title>
    <link>https://worldofconcept.in</link>
    <description>Feed temporarily unavailable. Please check back later.</description>
    <language>hi-IN</language>
  </channel>
</rss>`;
    
    return new NextResponse(fallbackXml, { 
      status: 200, // Return 200 OK with valid XML, NOT 500
      headers: { 
        'Content-Type': 'application/rss+xml; charset=utf-8' 
      }
    });
  }
}