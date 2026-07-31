const taskModel = require("../models/taskModel");

// Get all tasks
const getAllTasks = (req, res) => {

    taskModel.getAllTasks((err, tasks) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch tasks",
                error: err.message
            });
        }

        res.status(200).json(tasks);
    });

};


const createTask = (req, res) => {

    const task = req.body;

    taskModel.createTask(task, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to create task"
            });
        }

        res.status(201).json({
            message: "Task created successfully",
            taskId: result.insertId
        });

    });

};

module.exports = {
    getAllTasks,
    createTask
};