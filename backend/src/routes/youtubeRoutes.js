const express = require("express");

const {
    searchYouTubeVideos,
    getYouTubeVideoDetails
} = require("../controllers/youtubeController");

const router = express.Router();


// =======================================
// SEARCH YOUTUBE VIDEOS
// =======================================

router.get(
    "/search",
    searchYouTubeVideos
);


// =======================================
// GET VIDEO DETAILS
// =======================================

router.get(
    "/video/:videoId",
    getYouTubeVideoDetails
);


module.exports = router;