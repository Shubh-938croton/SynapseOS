const axios = require("axios");


// =======================================
// YOUTUBE API URLS
// =======================================

const YOUTUBE_SEARCH_API_URL =
    "https://www.googleapis.com/youtube/v3/search";

const YOUTUBE_VIDEO_API_URL =
    "https://www.googleapis.com/youtube/v3/videos";


// =======================================
// SEARCH YOUTUBE VIDEOS
// =======================================

const searchVideos = async ({
    query,
    maxResults = 10,
    pageToken = null
}) => {

    if (!process.env.YOUTUBE_API_KEY) {
        throw new Error(
            "YouTube API key is not configured on the server"
        );
    }

    if (!query || !query.trim()) {

        throw new Error(
            "Search query is required"
        );

    }


    const params = {

        part: "snippet",

        q: query.trim(),

        type: "video",

        maxResults: Math.min(
            Number(maxResults) || 10,
            50
        ),

        regionCode: "IN",

        relevanceLanguage: "en",

        safeSearch: "moderate",

        key: process.env.YOUTUBE_API_KEY

    };


    if (pageToken) {

        params.pageToken = pageToken;

    }


    const response = await axios.get(
        YOUTUBE_SEARCH_API_URL,
        {
            params
        }
    );


    const youtubeData =
        response.data;


    // ===================================
    // NORMALIZE SEARCH RESPONSE
    // ===================================

    const videos =
        (youtubeData.items || []).map(
            (item) => ({

                videoId:
                    item.id?.videoId || null,

                title:
                    item.snippet?.title || "",

                description:
                    item.snippet?.description || "",

                thumbnail:
                    item.snippet?.thumbnails?.medium?.url ||
                    item.snippet?.thumbnails?.default?.url ||
                    null,

                channelTitle:
                    item.snippet?.channelTitle || "",

                channelId:
                    item.snippet?.channelId || null,

                publishedAt:
                    item.snippet?.publishedAt || null

            })
        );


    return {

        videos,

        nextPageToken:
            youtubeData.nextPageToken || null,

        totalResults:
            youtubeData.pageInfo?.totalResults || 0

    };

};


// =======================================
// GET VIDEO DETAILS
// =======================================

const getVideoDetails = async (
    videoId
) => {

    if (!process.env.YOUTUBE_API_KEY) {
        throw new Error(
            "YouTube API key is not configured on the server"
        );
    }

    if (!videoId || !videoId.trim()) {

        throw new Error(
            "Video ID is required"
        );

    }


    const params = {

        part:
            "snippet,contentDetails,statistics",

        id: videoId.trim(),

        key:
            process.env.YOUTUBE_API_KEY

    };


    const response = await axios.get(
        YOUTUBE_VIDEO_API_URL,
        {
            params
        }
    );


    const youtubeData =
        response.data;


    // ===================================
    // CHECK VIDEO
    // ===================================

    const item =
        youtubeData.items?.[0];


    if (!item) {

        throw new Error(
            "Video not found"
        );

    }


    // ===================================
    // NORMALIZE VIDEO DETAILS
    // ===================================

    return {

        videoId:
            item.id || null,

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


// =======================================
// EXPORT
// =======================================

module.exports = {

    searchVideos,

    getVideoDetails

};