const studySessionModel = require("../models/studySessionModel");

// =======================================
// Create Study Session
// =======================================
const createStudySession = (req, res) => {

    try {

        const user_id = req.user.user_id;

        const {
            subject_id,
            topic,
            start_time,
            end_time,
            session_notes
        } = req.body;

        const start = new Date(start_time);
const end = new Date(end_time);
const duration_minutes = Math.floor((end - start) / (1000 * 60));

if (duration_minutes <= 0) {
    return res.status(400).json({
        message: "End time must be after start time"
    });
}

        const session = {
            user_id,
            subject_id,
            topic,
            start_time,
            end_time,
            duration_minutes,
            session_notes
        };

        studySessionModel.createStudySession(session, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(201).json({
                message: "Study session created successfully",
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
// Get All Study Sessions
// =======================================
const getAllStudySessions = (req, res) => {

    try {

        const userId = req.user.user_id;

        studySessionModel.getAllStudySessions(userId, (err, sessions) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                message: "Study sessions fetched successfully",
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
// Get Study Session By ID
// =======================================
const getStudySessionById = (req, res) => {

    try {

        const userId = req.user.user_id;
        const sessionId = req.params.id;

        studySessionModel.getStudySessionById(userId, sessionId, (err, sessions) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (sessions.length === 0) {
                return res.status(404).json({
                    message: "Study session not found"
                });
            }

            return res.status(200).json({
                message: "Study session fetched successfully",
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
// Update Study Session
// =======================================
const updateStudySession = (req, res) => {

    try {

        const user_id = req.user.user_id;
        const session_id = req.params.id;

        const {
            subject_id,
            topic,
            start_time,
            end_time,
            session_notes
        } = req.body;

        // Calculate duration automatically
        const start = new Date(start_time);
        const end = new Date(end_time);

        const duration_minutes = Math.floor((end - start) / (1000 * 60));

        // Validate duration
        if (duration_minutes <= 0) {
            return res.status(400).json({
                message: "End time must be after start time"
            });
        }

        const session = {
            session_id,
            user_id,
            subject_id,
            topic,
            start_time,
            end_time,
            duration_minutes,
            session_notes
        };

        studySessionModel.updateStudySession(session, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Study session not found"
                });
            }

            return res.status(200).json({
                message: "Study session updated successfully"
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
// Delete Study Session
// =======================================
const deleteStudySession = (req, res) => {

    try {

        const userId = req.user.user_id;
        const sessionId = req.params.id;

        studySessionModel.deleteStudySession(userId, sessionId, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Study session not found"
                });
            }

            return res.status(200).json({
                message: "Study session deleted successfully"
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
    createStudySession,
    getAllStudySessions,
    getStudySessionById,
    updateStudySession,
    deleteStudySession
};