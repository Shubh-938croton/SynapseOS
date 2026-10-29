# SynapseOS Personalization, AI Actions & Intelligence Integration (Phase 6)

## 1. Executive Overview & The Closed Feedback Loop

Phase 6 completes the evolutionary trajectory of SynapseOS from a passive CRUD tool into an **autonomous closed-loop intelligence system**. 

The core achievement of this phase is synthesizing real user telemetry into actionable domain interventions while maintaining strict human-in-the-loop governance:

```
REAL USER BEHAVIOR (Tasks, Pomodoros, Study Sessions, Goals)
        │
        ▼
ACTIVITY EVENTS (Phase 2 Immutable Event Stream)
        │
        ▼
ANALYTICS ENGINE (Phase 3 Multi-Range Metrics & Trends)
        │
        ▼
AUTOMATION ENGINE (Phase 4 Scheduled Aggregations, Streaks, Audits)
        │
        ▼
DETERMINISTIC SIGNALS ENGINE (Phase 6 Rule-Based Grounding)
        │
        ▼
STRUCTURED CONTEXT BUILDER (Data Minimization & Multi-Tenant Scoping)
        │
        ▼
AI INTELLIGENCE LAYER (Phase 5 Provider Abstraction & Daily Brief Generation)
        │
        ▼
STRUCTURED ACTION PROPOSALS (Strict JSON Schema Validation)
        │
        ▼
USER REVIEW & EXPLICIT 1-CLICK APPROVAL (Dashboard Action Center / AI Hub)
        │
        ▼
DOMAIN SERVICE MUTATION (taskModel / goalModel via aiActionService)
        │
        ▼
ACTIVITY EVENT EMISSION (TASK_RESCHEDULED, TASK_UPDATED, TASK_CREATED)
        │
        └───► Closes the loop! (Reflected in subsequent analytics & context)
```

---

## 2. Core Invariants & Safety Guarantees

### 1. Human-in-the-Loop Advisory Invariant
- **The AI Never Mutates State Unilaterally**: The LLM output is strictly read-only and formatted as structured action proposals (`RESCHEDULE_TASK`, `PRIORITIZE_TASK`, `CREATE_SUBTASK`, `UPDATE_TASK_DURATION`).
- **Explicit User Action Required**: Database updates occur exclusively when the authenticated user reviews the proposal and clicks **Approve** or **Approve All**.

### 2. Stale Proposal Defense (Optimistic Concurrency)
- When an action proposal is generated, it captures the entity's current state in `expectedCurrentValue` (e.g. `expectedCurrentValue: "2026-09-21"`).
- When the user approves the proposal, `aiActionService` inspects the live database record. If the user or another process has modified the task in the interim, the proposal is rejected immediately with `409 Conflict` (`code: "STALE_PROPOSAL"`).
- This prevents race conditions, unintended overwrites, and destructive updates from out-of-date cached proposals.

### 3. Strict Grounding & Anti-Hallucination
- Every proposed task action is validated against the user's active task list.
- If an LLM hallucinates an arbitrary `targetEntityId` (e.g. `99999`) that does not exist in the user's current context, the output validator silently drops the hallucinated proposal before presenting it to the user.
- Action reasons and evidence fields must quote verifiable signals or factual metrics.

### 4. Multi-Tenant Partitioning & Authorization
- Action execution enforces strict tenant boundaries at the database level: `getTaskById(userId, taskId)` ensures a user cannot approve an action targeting another user's task.
- Unauthorized cross-tenant execution attempts fail with `404 Entity Not Found`.

---

## 3. Deterministic Signals Engine

To eliminate LLM hallucination of user state, SynapseOS computes factual, rule-based signals in code **prior to** AI prompting.

Located in `backend/src/ai/signals/deterministicSignals.js`, the engine evaluates the following deterministic rules:

| Signal Type | Severity | Trigger Condition | Rationale |
| :--- | :--- | :--- | :--- |
| `HIGH_OVERDUE_TASK_COUNT` | `critical` | Overdue task count $\ge 2$ | Highlights urgency to prevent task accumulation. |
| `LOW_TASK_COMPLETION` | `warning` | Completion rate $< 50\%$ with $\ge 3$ tasks | Detects productivity blockers or unrealistic commitments. |
| `LOW_STUDY_ACTIVITY` | `warning` | Study minutes $< 30\text{m}$ | Alerts on study stagnation against daily targets. |
| `INCONSISTENT_FOCUS` | `info` | Interrupted pomodoros $\ge$ Completed pomodoros | Identifies external interruptions or fatigue. |
| `GOAL_STAGNATION` | `warning` | Active goals with $0\%$ progress | Surfaces stagnant long-term objectives. |
| `LAGGING_SUBJECT` | `warning` | Subject completion $< 40\%$ and $\ge 1$ overdue task | Identifies academic areas needing immediate intervention. |
| `STABLE_MOMENTUM` | `positive` | Current streak $\ge 3$ days & completion $\ge 70\%$ | Reinforces positive habits and builds confidence. |
| `PERFECT_COMPLETION` | `positive` | $100\%$ task completion with $\ge 3$ tasks | Celebrates complete daily or weekly throughput. |

