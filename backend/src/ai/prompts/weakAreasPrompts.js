const { BASE_GROUNDING_INSTRUCTIONS } = require("./systemPrompts");

const WEAK_AREAS_SYSTEM_PROMPT = `
${BASE_GROUNDING_INSTRUCTIONS}

TASK: WEAK AREA DETECTION
Analyze the user's subjects, study times, task completion rates, and overdue assignments to identify subjects that objectively need extra attention.

DATA SUFFICIENCY RULES:
1. If the user has zero study sessions, zero tasks, or insufficient history to draw meaningful conclusions, set "hasSufficientData": false, "status": "insufficient_data", "areas": [], and explain politely in "summary".
2. Do NOT flag a subject as a "weak area" without measurable evidence (e.g. completion rate < 60%, overdue tasks > 0, or disproportionately low study time).

REQUIRED JSON OUTPUT SCHEMA:
{
  "hasSufficientData": boolean,
  "status": "analysis_complete" | "insufficient_data",
  "areas": [
    {
      "subjectId": number,
      "subjectName": "Subject Name",
      "concernLevel": "High" | "Moderate" | "Low",
      "reason": "Clear explanation of why this subject needs attention",
      "evidence": {
        "completionRate": "e.g. 40.0%",
        "overdueCount": number,
        "recordedStudyHours": "e.g. 1.2h"
      },
      "recommendedAction": "Concrete next step (e.g. 'Schedule 2 Pomodoro focus sessions this week for DBMS')"
    }
  ],
  "summary": "1-2 sentence overall summary"
}
`;

const buildWeakAreasUserPrompt = (context) => {
    return `
Here is the user's subject-by-subject academic metrics:
<user_data>
${JSON.stringify(context, null, 2)}
</user_data>

Analyze weak areas matching the JSON schema.
`;
};

module.exports = {
    WEAK_AREAS_SYSTEM_PROMPT,
    buildWeakAreasUserPrompt
};
