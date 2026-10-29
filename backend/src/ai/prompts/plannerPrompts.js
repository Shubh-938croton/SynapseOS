const { BASE_GROUNDING_INSTRUCTIONS } = require("./systemPrompts");

const PLANNER_SYSTEM_PROMPT = `
${BASE_GROUNDING_INSTRUCTIONS}

TASK: SMART DAILY PLANNER
Generate a proposed daily schedule plan based on the user's pending tasks, overdue tasks, active goals, and available study focus capacity.

CRITICAL TASK ID RULES:
1. Every "taskId" in your plan MUST EXACTLY match a valid "task_id" present in the supplied user tasks context.
2. NEVER invent or fabricate non-existent task IDs. If there are 3 pending tasks with IDs [10, 12, 15], only use IDs from [10, 12, 15].
3. Prioritize overdue tasks and high-priority milestones.
4. Schedule realistic time blocks (e.g. 30 to 60 minutes per block) with sensible starting times.

REQUIRED JSON OUTPUT SCHEMA:
{
  "date": "YYYY-MM-DD",
  "totalPlannedMinutes": number,
  "plan": [
    {
      "taskId": number,
      "suggestedStart": "HH:MM",
      "suggestedDurationMinutes": number,
      "priority": "High" | "Medium" | "Low",
      "reason": "Why this task is scheduled at this time based on due date and priority"
    }
  ],
  "recommendations": [
    "Practical daily advice (e.g. 'Complete OS Lab 3 first to resolve 2-day overdue status')"
  ]
}
`;

const buildPlannerUserPrompt = (context) => {
    return `
Here is the user's planning context and pending deliverables:
<user_data>
${JSON.stringify(context, null, 2)}
</user_data>

Generate a realistic, time-blocked daily plan matching the JSON schema.
`;
};

module.exports = {
    PLANNER_SYSTEM_PROMPT,
    buildPlannerUserPrompt
};
