import { NextResponse } from "next/server";

export const revalidate = 3600;

const API_KEY = process.env.YOUTUBE_API_KEY?.trim();
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID?.trim();
const CHANNEL_HANDLE = (
  process.env.YOUTUBE_CHANNEL_HANDLE || "@JoinWorldofConcept"
).trim();
const UPLOADS_PLAYLIST_ID = process.env.YOUTUBE_UPLOADS_PLAYLIST_ID?.trim();

const MAX_RESULTS = Math.min(
  Math.max(Number(process.env.YOUTUBE_MAX_RESULTS || 12), 1),
  50
);

interface YoutubeVideo {
  id: string;
  title: string;
  thumbnail?: string;
  publishedAt?: string;
}

interface PlaylistCandidate {
  id: string;
  source: string;
}

function normalizeHandle(handle: string) {
  const clean = handle.startsWith("@") ? handle.slice(1) : handle;
  return `@${clean}`;
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

function pickThumbnail(thumbnails: any): string {
  return (
    thumbnails?.maxres?.url ||
    thumbnails?.standard?.url ||
    thumbnails?.high?.url ||
    thumbnails?.medium?.url ||
    thumbnails?.default?.url ||
    ""
  );
}

async function callYouTube(
  endpoint: string,
  params: Record<string, string>
) {
  if (!API_KEY) {
    throw new Error("YOUTUBE_API_KEY missing");
  }

  const url = new URL(`https://www.googleapis.com/youtube/v3/${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  url.searchParams.set("key", API_KEY);

  const res = await fetch(url.toString(), {
    next: { revalidate: 3600 },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message =
      json?.error?.message ||
      json?.error?.errors?.[0]?.message ||
      `YouTube API request failed with status ${res.status}`;

    throw new Error(message);
  }

  return json;
}

async function resolveChannelId(): Promise<{
  channelId?: string;
  source?: string;
  errors: string[];
}> {
  const errors: string[] = [];

  if (CHANNEL_ID) {
    return {
      channelId: CHANNEL_ID,
      source: "env:YOUTUBE_CHANNEL_ID",
      errors,
    };
  }

  const handle = normalizeHandle(CHANNEL_HANDLE);

  try {
    const data = await callYouTube("channels", {
      part: "contentDetails",
      forHandle: handle,
    });

    const id = data?.items?.[0]?.id;

    if (id) {
      return {
        channelId: id,
        source: `youtube:channels.forHandle:${handle}`,
        errors,
      };
    }

    errors.push(`channels.forHandle ne koi channel nahi dhundha for ${handle}`);
  } catch (error) {
    errors.push(`channels.forHandle error: ${getErrorMessage(error)}`);
  }

  try {
    const searchQuery = handle.replace(/^@/, "");

    const data = await callYouTube("search", {
      part: "snippet",
      type: "channel",
      q: searchQuery,
      maxResults: "1",
    });

    const id =
      data?.items?.[0]?.id?.channelId ||
      data?.items?.[0]?.snippet?.channelId;

    if (id) {
      return {
        channelId: id,
        source: `youtube:search:${searchQuery}`,
        errors,
      };
    }

    errors.push(`search API ne koi channel nahi dhundha for ${searchQuery}`);
  } catch (error) {
    errors.push(`search API error: ${getErrorMessage(error)}`);
  }

  return { errors };
}

async function getPlaylistCandidates(channelId: string): Promise<{
  candidates: PlaylistCandidate[];
  errors: string[];
  channelData?: any;
}> {
  const candidates: PlaylistCandidate[] = [];
  const errors: string[] = [];
  let channelData: any = null;

  // 1. Direct uploads playlist env
  if (UPLOADS_PLAYLIST_ID) {
    candidates.push({
      id: UPLOADS_PLAYLIST_ID,
      source: "env:YOUTUBE_UPLOADS_PLAYLIST_ID",
    });
  }

  // 2. Official YouTube channels API uploads playlist
  try {
    channelData = await callYouTube("channels", {
      part: "contentDetails",
      id: channelId,
    });

    const officialUploads =
      channelData?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (officialUploads) {
      candidates.push({
        id: officialUploads,
        source: "youtube:channels.contentDetails.relatedPlaylists.uploads",
      });
    } else {
      errors.push(
        "Channels API ne uploads playlist nahi diya. Items empty ho sakte hain ya channel ID galat ho sakta hai."
      );
    }
  } catch (error) {
    errors.push(`Channels API error: ${getErrorMessage(error)}`);
  }

  // 3. Derived fallback: UCxxxx -> UUxxxx
  if (channelId.startsWith("UC") && channelId.length >= 4) {
    const derivedPlaylist = `UU${channelId.slice(2)}`;
    candidates.push({
      id: derivedPlaylist,
      source: "derived:channelId.UC-to-UU",
    });
  }

  // Remove duplicates
  const seen = new Set<string>();
  const uniqueCandidates = candidates.filter((candidate) => {
    if (!candidate.id || seen.has(candidate.id)) return false;
    seen.add(candidate.id);
    return true;
  });

  return {
    candidates: uniqueCandidates,
    errors,
    channelData,
  };
}

async function fetchVideosFromPlaylist(
  playlistId: string
): Promise<YoutubeVideo[]> {
  const data = await callYouTube("playlistItems", {
    part: "snippet,contentDetails",
    playlistId,
    maxResults: String(MAX_RESULTS),
  });

  const videos: YoutubeVideo[] = (data?.items || [])
    .map((item: any) => {
      const id = item?.contentDetails?.videoId;
      const title = item?.snippet?.title || "Untitled Video";
      const thumbnail = pickThumbnail(item?.snippet?.thumbnails);
      const publishedAt = item?.snippet?.publishedAt;

      if (!id) return null;

      return {
        id,
        title,
        thumbnail,
        publishedAt,
      };
    })
    .filter((video): video is YoutubeVideo => Boolean(video));

  return videos;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const debug = url.searchParams.get("debug") === "1";

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  };

  try {
    if (!API_KEY) {
      return NextResponse.json(
        {
          success: false,
          source: "fallback",
          message:
            "YOUTUBE_API_KEY missing. Vercel Environment Variables me add karke redeploy karo.",
          videos: [],
        },
        { headers }
      );
    }

    const resolved = await resolveChannelId();

    if (!resolved.channelId) {
      const message =
        "YouTube channel ID resolve nahi ho paya. YOUTUBE_CHANNEL_ID env variable set karo.";

      if (debug) {
        return NextResponse.json(
          {
            success: false,
            source: "debug",
            message,
            errors: resolved.errors,
            env: {
              hasApiKey: Boolean(API_KEY),
              hasChannelId: Boolean(CHANNEL_ID),
              hasUploadsPlaylistId: Boolean(UPLOADS_PLAYLIST_ID),
              channelHandle: CHANNEL_HANDLE,
            },
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

    const {
      candidates,
      errors: playlistErrors,
      channelData,
    } = await getPlaylistCandidates(resolved.channelId);

    const attempted: any[] = [];
    let lastError: string | null = null;

    for (const candidate of candidates) {
      try {
        const videos = await fetchVideosFromPlaylist(candidate.id);

        attempted.push({
          playlistId: candidate.id,
          source: candidate.source,
          videoCount: videos.length,
        });

        if (videos.length > 0) {
          if (debug) {
            return NextResponse.json(
              {
                success: true,
                source: "debug",
                channelId: resolved.channelId,
                channelSource: resolved.source,
                usedPlaylistId: candidate.id,
                playlistSource: candidate.source,
                total: videos.length,
                env: {
                  hasApiKey: Boolean(API_KEY),
                  hasChannelId: Boolean(CHANNEL_ID),
                  hasUploadsPlaylistId: Boolean(UPLOADS_PLAYLIST_ID),
                  channelHandle: CHANNEL_HANDLE,
                },
                videos,
              },
              { headers }
            );
          }

          return NextResponse.json(
            {
              success: true,
              source: "youtube",
              channelId: resolved.channelId,
              videos,
            },
            { headers }
          );
        }
      } catch (error) {
        const message = getErrorMessage(error);
        lastError = message;

        attempted.push({
          playlistId: candidate.id,
          source: candidate.source,
          error: message,
        });
      }
    }

    const message =
      lastError ||
      "Kisi bhi uploads playlist se videos nahi mile. Channel ID galat ho sakta hai ya channel par public videos nahi hain.";

    if (debug) {
      return NextResponse.json(
        {
          success: false,
          source: "debug",
          message,
          channelId: resolved.channelId,
          channelSource: resolved.source,
          attemptedPlaylists: attempted,
          playlistErrors,
          channelData,
          env: {
            hasApiKey: Boolean(API_KEY),
            hasChannelId: Boolean(CHANNEL_ID),
            hasUploadsPlaylistId: Boolean(UPLOADS_PLAYLIST_ID),
            channelHandle: CHANNEL_HANDLE,
          },
          videos: [],
        },
        { headers }
      );
    }

    return NextResponse.json(
      {
        success: false,
        source: "fallback",
        message: "YouTube videos fetch karne mein error aaya.",
        videos: [],
      },
      { headers }
    );
  } catch (error) {
    const message = getErrorMessage(error);

    console.error("Critical YouTube API route error:", error);

    if (debug) {
      return NextResponse.json(
        {
          success: false,
          source: "debug",
          message,
          env: {
            hasApiKey: Boolean(API_KEY),
            hasChannelId: Boolean(CHANNEL_ID),
            hasUploadsPlaylistId: Boolean(UPLOADS_PLAYLIST_ID),
            channelHandle: CHANNEL_HANDLE,
          },
          videos: [],
        },
        { headers }
      );
    }

    return NextResponse.json(
      {
        success: false,
        source: "fallback",
        message: "YouTube videos fetch karne mein error aaya.",
        videos: [],
      },
      { headers }
    );
  }
}