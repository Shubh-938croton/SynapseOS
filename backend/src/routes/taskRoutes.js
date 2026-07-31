const express = require("express");
const router = express.Router();

const taskController = require("../controllers/taskController");

// GET all tasks
router.get("/", taskController.getAllTasks);

// POST create a task
router.post("/", taskController.createTask);


module.exports = router;