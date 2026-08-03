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



// =======================================
// Pomodoro Analytics
// =======================================

const getPomodoroAnalytics = (userId, callback) => {

    const query = `

    SELECT

        COUNT(*) AS total_sessions,

        IFNULL(
            SUM(
                CASE
                    WHEN session_status = 'Completed'
                    THEN 1
                    ELSE 0
                END
            ),
            0
        ) AS completed_sessions,

        IFNULL(
            SUM(
                CASE
                    WHEN session_status = 'Interrupted'
                    THEN 1
                    ELSE 0
                END
            ),
            0
        ) AS interrupted_sessions,

        IFNULL(
            ROUND(SUM(duration_minutes) / 60, 2),
            0
        ) AS total_focus_hours,

        IFNULL(
            ROUND(AVG(duration_minutes), 2),
            0
        ) AS average_session_duration,

        IFNULL(
            MAX(duration_minutes),
            0
        ) AS longest_session

    FROM pomodoro_sessions

    WHERE user_id = ?;

    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results[0]);

    });

};

// =======================================
// Productivity Score
// =======================================

const getProductivityScore = (userId, callback) => {

    const query = `

    SELECT

        /* Goal Progress */

        (
            SELECT IFNULL(AVG(progress_percentage),0)
            FROM goals
            WHERE user_id = ?
        ) AS avg_goal_progress,

        /* Study Hours */

        (
            SELECT IFNULL(SUM(duration_minutes),0)
            FROM study_sessions
            WHERE user_id = ?
        ) AS total_study_minutes,

        /* Completed Pomodoro */

        (
            SELECT COUNT(*)
            FROM pomodoro_sessions
            WHERE user_id = ?
            AND session_status='Completed'
        ) AS completed_pomodoros,

        /* Tasks */

        (
            SELECT COUNT(*)
            FROM tasks
            WHERE user_id = ?
        ) AS total_tasks,

        (
            SELECT COUNT(*)
            FROM tasks
            WHERE user_id = ?
            AND status='Completed'
        ) AS completed_tasks;

    `;

    db.query(
        query,
        [
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

            const data = results[0];

            // -------------------------
            // Goal Score (30)
            // -------------------------

            const goalScore =
                (data.avg_goal_progress / 100) * 30;

            // -------------------------
            // Study Score (30)
            // 30 study hours = full marks
            // -------------------------

            const studyHours =
                data.total_study_minutes / 60;

            const studyScore =
                Math.min(studyHours, 30);

            // -------------------------
            // Pomodoro Score (20)
            // 40 completed sessions = full marks
            // -------------------------

            const pomodoroScore =
                Math.min(
                    (data.completed_pomodoros / 40) * 20,
                    20
                );

            // -------------------------
            // Task Score (20)
            // -------------------------

            let taskScore = 0;

            if (data.total_tasks > 0) {

                taskScore =
                    (data.completed_tasks /
                        data.total_tasks) * 20;

            }

            // -------------------------
            // Final Score
            // -------------------------

            const score = Math.round(

                goalScore +

                studyScore +

                pomodoroScore +

                taskScore

            );

            // -------------------------
            // Grade
            // -------------------------

            let grade;
            let message;

            if (score >= 90) {

                grade = "A+";
                message = "Outstanding productivity!";

            }

            else if (score >= 80) {

                grade = "A";
                message = "Excellent productivity!";

            }

            else if (score >= 70) {

                grade = "B";
                message = "Good work. Keep improving.";

            }

            else if (score >= 60) {

                grade = "C";
                message = "Average productivity.";

            }

            else if (score >= 40) {

                grade = "D";
                message = "Low productivity.";

            }

            else {

                grade = "F";
                message = "Productivity needs immediate attention.";

            }

            callback(null, {

                score,

                grade,

                message,

                breakdown: {

                    goal_score:
                        Number(goalScore.toFixed(2)),

                    study_score:
                        Number(studyScore.toFixed(2)),

                    pomodoro_score:
                        Number(pomodoroScore.toFixed(2)),

                    task_score:
                        Number(taskScore.toFixed(2))

                }

            });

        }

    );

};

module.exports = {
    getDashboardSummary,
    getSubjectAnalytics,
    getWeeklyAnalytics,
    getGoalAnalytics,
    getPomodoroAnalytics,
    getProductivityScore
};