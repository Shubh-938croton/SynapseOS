const db = require("../config/database");

// =======================================
// Create Pomodoro Session
// =======================================
const createPomodoroSession = (session, callback) => {

    const query = `
        INSERT INTO pomodoro_sessions
        (
            user_id,
            subject_id,
            task_id,
            duration_minutes,
            break_minutes,
            session_status,
            started_at,
            ended_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            session.user_id,
            session.subject_id,
            session.task_id,
            session.duration_minutes,
            session.break_minutes,
            session.session_status,
            session.started_at,
            session.ended_at
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// =======================================
// Get All Pomodoro Sessions
// =======================================
const getAllPomodoroSessions = (userId, callback) => {

    const query = `
        SELECT
            ps.*,
            s.subject_name,
            t.title AS task_title
        FROM pomodoro_sessions ps
        LEFT JOIN subjects s
            ON ps.subject_id = s.subject_id
        LEFT JOIN tasks t
            ON ps.task_id = t.task_id
        WHERE ps.user_id = ?
        ORDER BY ps.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// =======================================
// Get Pomodoro Session By ID
// =======================================
const getPomodoroSessionById = (userId, sessionId, callback) => {

    const query = `
        SELECT
            ps.*,
            s.subject_name,
            t.title AS task_title
        FROM pomodoro_sessions ps
        LEFT JOIN subjects s
            ON ps.subject_id = s.subject_id
        LEFT JOIN tasks t
            ON ps.task_id = t.task_id
        WHERE ps.session_id = ?
        AND ps.user_id = ?
    `;

    db.query(query, [sessionId, userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// =======================================
// Update Pomodoro Session
// =======================================
const updatePomodoroSession = (session, callback) => {

    const query = `
        UPDATE pomodoro_sessions
        SET
            subject_id = ?,
            task_id = ?,
            duration_minutes = ?,
            break_minutes = ?,
            session_status = ?,
            started_at = ?,
            ended_at = ?
        WHERE session_id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            session.subject_id,
            session.task_id,
            session.duration_minutes,
            session.break_minutes,
            session.session_status,
            session.started_at,
            session.ended_at,
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

// =======================================
// Delete Pomodoro Session
// =======================================
const deletePomodoroSession = (userId, sessionId, callback) => {

    const query = `
        DELETE FROM pomodoro_sessions
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
    createPomodoroSession,
    getAllPomodoroSessions,
    getPomodoroSessionById,
    updatePomodoroSession,
    deletePomodoroSession
};