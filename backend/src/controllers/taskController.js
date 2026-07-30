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

module.exports = {
    getAllTasks
};