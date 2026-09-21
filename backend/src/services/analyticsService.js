const analyticsModel = require("../models/analyticsModel");

// =====================================================
// DATE & PERIOD UTILITIES
// =====================================================

const VALID_PERIODS = ["today", "1d", "7d", "30d", "all"];

/**
 * Format Date object to YYYY-MM-DD
 */
const formatDate = (date) => {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
};

/**
 * Calculate standard date range and generate complete contiguous date list
 */
const getPeriodDateRange = (period = "7d") => {
    const cleanPeriod = (period || "7d").toLowerCase().trim();
    const normalizedPeriod = VALID_PERIODS.includes(cleanPeriod) ? cleanPeriod : "7d";

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    let start = new Date();
    start.setHours(0, 0, 0, 0);

    let dayCount = 7;

    if (normalizedPeriod === "today" || normalizedPeriod === "1d") {
        dayCount = 1;
    } else if (normalizedPeriod === "7d") {
        dayCount = 7;
        start.setDate(start.getDate() - 6);
    } else if (normalizedPeriod === "30d") {
        dayCount = 30;
        start.setDate(start.getDate() - 29);
    } else if (normalizedPeriod === "all") {
        dayCount = 90; // default max historical window for trend charts
        start.setDate(start.getDate() - 89);
    }

    // Generate list of all YYYY-MM-DD dates in the range
    const allDates = [];
    const curr = new Date(start);
    while (curr <= end) {
        allDates.push(formatDate(curr));
        curr.setDate(curr.getDate() + 1);
    }

    return {
        period: normalizedPeriod,
        startDate: formatDate(start),
        endDate: formatDate(end),
        dayCount,
        allDates
    };
};

/**
 * Promisify callback-based model function
 */
