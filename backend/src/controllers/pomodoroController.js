const pomodoroModel = require("../models/pomodoroModel");

// =======================================
// Create Pomodoro Session
// =======================================

const createPomodoroSession = (req, res) => {

    try {

        const user_id = req.user.user_id;

        const {
            subject_id,
            task_id,
            break_minutes,
            session_status,
            started_at,
            ended_at
        } = req.body;


        // =======================================
        // Validate timestamps
        // =======================================

        if (!started_at || !ended_at) {

            return res.status(400).json({
                message: "Start time and end time are required"
            });

        }


        const start = new Date(started_at);
        const end = new Date(ended_at);


        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {

            return res.status(400).json({
                message: "Invalid start time or end time"
            });

        }


        // =======================================
        // Calculate duration
        // =======================================

        const duration_minutes = Math.floor(
            (end - start) / (1000 * 60)
        );


        if (duration_minutes <= 0) {

            return res.status(400).json({
                message: "End time must be after start time"
            });

        }


        // =======================================
        // Validate break minutes
        // =======================================

        const breakValue =
            break_minutes === undefined ||
            break_minutes === null ||
            break_minutes === ""
                ? 5
                : Number(break_minutes);


        if (
            !Number.isFinite(breakValue) ||
            breakValue < 0
        ) {

            return res.status(400).json({
                message:
                    "Break minutes must be a valid non-negative number"
            });

        }


        // =======================================
        // Validate session status
        // =======================================

        const allowedStatuses = [
            "Completed",
            "Interrupted"
        ];


        const status =
            session_status || "Completed";


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid session status"
            });

        }


        // =======================================
        // Prepare session
        // =======================================

        const session = {

            user_id,

            subject_id:
                subject_id || null,

            task_id:
                task_id || null,

            duration_minutes,

            break_minutes:
                breakValue,

            session_status:
                status,

            started_at,

            ended_at

        };


        // =======================================
        // Save session
        // =======================================

        pomodoroModel.createPomodoroSession(
            session,
            (err, result) => {

                if (err) {

                    console.error(
                        "Create Pomodoro session error:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

                    });

                }


                return res.status(201).json({

                    message:
                        "Pomodoro session created successfully",

                    session_id:
                        result.insertId,

                    duration_minutes:
                        duration_minutes

                });

            }
        );

    } catch (error) {

        console.error(
            "Create Pomodoro session controller error:",
            error
        );

        return res.status(500).json({

            message:
                "Internal server error",

            error:
                error.message

        });

    }

};


// =======================================
// Get All Pomodoro Sessions
// =======================================

const getAllPomodoroSessions = (req, res) => {

    try {

        const userId =
            req.user.user_id;


        pomodoroModel.getAllPomodoroSessions(
            userId,
            (err, sessions) => {

                if (err) {

                    console.error(
                        "Get Pomodoro sessions error:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

                    });

                }


                return res.status(200).json({

                    message:
                        "Pomodoro sessions fetched successfully",

                    sessions:
                        sessions || []

                });

            }
        );

    } catch (error) {

        return res.status(500).json({

            message:
                "Internal server error",

            error:
                error.message

        });

    }

};


// =======================================
// Get Pomodoro Session By ID
// =======================================

const getPomodoroSessionById = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const sessionId =
            req.params.id;


        pomodoroModel.getPomodoroSessionById(
            userId,
            sessionId,
            (err, sessions) => {

                if (err) {

                    console.error(
                        "Get Pomodoro session error:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

                    });

                }


                if (
                    !sessions ||
                    sessions.length === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Pomodoro session not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Pomodoro session fetched successfully",

                    session:
                        sessions[0]

                });

            }
        );

    } catch (error) {

        return res.status(500).json({

            message:
                "Internal server error",

            error:
                error.message

        });

    }

};


// =======================================
// Update Pomodoro Session
// =======================================

const updatePomodoroSession = (req, res) => {

    try {

        const user_id =
            req.user.user_id;

        const session_id =
            req.params.id;


        const {
            subject_id,
            task_id,
            break_minutes,
            session_status,
            started_at,
            ended_at
        } = req.body;


        // =======================================
        // Validate timestamps
        // =======================================

        if (!started_at || !ended_at) {

            return res.status(400).json({

                message:
                    "Start time and end time are required"

            });

        }


        const start =
            new Date(started_at);

        const end =
            new Date(ended_at);


        if (
            Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())
        ) {

            return res.status(400).json({

                message:
                    "Invalid start time or end time"

            });

        }


        // =======================================
        // Calculate duration
        // =======================================

        const duration_minutes =
            Math.floor(
                (end - start) /
                (1000 * 60)
            );


        if (duration_minutes <= 0) {

            return res.status(400).json({

                message:
                    "End time must be after start time"

            });

        }


        // =======================================
        // Validate break minutes
        // =======================================

        const breakValue =
            break_minutes === undefined ||
            break_minutes === null ||
            break_minutes === ""
                ? 5
                : Number(break_minutes);


        if (
            !Number.isFinite(breakValue) ||
            breakValue < 0
        ) {

            return res.status(400).json({

                message:
                    "Break minutes must be a valid non-negative number"

            });

        }


        // =======================================
        // Validate session status
        // =======================================

        const allowedStatuses = [
            "Completed",
            "Interrupted"
        ];


        const status =
            session_status || "Completed";


        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({

                message:
                    "Invalid session status"

            });

        }


        // =======================================
        // Prepare session
        // =======================================

        const session = {

            session_id,

            user_id,

            subject_id:
                subject_id || null,

            task_id:
                task_id || null,

            duration_minutes,

            break_minutes:
                breakValue,

            session_status:
                status,

            started_at,

            ended_at

        };


        // =======================================
        // Update database
        // =======================================

        pomodoroModel.updatePomodoroSession(
            session,
            (err, result) => {

                if (err) {

                    console.error(
                        "Update Pomodoro session error:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Pomodoro session not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Pomodoro session updated successfully"

                });

            }
        );

    } catch (error) {

        console.error(
            "Update Pomodoro session controller error:",
            error
        );

        return res.status(500).json({

            message:
                "Internal server error",

            error:
                error.message

        });

    }

};


// =======================================
// Delete Pomodoro Session
// =======================================

const deletePomodoroSession = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const sessionId =
            req.params.id;


        pomodoroModel.deletePomodoroSession(
            userId,
            sessionId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Delete Pomodoro session error:",
                        err
                    );

                    return res.status(500).json({

                        message:
                            "Database error",

                        error:
                            err.message

                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Pomodoro session not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Pomodoro session deleted successfully"

                });

            }
        );

    } catch (error) {

        return res.status(500).json({

            message:
                "Internal server error",

            error:
                error.message

        });

    }

};


// =======================================
// EXPORTS
// =======================================

module.exports = {

    createPomodoroSession,

    getAllPomodoroSessions,

    getPomodoroSessionById,

    updatePomodoroSession,

    deletePomodoroSession

};