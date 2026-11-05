const express = require("express");
const router = express.Router();

const syllabusController = require("../controllers/syllabusController");
const verifyToken = require("../middleware/authMiddleware");

// =======================================
// SYLLABUS MANAGEMENT ROUTES
// =======================================

// 1. Get Subject Syllabus (Units + Topics + Metrics)
router.get("/", verifyToken, syllabusController.getSubjectSyllabus);

// 2. Unit Management
router.post("/units", verifyToken, syllabusController.createUnit);
router.put("/units/:id", verifyToken, syllabusController.updateUnit);
router.delete("/units/:id", verifyToken, syllabusController.deleteUnit);

// 3. Topic Management
router.post("/topics", verifyToken, syllabusController.createTopic);
router.put("/topics/:id", verifyToken, syllabusController.updateTopic);
router.patch("/topics/:id/status", verifyToken, syllabusController.updateTopicStatus);
router.delete("/topics/:id", verifyToken, syllabusController.deleteTopic);

// 4. Smart Import & Parser
router.post("/parse", verifyToken, syllabusController.parseRawSyllabus);
router.post("/import", verifyToken, syllabusController.bulkImport);

console.log("Syllabus Routes Loaded");

module.exports = router;
