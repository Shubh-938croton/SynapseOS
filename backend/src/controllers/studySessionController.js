const studySessionModel = require("../models/studySessionModel");
const { recordEvent, EVENT_TYPES, ENTITY_TYPES } = require("../services/activityEventService");

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

        if (!subject_id || !topic || !start_time || !end_time) {
            return res.status(400).json({
                message: "Subject, topic, start time, and end time are required"
            });
        }

        const start = new Date(start_time);
        const end = new Date(end_time);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid date format for start time or end time"
            });
        }

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
                console.error("Create study session database error:", err);
                return res.status(500).json({
                    message: "Failed to create study session"
                });
            }

            // Record STUDY_SESSION_COMPLETED event
            recordEvent({
                userId: user_id,
                eventType: EVENT_TYPES.STUDY_SESSION_COMPLETED,
                entityType: ENTITY_TYPES.STUDY_SESSION,
                entityId: result.insertId,
                metadata: {
                    subject_id: session.subject_id,
                    topic: session.topic,
                    duration_minutes: session.duration_minutes,
                    start_time: session.start_time,
                    end_time: session.end_time
                }
            });

            return res.status(201).json({
                message: "Study session created successfully",
                session_id: result.insertId
            });

        });

    } catch (error) {

        console.error("Create study session unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
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
                console.error("Get all study sessions database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch study sessions"
                });
            }

            return res.status(200).json({
                message: "Study sessions fetched successfully",
                sessions: sessions || []
            });

        });

    } catch (error) {

        console.error("Get all study sessions unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
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
                console.error("Get study session by ID database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch study session"
                });
            }

            if (!sessions || sessions.length === 0) {
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

        console.error("Get study session by ID unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
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


        if (!start_time || !end_time) {
            return res.status(400).json({
                message: "Start time and end time are required"
            });
        }

        const start = new Date(start_time);
        const end = new Date(end_time);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                message: "Invalid date format for start time or end time"
            });
        }

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


        studySessionModel.updateStudySession(
            session,
            (err, result) => {

                if (err) {

                    console.error(
                        "Update study session DB error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to update study session"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Study session not found"
                    });

                }


                return res.status(200).json({

                    message:
                        "Study session updated successfully"

                });

            }
        );

    } catch (error) {

        console.error(
            "Update study session error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
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
                console.error("Delete study session database error:", err);
                return res.status(500).json({
                    message: "Failed to delete study session"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Study session not found"
                });
            }

            // Record STUDY_SESSION_DELETED event
            recordEvent({
                userId: userId,
                eventType: EVENT_TYPES.STUDY_SESSION_DELETED,
                entityType: ENTITY_TYPES.STUDY_SESSION,
                entityId: Number(sessionId)
            });

            return res.status(200).json({
                message: "Study session deleted successfully"
            });

        });

    } catch (error) {

        console.error("Delete study session unexpected error:", error);
        return res.status(500).json({
            message: "Internal server error"
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