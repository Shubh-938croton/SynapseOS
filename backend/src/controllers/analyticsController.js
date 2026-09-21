const analyticsService = require("../services/analyticsService");

// =======================================
// GET COMPLETE ANALYTICS (MAIN / STATS UI)
// =======================================

const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const data = await analyticsService.getCompleteAnalytics(userId, period);
        return res.status(200).json(data);
    } catch (err) {
        console.error("Analytics Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch analytics"
        });
    }
};

// =======================================
// GET OVERVIEW
// =======================================

const getOverview = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const complete = await analyticsService.getCompleteAnalytics(userId, period);
        return res.status(200).json({
            message: "Overview fetched successfully",
            period: complete.period,
            startDate: complete.startDate,
            endDate: complete.endDate,
            overview: complete.overview
        });
    } catch (err) {
        console.error("Overview Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch analytics overview"
        });
    }
};

// =======================================
// GET PRODUCTIVITY ANALYTICS
// =======================================

const getProductivity = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const data = await analyticsService.getProductivityAnalytics(userId, period);
        return res.status(200).json({
            message: "Productivity analytics fetched successfully",
            ...data
        });
    } catch (err) {
        console.error("Productivity Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch productivity analytics"
        });
    }
};

// =======================================
// GET FOCUS / POMODORO ANALYTICS
// =======================================

const getFocus = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const data = await analyticsService.getFocusAnalytics(userId, period);
        return res.status(200).json({
            message: "Focus analytics fetched successfully",
            ...data
        });
    } catch (err) {
        console.error("Focus Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch focus analytics"
        });
    }
};

// =======================================
// GET LEARNING / STUDY ANALYTICS
// =======================================

const getLearning = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const data = await analyticsService.getLearningAnalytics(userId, period);
        return res.status(200).json({
            message: "Learning analytics fetched successfully",
            ...data
        });
    } catch (err) {
        console.error("Learning Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch learning analytics"
        });
    }
};

// =======================================
// GET GOAL ANALYTICS
// =======================================

const getGoals = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const data = await analyticsService.getGoalAnalytics(userId, period);
        return res.status(200).json({
            message: "Goal analytics fetched successfully",
            ...data
        });
    } catch (err) {
        console.error("Goal Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch goal analytics"
        });
    }
};

// =======================================
// GET ACTIVITY / BEHAVIOR ANALYTICS
// =======================================

const getActivity = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const data = await analyticsService.getActivityAnalytics(userId, period);
        return res.status(200).json({
            message: "Activity analytics fetched successfully",
            ...data
        });
    } catch (err) {
        console.error("Activity Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch activity analytics"
        });
    }
};

// =======================================
// GET DAILY TIME SERIES
// =======================================

const getDaily = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.query.period || "7d";

        const data = await analyticsService.getDailyTimeSeries(userId, period);
        return res.status(200).json({
            message: "Daily analytics series fetched successfully",
            ...data
        });
    } catch (err) {
        console.error("Daily Controller Error:", err);
        return res.status(500).json({
            message: "Failed to fetch daily analytics series"
        });
    }
};

module.exports = {
    getAnalytics,
    getOverview,
    getProductivity,
    getFocus,
    getLearning,
    getGoals,
    getActivity,
    getDaily
};