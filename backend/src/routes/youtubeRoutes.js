const express = require("express");

const {
    searchYouTubeVideos
} = require("../controllers/youtubeController");


const router = express.Router();


// =======================================
// SEARCH YOUTUBE VIDEOS
// =======================================

router.get(
    "/search",
    searchYouTubeVideos
);


module.exports = router;