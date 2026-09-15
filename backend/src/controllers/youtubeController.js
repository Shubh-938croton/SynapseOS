const youtubeService =
    require("../services/youtubeService");


// =======================================
// SEARCH YOUTUBE VIDEOS
// =======================================

const searchYouTubeVideos = async (req, res) => {

    try {

        const {
            q,
            maxResults,
            pageToken
        } = req.query;


        // ===================================
        // VALIDATION
        // ===================================

        if (!q || !q.trim()) {

            return res.status(400).json({

                success: false,

                message:
                    "Search query is required"

            });

        }


        // ===================================
        // SEARCH
        // ===================================

        const results =
            await youtubeService.searchVideos({

                query: q,

                maxResults:
                    Number(maxResults) || 10,

                pageToken

            });


        // ===================================
        // RESPONSE
        // ===================================

        return res.status(200).json({

            success: true,

            data: results.videos,

            pagination: {

                nextPageToken:
                    results.nextPageToken,

                totalResults:
                    results.totalResults

            }

        });

    } catch (error) {

        console.error(
            "YouTube API Error:",
            error.response?.data ||
            error.message
        );

        if (error.response) {
            const status = error.response.status || 500;
            return res.status(status).json({
                success: false,
                message: status === 429 || status === 403
                    ? "YouTube service is currently unavailable. Please try again later."
                    : "YouTube API request failed"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to search YouTube videos"
        });

    }
};


// =======================================
// GET VIDEO DETAILS
// =======================================

const getYouTubeVideoDetails = async (req, res) => {

    try {

        const {
            videoId
        } = req.params;


        // ===================================
        // VALIDATION
        // ===================================

        if (!videoId) {

            return res.status(400).json({

                success: false,

                message:
                    "Video ID is required"

            });

        }


        // ===================================
        // GET VIDEO DETAILS
        // ===================================

        const video =
            await youtubeService.getVideoDetails(
                videoId
            );


        // ===================================
        // RESPONSE
        // ===================================

        return res.status(200).json({

            success: true,

            data: video

        });

    } catch (error) {

        console.error(
            "YouTube video details error:",
            error.response?.data ||
            error.message
        );

        if (error.response) {
            const status = error.response.status || 500;
            return res.status(status).json({
                success: false,
                message: "Failed to fetch video details"
            });
        }

        return res.status(404).json({
            success: false,
            message: "Video not found"
        });

    }
};


// =======================================
// EXPORT CONTROLLERS
// =======================================

module.exports = {

    searchYouTubeVideos,

    getYouTubeVideoDetails

};