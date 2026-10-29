const automationModel = require("../models/automationModel");
const automationService = require("../services/automationService");
const { getTodayString } = require("../utils/dateUtils");

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

/**
 * Overdue Task Job Runner
 * Iterates through users, identifies overdue tasks, and creates idempotent notifications without mutating task status
 */
const runOverdueTaskJob = async (options = {}) => {
    const asOfDate = options.date || getTodayString();
    const specificUserId = options.userId || null;
    const notify = options.notify !== false;
    const jobName = "OVERDUE_TASK_JOB";

    console.log(`[Job: ${jobName}] Starting execution for date: ${asOfDate}...`);

    let runId = null;
    try {
        runId = await runQuery(automationModel.createRunLog, jobName);
    } catch (err) {
        console.error(`[Job: ${jobName}] Failed to create run log:`, err.message);
    }

    let userIds = [];
    try {
        if (specificUserId) {
            userIds = [Number(specificUserId)];
        } else {
            userIds = await runQuery(automationModel.getAllUserIds);
        }
    } catch (err) {
        console.error(`[Job: ${jobName}] Failed to fetch user IDs:`, err.message);
        if (runId) {
            await runQuery(
                automationModel.updateRunLog,
                runId,
                "failed",
                0,
                0,
                0,
                { fatalError: err.message }
            ).catch(() => {});
        }
        return {
            jobName,
            status: "failed",
            error: err.message
        };
    }

    let succeededCount = 0;
    let failedCount = 0;
    let totalNotificationsCreated = 0;
    const errors = [];

    for (const userId of userIds) {
        try {
            const res = await automationService.processOverdueTasks(userId, asOfDate, notify);
            totalNotificationsCreated += res.notificationsCreated;
            succeededCount++;
        } catch (userErr) {
            failedCount++;
            errors.push({ userId, error: userErr.message });
            console.error(`[Job: ${jobName}] Error processing user ${userId}:`, userErr.message);
        }
    }

    const finalStatus = failedCount === 0 ? "success" : (succeededCount > 0 ? "partial_failure" : "failed");

    if (runId) {
        try {
            await runQuery(
                automationModel.updateRunLog,
                runId,
                finalStatus,
                userIds.length,
                succeededCount,
                failedCount,
                errors.length > 0 ? errors : null
            );
        } catch (err) {
            console.error(`[Job: ${jobName}] Failed to update run log:`, err.message);
        }
    }

    console.log(`[Job: ${jobName}] Completed. Users: ${userIds.length}, Notifications: ${totalNotificationsCreated}, Status: ${finalStatus}`);

    return {
        jobName,
        asOfDate,
        status: finalStatus,
        usersProcessed: userIds.length,
        usersSucceeded: succeededCount,
        usersFailed: failedCount,
        totalNotificationsCreated,
        errors
    };
};

module.exports = {
    runOverdueTaskJob
};
