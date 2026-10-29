/**
 * Deterministic Signals Engine
 * Computes rule-based, empirical signals directly from verified analytics,
 * automation summaries, tasks, and study records before LLM interpretation.
 */

const SIGNAL_TYPES = Object.freeze({
    LOW_TASK_COMPLETION: "LOW_TASK_COMPLETION",
    HIGH_OVERDUE_TASK_COUNT: "HIGH_OVERDUE_TASK_COUNT",
    LOW_STUDY_ACTIVITY: "LOW_STUDY_ACTIVITY",
    INCONSISTENT_FOCUS: "INCONSISTENT_FOCUS",
    GOAL_STAGNATION: "GOAL_STAGNATION",
    STRONG_SUBJECT_ACTIVITY: "STRONG_SUBJECT_ACTIVITY",
    LAGGING_SUBJECT: "LAGGING_SUBJECT",
    STABLE_MOMENTUM: "STABLE_MOMENTUM",
    PERFECT_COMPLETION: "PERFECT_COMPLETION"
});

/**
 * Detect deterministic signals from user context data
 * @param {Object} context Unified context containing analytics, streak, tasks, subjects, goals
 * @returns {Array<Object>} List of detected signal objects
 */
const detectSignals = (context = {}) => {
    const signals = [];
    const overview = context.analytics?.overview || context.overview || {};
    const consistency = context.consistency || {};
    const tasks = Array.isArray(context.tasks) ? context.tasks : [];
    const activeGoals = Array.isArray(context.activeGoals) ? context.activeGoals : [];
    const subjects = Array.isArray(context.subjects) ? context.subjects : (context.subjectBreakdown || []);

    const totalTasks = Number(overview.totalTasks) || tasks.length;
    const completedTasks = Number(overview.completedTasks) || tasks.filter(t => t.status === "Completed").length;
    const pendingTasks = Number(overview.pendingTasks) || tasks.filter(t => t.status !== "Completed").length;
    const overdueTasks = Number(overview.overdueTasks) || (context.overdueCount ?? tasks.filter(t => t.is_overdue || t.isOverdue).length);
    const completionRate = totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 0.0;

    const studyMinutes = Number(overview.studyMinutes || overview.totalStudyMinutes) || 0;
    const pomodoroMinutes = Number(overview.focusMinutes || overview.pomodoroMinutes) || 0;
    const completedPomodoros = Number(overview.completedFocusSessions || overview.completedPomodoroSessions) || 0;
    const interruptedPomodoros = Number(overview.interruptedPomodoroSessions) || 0;
    const currentStreak = Number(consistency.currentStreak) || 0;

    // 1. High Overdue Tasks Signal
    if (overdueTasks >= 2) {
        signals.push({
            type: SIGNAL_TYPES.HIGH_OVERDUE_TASK_COUNT,
            severity: overdueTasks >= 4 ? "high" : "medium",
            label: "Elevated Overdue Workload",
            description: `${overdueTasks} tasks are currently overdue.`,
            metrics: { overdueTasks, totalTasks },
            evidence: `${overdueTasks} out of ${totalTasks} active tasks have passed their deadline.`
        });
    }

    // 2. Low Task Completion Rate Signal
    if (totalTasks >= 3 && completionRate < 50 && pendingTasks > 0) {
        signals.push({
            type: SIGNAL_TYPES.LOW_TASK_COMPLETION,
            severity: "medium",
            label: "Lagging Task Completion",
            description: `Completion rate is currently at ${completionRate}%.`,
            metrics: { completionRate, completedTasks, pendingTasks },
            evidence: `Only ${completedTasks} of ${totalTasks} tasks completed in the observed period.`
        });
    }

    // 3. Low Study Activity Signal
    if (subjects.length > 0 && studyMinutes < 30) {
        signals.push({
            type: SIGNAL_TYPES.LOW_STUDY_ACTIVITY,
            severity: "medium",
            label: "Low Logged Study Time",
            description: `Only ${studyMinutes} minutes of study logged across ${subjects.length} enrolled subjects.`,
            metrics: { studyMinutes, subjectCount: subjects.length },
            evidence: `Logged study duration (${studyMinutes}m) is below the minimum recommended active threshold.`
        });
    }

    // 4. Inconsistent Focus / High Interruption Signal
    if (completedPomodoros > 0 && interruptedPomodoros >= completedPomodoros) {
        signals.push({
            type: SIGNAL_TYPES.INCONSISTENT_FOCUS,
            severity: "medium",
            label: "High Focus Interruption Rate",
            description: `${interruptedPomodoros} focus sessions were abandoned or interrupted.`,
            metrics: { completedPomodoros, interruptedPomodoros },
            evidence: `Interrupted sessions (${interruptedPomodoros}) equal or exceed completed sessions (${completedPomodoros}).`
        });
    }

    // 5. Goal Stagnation Signal
    const stagnantGoals = activeGoals.filter(g => Number(g.progress_percentage || g.progress || 0) === 0);
    if (activeGoals.length > 0 && stagnantGoals.length >= 1) {
        signals.push({
            type: SIGNAL_TYPES.GOAL_STAGNATION,
            severity: "medium",
            label: "Goal Progress Stagnation",
            description: `${stagnantGoals.length} active goal(s) currently have 0% recorded progress.`,
            metrics: { stagnantGoalsCount: stagnantGoals.length, totalActiveGoals: activeGoals.length },
            evidence: `Goals like "${stagnantGoals[0].title}" require scheduled milestones.`
        });
    }

    // 6. Lagging Subject Detection
    for (const sub of subjects) {
        const subName = sub.subject_name || sub.subjectName || "Subject";
        const subOverdue = Number(sub.overdue_tasks_count || sub.overdueTasks || 0);
        const subComp = parseFloat(sub.completion_percentage || sub.completionRate || 0);
        const subMinutes = Number(sub.total_study_minutes || sub.studyMinutes || 0);

        if ((subOverdue >= 2 || (subComp < 30 && subOverdue >= 1)) && subMinutes < 45) {
            signals.push({
                type: SIGNAL_TYPES.LAGGING_SUBJECT,
                severity: "high",
                label: `Lagging Progress in ${subName}`,
                description: `${subName} has ${subOverdue} overdue tasks with only ${subMinutes}m study logged.`,
                metrics: { subjectName: subName, overdueTasks: subOverdue, studyMinutes: subMinutes, completionPercentage: subComp },
                evidence: `${subName} has low completion (${subComp}%) and unaddressed overdue tasks.`
            });
            break; // limit to most urgent subject to avoid prompt clutter
        }
    }

    // 7. Strong Subject Activity (Positive)
    if (studyMinutes >= 120 && subjects.length > 0) {
        const topSub = [...subjects].sort((a, b) => Number(b.total_study_minutes || b.studyMinutes || 0) - Number(a.total_study_minutes || a.studyMinutes || 0))[0];
        const topSubMinutes = Number(topSub?.total_study_minutes || topSub?.studyMinutes || 0);
        if (topSubMinutes >= 90) {
            signals.push({
                type: SIGNAL_TYPES.STRONG_SUBJECT_ACTIVITY,
                severity: "positive",
                label: `High Engagement in ${topSub.subject_name || topSub.subjectName}`,
                description: `${topSubMinutes} minutes dedicated to ${topSub.subject_name || topSub.subjectName}.`,
                metrics: { subjectName: topSub.subject_name || topSub.subjectName, studyMinutes: topSubMinutes },
                evidence: `${Math.round((topSubMinutes / studyMinutes) * 100)}% of total study time concentrated here.`
            });
        }
    }

    // 8. Stable Momentum Signal (Positive)
    if (currentStreak >= 3 && completionRate >= 65) {
        signals.push({
            type: SIGNAL_TYPES.STABLE_MOMENTUM,
            severity: "positive",
            label: "Consistent Study Momentum",
            description: `Active streak of ${currentStreak} days with ${completionRate}% task completion.`,
            metrics: { currentStreak, completionRate },
            evidence: `Maintained consistency over consecutive days.`
        });
    }

    // 9. Perfect Completion Signal (Positive)
    if (totalTasks >= 2 && pendingTasks === 0 && overdueTasks === 0) {
        signals.push({
            type: SIGNAL_TYPES.PERFECT_COMPLETION,
            severity: "positive",
            label: "All Tasks Completed",
            description: "Zero pending or overdue deliverables.",
            metrics: { completedTasks, totalTasks },
            evidence: `100% completion across all ${totalTasks} assigned tasks.`
        });
    }

    return signals;
};

module.exports = {
    SIGNAL_TYPES,
    detectSignals
};
