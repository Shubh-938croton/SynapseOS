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

const getTaskById = (req, res) => {

    const id = req.params.id;

    taskModel.getTaskById(id, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to fetch task",
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json(results[0]);

    });

};

module.exports = {
    getAllTasks,
    createTask,
    getTaskById
};