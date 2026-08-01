const express = require("express");
const router = express.Router();


const taskController = require("../controllers/taskController");
const verifyToken = require("../middleware/authMiddleware");

// Read
router.get("/",verifyToken, taskController.getAllTasks);
router.get("/:id",verifyToken, taskController.getTaskById);

// Create
router.post("/",verifyToken, taskController.createTask);

//Update
router.put("/:id",verifyToken, taskController.updateTask);

// // Delete
router.delete("/:id",verifyToken, taskController.deleteTask);
console.log("Task Routes Loaded");

module.exports = router;