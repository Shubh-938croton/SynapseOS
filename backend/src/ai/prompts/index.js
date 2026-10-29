const { INSIGHTS_SYSTEM_PROMPT, buildInsightsUserPrompt } = require("./insightsPrompts");
const { PLANNER_SYSTEM_PROMPT, buildPlannerUserPrompt } = require("./plannerPrompts");
const { TASK_BREAKDOWN_SYSTEM_PROMPT, buildTaskBreakdownUserPrompt } = require("./taskBreakdownPrompts");
const { WEAK_AREAS_SYSTEM_PROMPT, buildWeakAreasUserPrompt } = require("./weakAreasPrompts");
const { WEEKLY_REVIEW_SYSTEM_PROMPT, buildWeeklyReviewUserPrompt } = require("./weeklyReviewPrompts");
const { PARSE_TASK_SYSTEM_PROMPT, buildParseTaskUserPrompt } = require("./parseTaskPrompts");
const { DAILY_BRIEF_SYSTEM_PROMPT, buildDailyBriefUserPrompt } = require("./dailyBriefPrompts");

module.exports = {
    INSIGHTS_SYSTEM_PROMPT,
    buildInsightsUserPrompt,
    PLANNER_SYSTEM_PROMPT,
    buildPlannerUserPrompt,
    TASK_BREAKDOWN_SYSTEM_PROMPT,
    buildTaskBreakdownUserPrompt,
    WEAK_AREAS_SYSTEM_PROMPT,
    buildWeakAreasUserPrompt,
    WEEKLY_REVIEW_SYSTEM_PROMPT,
    buildWeeklyReviewUserPrompt,
    PARSE_TASK_SYSTEM_PROMPT,
    buildParseTaskUserPrompt,
    DAILY_BRIEF_SYSTEM_PROMPT,
    buildDailyBriefUserPrompt
};
