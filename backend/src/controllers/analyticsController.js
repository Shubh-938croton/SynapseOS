const analyticsModel = require("../models/analyticsModel");


// =======================================
// GET COMPLETE ANALYTICS
// =======================================

const getAnalytics = async (req, res) => {

    try {

        // Get logged-in user's ID
        const userId = req.user.user_id;


        // =======================================
        // HELPER
        // Convert callback-based model function
        // into a Promise
        // =======================================

        const runQuery = (modelFunction) => {

            return new Promise((resolve, reject) => {

                modelFunction(userId, (err, result) => {

                    if (err) {
                        return reject(err);
                    }

                    resolve(result);

                });

            });

        };


        // =======================================
        // RUN ALL ANALYTICS QUERIES
        // =======================================

        const [

            overview,

            tasksByPriority,
            taskCompletionTrend,

            studyTimeTrend,
            studyTimeBySubject,

            progressBySubject,

            pomodoroTrend,
            pomodoroBySubject,

            goalsByStatus,

            contestsByPlatform,

            notesBySubject,

            calendarByStatus

        ] = await Promise.all([

            runQuery(
                analyticsModel.getOverview
            ),

            runQuery(
                analyticsModel.getTasksByPriority
            ),

            runQuery(
                analyticsModel.getTaskCompletionTrend
            ),

            runQuery(
                analyticsModel.getStudyTimeTrend
            ),

            runQuery(
                analyticsModel.getStudyTimeBySubject
            ),

            runQuery(
                analyticsModel.getProgressBySubject
            ),

            runQuery(
                analyticsModel.getPomodoroTrend
            ),

            runQuery(
                analyticsModel.getPomodoroBySubject
            ),

            runQuery(
                analyticsModel.getGoalsByStatus
            ),

            runQuery(
                analyticsModel.getContestsByPlatform
            ),

            runQuery(
                analyticsModel.getNotesBySubject
            ),

            runQuery(
                analyticsModel.getCalendarByStatus
            )

        ]);


        // =======================================
        // FORMAT OVERVIEW
        // =======================================

        const formattedOverview = {

            // -------------------------
            // Tasks
            // -------------------------

            totalTasks:
                Number(overview.total_tasks) || 0,

            completedTasks:
                Number(overview.completed_tasks) || 0,

            pendingTasks:
                Number(overview.pending_tasks) || 0,

            overdueTasks:
                Number(overview.overdue_tasks) || 0,


            // -------------------------
            // Study Sessions
            // -------------------------

            totalStudySessions:
                Number(overview.total_study_sessions) || 0,

            totalStudyMinutes:
                Number(overview.total_study_minutes) || 0,

            averageSessionMinutes:
                Number(
                    Number(
                        overview.average_session_minutes
                    ).toFixed(2)
                ) || 0,


            // -------------------------
            // Progress
            // -------------------------

            averageProgress:
                Number(
                    Number(
                        overview.average_progress
                    ).toFixed(2)
                ) || 0,


            // -------------------------
            // Goals
            // -------------------------

            totalGoals:
                Number(overview.total_goals) || 0,

            completedGoals:
                Number(overview.completed_goals) || 0,

            inProgressGoals:
                Number(overview.in_progress_goals) || 0,

            notStartedGoals:
                Number(overview.not_started_goals) || 0,

            overdueGoals:
                Number(overview.overdue_goals) || 0,


            // -------------------------
            // Pomodoro
            // -------------------------

            totalPomodoroSessions:
                Number(
                    overview.total_pomodoro_sessions
                ) || 0,

            completedPomodoroSessions:
                Number(
                    overview.completed_pomodoro_sessions
                ) || 0,

            interruptedPomodoroSessions:
                Number(
                    overview.interrupted_pomodoro_sessions
                ) || 0,

            pomodoroMinutes:
                Number(
                    overview.pomodoro_minutes
                ) || 0,


            // -------------------------
            // Contests
            // -------------------------

            totalContests:
                Number(overview.total_contests) || 0,

            participatedContests:
                Number(
                    overview.participated_contests
                ) || 0,

            upcomingContests:
                Number(
                    overview.upcoming_contests
                ) || 0,

            missedContests:
                Number(
                    overview.missed_contests
                ) || 0,


            // -------------------------
            // Notes
            // -------------------------

            totalNotes:
                Number(overview.total_notes) || 0,

            pinnedNotes:
                Number(overview.pinned_notes) || 0,


            // -------------------------
            // Calendar
            // -------------------------

            totalCalendarEvents:
                Number(
                    overview.total_calendar_events
                ) || 0,

            upcomingEvents:
                Number(
                    overview.upcoming_events
                ) || 0,

            completedEvents:
                Number(
                    overview.completed_events
                ) || 0,

            cancelledEvents:
                Number(
                    overview.cancelled_events
                ) || 0

        };


        // =======================================
        // SEND RESPONSE
        // =======================================

        return res.status(200).json({

            message: "Analytics fetched successfully",

            overview: formattedOverview,


            // =========================
            // TASK ANALYTICS
            // =========================

            tasks: {

                byPriority:
                    tasksByPriority,

                completionTrend:
                    taskCompletionTrend

            },


            // =========================
            // STUDY ANALYTICS
            // =========================

            study: {

                dailyTrend:
                    studyTimeTrend,

                bySubject:
                    studyTimeBySubject

            },


            // =========================
            // PROGRESS ANALYTICS
            // =========================

            progress: {

                bySubject:
                    progressBySubject

            },


            // =========================
            // POMODORO ANALYTICS
            // =========================

            pomodoro: {

                dailyTrend:
                    pomodoroTrend,

                bySubject:
                    pomodoroBySubject

            },


            // =========================
            // GOAL ANALYTICS
            // =========================

            goals: {

                byStatus:
                    goalsByStatus

            },


            // =========================
            // CONTEST ANALYTICS
            // =========================

            contests: {

                byPlatform:
                    contestsByPlatform

            },


            // =========================
            // NOTE ANALYTICS
            // =========================

            notes: {

                bySubject:
                    notesBySubject

            },


            // =========================
            // CALENDAR ANALYTICS
            // =========================

            calendar: {

                byStatus:
                    calendarByStatus

            }

        });

    } catch (err) {

        console.error(
            "Analytics Controller Error:",
            err
        );

        return res.status(500).json({
            message: "Failed to fetch analytics"
        });

    }

};


// =======================================
// EXPORT
// =======================================

module.exports = {

    getAnalytics

};