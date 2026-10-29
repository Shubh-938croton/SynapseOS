const automationModel = require("../models/automationModel");
const automationService = require("../services/automationService");
const { isValidDateString, getYesterdayString } = require("../utils/dateUtils");

const runQuery = (modelFn, ...args) => {
    return new Promise((resolve, reject) => {
        modelFn(...args, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// =======================================
// GET DAILY SUMMARY
// =======================================

const getDailySummary = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const requestedDate = req.query.date;

        if (requestedDate && !isValidDateString(requestedDate)) {
            return res.status(400).json({ message: "Invalid date format. Expected YYYY-MM-DD." });
        }

        let summary = null;
        if (requestedDate) {
            summary = await runQuery(automationModel.getSummary, userId, "daily", requestedDate);
        } else {
            summary = await runQuery(automationModel.getLatestSummary, userId, "daily");
        }

        // If no persisted summary exists for this date, compute on-demand
        if (!summary) {
            const targetDate = requestedDate || getYesterdayString();
            const generated = await automationService.processDailySummary(userId, targetDate);
            return res.status(200).json({
                message: "Daily summary generated successfully",
                summary: generated.data
            });
        }

        return res.status(200).json({
            message: "Daily summary fetched successfully",
            summary: summary.summary_data,
            createdAt: summary.created_at,
            updatedAt: summary.updated_at
        });
    } catch (err) {
        console.error("Summary Controller Error:", err);
        return res.status(500).json({ message: "Failed to fetch daily summary" });
    }
};

// =======================================
// GET WEEKLY SUMMARY
// =======================================

const getWeeklySummary = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const requestedDate = req.query.date;

        if (requestedDate && !isValidDateString(requestedDate)) {
            return res.status(400).json({ message: "Invalid date format. Expected YYYY-MM-DD." });
        }

        let summary = null;
        if (requestedDate) {
            summary = await runQuery(automationModel.getSummary, userId, "weekly", requestedDate);
        } else {
            summary = await runQuery(automationModel.getLatestSummary, userId, "weekly");
        }

        // If no persisted summary exists, compute on-demand
        if (!summary) {
            const targetDate = requestedDate || getYesterdayString();
            const generated = await automationService.processWeeklySummary(userId, targetDate);
            return res.status(200).json({
                message: "Weekly summary generated successfully",
                summary: generated.data
            });
        }

        return res.status(200).json({
            message: "Weekly summary fetched successfully",
            summary: summary.summary_data,
            createdAt: summary.created_at,
            updatedAt: summary.updated_at
        });
    } catch (err) {
        console.error("Weekly Summary Controller Error:", err);
        return res.status(500).json({ message: "Failed to fetch weekly summary" });
    }
};

// =======================================
// GET STREAK & CONSISTENCY METRICS
// =======================================

const getUserStreak = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const date = req.query.date;

        const streak = await automationService.calculateUserStreak(userId, date);
        return res.status(200).json({
            message: "User streak calculated successfully",
            streak
        });
    } catch (err) {
        console.error("Streak Controller Error:", err);
        return res.status(500).json({ message: "Failed to calculate user streak" });
    }
};

// =======================================
// GET SUMMARY HISTORY
// =======================================

const getSummaryHistory = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const type = req.query.type === "weekly" ? "weekly" : "daily";
        const limit = Number(req.query.limit) || 10;

        const history = await runQuery(automationModel.getSummaryHistory, userId, type, limit);
        return res.status(200).json({
            message: `${type} summary history fetched successfully`,
            type,
            count: history.length,
            history: history.map(h => ({
                id: h.summary_id,
                periodStart: h.period_start,
                periodEnd: h.period_end,
                data: h.summary_data,
                createdAt: h.created_at
            }))
        });
    } catch (err) {
        console.error("Summary History Controller Error:", err);
        return res.status(500).json({ message: "Failed to fetch summary history" });
    }
};

module.exports = {
    getDailySummary,
    getWeeklySummary,
    getUserStreak,
    getSummaryHistory
};
