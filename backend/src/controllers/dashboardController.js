const dashboardModel = require("../models/dashboardModel");

// =======================================
// Dashboard Summary
// =======================================

const getDashboardSummary = (req, res) => {

    try {

        const userId = req.user.user_id;

        dashboardModel.getDashboardSummary(userId, (err, summary) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                message: "Dashboard summary fetched successfully",
                summary
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
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
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                message: "Subject analytics fetched successfully",
                analytics
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
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
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                message: "Weekly analytics fetched successfully",
                analytics
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
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
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                message: "Goal analytics fetched successfully",
                analytics
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

module.exports = {
    getDashboardSummary,
    getSubjectAnalytics,
    getWeeklyAnalytics,
    getGoalAnalytics
};