const express = require("express");
const router = express.Router();
const summaryController = require("../controllers/summaryController");
const verifyToken = require("../middleware/authMiddleware");

// =======================================
// SUMMARY ROUTES (AUTHENTICATED ONLY)
// =======================================

router.get("/daily", verifyToken, summaryController.getDailySummary);
router.get("/weekly", verifyToken, summaryController.getWeeklySummary);
router.get("/streak", verifyToken, summaryController.getUserStreak);
router.get("/history", verifyToken, summaryController.getSummaryHistory);

console.log("Summary Routes Loaded");

module.exports = router;
