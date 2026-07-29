const tasks = require("../models/taskModel");

const getAllTasks = (req, res) => {
    res.status(200).json(tasks);
};

module.exports = {
    getAllTasks
};