These signals are passed into both the AI Daily Brief context and returned directly to the frontend for immediate UI rendering.

---

## 4. AI Action Proposals & Execution Service

### Supported Action Types
- `RESCHEDULE_TASK`: Updates `due_date` to a proposed future date.
- `PRIORITIZE_TASK`: Updates `priority` to `High`, `Medium`, or `Low`.
- `CREATE_SUBTASK`: Creates a concrete new subtask referencing a parent task.
- `UPDATE_TASK_DURATION`: Updates `estimated_minutes` for time-blocking accuracy.

### Action Service Execution Flow (`aiActionService.js`)
```javascript
// 1. Authenticate user & validate proposal payload
// 2. Fetch live domain entity (e.g. taskModel.getTaskById)
// 3. Stale Proposal Check:
if (currentDbDate !== expectedClean) {
    throw createError(409, "STALE_PROPOSAL");
}
// 4. Execute domain update:
await taskModel.updateTask(userId, taskId, updateData);
// 5. Emit Phase 2 Activity Event:
recordEvent({
    userId,
    eventType: EVENT_TYPES.TASK_RESCHEDULED,
    entityType: ENTITY_TYPES.TASK,
    entityId: taskId,
    metadata: { previous_due_date, new_due_date, source: "user_approved_ai_proposal" }
});
```

---

## 5. Daily Brief Caching & Performance

To optimize latency and eliminate redundant LLM token costs, Daily Briefs are cached in memory using a 15-minute TTL key: `daily_brief:${userId}:${date}`.

- Navigating between pages (e.g. Dashboard $\leftrightarrow$ AI Hub) utilizes instant cached results.
- Users can trigger an immediate re-synthesis at any time using the **Refresh Brief** button, which passes `forceRefresh: true`.
- Cached responses are invalidated or updated as action proposals are executed.

---

## 6. Frontend User Experience

### Dashboard Action Center (`Dashboard.jsx`)
- **Actionable AI Brief Banner**: Renders at the top of the dashboard when actionable proposals exist.
- **Signal Chips**: Displays color-coded deterministic signals (e.g. `HIGH OVERDUE TASK COUNT`, `STABLE MOMENTUM`).
- **1-Click Proposal Approval**: Each proposal displays clear diffs (`Change due date from 2026-09-21 to 2026-09-28`) with individual **Approve** / **Dismiss** buttons and a global **Approve All** action.

### AI Hub Daily Brief (`AIHub.jsx`)
- **Full Retrospective & Strategy**: Displays executive summaries, daily priorities, and suggested study distribution alongside interactive action execution.
- **Signals Inspector**: Provides transparent, factual metrics backing every AI recommendation.

---

## 7. REST API Reference

### `POST /api/ai/daily-brief`
Generates or retrieves the cached personalized daily brief.
- **Request Body**: `{ date?: "YYYY-MM-DD", forceRefresh?: boolean }`
- **Response**:
  ```json
  {
    "success": true,
    "source": "cache" | "provider",
    "data": {
      "executiveSummary": "...",
      "signals": [...],
      "dailyPriorities": [...],
      "actionProposals": [
        {
          "id": "prop_101",
          "action": "RESCHEDULE_TASK",
          "targetEntityType": "task",
          "targetEntityId": 101,
          "targetEntityTitle": "Algorithms Assignment 3",
          "expectedCurrentValue": "2026-09-21",
          "proposedValue": "2026-09-28",
          "reason": "Clear overdue backlog before midterm",
          "impact": "High"
        }
      ],
      "studyTimeRecommendation": { "targetMinutes": 120, "subjectAllocations": [...] }
    }
  }
  ```

### `POST /api/ai/actions/approve`
Executes an individual action proposal after user confirmation.
- **Request Body**: `{ proposal: ActionProposal }`
- **Response**: `{ success: true, action: "RESCHEDULE_TASK", taskId: 101, message: "Task #101 successfully rescheduled to 2026-09-28." }`

### `POST /api/ai/actions/batch-approve`
Executes a batch of action proposals atomically per proposal.
- **Request Body**: `{ proposals: ActionProposal[] }`
- **Response**: `{ success: true, processedCount: 3, successCount: 3, failedCount: 0, results: [...] }`
