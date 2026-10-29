const db = require("../config/database");

// =======================================
// GET ALL ACTIVE USER IDS
// =======================================

const getAllUserIds = (callback) => {
    const query = `SELECT user_id FROM users ORDER BY user_id ASC`;
    db.query(query, (err, results) => {
        if (err) return callback(err, null);
        const userIds = results.map((r) => r.user_id);
        callback(null, userIds);
    });
};

// =======================================
// UPSERT AUTOMATION SUMMARY (IDEMPOTENT)
// =======================================

const upsertSummary = (userId, summaryType, periodStart, periodEnd, summaryData, callback) => {
    const jsonData = typeof summaryData === "string" ? summaryData : JSON.stringify(summaryData);

    const query = `
        INSERT INTO automation_summaries (
            user_id,
            summary_type,
            period_start,
            period_end,
            summary_data
        )
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
            summary_data = VALUES(summary_data),
            updated_at = CURRENT_TIMESTAMP
    `;

    db.query(query, [userId, summaryType, periodStart, periodEnd, jsonData], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

// =======================================
// GET SUMMARY BY DATE / PERIOD
// =======================================

const getSummary = (userId, summaryType, targetDate, callback) => {
    const query = `
        SELECT *
        FROM automation_summaries
        WHERE user_id = ?
          AND summary_type = ?
          AND period_start <= ?
          AND period_end >= ?
        ORDER BY period_start DESC
        LIMIT 1
    `;

    db.query(query, [userId, summaryType, targetDate, targetDate], (err, results) => {
        if (err) return callback(err, null);
        const row = results && results[0] ? results[0] : null;
        if (row && typeof row.summary_data === "string") {
            try {
                row.summary_data = JSON.parse(row.summary_data);
            } catch {
                // keep string if parse fails
            }
        }
        callback(null, row);
    });
};

// =======================================
// GET LATEST SUMMARY
// =======================================

const getLatestSummary = (userId, summaryType, callback) => {
    const query = `
        SELECT *
        FROM automation_summaries
        WHERE user_id = ?
          AND summary_type = ?
        ORDER BY period_end DESC
        LIMIT 1
    `;

    db.query(query, [userId, summaryType], (err, results) => {
        if (err) return callback(err, null);
        const row = results && results[0] ? results[0] : null;
        if (row && typeof row.summary_data === "string") {
            try {
                row.summary_data = JSON.parse(row.summary_data);
            } catch {
                // keep string if parse fails
            }
        }
        callback(null, row);
    });
};

// =======================================
// GET SUMMARY HISTORY
// =======================================

const getSummaryHistory = (userId, summaryType, limit = 10, callback) => {
    const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 50));

    const query = `
        SELECT *
        FROM automation_summaries
        WHERE user_id = ?
          AND summary_type = ?
        ORDER BY period_start DESC
        LIMIT ?
    `;

    db.query(query, [userId, summaryType, safeLimit], (err, results) => {
        if (err) return callback(err, null);
        const rows = (results || []).map((row) => {
            if (typeof row.summary_data === "string") {
                try {
                    row.summary_data = JSON.parse(row.summary_data);
                } catch {
                    // keep string
                }
            }
            return row;
        });
        callback(null, rows);
    });
};

// =======================================
// AUTOMATION RUN AUDIT TRACKING
// =======================================

const createRunLog = (jobName, callback) => {
    const query = `
        INSERT INTO automation_runs (job_name, status, started_at)
        VALUES (?, 'running', CURRENT_TIMESTAMP)
    `;

    db.query(query, [jobName], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result.insertId);
    });
};

const updateRunLog = (runId, status, usersProcessed, usersSucceeded, usersFailed, errorDetails, callback) => {
    const errorsJson = errorDetails ? JSON.stringify(errorDetails) : null;

    const query = `
        UPDATE automation_runs
        SET
            status = ?,
            users_processed = ?,
            users_succeeded = ?,
            users_failed = ?,
            error_details = ?,
            completed_at = CURRENT_TIMESTAMP
        WHERE run_id = ?
    `;

    db.query(
        query,
        [status, usersProcessed, usersSucceeded, usersFailed, errorsJson, runId],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        }
    );
};

// =======================================
// OVERDUE TASKS DETECTION (READ-ONLY)
// =======================================

const getOverdueTasks = (userId, asOfDate, callback) => {
    const query = `
        SELECT
            t.task_id,
            t.title,
            t.priority,
            DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date,
            t.subject_id,
            COALESCE(s.subject_name, 'General') AS subject_name,
            DATEDIFF(?, t.due_date) AS days_overdue
        FROM tasks t
        LEFT JOIN subjects s ON t.subject_id = s.subject_id
        WHERE t.user_id = ?
          AND t.status != 'Completed'
          AND t.due_date < ?
        ORDER BY t.due_date ASC
    `;

    db.query(query, [asOfDate, userId, asOfDate], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results || []);
    });
};

// =======================================
// CHECK EXISTING NOTIFICATION (IDEMPOTENCY)
// =======================================

const checkExistingNotification = (userId, type, referenceType, referenceId, dateStr, callback) => {
    const query = `
        SELECT notification_id
        FROM notifications
        WHERE user_id = ?
          AND type = ?
          AND reference_type = ?
          AND reference_id = ?
          AND DATE(created_at) = ?
        LIMIT 1
    `;

    db.query(query, [userId, type, referenceType, referenceId, dateStr], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results && results.length > 0);
    });
};

