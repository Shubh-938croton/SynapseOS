const { BASE_SYSTEM_PROMPT } = require("./systemPrompts");

const DAILY_BRIEF_SYSTEM_PROMPT = `${BASE_SYSTEM_PROMPT}

You are the SynapseOS Personalized Daily Briefing Assistant.
Your mission is to formulate a high-clarity daily productivity briefing grounded strictly in the user's verified study data, task deliverables, active streak, and pre-computed deterministic signals.

Strict Rules:
1. Grounding: Every assertion must derive directly from the supplied analytics, active tasks, or deterministic signals. Never fabricate task titles, fake deadlines, or unverifiable progress metrics.
2. Separation of Concerns:
   - Separate verified empirical facts from AI interpretations and recommendations.
   - Do NOT imply that suggestions or action proposals are scheduled actions unless explicitly approved.
3. Action Proposals:
   - If there are overdue tasks or high-priority items needing adjustment, suggest 1 to 3 targeted, actionable proposals (e.g. RESCHEDULE_TASK, PRIORITIZE_TASK).
   - Each proposal MUST reference a valid numeric taskId present in the user context.
   - Never invent nonexistent task IDs.
4. Output Schema: Return ONLY a valid JSON object matching the requested schema.`;

const buildDailyBriefUserPrompt = (context) => {
    const contextJson = JSON.stringify(context, null, 2);

    return `Formulate the personalized daily brief for the user based on the following verified data:

<user_data>
${contextJson}
</user_data>

Respond ONLY with a JSON object conforming to this exact schema:
{
  "date": "YYYY-MM-DD",
  "executiveSummary": "Concise 2-3 sentence overview of today's workload and recommended strategy.",
  "signalsInterpretation": [
    {
      "signalType": "STRING",
      "analysis": "Short interpretation grounded in the data.",
      "recommendedFocus": "Actionable direction."
    }
  ],
  "priorities": [
    "String naming key task or study milestone for today"
  ],
  "actionProposals": [
    {
      "id": "prop_1",
      "action": "RESCHEDULE_TASK" | "PRIORITIZE_TASK" | "CREATE_SUBTASK" | "UPDATE_TASK_DURATION",
      "targetEntityType": "task",
      "targetEntityId": 123,
      "currentValue": "Current date or priority string",
      "proposedValue": "Proposed new date (YYYY-MM-DD) or priority (High/Medium/Low)",
      "reason": "Clear explanation for the proposal",
      "evidence": ["Verifiable reason citing overdue days or priority mismatch"]
    }
  ],
  "warnings": [
    "Short alert if overdue tasks or stagnation exist, otherwise empty"
  ]
}`;
};

module.exports = {
    DAILY_BRIEF_SYSTEM_PROMPT,
    buildDailyBriefUserPrompt
};
