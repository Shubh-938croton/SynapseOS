const express = require("express");
const verifyToken = require("../middleware/authMiddleware");

const {
    searchYouTubeVideos,
    getYouTubeVideoDetails
} = require("../controllers/youtubeController");

const router = express.Router();

// Protect all YouTube routes with JWT authentication
router.use(verifyToken);

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