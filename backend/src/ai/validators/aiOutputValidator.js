/**
 * Strict AI Output Validation and Grounding Verification
 */

const { isValidDateString, formatDate } = require("../../utils/dateUtils");

const validateInsights = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid AI output: Expected a JSON object.");
    }
    if (!Array.isArray(data.insights)) {
        throw new Error("Invalid AI output: 'insights' must be an array.");
    }

    const validCategories = ["productivity", "focus", "learning", "goals"];
    const sanitizedInsights = data.insights.map((item, idx) => {
        if (!item.title || typeof item.title !== "string") {
            throw new Error(`Invalid insight at index ${idx}: Missing title.`);
        }
        if (!item.description || typeof item.description !== "string") {
            throw new Error(`Invalid insight at index ${idx}: Missing description.`);
        }
        const cat = (item.category || "productivity").toLowerCase();
        return {
            title: item.title.trim(),
            description: item.description.trim(),
            category: validCategories.includes(cat) ? cat : "productivity",
            evidence: Array.isArray(item.evidence) ? item.evidence.map(e => String(e)) : []
        };
    });

    return {
        summary: typeof data.summary === "string" ? data.summary.trim() : "Personalized insights generated.",
        insights: sanitizedInsights
    };
};

const validatePlanner = (data, context = null) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid AI output: Expected a JSON object.");
    }
    if (!Array.isArray(data.plan)) {
        throw new Error("Invalid AI output: 'plan' must be an array.");
    }

    // Extract valid task IDs from context if available
    let validTaskIds = null;
    if (context && Array.isArray(context.tasks)) {
        validTaskIds = new Set(context.tasks.map(t => Number(t.task_id || t.taskId)));
    }

    const sanitizedPlan = [];
    for (const item of data.plan) {
        const taskId = Number(item.taskId || item.task_id);
        if (isNaN(taskId)) continue;

        // Strict grounding rule: task ID must belong to context
        if (validTaskIds && !validTaskIds.has(taskId)) {
            console.warn(`[AI Grounding] Filtered out fabricated task ID ${taskId} not found in user context.`);
            continue;
        }

        sanitizedPlan.push({
            taskId,
            suggestedStart: item.suggestedStart || item.suggested_start || "09:00",
            suggestedDurationMinutes: Number(item.suggestedDurationMinutes || item.duration_minutes) || 45,
            priority: ["High", "Medium", "Low"].includes(item.priority) ? item.priority : "Medium",
            reason: item.reason ? String(item.reason).trim() : "Scheduled based on due date and focus priorities."
        });
    }

    return {
        date: data.date || new Date().toISOString().split("T")[0],
        totalPlannedMinutes: Number(data.totalPlannedMinutes) || sanitizedPlan.reduce((acc, p) => acc + p.suggestedDurationMinutes, 0),
        plan: sanitizedPlan,
        recommendations: Array.isArray(data.recommendations) ? data.recommendations.map(r => String(r)) : []
    };
};

const validateTaskBreakdown = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid AI output: Expected a JSON object.");
    }
    if (!Array.isArray(data.steps) || data.steps.length === 0) {
        throw new Error("Invalid AI output: 'steps' must be a non-empty array.");
    }

    const sanitizedSteps = data.steps.map((step, idx) => {
        if (!step.title || typeof step.title !== "string") {
            throw new Error(`Invalid step at index ${idx}: Missing title.`);
        }
        return {
            stepNumber: Number(step.stepNumber || step.step_number) || (idx + 1),
            title: step.title.trim(),
            estimatedMinutes: Number(step.estimatedMinutes || step.estimated_minutes) || 30,
            actionableAdvice: step.actionableAdvice ? String(step.actionableAdvice).trim() : ""
        };
    });

    return {
        originalTask: data.originalTask ? String(data.originalTask).trim() : "Task",
        totalEstimatedMinutes: Number(data.totalEstimatedMinutes) || sanitizedSteps.reduce((acc, s) => acc + s.estimatedMinutes, 0),
        steps: sanitizedSteps
    };
};

const validateWeakAreas = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid AI output: Expected a JSON object.");
    }

    const hasSufficientData = data.hasSufficientData !== false && data.status !== "insufficient_data";
    const areas = Array.isArray(data.areas) ? data.areas.map(a => ({
        subjectId: a.subjectId || a.subject_id || null,
        subjectName: a.subjectName ? String(a.subjectName).trim() : "Subject",
        concernLevel: ["High", "Moderate", "Low"].includes(a.concernLevel) ? a.concernLevel : "Moderate",
        reason: a.reason ? String(a.reason).trim() : "Requires additional study attention.",
        evidence: typeof a.evidence === "object" ? a.evidence : {},
        recommendedAction: a.recommendedAction ? String(a.recommendedAction).trim() : "Schedule dedicated focus session."
    })) : [];

    return {
        hasSufficientData,
        status: hasSufficientData ? "analysis_complete" : "insufficient_data",
        areas: hasSufficientData ? areas : [],
        summary: data.summary ? String(data.summary).trim() : "Academic weak area analysis completed."
    };
};

