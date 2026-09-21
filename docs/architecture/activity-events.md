# 📜 Activity & Event Tracking Architecture — SynapseOS Phase 2

**Status:** Implemented & Production Ready  
**Scope:** Append-Only Immutable Event Logging for SynapseOS Domain Operations  

---

## 1. Overview & Architectural Role

SynapseOS transitions from a direct CRUD model to a dual-write event-sourcing architectural pattern:

```text
USER ACTION (Frontend Request)
       ↓
JWT Authentication & Authorization (req.user.user_id)
       ↓
Express Domain Controller
       ↓
Domain Model Mutation (MySQL Primary Tables: tasks, notes, etc.)
       ├──→ Primary Database Mutation Success
       │
       └──→ Activity Event Service (activityEventService.js)
                 ↓
            Validation & Metadata Sanitization
                 ↓
            activityEventModel.createEvent
                 ↓
            activity_events Table (Append-Only MySQL Log)
```

The `activity_events` table serves as the reliable, immutable data backbone for future analytical processing, automation workflows, productivity insights, and AI reasoning.

---

## 2. Database Schema Definition

The `activity_events` table is designed to fit the existing SynapseOS database conventions:

```sql
CREATE TABLE IF NOT EXISTS activity_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NULL,
    metadata_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
```

### Indexing Strategy:

1. **`idx_events_user` on `(user_id)`**: Enables efficient user-scoped queries and joins.
2. **`idx_events_user_created` on `(user_id, created_at)`**: Optimizes chronological user activity streams (`ORDER BY created_at DESC`).
3. **`idx_events_user_type` on `(user_id, event_type)`**: Accelerates filtering of specific actions for a user (e.g., all `TASK_COMPLETED` for streak computation).
4. **`idx_events_entity` on `(entity_type, entity_id)`**: Enables fetching the complete lifecycle / audit trail of any entity (e.g. task #42).
5. **`idx_events_created` on `(created_at)`**: Supports system-wide temporal indexing and time window partitioning.

---

## 3. Event Types & Entity Types Reference

All event types and entity types are strictly governed by constants in [`backend/src/constants/eventTypes.js`](file:///d:/SynapseOS/backend/src/constants/eventTypes.js):

| Domain | Entity Type (`entity_type`) | Event Type (`event_type`) | Trigger Condition |
| :--- | :--- | :--- | :--- |
| **Tasks** | `task` | `TASK_CREATED` | When a new task is created |
| | | `TASK_UPDATED` | When task details are modified |
| | | `TASK_COMPLETED` | When task status changes to `'Completed'` |
| | | `TASK_RESCHEDULED` | When task `due_date` is modified |
| | | `TASK_DELETED` | When a task is removed |
| **Notes** | `note` | `NOTE_CREATED` | When a new note is saved |
| | | `NOTE_UPDATED` | When note title, content, or pin state changes |
| | | `NOTE_DELETED` | When a note is removed |
| **Goals** | `goal` | `GOAL_CREATED` | When a new goal is initialized |
| | | `GOAL_UPDATED` | When goal attributes change |
| | | `GOAL_COMPLETED` | When goal reaches 100% or `'Completed'` status |
| | | `GOAL_DELETED` | When a goal is deleted |
| **Study Sessions** | `study_session` | `STUDY_SESSION_COMPLETED` | When a study session is logged |
| | | `STUDY_SESSION_DELETED` | When a study session is removed |
| **Pomodoro** | `pomodoro_session` | `POMODORO_COMPLETED` | When a focus session finishes successfully |
| | | `POMODORO_ABANDONED` | When a focus session is marked `'Interrupted'` |
| | | `POMODORO_DELETED` | When a Pomodoro session log is deleted |
| **Calendar** | `calendar_event` | `CALENDAR_EVENT_CREATED` | When a calendar event is scheduled |
| | | `CALENDAR_EVENT_UPDATED` | When calendar event details change |
| | | `CALENDAR_EVENT_DELETED` | When a calendar event is cancelled/deleted |
| **Subjects** | `subject` | `SUBJECT_CREATED` | When a curriculum subject is added |
| | | `SUBJECT_UPDATED` | When subject metadata changes |
| | | `SUBJECT_DELETED` | When a subject is deleted |
| **Contests** | `contest` | `CONTEST_CREATED` | When a competitive contest is tracked |
| | | `CONTEST_UPDATED` | When contest status/date is modified |
| | | `CONTEST_DELETED` | When a contest entry is deleted |

---

## 4. Security & Metadata Privacy Rules

1. **Trusted Identity:** `user_id` is **never** accepted from the client request body. It is strictly obtained from `req.user.user_id` decoded from the verified JWT.
2. **Metadata Sanitization:** The service automatically scrubs sensitive keys (`password`, `token`, `secret`, `key`, `auth`, `bearer`, `cookie`, `credential`) from any event payload before serialization.
3. **Compact Payloads:** Metadata captures only operational diffs and key metrics (e.g. durations, statuses, dates), never full database dumps or unneeded blobs.
4. **Append-Only Invariant:** No `UPDATE` or `DELETE` endpoints or model methods exist for `activity_events`. Historical events are immutable.

---

## 5. Resilience & Consistency Strategy

1. **Failure Isolation:** Primary domain mutations execute first. If a domain operation fails, no event is logged (zero false positive events).
2. **Non-Blocking Resilience:** Event logging runs through `activityEventService.recordEvent()`. If an event write fails (e.g., transient DB glitch), it logs server diagnostics without crashing or blocking the HTTP response for the user's primary action.
3. **Transactional Support:** For critical multi-table transactions, `activityEventService.recordEventWithConnection()` enables writing events inside an existing `mysql2` transaction connection.
