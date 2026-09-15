const goalModel = require("../models/goalModel");

// =====================================================
// CREATE GOAL
// =====================================================

const createGoal = (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            title,
            description,
            target_date,
            progress_percentage,
            status
        } = req.body;


        // =================================================
        // TITLE VALIDATION
        // =================================================

        if (!title || !title.trim()) {

            return res.status(400).json({
                message: "Goal title is required"
            });

        }


        // =================================================
        // PROGRESS
        // =================================================

        const progress =
            progress_percentage === undefined ||
            progress_percentage === null ||
            progress_percentage === ""
                ? 0
                : Number(progress_percentage);


        if (
            !Number.isInteger(progress) ||
            progress < 0 ||
            progress > 100
        ) {

            return res.status(400).json({
                message:
                    "Progress percentage must be an integer between 0 and 100"
            });

        }


        // =================================================
        // STATUS
        // =================================================

        let goalStatus =
            status || "Not Started";


        const validStatuses = [
            "Not Started",
            "In Progress",
            "Completed"
        ];


        if (!validStatuses.includes(goalStatus)) {

            return res.status(400).json({
                message: "Invalid goal status"
            });

        }


        // =================================================
        // AUTOMATIC STATUS
        // =================================================

        if (progress === 100) {

            goalStatus = "Completed";

        } else if (progress > 0) {

            goalStatus = "In Progress";

        }


        // =================================================
        // CREATE GOAL OBJECT
        // =================================================

        const goal = {

            user_id: userId,

            title: title.trim(),

            description:
                description?.trim() || null,

            target_date:
                target_date || null,

            progress_percentage:
                progress,

            status:
                goalStatus

        };


        // =================================================
        // DATABASE
        // =================================================

        goalModel.createGoal(
            goal,
            (err, result) => {

                if (err) {

                    console.error(
                        "Create goal database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to create goal"
                    });

                }


                return res.status(201).json({

                    message:
                        "Goal created successfully",

                    goal_id:
                        result.insertId

                });

            }
        );

    } catch (error) {

        console.error(
            "Create goal error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// GET ALL GOALS
// =====================================================

const getAllGoals = (req, res) => {

    try {

        const userId =
            req.user.user_id;


        goalModel.getAllGoals(
            userId,
            (err, goals) => {

                if (err) {

                    console.error(
                        "Get goals database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch goals"
                    });

                }


                return res.status(200).json({

                    message:
                        "Goals fetched successfully",

                    goals:
                        goals || []

                });

            }
        );

    } catch (error) {

        console.error(
            "Get all goals error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// GET GOAL BY ID
// =====================================================

const getGoalById = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const goalId =
            req.params.id;


        goalModel.getGoalById(
            userId,
            goalId,
            (err, goals) => {

                if (err) {

                    console.error(
                        "Get goal database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch goal"
                    });

                }


                if (
                    !goals ||
                    goals.length === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Goal not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Goal fetched successfully",

                    goal:
                        goals[0]

                });

            }
        );

    } catch (error) {

        console.error(
            "Get goal by ID error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// UPDATE GOAL
// =====================================================

const updateGoal = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const goalId =
            req.params.id;


        const {
            title,
            description,
            target_date,
            progress_percentage,
            status
        } = req.body;


        // =================================================
        // TITLE VALIDATION
        // =================================================

        if (!title || !title.trim()) {

            return res.status(400).json({

                message:
                    "Goal title is required"

            });

        }


        // =================================================
        // PROGRESS
        // =================================================

        const progress =
            progress_percentage === undefined ||
            progress_percentage === null ||
            progress_percentage === ""
                ? 0
                : Number(progress_percentage);


        if (
            !Number.isInteger(progress) ||
            progress < 0 ||
            progress > 100
        ) {

            return res.status(400).json({

                message:
                    "Progress percentage must be an integer between 0 and 100"

            });

        }


        // =================================================
        // STATUS
        // =================================================

        let goalStatus =
            status || "Not Started";


        const validStatuses = [
            "Not Started",
            "In Progress",
            "Completed"
        ];


        if (!validStatuses.includes(goalStatus)) {

            return res.status(400).json({

                message:
                    "Invalid goal status"

            });

        }


        // =================================================
        // AUTOMATIC STATUS
        // =================================================

        if (progress === 100) {

            goalStatus = "Completed";

        } else if (progress > 0) {

            goalStatus = "In Progress";

        }


        // =================================================
        // UPDATE OBJECT
        // =================================================

        const goal = {

            goal_id:
                goalId,

            user_id:
                userId,

            title:
                title.trim(),

            description:
                description?.trim() || null,

            target_date:
                target_date || null,

            progress_percentage:
                progress,

            status:
                goalStatus

        };


        // =================================================
        // DATABASE
        // =================================================

        goalModel.updateGoal(
            goal,
            (err, result) => {

                if (err) {

                    console.error(
                        "Update goal database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to update goal"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Goal not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Goal updated successfully"

                });

            }
        );

    } catch (error) {

        console.error(
            "Update goal error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// DELETE GOAL
// =====================================================

const deleteGoal = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const goalId =
            req.params.id;


        goalModel.deleteGoal(
            userId,
            goalId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Delete goal database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to delete goal"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Goal not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Goal deleted successfully"

                });

            }
        );

    } catch (error) {

        console.error(
            "Delete goal error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {

    createGoal,

    getAllGoals,

    getGoalById,

    updateGoal,

    deleteGoal

};