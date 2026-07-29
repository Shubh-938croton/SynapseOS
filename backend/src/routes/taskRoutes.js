const express = require("express");

const router = express.Router();

const { getAllTasks } = require("../controllers/taskController");

router.get("/", getAllTasks);

module.exports = router;

