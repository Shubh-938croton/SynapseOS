const taskModel = require("../models/taskModel");

// Get all tasks
const getAllTasks = (req, res) => {

    const user_id = req.user.user_id;

    taskModel.getAllTasks(user_id, (err, tasks) => {

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

    // Get user_id from the JWT
    const user_id = req.user.user_id;

    // Get remaining fields from the request body
    const {
        subject_id,
        title,
        description,
        priority,
        status,
        due_date
    } = req.body;

    const task = {
        user_id,
        subject_id,
        title,
        description,
        priority,
        status,
        due_date
    };

    taskModel.createTask(task, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to create task",
                error: err.message
            });
        }

        return res.status(201).json({
            message: "Task created successfully",
            taskId: result.insertId
        });

    });

};

const getTaskById = (req, res) => {

    const user_id = req.user.user_id;
    const id = req.params.id;

    taskModel.getTaskById(user_id, id, (err, results) => {

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



const updateTask = (req, res) => {

    const user_id = req.user.user_id;
    const id = req.params.id;
    const task = req.body;

    taskModel.updateTask(user_id, id, task, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to update task",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task updated successfully"
        });

    });

};

const deleteTask = (req, res) => {

    const user_id = req.user.user_id;
    const id = req.params.id;

    taskModel.deleteTask(user_id, id, (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Failed to delete task",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        return res.status(200).json({
            message: "Task deleted successfully"
        });

    });

};

module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
};