const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

// Read
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);

// Create
router.post("/", taskController.createTask);

//Update
router.put("/:id", taskController.updateTask);

// // Delete
router.delete("/:id", taskController.deleteTask);
console.log("Task Routes Loaded");

module.exports = router;