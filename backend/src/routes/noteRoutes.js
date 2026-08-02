const express = require("express");
const router = express.Router();

const noteController = require("../controllers/noteController");
const verifyToken = require("../middleware/authMiddleware");

// Create Note
router.post("/", verifyToken, noteController.createNote);
// get all notes 
router.get("/", verifyToken, noteController.getAllNotes);
// get note by id 
router.get("/:id", verifyToken, noteController.getNoteById);
// update note
router.put("/:id", verifyToken, noteController.updateNote);
// delete note 
router.delete("/:id", verifyToken, noteController.deleteNote);

module.exports = router;