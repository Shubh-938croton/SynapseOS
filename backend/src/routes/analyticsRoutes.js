const express = require("express");

const router = express.Router();

const analyticsController = require("../controllers/analyticsController");

const verifyToken = require("../middleware/authMiddleware");


// =======================================
// GET ANALYTICS
// =======================================

router.get(
    "/",
    verifyToken,
    analyticsController.getAnalytics
);


console.log("Analytics Routes Loaded");


module.exports = router;