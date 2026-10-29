const { getAIConfig } = require("./aiConfig");
const { createAIProvider, getProvider } = require("./providers/providerFactory");
const contextBuilder = require("./aiContextBuilder");
const prompts = require("./prompts");
const validators = require("./validators/aiOutputValidator");
const { getTodayString } = require("../utils/dateUtils");

/**
 * AI Service Orchestrator
 */

// In-memory cache for expensive AI responses (15-minute TTL)
const aiResponseCache = new Map();
const CACHE_TTL_MS = 15 * 60 * 1000;

const getCacheKey = (type, userId, param = "") => `${type}:${userId}:${param}`;

const getFromCache = (key) => {
    const cached = aiResponseCache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > CACHE_TTL_MS) {
        aiResponseCache.delete(key);
        return null;
    }
    return cached.data;
};

const setInCache = (key, data) => {
    aiResponseCache.set(key, { data, timestamp: Date.now() });
};

const getAIStatus = () => {
    const config = getAIConfig();
    return {
        enabled: config.enabled,
        provider: config.provider,
        model: config.model,
        hasApiKey: config.hasApiKey
    };
};

const resolveProvider = (options = {}) => {
    const config = getAIConfig();
    const providerName = options.providerName || options.provider || config.provider;

    // If a mock provider is explicitly requested (e.g. in test suites), allow execution
    if (providerName === "mock") {
        return getProvider("mock", { ...config, enabled: true });
    }

    if (!config.enabled) {
        const err = new Error("AI features are currently disabled. Configure AI_ENABLED=true and AI_API_KEY in server environment.");
        err.code = "AI_DISABLED";
        err.status = 503;
        throw err;
    }

    return createAIProvider(config);
};

// =======================================
// FEATURE 1: PERSONALIZED DAILY BRIEF (PHASE 6)
// =======================================
const generateDailyBrief = async (userId, options = null) => {
    const targetDate = typeof options === "string" ? options : (options?.date || options?.targetDate || getTodayString());
    const opts = typeof options === "object" && options !== null ? options : {};
    const cacheKey = getCacheKey("daily_brief", userId, targetDate);

    if (!opts.forceRefresh && opts.providerName !== "mock") {
        const cached = getFromCache(cacheKey);
        if (cached) return cached;
    }

    const provider = resolveProvider(opts);
    const config = getAIConfig();

    const context = await contextBuilder.buildDailyBriefContext(userId, targetDate);
    const systemPrompt = prompts.DAILY_BRIEF_SYSTEM_PROMPT;
    const userPrompt = prompts.buildDailyBriefUserPrompt(context);

    const rawOutput = await provider.generateJSON(systemPrompt, userPrompt, { operation: "daily_brief" });
    const validated = validators.validateDailyBrief(rawOutput, context);

    const result = {
        isAIGenerated: true,
        provider: opts.providerName || config.provider,
        model: config.model,
        date: targetDate,
        factualOverview: context.factualOverview,
        deterministicSignals: context.deterministicSignals,
        ...validated
    };

    if (opts.providerName !== "mock") {
        setInCache(cacheKey, result);
    }

    return result;
};

// =======================================
// FEATURE 2: PERSONALIZED INSIGHTS
// =======================================
const generatePersonalizedInsights = async (userId, options = "7d") => {
    const period = typeof options === "string" ? options : (options?.timeRange || options?.period || "7d");
    const opts = typeof options === "object" ? options : {};
    const cacheKey = getCacheKey("insights", userId, period);

    if (!opts.forceRefresh && opts.providerName !== "mock") {
        const cached = getFromCache(cacheKey);
        if (cached) return cached;
    }

    const provider = resolveProvider(opts);
    const config = getAIConfig();

    const context = await contextBuilder.buildInsightsContext(userId, period);
    const systemPrompt = prompts.INSIGHTS_SYSTEM_PROMPT;
    const userPrompt = prompts.buildInsightsUserPrompt(context);

    const rawOutput = await provider.generateJSON(systemPrompt, userPrompt, { operation: "insights" });
    const validated = validators.validateInsights(rawOutput);

    const result = {
        isAIGenerated: true,
        provider: opts.providerName || config.provider,
        model: config.model,
        period,
        deterministicSignals: context.deterministicSignals || [],
        ...validated
    };

    if (opts.providerName !== "mock") {
        setInCache(cacheKey, result);
    }

    return result;
};

// =======================================
// FEATURE 3: SMART DAILY PLANNER
// =======================================
const generateDailyPlan = async (userId, options = null) => {
    const date = typeof options === "string" ? options : (options?.date || options?.targetDate || null);
    const opts = typeof options === "object" && options !== null ? options : {};
    const provider = resolveProvider(opts);
    const config = getAIConfig();

    const context = await contextBuilder.buildPlannerContext(userId, date);
    const systemPrompt = prompts.PLANNER_SYSTEM_PROMPT;
    const userPrompt = prompts.buildPlannerUserPrompt(context);

    const rawOutput = await provider.generateJSON(systemPrompt, userPrompt, { operation: "planner" });
    const validated = validators.validatePlanner(rawOutput, context);

    return {
        isAIGenerated: true,
        provider: opts.providerName || config.provider,
        model: config.model,
        ...validated
    };
};

