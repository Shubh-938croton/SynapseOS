const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");
const verifyToken = require("../middleware/authMiddleware");
const { aiLimiter } = require("../middleware/rateLimiter");

// =======================================
// AI INTELLIGENCE ROUTES
// =======================================

// Public/Authenticated Status
router.get("/status", verifyToken, aiController.getStatus);

// Phase 6: Personalized Daily Brief
router.get("/daily-brief", verifyToken, aiLimiter, aiController.getDailyBrief);
router.post("/daily-brief", verifyToken, aiLimiter, aiController.getDailyBrief);

// Phase 6: AI Action Proposal Approvals
router.post("/actions/approve", verifyToken, aiController.approveActionProposal);
router.post("/actions/batch-approve", verifyToken, aiController.batchApproveActionProposals);

// Core AI Intelligence Features (Protected by Auth & AI Rate Limiter)
router.post("/insights", verifyToken, aiLimiter, aiController.getInsights);
router.post("/planner", verifyToken, aiLimiter, aiController.getDailyPlan);
router.post("/task-breakdown", verifyToken, aiLimiter, aiController.getTaskBreakdown);
router.post("/weak-areas", verifyToken, aiLimiter, aiController.getWeakAreas);
router.post("/weekly-review", verifyToken, aiLimiter, aiController.getWeeklyReview);
router.post("/parse-task", verifyToken, aiLimiter, aiController.parseTask);

console.log("AI Routes Loaded");

module.exports = router;
