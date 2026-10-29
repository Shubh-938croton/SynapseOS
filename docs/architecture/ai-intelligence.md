# SynapseOS AI Intelligence Layer (Phase 5)

## 1. Overview & Core Philosophy

The SynapseOS AI Intelligence Layer is designed as a **grounded, advisory, and secure reasoning engine**. Unlike conventional wrappers that feed raw user prompts into unrestricted LLMs, SynapseOS strictly enforces a unidirectional data flow where AI reasoning is the synthesis of verified historical analytics and deterministic automation records.

```
REAL USER DATA
      ↓
Activity Events (Phase 2)
      ↓
Analytics Engine (Phase 3)
      ↓
Automation Engine (Phase 4)
      ↓
Structured User Context (Context Builder)
      ↓
┌────────────────────────────────────────────────────────┐
│                   AI SERVICE LAYER                     │
│                                                        │
│  - Personalized Insights                               │
│  - Smart Daily Planner                                 │
│  - Smart Task Breakdown                                │
│  - Academic Weak Area Analysis                         │
│  - Weekly Retrospective Review                         │
│  - Natural Language Task Parser                        │
└───────────────────────────┬────────────────────────────┘
                            ↓
                Personalized Proposal (JSON)
                            ↓
                User Review & Explicit Approval
                            ↓
            User Action (Database Mutation via Domain APIs)
```

---

## 2. Invariants & Safety Principles

1. **Non-Destructive AI (Advisory Invariant)**:
   - The AI layer NEVER writes directly to the database or modifies existing user entities.
   - All AI responses are strictly proposals and recommendations.
   - Entity creation (e.g. creating tasks from breakdown steps or natural language parsing) occurs ONLY when the user clicks an explicit confirmation button calling authenticated domain endpoints (`POST /api/tasks`).

2. **Data Minimization & Privacy**:
   - The Context Builder strips all passwords, authentication tokens, session cookies, API keys, full note contents, and unneeded metadata.
   - AI prompts receive only high-level aggregates (e.g. study minutes, streak metrics, task titles, priorities, and subject completion percentages).

3. **Grounding & Anti-Hallucination**:
   - In the Smart Daily Planner, the output validator strictly cross-references all suggested `taskId` values against the user's active task list. Any fabricated or hallucinated task IDs are stripped before delivery to the client.
   - Insights and weak area analyses require verifiable evidence strings derived directly from analytics data.

4. **Prompt Injection Defense**:
   - User-supplied text (task titles, natural language inputs, subject names) is encapsulated inside inert `<user_data>` XML tags.
   - System prompts explicitly instruct the model to treat all text within `<user_data>` tags as passive data, preventing instruction overrides or jailbreaks.

5. **Server-Side Key Isolation**:
   - Provider API keys (`GEMINI_API_KEY`, `OPENAI_API_KEY`) reside exclusively in backend environment variables.
   - The frontend never receives provider secrets or client-side SDK tokens.

6. **Rate Limiting & Cost Control**:
   - AI endpoints are governed by `aiLimiter` (30 requests / 10 minutes per IP) to prevent token exhaustion and denial-of-service.

7. **Graceful Degradation**:
   - When `AI_ENABLED=false` or no API key is configured, all AI endpoints return a clean `503 Service Unavailable` with `code: "AI_DISABLED"`, allowing the UI to present informative fallback states without crashing.

---

## 3. Directory Structure & Architecture

```
backend/src/ai/
├── aiConfig.js                     # Environment configuration loader & validation
├── aiContextBuilder.js             # Data-minimized context aggregation from services
├── aiService.js                    # Core orchestration layer
├── providers/
│   ├── baseProvider.js             # Abstract base provider class
│   ├── geminiProvider.js           # Google Gemini REST API integration (axios)
│   ├── openaiProvider.js           # OpenAI REST API integration (axios)
│   ├── mockProvider.js             # Deterministic mock provider for tests & CI/CD
│   └── providerFactory.js          # Provider factory and resolver
├── prompts/
│   ├── systemPrompts.js            # Base system instructions & injection guards
│   ├── insightsPrompts.js          # Study insight prompt builder
│   ├── plannerPrompts.js           # Smart daily planner prompt builder
│   ├── taskBreakdownPrompts.js     # Task decomposition prompt builder
│   ├── weakAreasPrompts.js         # Subject weakness analysis prompt builder
│   ├── weeklyReviewPrompts.js      # Retrospective review prompt builder
│   ├── parseTaskPrompts.js         # Natural language parsing prompt builder
│   └── index.js                    # Prompt barrel export
└── validators/
    └── aiOutputValidator.js        # Strict JSON schema and grounding validation
```

---

## 4. REST API Endpoints

All endpoints are protected by `verifyToken` middleware and rate-limited via `aiLimiter`.

### 1. `GET /api/ai/status`
Returns active AI configuration status (provider, model, enabled flag) without exposing secret keys.

### 2. `POST /api/ai/insights`
- **Request Body**: `{ "timeRange": "7d" }`
- **Response**: Grounded study patterns, focus consistency observations, and empirical evidence arrays.

### 3. `POST /api/ai/planner`
- **Request Body**: `{ "date": "YYYY-MM-DD" }` (optional, defaults to current date)
- **Response**: Suggested time-blocked schedule with verified task IDs, duration budgets, and priority rationale.

### 4. `POST /api/ai/task-breakdown`
- **Request Body**: `{ "title": "Build Distributed Key-Value Store", "subject": "Distributed Systems" }`
- **Response**: Sequential, time-budgeted subtask steps with actionable implementation advice.

### 5. `POST /api/ai/weak-areas`
- **Request Body**: `{}`
- **Response**: Subject-level risk assessment with completion rate differentials, overdue task counts, and targeted study prescriptions.

### 6. `POST /api/ai/weekly-review`
- **Request Body**: `{ "endDate": "YYYY-MM-DD" }` (optional)
- **Response**: 4-part structured retrospective separating verified accomplishments, pattern observations, attention flags, and next week's recommended priorities.

### 7. `POST /api/ai/parse-task`
- **Request Body**: `{ "prompt": "Tomorrow at 4pm review CS301 algorithms for 45 mins" }`
- **Response**: Proposed task parameters (`title`, `dueDate`, `durationMinutes`, `priority`, `subjectName`, `confidence`) ready for explicit user confirmation.

---

## 5. Frontend Integration (`/ai`)

The frontend AI Hub provides a unified, tabbed interface:
- **Personalized Insights**: Displays verified pattern cards with evidence trails.
- **Smart Planner**: Interactive schedule timeline with duration indicators and priority badges.
- **Task Breakdown**: Decomposition interface with one-click "Add as Task" confirmations.
- **Weak Areas**: Subject alert cards highlighting lagging completion rates and recommended actions.
- **Weekly Review**: Comprehensive 4-quadrant retrospective review.
- **Quick Task Parser**: Natural language input producing a structured task card with an explicit "Confirm & Add to Tasks" button.
