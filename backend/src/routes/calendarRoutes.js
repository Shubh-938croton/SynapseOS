const express = require("express");
const router = express.Router();

const calendarController = require("../controllers/calendarController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, calendarController.createEvent);
router.get("/", verifyToken, calendarController.getAllEvents);
router.get("/:id", verifyToken, calendarController.getEventById);
router.put("/:id", verifyToken, calendarController.updateEvent);
router.delete("/:id", verifyToken, calendarController.deleteEvent);

module.exports = router;