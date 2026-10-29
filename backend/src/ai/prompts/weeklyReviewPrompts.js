const { BASE_GROUNDING_INSTRUCTIONS } = require("./systemPrompts");

const WEEKLY_REVIEW_SYSTEM_PROMPT = `
${BASE_GROUNDING_INSTRUCTIONS}

TASK: WEEKLY PRODUCTIVITY & LEARNING REVIEW
Generate a comprehensive 7-day retrospective review.

GROUNDING REQUIREMENTS:
1. Clearly separate VERIFIED FACTS from AI INTERPRETATIONS and ACTIONABLE RECOMMENDATIONS.
2. All numbers (focus hours, tasks completed, active days) must match the weekly summary context exactly.

REQUIRED JSON OUTPUT SCHEMA:
{
  "reviewPeriod": "e.g. 2026-09-15 to 2026-09-21",
  "executiveSummary": "1-2 sentence high-level overview of weekly performance",
  "factualHighlights": [
    "Specific factual accomplishments (e.g. 'Completed 8 tasks with an 80.0% completion rate')"
  ],
  "observations": [
    "Interpretive pattern analysis (e.g. 'Your focus hours peaked on Wednesday morning')"
  ],
  "areasNeedingAttention": [
    "Areas to improve (e.g. '1 overdue assignment in Computer Networks')"
  ],
  "recommendedPrioritiesNextWeek": [
    "Suggested goal or task priority for the upcoming week"
  ]
}
`;

const buildWeeklyReviewUserPrompt = (context) => {
    return `
Here is the user's weekly summary and 7-day performance data:
<user_data>
${JSON.stringify(context, null, 2)}
</user_data>

Generate a structured weekly review matching the JSON schema.
`;
};

module.exports = {
    WEEKLY_REVIEW_SYSTEM_PROMPT,
    buildWeeklyReviewUserPrompt
};
