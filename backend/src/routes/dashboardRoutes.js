const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const verifyToken = require("../middleware/authMiddleware");

// Dashboard Summary
router.get(
    "/summary",
    verifyToken,
    dashboardController.getDashboardSummary
);


// =======================================
// Subject Analytics
// =======================================

router.get(
    "/subject-analysis",
    verifyToken,
    dashboardController.getSubjectAnalytics
);


// =======================================
// Weekly Analytics
// =======================================

router.get(
    "/weekly",
    verifyToken,
    dashboardController.getWeeklyAnalytics
);

// =======================================
// Goal Analytics
// =======================================

router.get(
    "/goals",
    verifyToken,
    dashboardController.getGoalAnalytics
);


// =======================================
// Pomodoro Analytics
// =======================================

router.get(
    "/pomodoro",
    verifyToken,
    dashboardController.getPomodoroAnalytics
);

module.exports = router;