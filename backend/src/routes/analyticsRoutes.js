const express = require("express");
const router = express.Router();

const analyticsController = require("../controllers/analyticsController");
const verifyToken = require("../middleware/authMiddleware");

// =======================================
// ANALYTICS ROUTES
// =======================================

// Full Unified Analytics (Main Stats UI & backwards-compatible)
router.get("/", verifyToken, analyticsController.getAnalytics);

// Overview Metrics
router.get("/overview", verifyToken, analyticsController.getOverview);

// Domain-Specific Analytics
router.get("/productivity", verifyToken, analyticsController.getProductivity);
router.get("/focus", verifyToken, analyticsController.getFocus);
router.get("/learning", verifyToken, analyticsController.getLearning);
router.get("/goals", verifyToken, analyticsController.getGoals);
router.get("/activity", verifyToken, analyticsController.getActivity);

// Normalized Daily Time-Series
router.get("/daily", verifyToken, analyticsController.getDaily);

console.log("Analytics Routes Loaded");

module.exports = router;