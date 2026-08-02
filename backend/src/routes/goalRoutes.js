const express = require("express");
const router = express.Router();

const goalController = require("../controllers/goalController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/", verifyToken, goalController.createGoal);
router.get("/", verifyToken, goalController.getAllGoals);
router.get("/:id", verifyToken, goalController.getGoalById);
router.put("/:id", verifyToken, goalController.updateGoal);
router.delete("/:id", verifyToken, goalController.deleteGoal);

module.exports = router;