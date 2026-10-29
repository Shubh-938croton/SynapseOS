# ⚙️ Automation & Scheduled Intelligence Architecture — SynapseOS Phase 4

**Status:** Implemented & Production Ready  
**Scope:** Deterministic, Idempotent Backend Automation System, Streak & Consistency Engine, Scheduled Summary Rollups, Overdue Task Detection, and Run Auditing.

---

## 1. Overview & Architectural Role

The SynapseOS Automation Layer operates on a strictly decoupled, unidirectional execution model. Automation jobs process real domain data and Phase 2 `activity_events` periodically without depending on or interfering with HTTP request lifecycles.

```text
               ┌──────────────────────────────┐
               │    Node-Cron / Scheduler     │ (Controlled by AUTOMATION_ENABLED)
               └──────────────┬───────────────┘
                              │ cron trigger or CLI script
                              ▼
               ┌──────────────────────────────┐
               │     Automation Job Layer     │
               │  - dailySummaryJob.js        │
               │  - weeklySummaryJob.js       │
               │  - overdueTaskJob.js         │
               └──────────────┬───────────────┘
                              │ executes per user with error isolation
                              ▼
               ┌──────────────────────────────┐
               │      Automation Service      │
               │  - processDailySummary()     │
               │  - processWeeklySummary()    │
               │  - calculateUserStreak()     │
               │  - processOverdueTasks()     │
               │  - auditGoalProgress()       │
               └───────┬──────────────┬───────┘
                       │              │
           reads data  │              │ persists summaries & audit runs
                       ▼              ▼
           ┌────────────────┐   ┌───────────────────────────┐
           │ Relational DB  │   │ automation_summaries      │
           │ & Events Log   │   │ automation_runs           │
           │ (Read-Only)    │   │ notifications (idempotent)│
           └────────────────┘   └───────────────────────────┘
```

---

## 2. Environment Configuration

The scheduler is completely configurable and safe for local development:

| Variable | Default Value | Description |
| :--- | :--- | :--- |
| `AUTOMATION_ENABLED` | `false` | When `false`, background cron scheduler is dormant (jobs can still be run manually). |
| `AUTOMATION_TIMEZONE` | `Asia/Kolkata` | Standard IANA timezone used for cron triggers and date boundaries. |
| `AUTOMATION_DAILY_CRON` | `0 0 * * *` | Cron expression for Daily Summary Job (00:00 midnight daily). |
| `AUTOMATION_WEEKLY_CRON` | `0 0 * * 0` | Cron expression for Weekly Summary Job (00:00 midnight every Sunday). |
| `AUTOMATION_OVERDUE_CRON` | `0 8 * * *` | Cron expression for Overdue Task Job (08:00 AM daily). |

---

## 3. Database Schema & Idempotency Guarantees

### A. `automation_summaries`
Stores persistent daily and weekly aggregate rollups.
* **Idempotency Strategy:** Enforced at the database constraint level using `UNIQUE KEY uk_user_summary_period (user_id, summary_type, period_start, period_end)`.
* **Upsert Semantics:** Re-running a job for the same period updates the record via `ON DUPLICATE KEY UPDATE` without generating duplicate entries.

```sql
CREATE TABLE IF NOT EXISTS automation_summaries (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    summary_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    summary_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_summary_period (user_id, summary_type, period_start, period_end),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

### B. `automation_runs`
Provides structured internal telemetry on job execution history, user counts, and errors.

```sql
CREATE TABLE IF NOT EXISTS automation_runs (
    run_id INT AUTO_INCREMENT PRIMARY KEY,
    job_name VARCHAR(100) NOT NULL,
    status ENUM('running', 'success', 'partial_failure', 'failed') NOT NULL DEFAULT 'running',
    users_processed INT DEFAULT 0,
    users_succeeded INT DEFAULT 0,
    users_failed INT DEFAULT 0,
    error_details JSON NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL
);
```

---

## 4. Consistency & Streak Engine

### Active Day Definition
A calendar day is defined as **Active** if and only if the user has at least one qualifying action recorded on that date:
* $\ge 1$ Task completed (`tasks.completed_at`)
* $\ge 1$ Completed Pomodoro focus session (`pomodoro_sessions.started_at`)
* $\ge 1$ Study session recorded (`study_sessions.start_time`)
* $\ge 1$ Domain activity event logged (`activity_events.created_at`)

### Streak Metrics:
1. **`currentStreak`**: Count of consecutive active days traversing backwards from today (or yesterday if today has not yet had qualifying activity).
2. **`longestStreak`**: Maximum consecutive sequence of active days across the 90-day evaluation window.
3. **`totalActiveDays`**: Count of distinct active calendar days in the window.
4. **`consistencyScore`**:
   $$\text{consistencyScore} = \text{round}\left(\frac{\text{totalActiveDays}}{\text{windowDays}} \times 100, 1\right)$$

---

## 5. Overdue Task Detection & Idempotent Alerting

* **Detection Rule:** `status != 'Completed' AND due_date < asOfDate`
* **Zero Mutation Policy:** The automation system **never** mutates or overwrites user task statuses automatically.
* **Idempotent Alerting:** When an overdue task is detected, the system checks `notifications` for existing records matching `(user_id, type = 'TASK_OVERDUE', reference_type = 'task', reference_id = task.task_id, DATE(created_at) = asOfDate)`. Only one notification per overdue task per day is created.

---

## 6. Daily & Weekly Summaries

### Daily Summary Payload:
* `date`: `YYYY-MM-DD`
* `tasks`: `{ created, completed, overdue, completionRate }`
* `focus`: `{ completedSessions, interruptedSessions, focusMinutes, focusHours }`
* `study`: `{ sessionsCount, studyMinutes, studyHours }`
* `goals`: `{ completed, inProgress }`
* `activity`: `{ totalEvents }`
* `activeSubjects`: Array of subject names worked on during the day
* `consistency`: `{ isActiveDay, currentStreak, longestStreak, totalActiveDays, consistencyScore }`

### Weekly Summary Payload:
* `periodStart`, `periodEnd` (7 continuous calendar days)
* `overview`: Multi-domain aggregates (tasks, focus hours, study hours, goals, events)
* `consistency`: `{ activeDaysCount, totalDays: 7, weeklyConsistencyRate, currentStreak, longestStreak, mostProductiveDay }`
* `subjectBreakdown`: Subject-level distribution of time and outputs

---

## 7. REST Endpoints Reference

All endpoints require JWT Bearer Token (`Authorization: Bearer <token>`):

| Method | Endpoint | Query Parameters | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/summaries/daily` | `?date=YYYY-MM-DD` | Returns persisted daily summary (or computes on-demand) |
| `GET` | `/api/summaries/weekly` | `?date=YYYY-MM-DD` | Returns persisted 7-day weekly summary |
| `GET` | `/api/summaries/streak` | `?date=YYYY-MM-DD` | Returns user consistency and streak metrics |
| `GET` | `/api/summaries/history` | `?type=daily\|weekly&limit=10` | Returns historical summary ledger for user |

---

## 8. Multi-Tenant Security & Error Isolation

1. **Scheduled Batch Execution:** User IDs are retrieved strictly from internal database queries (`SELECT user_id FROM users`). No public parameter injection is possible.
2. **Per-User Error Boundaries:** In multi-user job runs, an unexpected error processing User A is caught, logged in `automation_runs.error_details`, and execution proceeds cleanly to User B.
3. **No Public Trigger Routes:** Scheduled jobs can only be invoked via cron or CLI scripts (`npm run job:daily`, `npm run job:weekly`, `npm run job:overdue`).
