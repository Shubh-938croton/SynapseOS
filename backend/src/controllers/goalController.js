const goalModel = require("../models/goalModel");

// Create Goal
const createGoal = (req, res) => {

    try {

        const user_id = req.user.user_id;

        const {
            title,
            description,
            target_date,
            progress_percentage,
            status
        } = req.body;

        // Validation
        if (
            progress_percentage < 0 ||
            progress_percentage > 100
        ) {
            return res.status(400).json({
                message: "Progress percentage must be between 0 and 100"
            });
        }

        const goal = {
            user_id,
            title,
            description,
            target_date,
            progress_percentage,
            status
        };

        goalModel.createGoal(goal, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(201).json({
                message: "Goal created successfully",
                goal_id: result.insertId
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Get All Goals
const getAllGoals = (req, res) => {

    try {

        const userId = req.user.user_id;

        goalModel.getAllGoals(userId, (err, goals) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                message: "Goals fetched successfully",
                goals
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};


// Get Goal By ID
const getGoalById = (req, res) => {

    try {

        const userId = req.user.user_id;
        const goalId = req.params.id;

        goalModel.getGoalById(userId, goalId, (err, goals) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (goals.length === 0) {
                return res.status(404).json({
                    message: "Goal not found"
                });
            }

            return res.status(200).json({
                message: "Goal fetched successfully",
                goal: goals[0]
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};


// Update Goal
const updateGoal = (req, res) => {

    try {

        const user_id = req.user.user_id;
        const goal_id = req.params.id;

        const {
            title,
            description,
            target_date,
            progress_percentage,
            status
        } = req.body;

        // Validation
        if (progress_percentage < 0 || progress_percentage > 100) {
            return res.status(400).json({
                message: "Progress percentage must be between 0 and 100"
            });
        }

        const goal = {
            goal_id,
            user_id,
            title,
            description,
            target_date,
            progress_percentage,
            status
        };

        goalModel.updateGoal(goal, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Goal not found"
                });
            }

            return res.status(200).json({
                message: "Goal updated successfully"
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};


// Delete Goal
const deleteGoal = (req, res) => {

    try {

        const userId = req.user.user_id;
        const goalId = req.params.id;

        goalModel.deleteGoal(userId, goalId, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Goal not found"
                });
            }

            return res.status(200).json({
                message: "Goal deleted successfully"
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

module.exports = {
    createGoal,
    getAllGoals,
    getGoalById,
    updateGoal,
    deleteGoal
};