const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/youtube`;


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

export const getVideoDetails = async (videoId) => {

    if (!videoId || !videoId.trim()) {
        throw new Error("Video ID is required");
    }

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/video/${videoId.trim()}`,
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
            "Failed to fetch video details"
        );
    }

    return data;
};