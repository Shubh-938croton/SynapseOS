const express = require("express");
const router = express.Router();

const noteController = require("../controllers/noteController");
const verifyToken = require("../middleware/authMiddleware");

// Create Note
router.post("/", verifyToken, noteController.createNote);

module.exports = router;