// =======================================
// FEATURE 4: SMART TASK BREAKDOWN
// =======================================
const generateTaskBreakdown = async (userId, taskDataOrTitle, options = {}) => {
    const opts = typeof options === "object" ? options : {};
    const provider = resolveProvider(opts);
    const config = getAIConfig();

    let taskData = taskDataOrTitle;
    if (typeof taskDataOrTitle === "string") {
        taskData = {
            title: taskDataOrTitle,
            description: opts.description || "",
            subject: opts.subjectName || opts.subject || "General"
        };
    }

    if (!taskData || !taskData.title) {
        throw new Error("Missing required task title for breakdown.");
    }

    const systemPrompt = prompts.TASK_BREAKDOWN_SYSTEM_PROMPT;
    const userPrompt = prompts.buildTaskBreakdownUserPrompt(taskData);

    const rawOutput = await provider.generateJSON(systemPrompt, userPrompt, { operation: "task_breakdown" });
    const validated = validators.validateTaskBreakdown(rawOutput);

    return {
        isAIGenerated: true,
        provider: opts.providerName || config.provider,
        model: config.model,
        ...validated
    };
};

// =======================================
// FEATURE 5: WEAK AREA DETECTION
// =======================================
const generateWeakAreas = async (userId, options = {}) => {
    const opts = typeof options === "object" ? options : {};
    const provider = resolveProvider(opts);
    const config = getAIConfig();

    const context = await contextBuilder.buildWeakAreasContext(userId);
    const systemPrompt = prompts.WEAK_AREAS_SYSTEM_PROMPT;
    const userPrompt = prompts.buildWeakAreasUserPrompt(context);

    const rawOutput = await provider.generateJSON(systemPrompt, userPrompt, { operation: "weak_areas" });
    const validated = validators.validateWeakAreas(rawOutput);

    return {
        isAIGenerated: true,
        provider: opts.providerName || config.provider,
        model: config.model,
        ...validated
    };
};

// =======================================
// FEATURE 6: WEEKLY REVIEW
// =======================================
const generateWeeklyReview = async (userId, options = null) => {
    const endDate = typeof options === "string" ? options : (options?.endDate || options?.periodEnd || null);
    const opts = typeof options === "object" && options !== null ? options : {};
    const provider = resolveProvider(opts);
    const config = getAIConfig();

    const context = await contextBuilder.buildWeeklyReviewContext(userId, endDate);
    const systemPrompt = prompts.WEEKLY_REVIEW_SYSTEM_PROMPT;
    const userPrompt = prompts.buildWeeklyReviewUserPrompt(context);

    const rawOutput = await provider.generateJSON(systemPrompt, userPrompt, { operation: "weekly_review" });
    const validated = validators.validateWeeklyReview(rawOutput);

    return {
        isAIGenerated: true,
        provider: opts.providerName || config.provider,
        model: config.model,
        ...validated
    };
};

// =======================================
// FEATURE 7: NATURAL LANGUAGE TASK PARSING
// =======================================
const parseNaturalLanguageTask = async (userId, inputPrompt, options = {}) => {
    const opts = typeof options === "object" ? options : {};
    const provider = resolveProvider(opts);
    const config = getAIConfig();

    if (!inputPrompt || typeof inputPrompt !== "string" || !inputPrompt.trim()) {
        throw new Error("Missing natural language task description.");
    }

    const context = await contextBuilder.buildParseTaskContext(userId);
    const systemPrompt = prompts.PARSE_TASK_SYSTEM_PROMPT;
    const userPrompt = prompts.buildParseTaskUserPrompt(inputPrompt.trim(), context);

    const rawOutput = await provider.generateJSON(systemPrompt, userPrompt, { operation: "parse_task" });
    const validated = validators.validateParseTask(rawOutput);

    return {
        isAIGenerated: true,
        provider: opts.providerName || config.provider,
        model: config.model,
        proposal: validated
    };
};

module.exports = {
    getAIStatus,
    generateDailyBrief,
    generatePersonalizedInsights,
    generateDailyPlan,
    generateTaskBreakdown,
    generateWeakAreas,
    generateWeeklyReview,
    parseNaturalLanguageTask,
    // Aliases
    getDailyBrief: generateDailyBrief,
    generateInsights: generatePersonalizedInsights,
    analyzeWeakAreas: generateWeakAreas,
    parseTask: parseNaturalLanguageTask
};