// =======================================
// GET DAILY METRICS (REAL DATA AGGREGATES)
// =======================================

const getDailyMetrics = (userId, targetDate, callback) => {
    const query = `
        SELECT
            /* Tasks */
            (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND DATE(created_at) = ?) AS tasks_created,
            (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'Completed' AND DATE(completed_at) = ?) AS tasks_completed,
            (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status != 'Completed' AND due_date < ?) AS tasks_overdue,

            /* Pomodoro Focus */
            (SELECT COUNT(*) FROM pomodoro_sessions WHERE user_id = ? AND session_status = 'Completed' AND DATE(started_at) = ?) AS pomodoro_completed_sessions,
            (SELECT COUNT(*) FROM pomodoro_sessions WHERE user_id = ? AND session_status = 'Interrupted' AND DATE(started_at) = ?) AS pomodoro_interrupted_sessions,
            (SELECT COALESCE(SUM(duration_minutes), 0) FROM pomodoro_sessions WHERE user_id = ? AND session_status = 'Completed' AND DATE(started_at) = ?) AS pomodoro_focus_minutes,

            /* Study Sessions */
            (SELECT COUNT(*) FROM study_sessions WHERE user_id = ? AND DATE(start_time) = ?) AS study_sessions_count,
            (SELECT COALESCE(SUM(duration_minutes), 0) FROM study_sessions WHERE user_id = ? AND DATE(start_time) = ?) AS study_minutes,

            /* Goals */
            (SELECT COUNT(*) FROM goals WHERE user_id = ? AND status = 'Completed' AND DATE(updated_at) = ?) AS goals_completed,
            (SELECT COUNT(*) FROM goals WHERE user_id = ? AND status = 'In Progress') AS goals_in_progress,

            /* Activity Events */
            (SELECT COUNT(*) FROM activity_events WHERE user_id = ? AND DATE(created_at) = ?) AS activity_events_count
    `;

    const params = [
        userId, targetDate,
        userId, targetDate,
        userId, targetDate,
        userId, targetDate,
        userId, targetDate,
        userId, targetDate,
        userId, targetDate,
        userId, targetDate,
        userId, targetDate,
        userId,
        userId, targetDate
    ];

    db.query(query, params, (err, results) => {
        if (err) return callback(err, null);
        callback(null, results && results[0] ? results[0] : {});
    });
};

// =======================================
// GET ACTIVE SUBJECTS FOR DAY
// =======================================

const getActiveSubjectsForDate = (userId, targetDate, callback) => {
    const query = `
        SELECT DISTINCT s.subject_name
        FROM (
            SELECT subject_id FROM study_sessions WHERE user_id = ? AND DATE(start_time) = ?
            UNION
            SELECT subject_id FROM pomodoro_sessions WHERE user_id = ? AND DATE(started_at) = ? AND subject_id IS NOT NULL
            UNION
            SELECT subject_id FROM tasks WHERE user_id = ? AND DATE(completed_at) = ?
        ) active
        JOIN subjects s ON active.subject_id = s.subject_id
        WHERE s.user_id = ?
        ORDER BY s.subject_name ASC
    `;

    const params = [userId, targetDate, userId, targetDate, userId, targetDate, userId];

    db.query(query, params, (err, results) => {
        if (err) return callback(err, null);
        const subjects = (results || []).map((r) => r.subject_name);
        callback(null, subjects);
    });
};

// =======================================
// GET QUALIFYING ACTIVE DATES (FOR STREAKS)
// =======================================

const getQualifyingActiveDates = (userId, startDate, endDate, callback) => {
    const query = `
        SELECT DISTINCT active_date
        FROM (
            SELECT DATE_FORMAT(completed_at, '%Y-%m-%d') AS active_date
            FROM tasks
            WHERE user_id = ?
              AND status = 'Completed'
              AND completed_at IS NOT NULL
              AND DATE(completed_at) >= ? AND DATE(completed_at) <= ?

            UNION

            SELECT DATE_FORMAT(started_at, '%Y-%m-%d') AS active_date
            FROM pomodoro_sessions
            WHERE user_id = ?
              AND session_status = 'Completed'
              AND DATE(started_at) >= ? AND DATE(started_at) <= ?

            UNION

            SELECT DATE_FORMAT(start_time, '%Y-%m-%d') AS active_date
            FROM study_sessions
            WHERE user_id = ?
              AND DATE(start_time) >= ? AND DATE(start_time) <= ?

            UNION

            SELECT DATE_FORMAT(created_at, '%Y-%m-%d') AS active_date
            FROM activity_events
            WHERE user_id = ?
              AND DATE(created_at) >= ? AND DATE(created_at) <= ?
        ) unified_active
        ORDER BY active_date ASC
    `;

    const params = [
        userId, startDate, endDate,
        userId, startDate, endDate,
        userId, startDate, endDate,
        userId, startDate, endDate
    ];

    db.query(query, params, (err, results) => {
        if (err) return callback(err, null);
        const dates = (results || []).map((r) => r.active_date);
        callback(null, dates);
    });
};

module.exports = {
    getAllUserIds,
    upsertSummary,
    getSummary,
    getLatestSummary,
    getSummaryHistory,
    createRunLog,
    updateRunLog,
    getOverdueTasks,
    checkExistingNotification,
    getDailyMetrics,
    getActiveSubjectsForDate,
    getQualifyingActiveDates
};
