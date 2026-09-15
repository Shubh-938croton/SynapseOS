const dashboardModel = require("../models/dashboardModel");

// =======================================
// Dashboard Summary
// =======================================

const getDashboardSummary = (req, res) => {

    try {

        const userId = req.user.user_id;

        dashboardModel.getDashboardSummary(userId, (err, summary) => {

            if (err) {
                console.error("Get dashboard summary database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch dashboard summary"
                });
            }

            return res.status(200).json({
                message: "Dashboard summary fetched successfully",
                summary
            });

        });

    } catch (error) {

        console.error("Get dashboard summary controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =======================================
// Subject Analytics
// =======================================

const getSubjectAnalytics = (req, res) => {

    try {

        const userId = req.user.user_id;

        dashboardModel.getSubjectAnalytics(userId, (err, analytics) => {

            if (err) {
                console.error("Get subject analytics database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch subject analytics"
                });
            }

            return res.status(200).json({
                message: "Subject analytics fetched successfully",
                analytics
            });

        });

    } catch (error) {

        console.error("Get subject analytics controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =======================================
// Weekly Analytics
// =======================================

const getWeeklyAnalytics = (req, res) => {

    try {

        const userId = req.user.user_id;

        dashboardModel.getWeeklyAnalytics(userId, (err, analytics) => {

            if (err) {
                console.error("Get weekly analytics database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch weekly analytics"
                });
            }

            return res.status(200).json({
                message: "Weekly analytics fetched successfully",
                analytics
            });

        });

    } catch (error) {

        console.error("Get weekly analytics controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

// =======================================
// Goal Analytics
// =======================================

const getGoalAnalytics = (req, res) => {

    try {

        const userId = req.user.user_id;

        dashboardModel.getGoalAnalytics(userId, (err, analytics) => {

            if (err) {
                console.error("Get goal analytics database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch goal analytics"
                });
            }

            return res.status(200).json({
                message: "Goal analytics fetched successfully",
                analytics
            });

        });

    } catch (error) {

        console.error("Get goal analytics controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =======================================
// Pomodoro Analytics
// =======================================

const getPomodoroAnalytics = (req, res) => {

    try {

        const userId = req.user.user_id;

        dashboardModel.getPomodoroAnalytics(userId, (err, analytics) => {

            if (err) {
                console.error("Get pomodoro analytics database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch pomodoro analytics"
                });
            }

            return res.status(200).json({
                message: "Pomodoro analytics fetched successfully",
                analytics
            });

        });

    } catch (error) {

        console.error("Get pomodoro analytics controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

// =======================================
// Productivity Score
// =======================================

const getProductivityScore = (req, res) => {

    try {

        const userId = req.user.user_id;

        dashboardModel.getProductivityScore(userId, (err, productivity) => {

            if (err) {
                console.error("Get productivity score database error:", err);
                return res.status(500).json({
                    message: "Failed to calculate productivity score"
                });
            }

            return res.status(200).json({
                message: "Productivity score calculated successfully",
                productivity
            });

        });

    } catch (error) {

        console.error("Get productivity score controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

module.exports = {
    getDashboardSummary,
    getSubjectAnalytics,
    getWeeklyAnalytics,
    getGoalAnalytics,
    getPomodoroAnalytics,
    getProductivityScore
};