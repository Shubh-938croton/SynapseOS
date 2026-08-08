const express = require("express");

const router = express.Router();

const noteController = require("../controllers/noteController");

const verifyToken = require("../middleware/authMiddleware");


// =========================
// CREATE NOTE
// =========================

router.post(
    "/",
    verifyToken,
    noteController.createNote
);


// =========================
// GET ALL NOTES
// =========================

router.get(
    "/",
    verifyToken,
    noteController.getAllNotes
);


// =========================
// GET NOTE BY ID
// =========================

router.get(
    "/:id",
    verifyToken,
    noteController.getNoteById
);


// =========================
// UPDATE NOTE
// =========================

router.put(
    "/:id",
    verifyToken,
    noteController.updateNote
);


// =========================
// DELETE NOTE
// =========================

router.delete(
    "/:id",
    verifyToken,
    noteController.deleteNote
);


console.log("Note Routes Loaded");


module.exports = router;