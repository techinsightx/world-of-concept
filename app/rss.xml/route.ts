import { NextResponse } from 'next/server';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const revalidate = 3600; // 1 hour cache

export async function GET() {
  try {
    const SITE_URL = 'https://worldofconcept.in';
    const FOUNDER_NAME = 'Mukesh Kumar Malakar';

    const q = query(
      collection(db, 'updates'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    
    const snapshot = await getDocs(q);
    let itemsXml = '';

    snapshot.forEach((doc) => {
      const data = doc.data();
      const dateObj = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
      const pubDate = dateObj.toUTCString();
      const postUrl = `${SITE_URL}`; 
      const thumbnail = data.imageUrl || `${SITE_URL}/logo.png`;
      const description = data.description || 'Check out this amazing update from World of Concept!';
      const title = data.title || 'New Update from World of Concept';
      const author = 'RK Sir';
      const category = data.type ? data.type.charAt(0).toUpperCase() + data.type.slice(1) : 'Update';

      itemsXml += `
        <item>
          <title><![CDATA[${title}]]></title>
          <link>${postUrl}</link>
          <guid isPermaLink="true">${postUrl}</guid>
          <pubDate>${pubDate}</pubDate>
          <description><![CDATA[${description}]]></description>
          <content:encoded><![CDATA[
            <p>${description}</p>
            ${data.imageUrl ? `<br/><img src="${data.imageUrl}" alt="Update Media" style="max-width: 100%; height: auto; border-radius: 8px;" />` : ''}
          ]]></content:encoded>
          <author><![CDATA[${author}]]></author>
          <category><![CDATA[${category}]]></category>
          <media:content url="${data.imageUrl || ''}" type="image/jpeg" />
          <media:thumbnail url="${thumbnail}" width="1200" height="630" />
        </item>
      `;
    });

    // ✅ Fixed: Added proper xmlns for content and media
    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>World of Concept | RK Sir's Latest Updates & Courses</title>
    <link>${SITE_URL}</link>
    <description>Discover the latest courses, updates, motivational posts, and educational content from World of Concept by RK Sir.</description>
    <language>hi-in</language>
    <copyright>© ${new Date().getFullYear()} World of Concept. All rights reserved.</copyright>
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
  } catch (error) {
    console.error('❌ RSS Generation Error:', error);
    return new NextResponse('Error generating RSS feed', { 
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}