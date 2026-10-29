const aiService = require("../ai/aiService");
const aiActionService = require("../ai/actions/aiActionService");

// =======================================
// GET AI STATUS
// =======================================
const getStatus = async (req, res) => {
    try {
        const status = aiService.getAIStatus();
        return res.status(200).json({
            message: "AI service status retrieved",
            status
        });
    } catch (err) {
        console.error("[AI Controller] Status Error:", err);
        return res.status(500).json({ message: "Failed to retrieve AI service status" });
    }
};

// =======================================
// GET PERSONALIZED DAILY BRIEF (PHASE 6)
// =======================================
const getDailyBrief = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const date = req.body?.date || req.query?.date || null;
        const forceRefresh = req.body?.forceRefresh === true || req.query?.forceRefresh === "true";

        const data = await aiService.generateDailyBrief(userId, { date, forceRefresh });
        return res.status(200).json({
            message: "Daily brief generated successfully",
            ...data
        });
    } catch (err) {
        console.error("[AI Controller] Daily Brief Error:", err.message);
        const statusCode = err.message.includes("disabled") ? 503 : (err.message.includes("rate limit") ? 429 : 500);
        return res.status(statusCode).json({
            message: err.message || "Failed to generate daily brief"
        });
    }
};

// =======================================
// GET PERSONALIZED INSIGHTS
// =======================================
const getInsights = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const period = req.body?.period || req.query?.period || "7d";

        const data = await aiService.generatePersonalizedInsights(userId, period);
        return res.status(200).json({
            message: "Personalized insights generated successfully",
            ...data
        });
    } catch (err) {
        console.error("[AI Controller] Insights Error:", err.message);
        const statusCode = err.message.includes("disabled") ? 503 : (err.message.includes("rate limit") ? 429 : 500);
        return res.status(statusCode).json({
            message: err.message || "Failed to generate personalized insights"
        });
    }
};

// =======================================
// GET SMART DAILY PLAN
// =======================================
const getDailyPlan = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const date = req.body?.date || req.query?.date || null;

        const data = await aiService.generateDailyPlan(userId, date);
        return res.status(200).json({
            message: "Smart daily plan proposed successfully",
            ...data
        });
    } catch (err) {
        console.error("[AI Controller] Planner Error:", err.message);
        const statusCode = err.message.includes("disabled") ? 503 : (err.message.includes("rate limit") ? 429 : 500);
        return res.status(statusCode).json({
            message: err.message || "Failed to propose smart daily plan"
        });
    }
};

// =======================================
// GET SMART TASK BREAKDOWN
// =======================================
const getTaskBreakdown = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { title, description, subjectName, durationMinutes } = req.body || {};

        if (!title || typeof title !== "string" || !title.trim()) {
            return res.status(400).json({ message: "Task title is required for breakdown." });
        }

        const data = await aiService.generateTaskBreakdown(userId, {
            title: title.trim(),
            description,
            subjectName,
            durationMinutes
        });

        return res.status(200).json({
            message: "Task breakdown generated successfully",
            ...data
        });
    } catch (err) {
        console.error("[AI Controller] Task Breakdown Error:", err.message);
        const statusCode = err.message.includes("disabled") ? 503 : (err.message.includes("rate limit") ? 429 : 500);
        return res.status(statusCode).json({
            message: err.message || "Failed to break down task"
        });
    }
};

// =======================================
// GET WEAK AREA DETECTION
// =======================================
const getWeakAreas = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const data = await aiService.generateWeakAreas(userId);
        return res.status(200).json({
            message: "Weak area analysis completed",
            ...data
        });
    } catch (err) {
        console.error("[AI Controller] Weak Areas Error:", err.message);
        const statusCode = err.message.includes("disabled") ? 503 : (err.message.includes("rate limit") ? 429 : 500);
        return res.status(statusCode).json({
            message: err.message || "Failed to analyze weak areas"
        });
    }
};

// =======================================
// GET WEEKLY REVIEW
// =======================================
const getWeeklyReview = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const endDate = req.body?.endDate || req.query?.endDate || null;

        const data = await aiService.generateWeeklyReview(userId, endDate);
        return res.status(200).json({
            message: "Weekly review generated successfully",
            ...data
        });
    } catch (err) {
        console.error("[AI Controller] Weekly Review Error:", err.message);
        const statusCode = err.message.includes("disabled") ? 503 : (err.message.includes("rate limit") ? 429 : 500);
        return res.status(statusCode).json({
            message: err.message || "Failed to generate weekly review"
        });
    }
};

// =======================================
// PARSE NATURAL LANGUAGE TASK
// =======================================
const parseTask = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { prompt } = req.body || {};

        if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
            return res.status(400).json({ message: "Natural language prompt is required." });
        }

        const data = await aiService.parseNaturalLanguageTask(userId, prompt.trim());
        return res.status(200).json({
            message: "Natural language task parsed successfully",
            ...data
        });
    } catch (err) {
        console.error("[AI Controller] Parse Task Error:", err.message);
        const statusCode = err.message.includes("disabled") ? 503 : (err.message.includes("rate limit") ? 429 : 500);
        return res.status(statusCode).json({
            message: err.message || "Failed to parse natural language task"
        });
    }
};

// =======================================
// APPROVE & EXECUTE SINGLE ACTION PROPOSAL (PHASE 6)
// =======================================
const approveActionProposal = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const proposal = req.body?.proposal || req.body;

        if (!proposal || typeof proposal !== "object") {
            return res.status(400).json({ message: "Proposal object is required." });
        }

        const result = await aiActionService.executeActionProposal(userId, proposal);
        return res.status(200).json({
            message: "Action proposal executed successfully",
            result
        });
    } catch (err) {
        console.error("[AI Controller] Action Execution Error:", err.message);
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            message: err.message || "Failed to execute action proposal",
            code: err.code || "EXECUTION_ERROR"
        });
    }
};

// =======================================
// BATCH APPROVE ACTION PROPOSALS (PHASE 6)
// =======================================
const batchApproveActionProposals = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const proposals = req.body?.proposals || [];

        if (!Array.isArray(proposals) || proposals.length === 0) {
            return res.status(400).json({ message: "Non-empty proposals array is required." });
        }

        const result = await aiActionService.executeBatchProposals(userId, proposals);
        return res.status(200).json({
            message: "Batch action proposals processed",
            result
        });
    } catch (err) {
        console.error("[AI Controller] Batch Action Execution Error:", err.message);
        return res.status(500).json({
            message: err.message || "Failed to process batch action proposals"
        });
    }
};

module.exports = {
    getStatus,
    getDailyBrief,
    getInsights,
    getDailyPlan,
    getTaskBreakdown,
    getWeakAreas,
    getWeeklyReview,
    parseTask,
    approveActionProposal,
    batchApproveActionProposals
};
