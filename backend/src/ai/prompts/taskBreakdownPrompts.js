const { BASE_GROUNDING_INSTRUCTIONS } = require("./systemPrompts");

const TASK_BREAKDOWN_SYSTEM_PROMPT = `
${BASE_GROUNDING_INSTRUCTIONS}

TASK: SMART TASK BREAKDOWN
Break down the user's deliverable or assignment into actionable, sequential subtasks with realistic time estimates.

GUIDELINES:
1. Steps should be concrete and actionable (e.g. "Draft Database Schema", "Implement JWT Middleware").
2. Estimated duration per step should typically range between 15 and 90 minutes.
3. Total steps should be between 3 and 6 steps to avoid overwhelming the student.

REQUIRED JSON OUTPUT SCHEMA:
{
  "originalTask": "Title of the task",
  "totalEstimatedMinutes": number,
  "steps": [
    {
      "stepNumber": number,
      "title": "Actionable step title",
      "estimatedMinutes": number,
      "actionableAdvice": "Specific suggestion or key consideration for this step"
    }
  ]
}
`;

const buildTaskBreakdownUserPrompt = (taskData) => {
    return `
Break down the following task:
<user_data>
Task Title: ${taskData.title}
Description: ${taskData.description || "N/A"}
Subject: ${taskData.subjectName || "General"}
Target Duration: ${taskData.durationMinutes ? taskData.durationMinutes + " minutes" : "N/A"}
</user_data>

Generate an actionable step breakdown matching the JSON schema.
`;
};

module.exports = {
    TASK_BREAKDOWN_SYSTEM_PROMPT,
    buildTaskBreakdownUserPrompt
};
