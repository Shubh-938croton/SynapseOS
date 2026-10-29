const cron = require("node-cron");
const { runDailySummaryJob, runWeeklySummaryJob, runOverdueTaskJob } = require("../jobs");

// In-memory registry of scheduled tasks
const scheduledTasks = [];
let isRunning = false;

/**
 * Get Scheduler Configuration from Environment
 */
const getSchedulerConfig = () => {
    return {
        enabled: (process.env.AUTOMATION_ENABLED || "false").toLowerCase() === "true",
        timezone: process.env.AUTOMATION_TIMEZONE || "Asia/Kolkata",
        dailyCron: process.env.AUTOMATION_DAILY_CRON || "0 0 * * *", // 00:00 every day
        weeklyCron: process.env.AUTOMATION_WEEKLY_CRON || "0 0 * * 0", // 00:00 every Sunday
        overdueCron: process.env.AUTOMATION_OVERDUE_CRON || "0 8 * * *" // 08:00 every day
    };
};

/**
 * Start Background Scheduler
 */
const startScheduler = () => {
    const config = getSchedulerConfig();

    if (!config.enabled) {
        console.log("ℹ️ [Scheduler] Automation scheduler is DISABLED (AUTOMATION_ENABLED != true).");
        return { started: false, reason: "disabled" };
    }

    if (isRunning) {
        console.log("⚠️ [Scheduler] Scheduler is already running.");
        return { started: true, reason: "already_running" };
    }

    stopScheduler(); // Clean any previous tasks

    console.log(`🚀 [Scheduler] Initializing automation cron jobs with timezone: ${config.timezone}`);

    try {
        // 1. Daily Summary Job (runs at configured daily schedule, processes yesterday)
        const dailyTask = cron.schedule(
            config.dailyCron,
            async () => {
                console.log("[Scheduler] Triggering scheduled Daily Summary Job...");
                try {
                    await runDailySummaryJob();
                } catch (err) {
                    console.error("[Scheduler] Error in Daily Summary Job:", err);
                }
            },
            {
                timezone: config.timezone
            }
        );
        scheduledTasks.push({ name: "DAILY_SUMMARY", task: dailyTask, cron: config.dailyCron });

        // 2. Weekly Summary Job (runs at configured weekly schedule)
        const weeklyTask = cron.schedule(
            config.weeklyCron,
            async () => {
                console.log("[Scheduler] Triggering scheduled Weekly Summary Job...");
                try {
                    await runWeeklySummaryJob();
                } catch (err) {
                    console.error("[Scheduler] Error in Weekly Summary Job:", err);
                }
            },
            {
                timezone: config.timezone
            }
        );
        scheduledTasks.push({ name: "WEEKLY_SUMMARY", task: weeklyTask, cron: config.weeklyCron });

        // 3. Overdue Task Detection Job (runs daily at 8:00 AM)
        const overdueTask = cron.schedule(
            config.overdueCron,
            async () => {
                console.log("[Scheduler] Triggering scheduled Overdue Task Job...");
                try {
                    await runOverdueTaskJob();
                } catch (err) {
                    console.error("[Scheduler] Error in Overdue Task Job:", err);
                }
            },
            {
                timezone: config.timezone
            }
        );
        scheduledTasks.push({ name: "OVERDUE_TASK", task: overdueTask, cron: config.overdueCron });

        isRunning = true;
        console.log(`✅ [Scheduler] Successfully registered ${scheduledTasks.length} automation cron tasks.`);
        return { started: true, taskCount: scheduledTasks.length, config };
    } catch (err) {
        console.error("❌ [Scheduler] Failed to initialize scheduler:", err.message);
        stopScheduler();
        return { started: false, error: err.message };
    }
};

/**
 * Stop all active scheduler jobs
 */
const stopScheduler = () => {
    while (scheduledTasks.length > 0) {
        const item = scheduledTasks.pop();
        if (item && item.task && typeof item.task.stop === "function") {
            item.task.stop();
            if (typeof item.task.destroy === "function") {
                item.task.destroy();
            }
        }
    }
    isRunning = false;
    console.log("⏹️ [Scheduler] All background automation jobs stopped.");
};

/**
 * Get current scheduler status
 */
const getSchedulerStatus = () => {
    const config = getSchedulerConfig();
    return {
        enabled: config.enabled,
        isRunning,
        timezone: config.timezone,
        activeTaskCount: scheduledTasks.length,
        tasks: scheduledTasks.map(t => ({ name: t.name, cron: t.cron }))
    };
};

module.exports = {
    getSchedulerConfig,
    startScheduler,
    stopScheduler,
    getSchedulerStatus
};
