const db = require("../config/database");

// =======================================
// HELPER: NORMALIZE OPTIONAL ARGS
// =======================================

const normalizeArgs = (userId, dateRangeOrCallback, callback) => {
    let dateRange = null;
    let cb = callback;
    if (typeof dateRangeOrCallback === "function") {
        cb = dateRangeOrCallback;
    } else {
        dateRange = dateRangeOrCallback;
    }
    return { userId, dateRange, cb };
};

// =======================================
// GET ANALYTICS OVERVIEW
// =======================================

const getOverview = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            /* TASKS */
            (SELECT COUNT(*) FROM tasks WHERE user_id = ?) AS total_tasks,
            (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'Completed') AS completed_tasks,
            (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'Pending') AS pending_tasks,
            (SELECT COUNT(*) FROM tasks WHERE user_id = ? AND status = 'Pending' AND due_date < CURDATE()) AS overdue_tasks,

            /* STUDY SESSIONS */
            (SELECT COUNT(*) FROM study_sessions WHERE user_id = ?) AS total_study_sessions,
            (SELECT COALESCE(SUM(duration_minutes), 0) FROM study_sessions WHERE user_id = ?) AS total_study_minutes,
            (SELECT COALESCE(ROUND(AVG(duration_minutes), 1), 0) FROM study_sessions WHERE user_id = ?) AS average_session_minutes,

            /* PROGRESS */
            (SELECT COALESCE(ROUND((COUNT(CASE WHEN status = 'Completed' THEN 1 END) * 100.0) / NULLIF(COUNT(*), 0), 1), 0) FROM tasks WHERE user_id = ?) AS average_progress,

            /* GOALS */
            (SELECT COUNT(*) FROM goals WHERE user_id = ?) AS total_goals,
            (SELECT COUNT(*) FROM goals WHERE user_id = ? AND status = 'Completed') AS completed_goals,
            (SELECT COUNT(*) FROM goals WHERE user_id = ? AND status = 'In Progress') AS in_progress_goals,
            (SELECT COUNT(*) FROM goals WHERE user_id = ? AND status = 'Not Started') AS not_started_goals,
            (SELECT COUNT(*) FROM goals WHERE user_id = ? AND target_date < CURDATE() AND status != 'Completed') AS overdue_goals,

            /* POMODORO */
            (SELECT COUNT(*) FROM pomodoro_sessions WHERE user_id = ?) AS total_pomodoro_sessions,
            (SELECT COUNT(*) FROM pomodoro_sessions WHERE user_id = ? AND session_status = 'Completed') AS completed_pomodoro_sessions,
            (SELECT COUNT(*) FROM pomodoro_sessions WHERE user_id = ? AND session_status = 'Interrupted') AS interrupted_pomodoro_sessions,
            (SELECT COALESCE(SUM(duration_minutes), 0) FROM pomodoro_sessions WHERE user_id = ? AND session_status = 'Completed') AS pomodoro_minutes,

            /* CONTESTS */
            (SELECT COUNT(*) FROM contests WHERE user_id = ?) AS total_contests,
            (SELECT COUNT(*) FROM contests WHERE user_id = ? AND participation_status = 'Participated') AS participated_contests,
            (SELECT COUNT(*) FROM contests WHERE user_id = ? AND participation_status = 'Upcoming') AS upcoming_contests,
            (SELECT COUNT(*) FROM contests WHERE user_id = ? AND participation_status = 'Missed') AS missed_contests,

            /* NOTES */
            (SELECT COUNT(*) FROM notes WHERE user_id = ?) AS total_notes,
            (SELECT COUNT(*) FROM notes WHERE user_id = ? AND is_pinned = TRUE) AS pinned_notes,

            /* CALENDAR */
            (SELECT COUNT(*) FROM calendar_events WHERE user_id = ?) AS total_calendar_events,
            (SELECT COUNT(*) FROM calendar_events WHERE user_id = ? AND status = 'Upcoming') AS upcoming_events,
            (SELECT COUNT(*) FROM calendar_events WHERE user_id = ? AND status = 'Completed') AS completed_events,
            (SELECT COUNT(*) FROM calendar_events WHERE user_id = ? AND status = 'Cancelled') AS cancelled_events
    `;

    const params = [
        userId, userId, userId, userId,
        userId, userId, userId,
        userId,
        userId, userId, userId, userId, userId,
        userId, userId, userId, userId,
        userId, userId, userId, userId,
        userId, userId,
        userId, userId, userId, userId
    ];

    db.query(query, params, (err, results) => {
        if (err) return cb(err, null);
        cb(null, results[0] || {});
    });
};

// =======================================
// TASKS BY PRIORITY
// =======================================

const getTasksByPriority = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            priority,
            COUNT(*) AS task_count
        FROM tasks
        WHERE user_id = ?
        GROUP BY priority
        ORDER BY FIELD(priority, 'High', 'Medium', 'Low')
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// TASK COMPLETION TREND
// =======================================

const getTaskCompletionTrend = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, dateRange, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    let query = `
        SELECT
            DATE(completed_at) AS completion_date,
            COUNT(*) AS completed_count
        FROM tasks
        WHERE user_id = ?
        AND status = 'Completed'
        AND completed_at IS NOT NULL
    `;
    const params = [userId];

    if (dateRange && dateRange.startDate && dateRange.endDate) {
        query += ` AND DATE(completed_at) >= ? AND DATE(completed_at) <= ?`;
        params.push(dateRange.startDate, dateRange.endDate);
    }

    query += ` GROUP BY DATE(completed_at) ORDER BY completion_date ASC`;

    db.query(query, params, (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// STUDY TIME TREND
// =======================================

const getStudyTimeTrend = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, dateRange, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    let query = `
        SELECT
            DATE(start_time) AS study_date,
            COUNT(session_id) AS session_count,
            COALESCE(SUM(duration_minutes), 0) AS study_minutes
        FROM study_sessions
        WHERE user_id = ?
    `;
    const params = [userId];

    if (dateRange && dateRange.startDate && dateRange.endDate) {
        query += ` AND DATE(start_time) >= ? AND DATE(start_time) <= ?`;
        params.push(dateRange.startDate, dateRange.endDate);
    }

    query += ` GROUP BY DATE(start_time) ORDER BY study_date ASC`;

    db.query(query, params, (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// STUDY TIME BY SUBJECT
// =======================================

const getStudyTimeBySubject = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            COALESCE(s.subject_name, 'Uncategorized') AS subject_name,
            COUNT(ss.session_id) AS session_count,
            COALESCE(SUM(ss.duration_minutes), 0) AS study_minutes
        FROM study_sessions ss
        LEFT JOIN subjects s
            ON ss.subject_id = s.subject_id
        WHERE ss.user_id = ?
        GROUP BY s.subject_id, s.subject_name
        ORDER BY study_minutes DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// PROGRESS BY SUBJECT
// =======================================

const getProgressBySubject = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            s.subject_name,
            COALESCE(
                ROUND(
                    (COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) * 100.0) / NULLIF(COUNT(t.task_id), 0)
                , 1), 0.0) AS completion_percentage,
            COALESCE(
                (
                    SELECT SUM(ss.duration_minutes)
                    FROM study_sessions ss
                    WHERE ss.subject_id = s.subject_id AND ss.user_id = ?
                ), 0
            ) AS total_study_minutes,
            COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) AS tasks_completed,
            COALESCE(
                (
                    SELECT COUNT(*)
                    FROM notes n
                    WHERE n.subject_id = s.subject_id AND n.user_id = ?
                ), 0
            ) AS notes_created
        FROM subjects s
        LEFT JOIN tasks t
            ON s.subject_id = t.subject_id AND t.user_id = ?
        WHERE s.user_id = ?
        GROUP BY s.subject_id, s.subject_name
        ORDER BY completion_percentage DESC
    `;

    db.query(query, [userId, userId, userId, userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// POMODORO TREND
// =======================================

const getPomodoroTrend = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, dateRange, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    let query = `
        SELECT
            DATE(started_at) AS session_date,
            COUNT(*) AS session_count,
            COALESCE(SUM(duration_minutes), 0) AS focus_minutes
        FROM pomodoro_sessions
        WHERE user_id = ?
        AND session_status = 'Completed'
    `;
    const params = [userId];

    if (dateRange && dateRange.startDate && dateRange.endDate) {
        query += ` AND DATE(started_at) >= ? AND DATE(started_at) <= ?`;
        params.push(dateRange.startDate, dateRange.endDate);
    }

    query += ` GROUP BY DATE(started_at) ORDER BY session_date ASC`;

    db.query(query, params, (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// POMODORO BY SUBJECT
// =======================================

const getPomodoroBySubject = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            COALESCE(s.subject_name, 'Uncategorized') AS subject_name,
            COUNT(ps.session_id) AS session_count,
            COALESCE(SUM(ps.duration_minutes), 0) AS focus_minutes
        FROM pomodoro_sessions ps
        LEFT JOIN subjects s
            ON ps.subject_id = s.subject_id
        WHERE ps.user_id = ?
        AND ps.session_status = 'Completed'
        GROUP BY ps.subject_id, s.subject_name
        ORDER BY focus_minutes DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// GOALS BY STATUS
// =======================================

const getGoalsByStatus = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            status,
            COUNT(*) AS goal_count
        FROM goals
        WHERE user_id = ?
        GROUP BY status
        ORDER BY FIELD(status, 'Completed', 'In Progress', 'Not Started')
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// CONTESTS BY PLATFORM
// =======================================

const getContestsByPlatform = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            platform,
            COUNT(*) AS contest_count
        FROM contests
        WHERE user_id = ?
        GROUP BY platform
        ORDER BY contest_count DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// NOTES BY SUBJECT
// =======================================

const getNotesBySubject = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            COALESCE(s.subject_name, 'Uncategorized') AS subject_name,
            COUNT(n.note_id) AS note_count
        FROM notes n
        LEFT JOIN subjects s
            ON n.subject_id = s.subject_id
        WHERE n.user_id = ?
        GROUP BY s.subject_id, s.subject_name
        ORDER BY note_count DESC
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// CALENDAR BY STATUS
// =======================================

const getCalendarByStatus = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    const query = `
        SELECT
            status,
            COUNT(*) AS event_count
        FROM calendar_events
        WHERE user_id = ?
        GROUP BY status
        ORDER BY FIELD(status, 'Upcoming', 'Completed', 'Cancelled')
    `;

    db.query(query, [userId], (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

// =======================================
// ACTIVITY EVENTS (PHASE 2 INTEGRATION)
// =======================================

const getActivityEventsSummary = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, dateRange, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    let query = `
        SELECT COUNT(*) AS total_events
        FROM activity_events
        WHERE user_id = ?
    `;
    const params = [userId];

    if (dateRange && dateRange.startDate && dateRange.endDate) {
        query += ` AND DATE(created_at) >= ? AND DATE(created_at) <= ?`;
        params.push(dateRange.startDate, dateRange.endDate);
    }

    db.query(query, params, (err, results) => {
        if (err) return cb(err, null);
        cb(null, results[0] || { total_events: 0 });
    });
};

const getActivityEventsByType = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, dateRange, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    let query = `
        SELECT
            event_type,
            COUNT(*) AS event_count
        FROM activity_events
        WHERE user_id = ?
    `;
    const params = [userId];

    if (dateRange && dateRange.startDate && dateRange.endDate) {
        query += ` AND DATE(created_at) >= ? AND DATE(created_at) <= ?`;
        params.push(dateRange.startDate, dateRange.endDate);
    }

    query += ` GROUP BY event_type ORDER BY event_count DESC`;

    db.query(query, params, (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

const getActivityEventsTrend = (userIdOrId, dateRangeOrCallback, callback) => {
    const { userId, dateRange, cb } = normalizeArgs(userIdOrId, dateRangeOrCallback, callback);

    let query = `
        SELECT
            DATE(created_at) AS event_date,
            COUNT(*) AS event_count
        FROM activity_events
        WHERE user_id = ?
    `;
    const params = [userId];

    if (dateRange && dateRange.startDate && dateRange.endDate) {
        query += ` AND DATE(created_at) >= ? AND DATE(created_at) <= ?`;
        params.push(dateRange.startDate, dateRange.endDate);
    }

    query += ` GROUP BY DATE(created_at) ORDER BY event_date ASC`;

    db.query(query, params, (err, results) => {
        if (err) return cb(err, null);
        cb(null, results || []);
    });
};

module.exports = {
    getOverview,
    getTasksByPriority,
    getTaskCompletionTrend,
    getStudyTimeTrend,
    getStudyTimeBySubject,
    getProgressBySubject,
    getPomodoroTrend,
    getPomodoroBySubject,
    getGoalsByStatus,
    getContestsByPlatform,
    getNotesBySubject,
    getCalendarByStatus,
    getActivityEventsSummary,
    getActivityEventsByType,
    getActivityEventsTrend
};