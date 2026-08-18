const db = require("../config/database");

// =======================================
// CREATE STUDY SESSION
// =======================================

const createStudySession = (
    userId,
    subjectId,
    topic,
    startTime,
    endTime,
    durationMinutes,
    sessionNotes,
    callback
) => {

    const sql = `
        INSERT INTO study_sessions
        (
            user_id,
            subject_id,
            topic,
            start_time,
            end_time,
            duration_minutes,
            session_notes
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        userId,
        subjectId,
        topic,
        startTime,
        endTime,
        durationMinutes,
        sessionNotes || null
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            return callback(err, null);
        }

        return callback(null, result);

    });
};


// =======================================
// GET ALL STUDY SESSIONS
// =======================================

const getAllStudySessions = (
    userId,
    callback
) => {

    const sql = `
        SELECT
            ss.session_id,
            ss.user_id,
            ss.subject_id,
            s.subject_name,
            ss.topic,
            ss.start_time,
            ss.end_time,
            ss.duration_minutes,
            ss.session_notes,
            ss.created_at
        FROM study_sessions ss

        LEFT JOIN subjects s
            ON ss.subject_id = s.subject_id

        WHERE ss.user_id = ?

        ORDER BY ss.start_time DESC
    `;

    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            return callback(null, results);

        }
    );
};


// =======================================
// GET STUDY SESSION BY ID
// =======================================

const getStudySessionById = (
    userId,
    sessionId,
    callback
) => {

    const sql = `
        SELECT
            ss.session_id,
            ss.user_id,
            ss.subject_id,
            s.subject_name,
            ss.topic,
            ss.start_time,
            ss.end_time,
            ss.duration_minutes,
            ss.session_notes,
            ss.created_at
        FROM study_sessions ss

        LEFT JOIN subjects s
            ON ss.subject_id = s.subject_id

        WHERE
            ss.session_id = ?
            AND ss.user_id = ?
    `;

    db.query(
        sql,
        [sessionId, userId],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            return callback(null, results);

        }
    );
};


// =======================================
// UPDATE STUDY SESSION
// =======================================

const updateStudySession = (
    userId,
    sessionId,
    subjectId,
    topic,
    startTime,
    endTime,
    durationMinutes,
    sessionNotes,
    callback
) => {

    const sql = `
        UPDATE study_sessions

        SET
            subject_id = ?,
            topic = ?,
            start_time = ?,
            end_time = ?,
            duration_minutes = ?,
            session_notes = ?

        WHERE
            session_id = ?
            AND user_id = ?
    `;

    const values = [
        subjectId,
        topic,
        startTime,
        endTime,
        durationMinutes,
        sessionNotes || null,
        sessionId,
        userId
    ];

    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            return callback(null, result);

        }
    );
};


// =======================================
// DELETE STUDY SESSION
// =======================================

const deleteStudySession = (
    userId,
    sessionId,
    callback
) => {

    const sql = `
        DELETE FROM study_sessions

        WHERE
            session_id = ?
            AND user_id = ?
    `;

    db.query(
        sql,
        [sessionId, userId],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            return callback(null, result);

        }
    );
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