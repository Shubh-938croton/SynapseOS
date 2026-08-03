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

module.exports = {
    getDashboardSummary
};