const taskModel = require("../../models/taskModel");
const { recordEvent, EVENT_TYPES, ENTITY_TYPES } = require("../../services/activityEventService");
const { isValidDateString, formatDate } = require("../../utils/dateUtils");

const ACTION_TYPES = Object.freeze({
    RESCHEDULE_TASK: "RESCHEDULE_TASK",
    PRIORITIZE_TASK: "PRIORITIZE_TASK",
    CREATE_SUBTASK: "CREATE_SUBTASK",
    UPDATE_TASK_DURATION: "UPDATE_TASK_DURATION"
});

const runModelQuery = (fn, ...args) => {
    return new Promise((resolve, reject) => {
        fn(...args, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

/**
 * Validates and executes a single user-approved AI action proposal
 * through existing domain models and services.
 * 
 * @param {number} userId Authenticated user ID
 * @param {Object} proposal The action proposal payload approved by user
 * @returns {Promise<Object>} Execution summary and updated entity details
 */
const executeActionProposal = async (userId, proposal) => {
    if (!proposal || typeof proposal !== "object") {
        const err = new Error("Invalid proposal payload: Object required.");
        err.status = 400;
        err.code = "INVALID_PROPOSAL";
        throw err;
    }

    const { action, targetEntityType = "task", targetEntityId, expectedCurrentValue, proposedValue, reason } = proposal;

    if (!Object.values(ACTION_TYPES).includes(action)) {
        const err = new Error(`Unsupported action type: "${action}".`);
        err.status = 400;
        err.code = "INVALID_ACTION_TYPE";
        throw err;
    }

    // ==========================================
    // ACTION 1: RESCHEDULE TASK
    // ==========================================
    if (action === ACTION_TYPES.RESCHEDULE_TASK) {
        if (!targetEntityId || isNaN(Number(targetEntityId))) {
            const err = new Error("Valid numeric targetEntityId is required for task rescheduling.");
            err.status = 400;
            err.code = "INVALID_ENTITY_ID";
            throw err;
        }

        const taskId = Number(targetEntityId);
        const taskRows = await runModelQuery(taskModel.getTaskById, userId, taskId);

        if (!taskRows || taskRows.length === 0) {
            const err = new Error(`Task #${taskId} not found or does not belong to the user.`);
            err.status = 404;
            err.code = "ENTITY_NOT_FOUND";
            throw err;
        }

        const currentTask = taskRows[0];

        // Stale Proposal Invariant: Optimistic verification of current state
        if (expectedCurrentValue !== undefined && expectedCurrentValue !== null) {
            const currentDbDate = currentTask.due_date ? formatDate(currentTask.due_date) : null;
            const expectedClean = expectedCurrentValue ? formatDate(expectedCurrentValue) : null;

            if (currentDbDate !== expectedClean) {
                const err = new Error(`Stale proposal: Task #${taskId} due date was changed to "${currentDbDate}" after this proposal was generated.`);
                err.status = 409;
                err.code = "STALE_PROPOSAL";
                throw err;
            }
        }

        // Validate proposed new due date
        if (!isValidDateString(proposedValue)) {
            const err = new Error(`Invalid proposed due date format: "${proposedValue}". Expected YYYY-MM-DD.`);
            err.status = 400;
            err.code = "INVALID_PROPOSED_VALUE";
            throw err;
        }

        // Execute domain update
        await runModelQuery(taskModel.updateTask, userId, taskId, { due_date: proposedValue });

        // Record domain activity events
        recordEvent({
            userId,
            eventType: EVENT_TYPES.TASK_RESCHEDULED,
            entityType: ENTITY_TYPES.TASK,
            entityId: taskId,
            metadata: {
                previous_due_date: currentTask.due_date ? formatDate(currentTask.due_date) : null,
                new_due_date: proposedValue,
                source: "user_approved_ai_proposal",
                reason: reason || "Rescheduled via AI action proposal"
            }
        });

        return {
            success: true,
            action: ACTION_TYPES.RESCHEDULE_TASK,
            taskId,
            previousDueDate: currentTask.due_date ? formatDate(currentTask.due_date) : null,
            updatedDueDate: proposedValue,
            message: `Task #${taskId} successfully rescheduled to ${proposedValue}.`
        };
    }

    // ==========================================
    // ACTION 2: PRIORITIZE TASK
    // ==========================================
    if (action === ACTION_TYPES.PRIORITIZE_TASK) {
        if (!targetEntityId || isNaN(Number(targetEntityId))) {
            const err = new Error("Valid numeric targetEntityId is required for task reprioritization.");
            err.status = 400;
            err.code = "INVALID_ENTITY_ID";
            throw err;
        }

        const taskId = Number(targetEntityId);
        const taskRows = await runModelQuery(taskModel.getTaskById, userId, taskId);

        if (!taskRows || taskRows.length === 0) {
            const err = new Error(`Task #${taskId} not found or does not belong to the user.`);
            err.status = 404;
            err.code = "ENTITY_NOT_FOUND";
            throw err;
        }

        const currentTask = taskRows[0];

        // Stale Proposal Invariant
        if (expectedCurrentValue && currentTask.priority?.toLowerCase() !== expectedCurrentValue.toLowerCase()) {
            const err = new Error(`Stale proposal: Task #${taskId} priority was already changed to "${currentTask.priority}".`);
            err.status = 409;
            err.code = "STALE_PROPOSAL";
            throw err;
        }

        const validPriorities = ["High", "Medium", "Low"];
        const normalizedPriority = validPriorities.find(p => p.toLowerCase() === (proposedValue || "").toLowerCase());
        if (!normalizedPriority) {
            const err = new Error(`Invalid priority value: "${proposedValue}". Expected High, Medium, or Low.`);
            err.status = 400;
            err.code = "INVALID_PROPOSED_VALUE";
            throw err;
        }

        await runModelQuery(taskModel.updateTask, userId, taskId, { priority: normalizedPriority });

        recordEvent({
            userId,
            eventType: EVENT_TYPES.TASK_UPDATED,
            entityType: ENTITY_TYPES.TASK,
            entityId: taskId,
            metadata: {
                previous_priority: currentTask.priority,
                new_priority: normalizedPriority,
                source: "user_approved_ai_proposal"
            }
        });

        return {
            success: true,
            action: ACTION_TYPES.PRIORITIZE_TASK,
            taskId,
            previousPriority: currentTask.priority,
            updatedPriority: normalizedPriority,
            message: `Task #${taskId} priority set to ${normalizedPriority}.`
        };
    }

    // ==========================================
    // ACTION 3: CREATE SUBTASK
    // ==========================================
    if (action === ACTION_TYPES.CREATE_SUBTASK) {
        const taskData = typeof proposedValue === "object" ? proposedValue : { title: String(proposedValue) };
        if (!taskData.title || !taskData.title.trim()) {
            const err = new Error("Task title is required to create a subtask.");
            err.status = 400;
            err.code = "INVALID_TASK_TITLE";
            throw err;
        }

        const cleanDueDate = isValidDateString(taskData.dueDate || taskData.due_date)
            ? (taskData.dueDate || taskData.due_date)
            : formatDate(new Date());

        const newTask = {
            user_id: userId,
            subject_id: taskData.subjectId || taskData.subject_id || null,
            title: taskData.title.trim(),
            description: taskData.description || (reason ? `Subtask proposed by AI: ${reason}` : "Created via AI Action"),
            priority: ["High", "Medium", "Low"].includes(taskData.priority) ? taskData.priority : "Medium",
            status: "Pending",
            due_date: cleanDueDate
        };

        const result = await runModelQuery(taskModel.createTask, newTask);
        const createdTaskId = result.insertId;

        recordEvent({
            userId,
            eventType: EVENT_TYPES.TASK_CREATED,
            entityType: ENTITY_TYPES.TASK,
            entityId: createdTaskId,
            metadata: {
                title: newTask.title,
                priority: newTask.priority,
                status: newTask.status,
                due_date: newTask.due_date,
                source: "user_approved_ai_proposal"
            }
        });

        return {
            success: true,
            action: ACTION_TYPES.CREATE_SUBTASK,
            taskId: createdTaskId,
            title: newTask.title,
            dueDate: newTask.due_date,
            message: `Subtask "${newTask.title}" created successfully.`
        };
    }

    // ==========================================
    // ACTION 4: UPDATE TASK DURATION / NOTES
    // ==========================================
    if (action === ACTION_TYPES.UPDATE_TASK_DURATION) {
        const taskId = Number(targetEntityId);
        const taskRows = await runModelQuery(taskModel.getTaskById, userId, taskId);

        if (!taskRows || taskRows.length === 0) {
            const err = new Error(`Task #${taskId} not found.`);
            err.status = 404;
            err.code = "ENTITY_NOT_FOUND";
            throw err;
        }

        const durationMinutes = Number(proposedValue);
        if (isNaN(durationMinutes) || durationMinutes <= 0) {
            const err = new Error("Valid positive duration in minutes required.");
            err.status = 400;
            err.code = "INVALID_PROPOSED_VALUE";
            throw err;
        }

        const currentTask = taskRows[0];
        const updatedDesc = currentTask.description
            ? `${currentTask.description} [Est: ${durationMinutes}m]`
            : `[Est: ${durationMinutes}m]`;

        await runModelQuery(taskModel.updateTask, userId, taskId, { description: updatedDesc });

        recordEvent({
            userId,
            eventType: EVENT_TYPES.TASK_UPDATED,
            entityType: ENTITY_TYPES.TASK,
            entityId: taskId,
            metadata: {
                estimated_duration_minutes: durationMinutes,
                source: "user_approved_ai_proposal"
            }
        });

        return {
            success: true,
            action: ACTION_TYPES.UPDATE_TASK_DURATION,
            taskId,
            estimatedDurationMinutes: durationMinutes,
            message: `Task #${taskId} estimated duration set to ${durationMinutes} minutes.`
        };
    }

    throw new Error(`Unhandled action: ${action}`);
};

/**
 * Executes a batch of approved proposals sequentially with error isolation
 */
const executeBatchProposals = async (userId, proposals = []) => {
    if (!Array.isArray(proposals) || proposals.length === 0) {
        return { total: 0, succeeded: 0, failed: 0, results: [] };
    }

    const results = [];
    let succeeded = 0;
    let failed = 0;

    for (const proposal of proposals) {
        try {
            const res = await executeActionProposal(userId, proposal);
            results.push({ proposalId: proposal.id, status: "fulfilled", ...res });
            succeeded++;
        } catch (err) {
            results.push({
                proposalId: proposal.id,
                status: "rejected",
                error: err.message,
                code: err.code || "EXECUTION_FAILED"
            });
            failed++;
        }
    }

    return {
        total: proposals.length,
        succeeded,
        failed,
        results
    };
};

module.exports = {
    ACTION_TYPES,
    executeActionProposal,
    executeBatchProposals
};
