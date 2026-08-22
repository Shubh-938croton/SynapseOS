const API_URL = "http://localhost:5000/api/youtube";


// =======================================
// SEARCH YOUTUBE VIDEOS
// =======================================

export const searchYouTubeVideos = async (
    query,
    maxResults = 10,
    pageToken = null
) => {

    const token = localStorage.getItem("token");

    if (!query || !query.trim()) {
        throw new Error("Search query is required");
    }

    const params = new URLSearchParams({
        q: query.trim(),
        maxResults: String(maxResults)
    });

    if (pageToken) {
        params.append("pageToken", pageToken);
    }

    const response = await fetch(
        `${API_URL}/search?${params.toString()}`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message ||
            "Failed to search YouTube videos"
        );
    }

    return data;
};


// =======================================
// GET VIDEO DETAILS
// =======================================

const getVideoDetails = async (videoId) => {

    if (!videoId || !videoId.trim()) {
        throw new Error("Video ID is required");
    }

    const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
            params: {
                part: "snippet,contentDetails,statistics",
                id: videoId,
                key: process.env.YOUTUBE_API_KEY
            }
        }
    );

    const item = response.data.items?.[0];

    if (!item) {
        throw new Error("Video not found");
    }

    return {
        videoId: item.id,

        title:
            item.snippet?.title || "",

        description:
            item.snippet?.description || "",

        thumbnail:
            item.snippet?.thumbnails?.high?.url ||
            item.snippet?.thumbnails?.medium?.url ||
            item.snippet?.thumbnails?.default?.url ||
            null,

        channelTitle:
            item.snippet?.channelTitle || "",

        channelId:
            item.snippet?.channelId || null,

        publishedAt:
            item.snippet?.publishedAt || null,

        duration:
            item.contentDetails?.duration || null,

        viewCount:
            item.statistics?.viewCount || "0",

        likeCount:
            item.statistics?.likeCount || "0",

        commentCount:
            item.statistics?.commentCount || "0"
    };
};