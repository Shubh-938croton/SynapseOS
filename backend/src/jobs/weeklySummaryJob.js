const automationModel = require("../models/automationModel");
const automationService = require("../services/automationService");
const { getYesterdayString } = require("../utils/dateUtils");

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
 * Weekly Summary Job Runner
 * Iterates through all registered users and generates/persists idempotent weekly summaries
 */
const runWeeklySummaryJob = async (options = {}) => {
    const endDate = options.date || getYesterdayString();
    const specificUserId = options.userId || null;
    const jobName = "WEEKLY_SUMMARY_JOB";

    console.log(`[Job: ${jobName}] Starting execution for 7-day period ending on: ${endDate}...`);

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
    const errors = [];

    for (const userId of userIds) {
        try {
            await automationService.processWeeklySummary(userId, endDate);
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

    console.log(`[Job: ${jobName}] Completed. Processed: ${userIds.length}, Succeeded: ${succeededCount}, Failed: ${failedCount}. Status: ${finalStatus}`);

    return {
        jobName,
        endDate,
        status: finalStatus,
        usersProcessed: userIds.length,
        usersSucceeded: succeededCount,
        usersFailed: failedCount,
        errors
    };
};

module.exports = {
    runWeeklySummaryJob
};
