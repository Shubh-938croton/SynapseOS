const automationModel = require("../models/automationModel");
const notificationModel = require("../models/notificationModel");
const goalModel = require("../models/goalModel");
const analyticsService = require("./analyticsService");
const {
    formatDate,
    isValidDateString,
    getTodayString,
    getYesterdayString,
    getDateRangeDays,
    daysBetween
} = require("../utils/dateUtils");

/**
 * Promisify helper for callback-based models
 */
const runQuery = (modelFn, ...args) => {
    return new Promise((resolve, reject) => {
        modelFn(...args, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// =======================================
// STREAK & CONSISTENCY ENGINE
// =======================================

/**
 * Calculate user consistency and streak metrics as of a specific date
 * Definition of Active Day: A day with at least 1 completed task, Pomodoro session, study session, or activity event.
 */
const calculateUserStreak = async (userId, asOfDateStr = null) => {
    const targetDate = isValidDateString(asOfDateStr) ? asOfDateStr : getTodayString();
    const todayStr = getTodayString();

    // 90-day calculation window for historical consistency
    const range = getDateRangeDays(targetDate, 90);
    const activeDatesList = await runQuery(
        automationModel.getQualifyingActiveDates,
        userId,
        range.startDate,
        range.endDate
    );

    const activeSet = new Set(activeDatesList || []);

    // Calculate current continuous streak traversing backwards from targetDate
    let currentStreak = 0;
    const checkDate = new Date(targetDate);

    // If targetDate is today and today is not active yet, check starting from yesterday
    let currStr = formatDate(checkDate);
    if (currStr === todayStr && !activeSet.has(currStr)) {
        checkDate.setDate(checkDate.getDate() - 1);
        currStr = formatDate(checkDate);
    }

    while (activeSet.has(currStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
        currStr = formatDate(checkDate);
    }

    // Calculate longest streak across all chronological dates in window
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < range.allDates.length; i++) {
        const dStr = range.allDates[i];
        if (activeSet.has(dStr)) {
            tempStreak++;
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
        } else {
            tempStreak = 0;
        }
    }

    const totalActiveDays = activeSet.size;
    const consistencyScore = range.dayCount > 0
        ? Number(((totalActiveDays / range.dayCount) * 100).toFixed(1))
        : 0.0;

    return {
        asOfDate: targetDate,
        isActiveDay: activeSet.has(targetDate),
        currentStreak,
        longestStreak,
        totalActiveDays,
        windowDays: range.dayCount,
        consistencyScore
    };
};

// =======================================
// DAILY SUMMARY PROCESSING
// =======================================

/**
 * Process and persist deterministic daily summary for a user
 */
const processDailySummary = async (userId, targetDateStr = null) => {
    const date = isValidDateString(targetDateStr) ? targetDateStr : getYesterdayString();

    const [metricsRaw, activeSubjects, streak, overdueTasks] = await Promise.all([
        runQuery(automationModel.getDailyMetrics, userId, date),
        runQuery(automationModel.getActiveSubjectsForDate, userId, date),
        calculateUserStreak(userId, date),
        runQuery(automationModel.getOverdueTasks, userId, date)
    ]);

    const tasksCreated = Number(metricsRaw?.tasks_created) || 0;
    const tasksCompleted = Number(metricsRaw?.tasks_completed) || 0;
    const tasksOverdue = Number(metricsRaw?.tasks_overdue) || 0;

    const taskCompletionRate = (tasksCompleted + tasksCreated) > 0
        ? Number(((tasksCompleted / (tasksCompleted + tasksCreated)) * 100).toFixed(1))
        : 0.0;

    const pomodoroCompleted = Number(metricsRaw?.pomodoro_completed_sessions) || 0;
    const pomodoroInterrupted = Number(metricsRaw?.pomodoro_interrupted_sessions) || 0;
    const focusMinutes = Number(metricsRaw?.pomodoro_focus_minutes) || 0;

    const studySessionsCount = Number(metricsRaw?.study_sessions_count) || 0;
    const studyMinutes = Number(metricsRaw?.study_minutes) || 0;

    const goalsCompleted = Number(metricsRaw?.goals_completed) || 0;
    const goalsInProgress = Number(metricsRaw?.goals_in_progress) || 0;

    const activityEventsCount = Number(metricsRaw?.activity_events_count) || 0;

    const summaryPayload = {
        date,
        tasks: {
            created: tasksCreated,
            completed: tasksCompleted,
            overdue: tasksOverdue,
            completionRate: taskCompletionRate
        },
        focus: {
            completedSessions: pomodoroCompleted,
            interruptedSessions: pomodoroInterrupted,
            focusMinutes,
            focusHours: Number((focusMinutes / 60).toFixed(2))
        },
        study: {
            sessionsCount: studySessionsCount,
            studyMinutes,
            studyHours: Number((studyMinutes / 60).toFixed(2))
        },
        goals: {
            completed: goalsCompleted,
            inProgress: goalsInProgress
        },
        activity: {
            totalEvents: activityEventsCount
        },
        activeSubjects: activeSubjects || [],
        consistency: {
            isActiveDay: streak.isActiveDay,
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            totalActiveDays: streak.totalActiveDays,
            consistencyScore: streak.consistencyScore
        },
        overdueTasksCount: (overdueTasks || []).length
    };

    // Idempotent upsert into automation_summaries
    await runQuery(
        automationModel.upsertSummary,
        userId,
        "daily",
        date,
        date,
        summaryPayload
    );

    return {
        summaryType: "daily",
        userId,
        periodStart: date,
        periodEnd: date,
        data: summaryPayload
    };
};

// =======================================
// WEEKLY SUMMARY PROCESSING
// =======================================

/**
 * Process and persist deterministic 7-day weekly summary for a user
 */
const processWeeklySummary = async (userId, endDateStr = null) => {
    const end = isValidDateString(endDateStr) ? endDateStr : getYesterdayString();
    const range = getDateRangeDays(end, 7);

    // Reuse Phase 3 complete analytics
    const completeAnalytics = await analyticsService.getCompleteAnalytics(userId, "7d");
    const streak = await calculateUserStreak(userId, end);

    // Count active days in the 7-day window
    const activeDatesInWeek = await runQuery(
        automationModel.getQualifyingActiveDates,
        userId,
        range.startDate,
        range.endDate
    );
    const activeDaysCount = (activeDatesInWeek || []).length;

    // Detect most productive day in the week (by focus + study time)
    let peakMinutes = -1;
    let mostProductiveDay = null;

    if (Array.isArray(completeAnalytics?.study?.dailyTrend)) {
        completeAnalytics.study.dailyTrend.forEach((d) => {
            const pom = completeAnalytics.pomodoro?.dailyTrend?.find(p => p.date === d.date);
            const totalMin = (Number(d.studyMinutes) || 0) + (Number(pom?.focusMinutes) || 0);
            if (totalMin > peakMinutes) {
                peakMinutes = totalMin;
                mostProductiveDay = d.date;
            }
        });
    }

    const summaryPayload = {
        periodStart: range.startDate,
        periodEnd: range.endDate,
        overview: {
            totalTasksCompleted: completeAnalytics.overview.completedTasks,
            totalTasksCreated: completeAnalytics.overview.totalTasks,
            taskCompletionRate: completeAnalytics.overview.taskCompletionRate,
            overdueTasks: completeAnalytics.overview.overdueTasks,

            totalFocusMinutes: completeAnalytics.overview.pomodoroMinutes,
            totalFocusHours: completeAnalytics.overview.pomodoroHours,
            completedPomodoroSessions: completeAnalytics.overview.completedPomodoroSessions,

            totalStudyMinutes: completeAnalytics.overview.totalStudyMinutes,
            totalStudyHours: completeAnalytics.overview.totalStudyHours,
            totalStudySessions: completeAnalytics.overview.totalStudySessions,

            totalGoalsCompleted: completeAnalytics.overview.completedGoals,
            goalCompletionRate: completeAnalytics.overview.goalCompletionRate,

            totalActivityEvents: completeAnalytics.overview.totalActivityEvents
        },
        consistency: {
            activeDaysCount,
            totalDays: 7,
            weeklyConsistencyRate: Number(((activeDaysCount / 7) * 100).toFixed(1)),
            currentStreak: streak.currentStreak,
            longestStreak: streak.longestStreak,
            mostProductiveDay
        },
        subjectBreakdown: completeAnalytics.study.bySubject || [],
        tasksByPriority: completeAnalytics.tasks.byPriority || [],
        dailyTrend: completeAnalytics.study.dailyTrend || []
    };

    // Idempotent upsert into automation_summaries
    await runQuery(
        automationModel.upsertSummary,
        userId,
        "weekly",
        range.startDate,
        range.endDate,
        summaryPayload
    );

    return {
        summaryType: "weekly",
        userId,
        periodStart: range.startDate,
        periodEnd: range.endDate,
        data: summaryPayload
    };
};

// =======================================
// OVERDUE TASK AUDIT & ALERTING (IDEMPOTENT)
// =======================================

/**
 * Detect overdue tasks and idempotently create notifications without mutating user task statuses
 */
const processOverdueTasks = async (userId, asOfDateStr = null, notify = true) => {
    const asOfDate = isValidDateString(asOfDateStr) ? asOfDateStr : getTodayString();

    const overdueTasks = await runQuery(automationModel.getOverdueTasks, userId, asOfDate);
    let notificationsCreated = 0;

    if (notify && Array.isArray(overdueTasks) && overdueTasks.length > 0) {
        for (const task of overdueTasks) {
            // Check if notification already dispatched today for this task (Idempotency)
            const exists = await runQuery(
                automationModel.checkExistingNotification,
                userId,
                "TASK_OVERDUE",
                "task",
                task.task_id,
                asOfDate
            );

            if (!exists) {
                const title = `Task Overdue: ${task.title}`;
                const message = `Task "${task.title}" was due on ${task.due_date} (${task.days_overdue} day(s) overdue).`;

                await runQuery(
                    notificationModel.createNotification,
                    userId,
                    "TASK_OVERDUE",
                    title,
                    message,
                    "task",
                    task.task_id
                );
                notificationsCreated++;
            }
        }
    }

    return {
        userId,
        asOfDate,
        overdueCount: (overdueTasks || []).length,
        overdueTasks: overdueTasks || [],
        notificationsCreated
    };
};

// =======================================
// GOAL PROGRESS AUDIT
// =======================================

/**
 * Deterministically audit goal statuses based on schema invariants
 */
const auditGoalProgress = async (userId) => {
    const goals = await runQuery(goalModel.getAllGoals, userId);

    let completedCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;
    let overdueCount = 0;

    const todayStr = getTodayString();

    const auditedGoals = (goals || []).map((g) => {
        const targetDateStr = g.target_date ? formatDate(g.target_date) : null;
        const isCompleted = g.status === "Completed" || Number(g.progress_percentage) >= 100;
        const isOverdue = !isCompleted && targetDateStr && targetDateStr < todayStr;

        let derivedStatus = g.status;
        if (isCompleted) {
            derivedStatus = "Completed";
            completedCount++;
        } else if (isOverdue) {
            overdueCount++;
            derivedStatus = "Overdue";
        } else if (Number(g.progress_percentage) > 0) {
            inProgressCount++;
            derivedStatus = "In Progress";
        } else {
            notStartedCount++;
            derivedStatus = "Not Started";
        }

        return {
            goal_id: g.goal_id,
            title: g.title,
            target_date: targetDateStr,
            progress_percentage: Number(g.progress_percentage) || 0,
            status: g.status,
            derivedStatus,
            isOverdue
        };
    });

    return {
        userId,
        totalGoals: (goals || []).length,
        completedCount,
        inProgressCount,
        notStartedCount,
        overdueCount,
        goals: auditedGoals
    };
};

/**
 * Fetch latest automation summaries for context building
 */
const getLatestSummaries = async (userId, limit = 2) => {
    return runQuery(automationModel.getSummaryHistory, userId, "daily", limit);
};

module.exports = {
    calculateUserStreak,
    processDailySummary,
    processWeeklySummary,
    processOverdueTasks,
    auditGoalProgress,
    getLatestSummaries
};
