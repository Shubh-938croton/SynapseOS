const db = require("../config/database");

// =======================================
// Dashboard Summary
// =======================================

const getDashboardSummary = (userId, callback) => {

    const query = `

    SELECT

        /* Subjects */
        (SELECT COUNT(*)
         FROM subjects
         WHERE user_id = ?) AS totalSubjects,

        /* Tasks */
        (SELECT COUNT(*)
         FROM tasks
         WHERE user_id = ?) AS totalTasks,

        (SELECT COUNT(*)
         FROM tasks
         WHERE user_id = ?
         AND status = 'Completed') AS completedTasks,

        (SELECT COUNT(*)
         FROM tasks
         WHERE user_id = ?
         AND status <> 'Completed') AS pendingTasks,

        /* Notes */
        (SELECT COUNT(*)
         FROM notes
         WHERE user_id = ?) AS totalNotes,

        /* Goals */
        (SELECT COUNT(*)
         FROM goals
         WHERE user_id = ?) AS totalGoals,

        (SELECT COUNT(*)
         FROM goals
         WHERE user_id = ?
         AND status = 'Completed') AS completedGoals,

        /* Study Sessions */
        (SELECT COUNT(*)
         FROM study_sessions
         WHERE user_id = ?) AS totalStudySessions,

        IFNULL(
            (
                SELECT ROUND(SUM(duration_minutes)/60,2)
                FROM study_sessions
                WHERE user_id = ?
            ),
            0
        ) AS totalStudyHours,

        /* Pomodoro */

        (SELECT COUNT(*)
         FROM pomodoro_sessions
         WHERE user_id = ?) AS totalPomodoroSessions,

        IFNULL(
            (
                SELECT ROUND(SUM(duration_minutes)/60,2)
                FROM pomodoro_sessions
                WHERE user_id = ?
            ),
            0
        ) AS totalPomodoroHours

    `;

    db.query(
        query,
        [
            userId,
            userId,
            userId,
            userId,
            userId,
            userId,
            userId,
            userId,
            userId,
            userId,
            userId
        ],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results[0]);

        }
    );

};


// =======================================
// Subject Analytics
// =======================================

const getSubjectAnalytics = (userId, callback) => {

    const query = `

SELECT

    s.subject_id,
    s.subject_name,

    IFNULL(st.study_sessions, 0) AS study_sessions,
    IFNULL(st.study_hours, 0) AS study_hours,

    IFNULL(pm.pomodoro_sessions, 0) AS pomodoro_sessions,
    IFNULL(pm.pomodoro_hours, 0) AS pomodoro_hours

FROM subjects s

LEFT JOIN (

    SELECT

        subject_id,

        COUNT(*) AS study_sessions,

        ROUND(SUM(duration_minutes)/60,2) AS study_hours

    FROM study_sessions

    GROUP BY subject_id

) st

ON s.subject_id = st.subject_id

LEFT JOIN (

    SELECT

        subject_id,

        COUNT(*) AS pomodoro_sessions,

        ROUND(SUM(duration_minutes)/60,2) AS pomodoro_hours

    FROM pomodoro_sessions

    GROUP BY subject_id

) pm

ON s.subject_id = pm.subject_id

WHERE s.user_id = ?

ORDER BY study_hours DESC;

`;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// =======================================
// Weekly Analytics
// =======================================

const getWeeklyAnalytics = (userId, callback) => {

    const query = `

SELECT
    DAYNAME(start_time) AS day,
    WEEKDAY(start_time) AS day_order,

    COUNT(*) AS study_sessions,

    ROUND(SUM(duration_minutes)/60,2) AS study_hours

FROM study_sessions

WHERE user_id = ?

GROUP BY
    DAYNAME(start_time),
    WEEKDAY(start_time)

ORDER BY
    day_order;

`;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        // Return all seven days even if there is no data
        const week = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ];

        const analytics = week.map(day => {

            const record = results.find(r => r.day === day);

            return {
                day,
                study_sessions: record ? record.study_sessions : 0,
                study_hours: record ? Number(record.study_hours) : 0
            };

        });

        callback(null, analytics);

    });

};

// =======================================
// Goal Analytics
// =======================================

const getGoalAnalytics = (userId, callback) => {

    const query = `

    SELECT

COUNT(*) AS total_goals,

IFNULL(SUM(
CASE
WHEN status='Completed'
THEN 1
ELSE 0
END
),0) AS completed_goals,

IFNULL(SUM(
CASE
WHEN status='In Progress'
THEN 1
ELSE 0
END
),0) AS in_progress_goals,

IFNULL(SUM(
CASE
WHEN status='Not Started'
THEN 1
ELSE 0
END
),0) AS not_started_goals,

IFNULL(ROUND(AVG(progress_percentage),2),0) AS average_progress

FROM goals

WHERE user_id = ?;

    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results[0]);

    });

};

module.exports = {
    getDashboardSummary,
    getSubjectAnalytics,
    getWeeklyAnalytics,
    getGoalAnalytics
};