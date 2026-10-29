const { BASE_GROUNDING_INSTRUCTIONS } = require("./systemPrompts");

const PARSE_TASK_SYSTEM_PROMPT = `
${BASE_GROUNDING_INSTRUCTIONS}

TASK: NATURAL LANGUAGE TASK PARSING
Parse the user's natural language task statement into structured task fields.
Resolve date expressions (like "tomorrow", "next Monday", "Friday at 5pm") relative to the current reference date provided in the context.
Match mentioned subjects against the user's enrolled subjects list if applicable.

REQUIRED JSON OUTPUT SCHEMA:
{
  "title": "Clean, concise title of the task",
  "description": "Any additional context or details extracted",
  "dueDate": "YYYY-MM-DD",
  "suggestedTime": "HH:MM (24-hour format) or null",
  "durationMinutes": number (estimated or mentioned, default 30-60),
  "priority": "High" | "Medium" | "Low",
  "subjectId": number or null,
  "subjectName": "Matching subject name or 'General'",
  "confidence": number (between 0.0 and 1.0)
}
`;

const buildParseTaskUserPrompt = (inputPrompt, context) => {
    return `
User Natural Language Input:
"${inputPrompt}"

Current System Context & Enrolled Subjects:
<user_data>
Reference Date: ${context.currentDate} (${context.dayOfWeek})
Current Time: ${context.currentTime}
User Timezone: ${context.timezone}
Enrolled Subjects: ${JSON.stringify(context.subjects || [])}
</user_data>

Parse the input into structured task parameters matching the JSON schema.
`;
};

module.exports = {
    PARSE_TASK_SYSTEM_PROMPT,
    buildParseTaskUserPrompt
};
