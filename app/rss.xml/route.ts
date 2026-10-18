import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  try {
    const SITE_URL = 'https://worldofconcept.in';
    const FOUNDER_NAME = 'Mukesh Kumar Malakar';
    const CURRENT_YEAR = new Date().getFullYear();

    const q = query(
      collection(db, 'updates'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    let itemsXml = '';

    snapshot.forEach((doc) => {
      const data = doc.data();
      
      // 🔥 ROBUST DATE HANDLING: Prevents 500 errors if createdAt is missing/malformed
      let pubDate = new Date().toUTCString();
      if (data.createdAt) {
        try {
          const dateObj = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
          if (!isNaN(dateObj.getTime())) {
            pubDate = dateObj.toUTCString();
          }
        } catch (e) {
          console.warn('Invalid date format for doc:', doc.id);
        }
      }

      const postUrl = `${SITE_URL}`; 
      const thumbnail = data.imageUrl || `${SITE_URL}/logo.png`;
      
      // 🔥 XML SAFETY: Basic sanitization to prevent XML breakage
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

    // 🔥 WORLD-CLASS RSS STRUCTURE with Atom namespace for modern compatibility
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

    return new NextResponse(rssXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('❌ RSS Generation Error:', error);
    // 🔥 Return valid XML error instead of plain text to prevent parser crashes
    const errorXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Error</title>
    <link>https://worldofconcept.in</link>
    <description>Failed to generate RSS feed. Please try again later.</description>
  </channel>
</rss>`;
    return new NextResponse(errorXml, { 
      status: 500,
      headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
    });
  }
}