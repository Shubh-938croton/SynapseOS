const db = require("../config/database");

// ===============================
// Create Study Session
// ===============================
const createStudySession = (session, callback) => {

    const query = `
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

    db.query(
        query,
        [
            session.user_id,
            session.subject_id,
            session.topic,
            session.start_time,
            session.end_time,
            session.duration_minutes,
            session.session_notes
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// ===============================
// Get All Study Sessions
// ===============================
const getAllStudySessions = (userId, callback) => {

    const query = `
        SELECT
            ss.*,
            s.subject_name
        FROM study_sessions ss
        INNER JOIN subjects s
            ON ss.subject_id = s.subject_id
        WHERE ss.user_id = ?
        ORDER BY ss.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// ===============================
// Get Study Session By ID
// ===============================
const getStudySessionById = (userId, sessionId, callback) => {

    const query = `
        SELECT
            ss.*,
            s.subject_name
        FROM study_sessions ss
        INNER JOIN subjects s
            ON ss.subject_id = s.subject_id
        WHERE ss.session_id = ?
        AND ss.user_id = ?
    `;

    db.query(query, [sessionId, userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// ===============================
// Update Study Session
// ===============================
const updateStudySession = (session, callback) => {

    const query = `
        UPDATE study_sessions
        SET
            subject_id = ?,
            topic = ?,
            start_time = ?,
            end_time = ?,
            duration_minutes = ?,
            session_notes = ?
        WHERE session_id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            session.subject_id,
            session.topic,
            session.start_time,
            session.end_time,
            session.duration_minutes,
            session.session_notes,
            session.session_id,
            session.user_id
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// ===============================
// Delete Study Session
// ===============================
const deleteStudySession = (userId, sessionId, callback) => {

    const query = `
        DELETE FROM study_sessions
        WHERE session_id = ?
        AND user_id = ?
    `;

    db.query(query, [sessionId, userId], (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};

module.exports = {
    createStudySession,
    getAllStudySessions,
    getStudySessionById,
    updateStudySession,
    deleteStudySession
};