const validateWeeklyReview = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid AI output: Expected a JSON object.");
    }

    return {
        reviewPeriod: data.reviewPeriod ? String(data.reviewPeriod).trim() : "Past 7 Days",
        executiveSummary: data.executiveSummary ? String(data.executiveSummary).trim() : "Weekly review completed.",
        factualHighlights: Array.isArray(data.factualHighlights) ? data.factualHighlights.map(h => String(h)) : [],
        observations: Array.isArray(data.observations) ? data.observations.map(o => String(o)) : [],
        areasNeedingAttention: Array.isArray(data.areasNeedingAttention) ? data.areasNeedingAttention.map(a => String(a)) : [],
        recommendedPrioritiesNextWeek: Array.isArray(data.recommendedPrioritiesNextWeek) ? data.recommendedPrioritiesNextWeek.map(p => String(p)) : []
    };
};

const validateParseTask = (data) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid AI output: Expected a JSON object.");
    }
    if (!data.title || typeof data.title !== "string") {
        throw new Error("Invalid task parsing: Missing task title.");
    }

    const cleanDate = isValidDateString(data.dueDate) ? data.dueDate : new Date().toISOString().split("T")[0];

    return {
        title: data.title.trim(),
        description: data.description ? String(data.description).trim() : "",
        dueDate: cleanDate,
        suggestedTime: data.suggestedTime || null,
        durationMinutes: Number(data.durationMinutes) || 45,
        priority: ["High", "Medium", "Low"].includes(data.priority) ? data.priority : "Medium",
        subjectId: data.subjectId ? Number(data.subjectId) : null,
        subjectName: data.subjectName ? String(data.subjectName).trim() : "General",
        confidence: typeof data.confidence === "number" ? Math.max(0, Math.min(data.confidence, 1)) : 0.9
    };
};

const validateDailyBrief = (data, context = null) => {
    if (!data || typeof data !== "object") {
        throw new Error("Invalid AI output: Expected a JSON object.");
    }

    let validTaskIds = null;
    if (context && Array.isArray(context.tasks)) {
        validTaskIds = new Set(context.tasks.map(t => Number(t.task_id || t.taskId)));
    }

    const allowedActions = ["RESCHEDULE_TASK", "PRIORITIZE_TASK", "CREATE_SUBTASK", "UPDATE_TASK_DURATION"];
    const sanitizedProposals = [];

    if (Array.isArray(data.actionProposals)) {
        data.actionProposals.forEach((p, idx) => {
            const action = allowedActions.includes(p.action) ? p.action : "RESCHEDULE_TASK";
            const targetEntityId = p.targetEntityId ? Number(p.targetEntityId) : null;

            // Grounding check: for entity-targeting actions, enforce valid task ID in context
            if (action !== "CREATE_SUBTASK" && targetEntityId) {
                if (validTaskIds && !validTaskIds.has(targetEntityId)) {
                    console.warn(`[AI Grounding] Filtered out proposal for fabricated task ID ${targetEntityId}.`);
                    return;
                }
            }

            sanitizedProposals.push({
                id: p.id || `prop_${idx + 1}`,
                action,
                targetEntityType: p.targetEntityType || "task",
                targetEntityId,
                currentValue: p.currentValue !== undefined ? String(p.currentValue) : null,
                proposedValue: p.proposedValue !== undefined ? p.proposedValue : null,
                reason: p.reason ? String(p.reason).trim() : "Action proposed to optimize study schedule.",
                evidence: Array.isArray(p.evidence) ? p.evidence.map(e => String(e)) : []
            });
        });
    }

    return {
        date: data.date || new Date().toISOString().split("T")[0],
        executiveSummary: data.executiveSummary ? String(data.executiveSummary).trim() : "Daily briefing generated.",
        signalsInterpretation: Array.isArray(data.signalsInterpretation) ? data.signalsInterpretation.map(s => ({
            signalType: s.signalType ? String(s.signalType) : "GENERAL",
            analysis: s.analysis ? String(s.analysis).trim() : "",
            recommendedFocus: s.recommendedFocus ? String(s.recommendedFocus).trim() : ""
        })) : [],
        priorities: Array.isArray(data.priorities) ? data.priorities.map(p => String(p)) : [],
        actionProposals: sanitizedProposals,
        warnings: Array.isArray(data.warnings) ? data.warnings.map(w => String(w)) : []
    };
};

module.exports = {
    validateInsights,
    validatePlanner,
    validateTaskBreakdown,
    validateWeakAreas,
    validateWeeklyReview,
    validateParseTask,
    validateDailyBrief,
    // Aliases
    validateInsightsOutput: validateInsights,
    validateDailyPlanOutput: validatePlanner,
    validateTaskBreakdownOutput: validateTaskBreakdown,
    validateWeakAreasOutput: validateWeakAreas,
    validateWeeklyReviewOutput: validateWeeklyReview,
    validateParsedTaskOutput: (d) => ({ proposal: validateParseTask(d.proposal || d) }),
    validateDailyBriefOutput: validateDailyBrief
};
