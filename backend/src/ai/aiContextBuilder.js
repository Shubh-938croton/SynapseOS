const analyticsService = require("../services/analyticsService");
const automationService = require("../services/automationService");
const analyticsModel = require("../models/analyticsModel");
const automationModel = require("../models/automationModel");
const taskModel = require("../models/taskModel");
const goalModel = require("../models/goalModel");
const subjectModel = require("../models/subjectModel");
const settingsModel = require("../models/settingsModel");
const { getTodayString, getYesterdayString, formatDate } = require("../utils/dateUtils");
const { getAIConfig } = require("./aiConfig");
const { detectSignals } = require("./signals/deterministicSignals");

const runQuery = (modelFn, ...args) => {
    return new Promise((resolve, reject) => {
        modelFn(...args, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * AI Context Builder
 * Assembles data-minimized, user-scoped trusted context from existing services
 */

const buildInsightsContext = async (userId, period = "7d") => {
    const [analytics, streak, goalsRaw] = await Promise.all([
        analyticsService.getCompleteAnalytics(userId, period),
        automationService.calculateUserStreak(userId),
        runQuery(goalModel.getAllGoals, userId).catch(() => [])
    ]);

    const activeGoals = (goalsRaw || [])
        .filter(g => g.status !== "Completed" && Number(g.progress_percentage) < 100)
        .slice(0, 5)
        .map(g => ({
            goal_id: g.goal_id,
            title: g.title,
            progress_percentage: g.progress_percentage,
            status: g.status,
            target_date: g.target_date ? formatDate(g.target_date) : null
        }));

    const overview = {
        tasksCompleted: analytics.overview.completedTasks,
        totalTasks: analytics.overview.totalTasks,
        completionRate: `${analytics.overview.taskCompletionRate}%`,
        overdueTasks: analytics.overview.overdueTasks,
        focusMinutes: analytics.overview.pomodoroMinutes,
        focusHours: analytics.overview.pomodoroHours,
        completedFocusSessions: analytics.overview.completedPomodoroSessions,
        studyMinutes: analytics.overview.totalStudyMinutes,
        studyHours: analytics.overview.totalStudyHours,
        completedGoals: analytics.overview.completedGoals,
        totalGoals: analytics.overview.totalGoals,
        totalActivityEvents: analytics.overview.totalActivityEvents
    };

    const consistency = {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        totalActiveDays: streak.totalActiveDays,
        consistencyScore: `${streak.consistencyScore}%`
    };

    const topSubjects = (analytics.study?.bySubject || []).slice(0, 4);

    const signals = detectSignals({
        overview,
        consistency,
        activeGoals,
        subjects: topSubjects
    });

    return {
        referenceDate: getTodayString(),
        period,
        overview,
        consistency,
        activeGoals,
        topSubjects,
        deterministicSignals: signals
    };
};

const buildPlannerContext = async (userId, targetDate = null) => {
    const date = targetDate || getTodayString();

    const [allTasks, overdueTasks, settingsRaw, subjectsRaw, goalsRaw] = await Promise.all([
        runQuery(taskModel.getAllTasks, userId).catch(() => []),
        runQuery(automationModel.getOverdueTasks, userId, date).catch(() => []),
        runQuery(settingsModel.getSettings, userId).catch(() => []),
        runQuery(subjectModel.getAllSubjects, userId).catch(() => []),
        runQuery(goalModel.getAllGoals, userId).catch(() => [])
    ]);

    const settings = settingsRaw && settingsRaw[0] ? settingsRaw[0] : {};
    const subjectMap = new Map((subjectsRaw || []).map(s => [s.subject_id, s.subject_name]));

    // Filter to active pending tasks only, cap at 12 to respect token limits
    const pendingTasks = (allTasks || [])
        .filter(t => t.status !== "Completed")
        .slice(0, 12)
        .map(t => ({
            task_id: t.task_id,
            title: t.title,
            priority: t.priority,
            due_date: t.due_date ? formatDate(t.due_date) : null,
            subject_name: subjectMap.get(t.subject_id) || "General",
            is_overdue: t.due_date && formatDate(t.due_date) < date
        }));

    const activeGoals = (goalsRaw || [])
        .filter(g => g.status !== "Completed")
        .slice(0, 3)
        .map(g => ({ title: g.title, progress: `${g.progress_percentage}%` }));

    return {
        planningDate: date,
        dayOfWeek: new Date(date).toLocaleDateString("en-US", { weekday: "long" }),
        dailyGoalMinutes: settings.daily_goal_minutes || 120,
        pomodoroDuration: settings.pomodoro_duration || 25,
        overdueCount: (overdueTasks || []).length,
        tasks: pendingTasks,
        activeGoals
    };
};

const buildDailyBriefContext = async (userId, targetDate = null) => {
    const date = targetDate || getTodayString();

    const [plannerCtx, insightsCtx, latestSummariesRaw, settingsRaw] = await Promise.all([
        buildPlannerContext(userId, date),
        buildInsightsContext(userId, "7d"),
        automationService.getLatestSummaries(userId, 2).catch(() => []),
        runQuery(settingsModel.getSettings, userId).catch(() => [])
    ]);

    const settings = settingsRaw && settingsRaw[0] ? settingsRaw[0] : {};

    const signals = detectSignals({
        overview: insightsCtx.overview,
        consistency: insightsCtx.consistency,
        tasks: plannerCtx.tasks,
        overdueCount: plannerCtx.overdueCount,
        activeGoals: plannerCtx.activeGoals,
        subjects: insightsCtx.topSubjects
    });

    const factualOverview = {
        date,
        dayOfWeek: plannerCtx.dayOfWeek,
        timezone: process.env.AUTOMATION_TIMEZONE || "Asia/Kolkata",
        currentStreak: insightsCtx.consistency.currentStreak,
        totalActiveDays: insightsCtx.consistency.totalActiveDays,
        overdueTasksCount: plannerCtx.overdueCount,
        pendingTasksCount: plannerCtx.tasks.length,
        dailyGoalMinutes: plannerCtx.dailyGoalMinutes,
        tasksCompleted7d: insightsCtx.overview.tasksCompleted,
        studyHours7d: insightsCtx.overview.studyHours,
        focusHours7d: insightsCtx.overview.focusHours
    };

    return {
        factualOverview,
        deterministicSignals: signals,
        tasks: plannerCtx.tasks,
        activeGoals: plannerCtx.activeGoals,
        recentSummaries: latestSummariesRaw.map(s => ({
            type: s.summary_type,
            period: `${s.period_start} to ${s.period_end}`,
            data: s.summary_data
        }))
    };
};

const buildWeakAreasContext = async (userId) => {
    const [progressBySubject, studyBySubject, overdueTasks] = await Promise.all([
        runQuery(analyticsModel.getProgressBySubject, userId).catch(() => []),
        runQuery(analyticsModel.getStudyTimeBySubject, userId).catch(() => []),
        runQuery(automationModel.getOverdueTasks, userId, getTodayString()).catch(() => [])
    ]);

    const overdueBySubject = new Map();
    (overdueTasks || []).forEach(t => {
        const sub = t.subject_name || "General";
        overdueBySubject.set(sub, (overdueBySubject.get(sub) || 0) + 1);
    });

    const subjectsMetrics = (progressBySubject || []).map(s => ({
        subject_name: s.subject_name,
        completion_percentage: `${s.completion_percentage}%`,
        total_study_minutes: s.total_study_minutes,
        tasks_completed: s.tasks_completed,
        overdue_tasks_count: overdueBySubject.get(s.subject_name) || 0
    }));

    return {
        totalSubjects: subjectsMetrics.length,
        subjects: subjectsMetrics,
        totalOverdueTasks: (overdueTasks || []).length
    };
};

const buildWeeklyReviewContext = async (userId, endDateStr = null) => {
    const date = endDateStr || getYesterdayString();
    let weeklySummary = await runQuery(automationModel.getSummary, userId, "weekly", date).catch(() => null);

    if (!weeklySummary) {
        const gen = await automationService.processWeeklySummary(userId, date);
        weeklySummary = { summary_data: gen.data };
    }

    return weeklySummary.summary_data;
};

const buildParseTaskContext = async (userId) => {
    const [subjectsRaw, settingsRaw] = await Promise.all([
        runQuery(subjectModel.getAllSubjects, userId).catch(() => []),
        runQuery(settingsModel.getSettings, userId).catch(() => [])
    ]);

    const now = new Date();

    return {
        currentDate: getTodayString(),
        currentTime: now.toTimeString().split(" ")[0].substring(0, 5),
        dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
        timezone: process.env.AUTOMATION_TIMEZONE || "Asia/Kolkata",
        subjects: (subjectsRaw || []).map(s => ({ subject_id: s.subject_id, subject_name: s.subject_name }))
    };
};

const buildUserContext = async (userId, options = {}) => {
    const timeRange = options.timeRange || "7d";
    const [insightsCtx, plannerCtx] = await Promise.all([
        buildInsightsContext(userId, timeRange).catch(() => ({})),
        buildPlannerContext(userId).catch(() => ({}))
    ]);

    return {
        userId,
        timeRange,
        analytics: insightsCtx.overview || {},
        subjectBreakdown: insightsCtx.topSubjects || [],
        consistency: insightsCtx.consistency || {},
        deterministicSignals: insightsCtx.deterministicSignals || [],
        tasks: (plannerCtx.tasks || []).map(t => ({
            taskId: t.task_id,
            title: t.title,
            priority: t.priority,
            dueDate: t.due_date,
            subjectName: t.subject_name
        })),
        activeGoals: plannerCtx.activeGoals || []
    };
};

module.exports = {
    buildInsightsContext,
    buildPlannerContext,
    buildDailyBriefContext,
    buildWeakAreasContext,
    buildWeeklyReviewContext,
    buildParseTaskContext,
    buildUserContext
};
