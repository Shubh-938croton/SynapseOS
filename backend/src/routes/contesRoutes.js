const express = require("express");

const router = express.Router();

const contestController = require("../controllers/contestController");
const verifyToken = require("../middleware/authMiddleware");


// =========================
// CREATE CONTEST
// =========================

router.post(
    "/",
    verifyToken,
    contestController.createContest
);


// =========================
// GET ALL CONTESTS
// =========================

router.get(
    "/",
    verifyToken,
    contestController.getAllContests
);


// =========================
// GET CONTEST BY ID
// =========================

router.get(
    "/:id",
    verifyToken,
    contestController.getContestById
);


// =========================
// UPDATE CONTEST
// =========================

router.put(
    "/:id",
    verifyToken,
    contestController.updateContest
);


// =========================
// DELETE CONTEST
// =========================

router.delete(
    "/:id",
    verifyToken,
    contestController.deleteContest
);


console.log("Contest Routes Loaded");


module.exports = router;