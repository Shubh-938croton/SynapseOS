const express = require("express");
const router = express.Router();

const subjectController = require("../controllers/subjectController");
const verifyToken = require("../middleware/authMiddleware");

// Create Subject
router.post("/", verifyToken, subjectController.createSubject);
// get all subject 
router.get("/", verifyToken, subjectController.getAllSubjects);
// get single subject 
router.get("/:id", verifyToken, subjectController.getSubjectById);
// update the subject 
router.put("/:id", verifyToken, subjectController.updateSubject);

module.exports = router;