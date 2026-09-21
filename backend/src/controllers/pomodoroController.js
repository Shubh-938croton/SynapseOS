const pomodoroModel = require("../models/pomodoroModel");
const { recordEvent, EVENT_TYPES, ENTITY_TYPES } = require("../services/activityEventService");

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


        if (end.getTime() <= start.getTime()) {

            return res.status(400).json({
                message: "End time must be after start time"
            });

        }


        // =======================================
        // Calculate duration
        // =======================================

        const calculatedDuration = Math.round(
            (end.getTime() - start.getTime()) / (1000 * 60)
        );

        const duration_minutes =
            req.body.duration_minutes && Number(req.body.duration_minutes) > 0
                ? Number(req.body.duration_minutes)
                : Math.max(1, calculatedDuration);


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

            started_at: start,

            ended_at: end

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
                        message: "Failed to create Pomodoro session"
                    });

                }


                // Record Pomodoro activity event
                if (session.session_status === "Completed") {
                    recordEvent({
                        userId: user_id,
                        eventType: EVENT_TYPES.POMODORO_COMPLETED,
                        entityType: ENTITY_TYPES.POMODORO_SESSION,
                        entityId: result.insertId,
                        metadata: {
                            duration_minutes: session.duration_minutes,
                            break_minutes: session.break_minutes,
                            subject_id: session.subject_id,
                            task_id: session.task_id
                        }
                    });
                } else if (session.session_status === "Interrupted") {
                    recordEvent({
                        userId: user_id,
                        eventType: EVENT_TYPES.POMODORO_ABANDONED,
                        entityType: ENTITY_TYPES.POMODORO_SESSION,
                        entityId: result.insertId,
                        metadata: {
                            duration_minutes: session.duration_minutes,
                            break_minutes: session.break_minutes,
                            session_status: "Interrupted",
                            subject_id: session.subject_id,
                            task_id: session.task_id
                        }
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
            message: "Internal server error"
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
                        message: "Failed to fetch Pomodoro sessions"
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

        console.error("Get all Pomodoro sessions controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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
                        message: "Failed to fetch Pomodoro session"
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

        console.error("Get Pomodoro session by ID controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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


        if (end.getTime() <= start.getTime()) {

            return res.status(400).json({

                message:
                    "End time must be after start time"

            });

        }


        // =======================================
        // Calculate duration
        // =======================================

        const calculatedDuration = Math.round(
            (end.getTime() - start.getTime()) / (1000 * 60)
        );

        const duration_minutes =
            req.body.duration_minutes && Number(req.body.duration_minutes) > 0
                ? Number(req.body.duration_minutes)
                : Math.max(1, calculatedDuration);


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

            started_at: start,

            ended_at: end

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
                        message: "Failed to update Pomodoro session"
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
            message: "Internal server error"
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
                        message: "Failed to delete Pomodoro session"
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


                // Record POMODORO_DELETED event
                recordEvent({
                    userId: userId,
                    eventType: EVENT_TYPES.POMODORO_DELETED,
                    entityType: ENTITY_TYPES.POMODORO_SESSION,
                    entityId: Number(sessionId)
                });

                return res.status(200).json({

                    message:
                        "Pomodoro session deleted successfully"

                });

            }
        );

    } catch (error) {

        console.error("Delete Pomodoro session controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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