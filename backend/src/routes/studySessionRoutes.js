const express = require("express");
const router = express.Router();

const studySessionController = require("../controllers/studySessionController");
const verifyToken = require("../middleware/authMiddleware");

// Create
router.post("/", verifyToken, studySessionController.createStudySession);

// Get All
router.get("/", verifyToken, studySessionController.getAllStudySessions);

// Get By ID
router.get("/:id", verifyToken, studySessionController.getStudySessionById);

// Update
router.put("/:id", verifyToken, studySessionController.updateStudySession);

// Delete
router.delete("/:id", verifyToken, studySessionController.deleteStudySession);

module.exports = router;