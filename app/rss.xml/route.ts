import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  const SITE_URL = 'https://worldofconcept.in';
  const FOUNDER_NAME = 'Mukesh Kumar Malakar';
  const CURRENT_YEAR = new Date().getFullYear();

  let itemsXml = '';

  try {
    const q = query(
      collection(db, 'updates'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    
    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // 🔥 ROBUST DATE HANDLING
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
      const thumbnail = data.imageUrl || `${SITE_URL}/logo.png`;
      
      // 🔥 XML SAFETY: Prevents breakage from special characters like &, <, >
      const safeTitle = (data.title || 'New Update from World of Concept').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const safeDesc = (data.description || 'Check out this amazing update from World of Concept!').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      const author = 'RK Sir';
      const category = data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Update';
      const safeImageUrl = data.imageUrl ? data.imageUrl.replace(/&/g, '&amp;') : '';

      itemsXml += `
        <item>
          <title><![CDATA[${safeTitle}]]></title>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}?id=${doc.id}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${safeDesc}]]></description>
          <content:encoded><![CDATA[
            <p>${safeDesc}</p>
            ${safeImageUrl ? `<br/><img src="${safeImageUrl}" alt="Update Media" style="max-width: 100%; height: auto; border-radius: 8px;" />` : ''}
            <br/><p><a href="${postUrl}">Read more on World of Concept</a></p>
          ]]></content:encoded>
          <author><![CDATA[${author}]]></author>
          <category><![CDATA[${category}]]></category>
          ${safeImageUrl ? `<media:content url="${safeImageUrl}" type="image/jpeg" />` : ''}
          <media:thumbnail url="${thumbnail}" width="1200" height="630" />
        </item>
      `;
    });
  } catch (error) {
    // 🔥 BULLETPROOF FALLBACK: Even if Firebase fails, we log it but return a VALID empty RSS feed.
    // This ensures validators NEVER see an "Error" title or invalid XML structure.
    console.error('❌ Firestore RSS Generation Error (Returning empty valid feed):', error);
  }

  // 🔥 WORLD-CLASS RSS STRUCTURE
  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>World of Concept | RK Sir's Latest Updates & Courses</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Discover the latest courses, updates, motivational posts, and educational content from World of Concept by RK Sir.</description>
    <language>hi-IN</language>
    <copyright>© ${CURRENT_YEAR} World of Concept. All rights reserved.</copyright>
    <managingEditor>support@worldofconcept.in (${FOUNDER_NAME})</managingEditor>
    <webMaster>support@worldofconcept.in (${FOUNDER_NAME})</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js RSS Generator (World of Concept)</generator>
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

  // 🔥 ALWAYS RETURN 200 OK with valid XML, even if itemsXml is empty
  return new NextResponse(rssXml, {
    status: 200,
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}