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

        const start = new Date(started_at);
        const end = new Date(ended_at);

        const duration_minutes = Math.floor((end - start) / (1000 * 60));

        if (duration_minutes <= 0) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        if (break_minutes < 0) {
            return res.status(400).json({
                message: "Break minutes cannot be negative"
            });
        }

        const session = {
            user_id,
            subject_id,
            task_id,
            duration_minutes,
            break_minutes,
            session_status,
            started_at,
            ended_at
        };

        pomodoroModel.createPomodoroSession(session, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(201).json({
                message: "Pomodoro session created successfully",
                session_id: result.insertId
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// =======================================
// Get All Pomodoro Sessions
// =======================================
const getAllPomodoroSessions = (req, res) => {

    try {

        const userId = req.user.user_id;

        pomodoroModel.getAllPomodoroSessions(userId, (err, sessions) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                message: "Pomodoro sessions fetched successfully",
                sessions
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// =======================================
// Get Pomodoro Session By ID
// =======================================
const getPomodoroSessionById = (req, res) => {

    try {

        const userId = req.user.user_id;
        const sessionId = req.params.id;

        pomodoroModel.getPomodoroSessionById(userId, sessionId, (err, sessions) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (sessions.length === 0) {
                return res.status(404).json({
                    message: "Pomodoro session not found"
                });
            }

            return res.status(200).json({
                message: "Pomodoro session fetched successfully",
                session: sessions[0]
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// =======================================
// Update Pomodoro Session
// =======================================
const updatePomodoroSession = (req, res) => {

    try {

        const user_id = req.user.user_id;
        const session_id = req.params.id;

        const {
            subject_id,
            task_id,
            break_minutes,
            session_status,
            started_at,
            ended_at
        } = req.body;

        const start = new Date(started_at);
        const end = new Date(ended_at);

        const duration_minutes = Math.floor((end - start) / (1000 * 60));

        if (duration_minutes <= 0) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        if (break_minutes < 0) {
            return res.status(400).json({
                message: "Break minutes cannot be negative"
            });
        }

        const session = {
            session_id,
            user_id,
            subject_id,
            task_id,
            duration_minutes,
            break_minutes,
            session_status,
            started_at,
            ended_at
        };

        pomodoroModel.updatePomodoroSession(session, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Pomodoro session not found"
                });
            }

            return res.status(200).json({
                message: "Pomodoro session updated successfully"
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// =======================================
// Delete Pomodoro Session
// =======================================
const deletePomodoroSession = (req, res) => {

    try {

        const userId = req.user.user_id;
        const sessionId = req.params.id;

        pomodoroModel.deletePomodoroSession(userId, sessionId, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Pomodoro session not found"
                });
            }

            return res.status(200).json({
                message: "Pomodoro session deleted successfully"
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
    createPomodoroSession,
    getAllPomodoroSessions,
    getPomodoroSessionById,
    updatePomodoroSession,
    deletePomodoroSession
};