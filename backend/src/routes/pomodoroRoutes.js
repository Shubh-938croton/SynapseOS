const express = require("express");
const router = express.Router();

const pomodoroController = require("../controllers/pomodoroController");
const verifyToken = require("../middleware/authMiddleware");

// Create
router.post("/", verifyToken, pomodoroController.createPomodoroSession);

// Get All
router.get("/", verifyToken, pomodoroController.getAllPomodoroSessions);

// Get By ID
router.get("/:id", verifyToken, pomodoroController.getPomodoroSessionById);

// Update
router.put("/:id", verifyToken, pomodoroController.updatePomodoroSession);

// Delete
router.delete("/:id", verifyToken, pomodoroController.deletePomodoroSession);

module.exports = router;