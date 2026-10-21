import { NextResponse } from "next/server";

export const revalidate = 3600; // 1 hour cache

const CHANNEL_HANDLE = process.env.YOUTUBE_CHANNEL_HANDLE || "@JoinWorldofConcept";
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const API_KEY = process.env.YOUTUBE_API_KEY;
const MAX_RESULTS = Number(process.env.YOUTUBE_MAX_RESULTS || 12);

export interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
}

interface Thumbnail {
  url: string;
}

function normalizeHandle(handle: string) {
  return handle.startsWith("@") ? handle : `@${handle}`;
}

function handleToQuery(handle: string) {
  return normalizeHandle(handle).replace(/^@/, "");
}

function pickThumbnail(thumbnails?: Record<string, Thumbnail>) {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

async function resolveChannelId(): Promise<string | null> {
  if (CHANNEL_ID) return CHANNEL_ID;
  if (!API_KEY) return null;

  const handle = normalizeHandle(CHANNEL_HANDLE);

  // Try modern channels.list forHandle
  try {
    const channelsUrl = new URL("https://www.googleapis.com/youtube/v3/channels");
    channelsUrl.searchParams.set("part", "contentDetails");
    channelsUrl.searchParams.set("forHandle", handle);
    channelsUrl.searchParams.set("key", API_KEY);

    const res = await fetch(channelsUrl.toString(), {
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    if (json?.items?.[0]?.id) {
      return json.items[0].id;
    }
  } catch (error) {
    console.error("YouTube channels.forHandle lookup failed:", error);
  }

  // Fallback: search by channel name/handle
  try {
    const searchUrl = new URL("https://www.googleapis.com/youtube/v3/search");
    searchUrl.searchParams.set("part", "snippet");
    searchUrl.searchParams.set("type", "channel");
    searchUrl.searchParams.set("q", handleToQuery(handle));
    searchUrl.searchParams.set("maxResults", "1");
    searchUrl.searchParams.set("key", API_KEY);

    const res = await fetch(searchUrl.toString(), {
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    const channelId =
      json?.items?.[0]?.id?.channelId ||
      json?.items?.[0]?.snippet?.channelId ||
      null;

    return channelId;
  } catch (error) {
    console.error("YouTube channel search failed:", error);
    return null;
  }
}

async function getUploadsPlaylistId(channelId: string): Promise<string | null> {
  if (!API_KEY) return null;

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/channels");
    url.searchParams.set("part", "contentDetails");
    url.searchParams.set("id", channelId);
    url.searchParams.set("key", API_KEY);

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    return (
      json?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads || null
    );
  } catch (error) {
    console.error("YouTube uploads playlist lookup failed:", error);
    return null;
  }
}

async function getLatestVideos(
  uploadsPlaylistId: string
): Promise<YoutubeVideo[]> {
  if (!API_KEY) return [];

  try {
    const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
    url.searchParams.set("part", "snippet,contentDetails");
    url.searchParams.set("playlistId", uploadsPlaylistId);
    url.searchParams.set("maxResults", String(Math.min(Math.max(MAX_RESULTS, 1), 50)));
    url.searchParams.set("key", API_KEY);

    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 },
    });

    const json = await res.json();

    if (!res.ok) {
      console.error("YouTube playlistItems API error:", json?.error?.message || res.statusText);
      return [];
    }

    const items = Array.isArray(json?.items) ? json.items : [];

    const videos: YoutubeVideo[] = items
      .map((item: any) => {
        const id = item?.contentDetails?.videoId;
        const title = item?.snippet?.title;
        const thumbnail = pickThumbnail(item?.snippet?.thumbnails);
        const publishedAt = item?.snippet?.publishedAt;

        if (!id || !title) return null;

        return {
          id,
          title,
          thumbnail,
          publishedAt,
        };
      })
      .filter(Boolean) as YoutubeVideo[];

    return videos;
  } catch (error) {
    console.error("YouTube latest videos fetch failed:", error);
    return [];
  }
}

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get("debug") === "1";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };

  try {
    if (!API_KEY) {
      const message =
        "YOUTUBE_API_KEY missing. Add it in Vercel environment variables and redeploy.";

      if (debug) {
        return NextResponse.json(
          {
            success: false,
            source: "debug",
            message,
            videos: [],
          },
          { headers }
        );
      }

      return NextResponse.json(
        {
          success: false,
          source: "fallback",
          message,
          videos: [],
        },
        { headers }
      );
    }

    const channelId = await resolveChannelId();

    if (!channelId) {
      const message =
        "YouTube channel ID resolve nahi ho paya. YOUTUBE_CHANNEL_HANDLE ya YOUTUBE_CHANNEL_ID check karo.";

      if (debug) {
        return NextResponse.json(
          {
            success: false,
            source: "debug",
            message,
            channelHandle: normalizeHandle(CHANNEL_HANDLE),
            videos: [],
          },
          { headers }
        );
      }

      return NextResponse.json(
        {
          success: false,
          source: "fallback",
          message,
          videos: [],
        },
        { headers }
      );
    }

    const uploadsPlaylistId = await getUploadsPlaylistId(channelId);

    if (!uploadsPlaylistId) {
      const message = "YouTube uploads playlist ID nahi mila.";

      if (debug) {
        return NextResponse.json(
          {
            success: false,
            source: "debug",
            message,
            channelId,
            videos: [],
          },
          { headers }
        );
      }

      return NextResponse.json(
        {
          success: false,
          source: "fallback",
          message,
          videos: [],
        },
        { headers }
      );
    }

    const videos = await getLatestVideos(uploadsPlaylistId);

    if (debug) {
      return NextResponse.json(
        {
          success: videos.length > 0,
          source: "debug",
          channelHandle: normalizeHandle(CHANNEL_HANDLE),
          channelId,
          uploadsPlaylistId,
          total: videos.length,
          videos,
        },
        { headers }
      );
    }

    return NextResponse.json(
      {
        success: videos.length > 0,
        source: videos.length > 0 ? "youtube" : "fallback",
        channelId,
        videos,
      },
      { headers }
    );
  } catch (error) {
    console.error("Critical YouTube API route error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "YouTube videos fetch karne mein critical error aaya.";

    return NextResponse.json(
      {
        success: false,
        source: "fallback",
        message,
        videos: [],
      },
      { headers }
    );
  }
}