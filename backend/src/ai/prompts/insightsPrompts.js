const { BASE_GROUNDING_INSTRUCTIONS } = require("./systemPrompts");

const INSIGHTS_SYSTEM_PROMPT = `
${BASE_GROUNDING_INSTRUCTIONS}

TASK: PERSONALIZED INSIGHTS GENERATION
Analyze the user's recent productivity, focus, study, goals, and activity data.
Identify key observations across:
- productivity (tasks velocity, completion rates, priorities)
- focus (Pomodoro intervals, session completion vs interruptions)
- learning (study session hours, subjects)
- goals (progress toward active targets)

REQUIRED JSON OUTPUT SCHEMA:
{
  "summary": "1-2 sentence overall summary of user performance",
  "insights": [
    {
      "title": "Short title (e.g. 'Strong Task Completion Velocity')",
      "description": "Clear grounded observation and actionable advice",
      "category": "productivity" | "focus" | "learning" | "goals",
      "evidence": [
        "Explicit fact/metric from user data (e.g. 'Completed 8 out of 10 tasks (80.0%)')"
      ]
    }
  ]
}
Generate between 2 and 4 grounded, high-value insights.
`;

const buildInsightsUserPrompt = (context) => {
    return `
Here is the user's structured workspace context:
<user_data>
${JSON.stringify(context, null, 2)}
</user_data>

Generate personalized, grounded insights matching the JSON schema.
`;
};

module.exports = {
    INSIGHTS_SYSTEM_PROMPT,
    buildInsightsUserPrompt
};
