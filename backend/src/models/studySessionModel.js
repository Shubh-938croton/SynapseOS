const studySessionModel = require("../models/studySessionModel");


// =======================================
// CREATE STUDY SESSION
// =======================================

const createStudySession = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            subject_id,
            topic,
            start_time,
            end_time,
            session_notes
        } = req.body;


        // =======================================
        // VALIDATION
        // =======================================

        if (
            !subject_id ||
            !topic ||
            !start_time ||
            !end_time
        ) {

            return res.status(400).json({
                message: "Subject, topic, start time and end time are required"
            });

        }


        // =======================================
        // CALCULATE DURATION
        // =======================================

        const start = new Date(start_time);
        const end = new Date(end_time);

        const durationMinutes =
            Math.floor(
                (end - start) / (1000 * 60)
            );


        // =======================================
        // VALIDATE DURATION
        // =======================================

        if (durationMinutes <= 0) {

            return res.status(400).json({
                message: "End time must be after start time"
            });

        }


        if (durationMinutes > 1440) {

            return res.status(400).json({
                message: "Study session cannot exceed 24 hours"
            });

        }


        // =======================================
        // CREATE SESSION
        // =======================================

        studySessionModel.createStudySession(

            userId,
            subject_id,
            topic,
            start_time,
            end_time,
            durationMinutes,
            session_notes,

            (err, result) => {

                if (err) {

                    console.error(
                        "Create Study Session Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to create study session",
                        error: err.message
                    });

                }


                return res.status(201).json({

                    message: "Study session created successfully",

                    session_id:
                        result.insertId

                });

            }

        );

    } catch (err) {

        console.error(
            "Create Study Session Controller Error:",
            err
        );

        return res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

};


// =======================================
// GET ALL STUDY SESSIONS
// =======================================

const getAllStudySessions = async (req, res) => {

    try {

        const userId = req.user.user_id;


        studySessionModel.getAllStudySessions(

            userId,

            (err, results) => {

                if (err) {

                    console.error(
                        "Get Study Sessions Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch study sessions",
                        error: err.message
                    });

                }


                return res.status(200).json({

                    message:
                        "Study sessions fetched successfully",

                    sessions: results

                });

            }

        );

    } catch (err) {

        console.error(
            "Get Study Sessions Controller Error:",
            err
        );

        return res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

};


// =======================================
// GET STUDY SESSION BY ID
// =======================================

const getStudySessionById = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const sessionId = req.params.id;


        studySessionModel.getStudySessionById(

            userId,
            sessionId,

            (err, result) => {

                if (err) {

                    console.error(
                        "Get Study Session Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch study session",
                        error: err.message
                    });

                }


                if (!result || result.length === 0) {

                    return res.status(404).json({
                        message: "Study session not found"
                    });

                }


                return res.status(200).json({

                    message:
                        "Study session fetched successfully",

                    session: result[0]

                });

            }

        );

    } catch (err) {

        console.error(
            "Get Study Session By ID Controller Error:",
            err
        );

        return res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

};


// =======================================
// UPDATE STUDY SESSION
// =======================================

const updateStudySession = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const sessionId = req.params.id;


        const {
            subject_id,
            topic,
            start_time,
            end_time,
            session_notes
        } = req.body;


        // =======================================
        // VALIDATION
        // =======================================

        if (
            !subject_id ||
            !topic ||
            !start_time ||
            !end_time
        ) {

            return res.status(400).json({
                message: "Subject, topic, start time and end time are required"
            });

        }


        // =======================================
        // RECALCULATE DURATION
        // =======================================

        const start = new Date(start_time);
        const end = new Date(end_time);

        const durationMinutes =
            Math.floor(
                (end - start) / (1000 * 60)
            );


        // =======================================
        // VALIDATE DURATION
        // =======================================

        if (durationMinutes <= 0) {

            return res.status(400).json({
                message: "End time must be after start time"
            });

        }


        if (durationMinutes > 1440) {

            return res.status(400).json({
                message: "Study session cannot exceed 24 hours"
            });

        }


        // =======================================
        // UPDATE SESSION
        // =======================================

        studySessionModel.updateStudySession(

            userId,
            sessionId,
            subject_id,
            topic,
            start_time,
            end_time,
            durationMinutes,
            session_notes,

            (err, result) => {

                if (err) {

                    console.error(
                        "Update Study Session Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to update study session",
                        error: err.message
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Study session not found"
                    });

                }


                return res.status(200).json({

                    message:
                        "Study session updated successfully"

                });

            }

        );

    } catch (err) {

        console.error(
            "Update Study Session Controller Error:",
            err
        );

        return res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

};


// =======================================
// DELETE STUDY SESSION
// =======================================

const deleteStudySession = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const sessionId = req.params.id;


        studySessionModel.deleteStudySession(

            userId,
            sessionId,

            (err, result) => {

                if (err) {

                    console.error(
                        "Delete Study Session Error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to delete study session",
                        error: err.message
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message: "Study session not found"
                    });

                }


                return res.status(200).json({

                    message:
                        "Study session deleted successfully"

                });

            }

        );

    } catch (err) {

        console.error(
            "Delete Study Session Controller Error:",
            err
        );

        return res.status(500).json({
            message: "Server error",
            error: err.message
        });

    }

};


// =======================================
// EXPORT
// =======================================

module.exports = {

    createStudySession,
    getAllStudySessions,
    getStudySessionById,
    updateStudySession,
    deleteStudySession

};