const runQuery = (modelFn, userId, dateRange = null) => {
    return new Promise((resolve, reject) => {
        modelFn(userId, dateRange, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// =====================================================
// SERVICE METHODS
// =====================================================

/**
 * Get Productivity (Tasks) Analytics
 */
const getProductivityAnalytics = async (userId, period = "7d") => {
    const range = getPeriodDateRange(period);

    const [byPriority, trendRaw, overviewRaw] = await Promise.all([
        runQuery(analyticsModel.getTasksByPriority, userId, range),
        runQuery(analyticsModel.getTaskCompletionTrend, userId, range),
        runQuery(analyticsModel.getOverview, userId, range)
    ]);

    // Map raw trend to continuous date series
    const trendMap = new Map();
    if (Array.isArray(trendRaw)) {
        trendRaw.forEach((row) => {
            const dateStr = formatDate(row.completion_date);
            trendMap.set(dateStr, Number(row.completed_count) || 0);
        });
    }

    const dailyTrend = range.allDates.map((date) => ({
        date,
        completedCount: trendMap.get(date) || 0
    }));

    const totalTasks = Number(overviewRaw?.total_tasks) || 0;
    const completedTasks = Number(overviewRaw?.completed_tasks) || 0;
    const pendingTasks = Number(overviewRaw?.pending_tasks) || 0;
    const overdueTasks = Number(overviewRaw?.overdue_tasks) || 0;

    const completionRate = totalTasks > 0
        ? Number(((completedTasks / totalTasks) * 100).toFixed(1))
        : 0.0;

    return {
        period: range.period,
        startDate: range.startDate,
        endDate: range.endDate,
        metrics: {
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            completionRate
        },
        byPriority: byPriority || [],
        dailyTrend
    };
};

/**
 * Get Focus / Pomodoro Analytics
 */
const getFocusAnalytics = async (userId, period = "7d") => {
    const range = getPeriodDateRange(period);

    const [trendRaw, bySubject, overviewRaw] = await Promise.all([
        runQuery(analyticsModel.getPomodoroTrend, userId, range),
        runQuery(analyticsModel.getPomodoroBySubject, userId, range),
        runQuery(analyticsModel.getOverview, userId, range)
    ]);

    const trendMap = new Map();
    if (Array.isArray(trendRaw)) {
        trendRaw.forEach((row) => {
            const dateStr = formatDate(row.session_date);
            trendMap.set(dateStr, {
                sessionCount: Number(row.session_count) || 0,
                focusMinutes: Number(row.focus_minutes) || 0
            });
        });
    }

    const dailyTrend = range.allDates.map((date) => {
        const item = trendMap.get(date) || { sessionCount: 0, focusMinutes: 0 };
        return {
            date,
            sessionCount: item.sessionCount,
            focusMinutes: item.focusMinutes
        };
    });

    const totalSessions = Number(overviewRaw?.total_pomodoro_sessions) || 0;
    const completedSessions = Number(overviewRaw?.completed_pomodoro_sessions) || 0;
    const interruptedSessions = Number(overviewRaw?.interrupted_pomodoro_sessions) || 0;
    const totalFocusMinutes = Number(overviewRaw?.pomodoro_minutes) || 0;

    const averageSessionMinutes = completedSessions > 0
        ? Number((totalFocusMinutes / completedSessions).toFixed(1))
        : 0.0;

    return {
        period: range.period,
        startDate: range.startDate,
        endDate: range.endDate,
        metrics: {
            totalSessions,
            completedSessions,
            interruptedSessions,
            totalFocusMinutes,
            totalFocusHours: Number((totalFocusMinutes / 60).toFixed(2)),
            averageSessionMinutes
        },
        bySubject: bySubject || [],
        dailyTrend
    };
};

/**
 * Get Learning & Study Sessions Analytics
 */
const getLearningAnalytics = async (userId, period = "7d") => {
    const range = getPeriodDateRange(period);

    const [trendRaw, bySubject, progressBySubject, overviewRaw] = await Promise.all([
        runQuery(analyticsModel.getStudyTimeTrend, userId, range),
        runQuery(analyticsModel.getStudyTimeBySubject, userId, range),
        runQuery(analyticsModel.getProgressBySubject, userId, range),
        runQuery(analyticsModel.getOverview, userId, range)
    ]);

    const trendMap = new Map();
    if (Array.isArray(trendRaw)) {
        trendRaw.forEach((row) => {
            const dateStr = formatDate(row.study_date);
            trendMap.set(dateStr, Number(row.study_minutes) || 0);
        });
    }

    const dailyTrend = range.allDates.map((date) => ({
        date,
        studyMinutes: trendMap.get(date) || 0
    }));

    const totalSessions = Number(overviewRaw?.total_study_sessions) || 0;
    const totalStudyMinutes = Number(overviewRaw?.total_study_minutes) || 0;
    const averageSessionMinutes = Number(overviewRaw?.average_session_minutes) || 0;

    return {
        period: range.period,
        startDate: range.startDate,
        endDate: range.endDate,
        metrics: {
            totalSessions,
            totalStudyMinutes,
            totalStudyHours: Number((totalStudyMinutes / 60).toFixed(2)),
            averageSessionMinutes
        },
        bySubject: bySubject || [],
        progressBySubject: progressBySubject || [],
        dailyTrend
    };
};

/**
 * Get Goal Analytics
 */
const getGoalAnalytics = async (userId, period = "7d") => {
    const range = getPeriodDateRange(period);

    const [byStatus, overviewRaw] = await Promise.all([
        runQuery(analyticsModel.getGoalsByStatus, userId, range),
        runQuery(analyticsModel.getOverview, userId, range)
    ]);

    const totalGoals = Number(overviewRaw?.total_goals) || 0;
    const completedGoals = Number(overviewRaw?.completed_goals) || 0;
    const inProgressGoals = Number(overviewRaw?.in_progress_goals) || 0;
    const notStartedGoals = Number(overviewRaw?.not_started_goals) || 0;
    const overdueGoals = Number(overviewRaw?.overdue_goals) || 0;

    const completionRate = totalGoals > 0
        ? Number(((completedGoals / totalGoals) * 100).toFixed(1))
        : 0.0;

    return {
        period: range.period,
        startDate: range.startDate,
        endDate: range.endDate,
        metrics: {
            totalGoals,
            completedGoals,
            inProgressGoals,
            notStartedGoals,
            overdueGoals,
            completionRate
        },
        byStatus: byStatus || []
    };
};

/**
 * Get Activity / Behavior Event Analytics (from Phase 2 activity_events)
 */
const getActivityAnalytics = async (userId, period = "7d") => {
    const range = getPeriodDateRange(period);

    const [eventsSummary, eventsByType, eventsTrendRaw] = await Promise.all([
        runQuery(analyticsModel.getActivityEventsSummary, userId, range),
        runQuery(analyticsModel.getActivityEventsByType, userId, range),
        runQuery(analyticsModel.getActivityEventsTrend, userId, range)
    ]);

    const trendMap = new Map();
    let maxEvents = 0;
    let peakDay = null;

    if (Array.isArray(eventsTrendRaw)) {
        eventsTrendRaw.forEach((row) => {
            const dateStr = formatDate(row.event_date);
            const count = Number(row.event_count) || 0;
            trendMap.set(dateStr, count);
            if (count > maxEvents) {
                maxEvents = count;
                peakDay = dateStr;
            }
        });
    }

    const dailyTrend = range.allDates.map((date) => ({
        date,
        eventCount: trendMap.get(date) || 0
    }));

    const totalEvents = Number(eventsSummary?.total_events) || 0;

    return {
        period: range.period,
        startDate: range.startDate,
        endDate: range.endDate,
        metrics: {
            totalEvents,
            mostActiveDay: peakDay,
            peakEventCount: maxEvents
        },
        byType: eventsByType || [],
        dailyTrend
    };
};

/**
 * Get Unified Daily Time Series (Aggregated for all domains)
 */
const getDailyTimeSeries = async (userId, period = "7d") => {
    const range = getPeriodDateRange(period);

    const [tasksTrend, pomodoroTrend, studyTrend, activityTrend] = await Promise.all([
        runQuery(analyticsModel.getTaskCompletionTrend, userId, range),
        runQuery(analyticsModel.getPomodoroTrend, userId, range),
        runQuery(analyticsModel.getStudyTimeTrend, userId, range),
        runQuery(analyticsModel.getActivityEventsTrend, userId, range)
    ]);

    const taskMap = new Map();
    if (Array.isArray(tasksTrend)) {
        tasksTrend.forEach((r) => taskMap.set(formatDate(r.completion_date), Number(r.completed_count) || 0));
    }

    const pomodoroMap = new Map();
    if (Array.isArray(pomodoroTrend)) {
        pomodoroTrend.forEach((r) => pomodoroMap.set(formatDate(r.session_date), {
            minutes: Number(r.focus_minutes) || 0,
            sessions: Number(r.session_count) || 0
        }));
    }

    const studyMap = new Map();
    if (Array.isArray(studyTrend)) {
        studyTrend.forEach((r) => studyMap.set(formatDate(r.study_date), Number(r.study_minutes) || 0));
    }

    const activityMap = new Map();
    if (Array.isArray(activityTrend)) {
        activityTrend.forEach((r) => activityMap.set(formatDate(r.event_date), Number(r.event_count) || 0));
    }

    const days = range.allDates.map((date) => {
        const pom = pomodoroMap.get(date) || { minutes: 0, sessions: 0 };
        return {
            date,
            tasksCompleted: taskMap.get(date) || 0,
            focusMinutes: pom.minutes,
            focusSessions: pom.sessions,
            studyMinutes: studyMap.get(date) || 0,
            activityEvents: activityMap.get(date) || 0
        };
    });

    return {
        period: range.period,
        startDate: range.startDate,
        endDate: range.endDate,
        days
    };
};

/**
 * Get Comprehensive Analytics Package (Full unified payload for Stats page)
 */
const getCompleteAnalytics = async (userId, period = "7d") => {
    const range = getPeriodDateRange(period);

    const [
        productivity,
        focus,
        learning,
        goals,
        activity,
        notesBySubject,
        contestsByPlatform,
        calendarByStatus
    ] = await Promise.all([
        getProductivityAnalytics(userId, period),
        getFocusAnalytics(userId, period),
        getLearningAnalytics(userId, period),
        getGoalAnalytics(userId, period),
        getActivityAnalytics(userId, period),
        runQuery(analyticsModel.getNotesBySubject, userId, range),
        runQuery(analyticsModel.getContestsByPlatform, userId, range),
        runQuery(analyticsModel.getCalendarByStatus, userId, range)
    ]);

    // Construct standardized backwards-compatible overview
    const overview = {
        totalTasks: productivity.metrics.totalTasks,
        completedTasks: productivity.metrics.completedTasks,
        pendingTasks: productivity.metrics.pendingTasks,
        overdueTasks: productivity.metrics.overdueTasks,
        taskCompletionRate: productivity.metrics.completionRate,

        totalStudySessions: learning.metrics.totalSessions,
        totalStudyMinutes: learning.metrics.totalStudyMinutes,
        totalStudyHours: learning.metrics.totalStudyHours,
        averageSessionMinutes: learning.metrics.averageSessionMinutes,

        totalPomodoroSessions: focus.metrics.totalSessions,
        completedPomodoroSessions: focus.metrics.completedSessions,
        interruptedPomodoroSessions: focus.metrics.interruptedSessions,
        pomodoroMinutes: focus.metrics.totalFocusMinutes,
        pomodoroHours: focus.metrics.totalFocusHours,

        totalGoals: goals.metrics.totalGoals,
        completedGoals: goals.metrics.completedGoals,
        inProgressGoals: goals.metrics.inProgressGoals,
        notStartedGoals: goals.metrics.notStartedGoals,
        overdueGoals: goals.metrics.overdueGoals,
        goalCompletionRate: goals.metrics.completionRate,

        totalActivityEvents: activity.metrics.totalEvents,
        mostActiveDay: activity.metrics.mostActiveDay,

        totalNotes: (notesBySubject || []).reduce((acc, curr) => acc + (Number(curr.note_count) || 0), 0),
        totalContests: (contestsByPlatform || []).reduce((acc, curr) => acc + (Number(curr.contest_count) || 0), 0),
        totalCalendarEvents: (calendarByStatus || []).reduce((acc, curr) => acc + (Number(curr.event_count) || 0), 0)
    };

    return {
        message: "Analytics fetched successfully",
        period: range.period,
        startDate: range.startDate,
        endDate: range.endDate,
        overview,
        tasks: {
            byPriority: productivity.byPriority,
            completionTrend: productivity.dailyTrend
        },
        study: {
            dailyTrend: learning.dailyTrend,
            bySubject: learning.bySubject
        },
        progress: {
            bySubject: learning.progressBySubject
        },
        pomodoro: {
            dailyTrend: focus.dailyTrend,
            bySubject: focus.bySubject
        },
        goals: {
            byStatus: goals.byStatus
        },
        activity: {
            metrics: activity.metrics,
            byType: activity.byType,
            dailyTrend: activity.dailyTrend
        },
        notes: {
            bySubject: notesBySubject || []
        },
        contests: {
            byPlatform: contestsByPlatform || []
        },
        calendar: {
            byStatus: calendarByStatus || []
        }
    };
};

module.exports = {
    VALID_PERIODS,
    getPeriodDateRange,
    getProductivityAnalytics,
    getFocusAnalytics,
    getLearningAnalytics,
    getGoalAnalytics,
    getActivityAnalytics,
    getDailyTimeSeries,
    getCompleteAnalytics
};
