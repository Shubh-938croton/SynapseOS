# 📊 Real-Time Analytics Engine Architecture — SynapseOS Phase 3

**Status:** Implemented & Production Ready  
**Scope:** Deterministic, SQL-Aggregated Analytics Engine with Explicit Time-Window Filtering & Multi-Tenant Isolation  

---

## 1. Overview & Architectural Role

The SynapseOS Analytics Engine transforms raw relational records and the immutable Phase 2 `activity_events` stream into deterministic, explainable metrics across 6 distinct analytical domains:

```text
HTTP Request (GET /api/analytics/... ?period=7d)
       ↓
JWT Authentication & Authorization (req.user.user_id)
       ↓
Express Analytics Routes (analyticsRoutes.js)
       ↓
Analytics Controller (analyticsController.js)
       ↓
Analytics Service (analyticsService.js)
  - Time window normalization (1d, 7d, 30d, all)
  - Complete contiguous date-series generation
  - Zero-division guard rails & rate calculations
       ↓
Analytics Model (analyticsModel.js)
  - SQL aggregate functions (COUNT, SUM, AVG, GROUP BY, DATE)
  - Parameterized WHERE user_id = ? filters
       ↓
MySQL Relational Tables & activity_events
```

---

## 2. Supported Time Windows & Date Normalization

All analytical endpoints accept an optional `?period=` query parameter. Date calculations are handled deterministically on the backend:

| Period Key | Normalized Alias | Window Duration | Description |
| :--- | :--- | :--- | :--- |
| `today` | `1d` | 1 calendar day | Current day from `00:00:00` to `23:59:59` |
| `7d` *(default)* | `7d` | 7 calendar days | Past 6 days + today (`CURDATE() - INTERVAL 6 DAY`) |
| `30d` | `30d` | 30 calendar days | Past 29 days + today (`CURDATE() - INTERVAL 29 DAY`) |
| `all` | `all` | Full History / 90d | All lifetime records / 90-day trend horizon |

### Contiguous Series Guarantee:
For any requested period of $N$ days, the service generates an array of $N$ consecutive `YYYY-MM-DD` day buckets. If no activity occurred on a given day, default values of `0` are returned, ensuring line and bar charts render continuous time axes without gaps.

---

## 3. Metric Definitions & Formulas

Every metric is strictly defined and bound:

### A. Productivity (Tasks)
* **`totalTasks`**: Total count of tasks owned by user.
* **`completedTasks`**: Count of tasks where `status = 'Completed'`.
* **`pendingTasks`**: Count of active incomplete tasks (`status != 'Completed'`).
* **`overdueTasks`**: Count of incomplete tasks where `due_date < CURDATE()`.
* **`completionRate`**: 
  $$\text{completionRate} = \begin{cases} \text{round}\left(\frac{\text{completedTasks}}{\text{totalTasks}} \times 100, 1\right) & \text{if } \text{totalTasks} > 0 \\ 0.0 & \text{otherwise} \end{cases}$$
* **`byPriority`**: Distribution count of tasks categorized by `High`, `Medium`, `Low`.
* **`dailyTrend`**: Daily count of tasks completed on each date.

### B. Focus & Pomodoro
* **`totalSessions`**: Count of all logged Pomodoro focus sessions.
* **`completedSessions`**: Count of sessions with `session_status = 'Completed'`.
* **`interruptedSessions`**: Count of sessions with `session_status = 'Interrupted'`.
* **`totalFocusMinutes`**: Sum of duration (in minutes) for completed Pomodoro sessions.
* **`totalFocusHours`**: $\text{round}\left(\frac{\text{totalFocusMinutes}}{60}, 2\right)$.
* **`averageSessionMinutes`**:
  $$\text{averageSessionMinutes} = \begin{cases} \text{round}\left(\frac{\text{totalFocusMinutes}}{\text{completedSessions}}, 1\right) & \text{if } \text{completedSessions} > 0 \\ 0.0 & \text{otherwise} \end{cases}$$
* **`bySubject`**: Focus minutes and session count grouped by academic subject.

### C. Learning & Study Sessions
* **`totalSessions`**: Total logged study sessions.
* **`totalStudyMinutes`**: Sum of `duration_minutes` across all study sessions.
* **`totalStudyHours`**: $\text{round}\left(\frac{\text{totalStudyMinutes}}{60}, 2\right)$.
* **`averageSessionMinutes`**: $\text{round}\left(\frac{\text{totalStudyMinutes}}{\text{totalSessions}}, 1\right)$.
* **`bySubject`**: Subject-level breakdown of total study minutes, session counts, task completion rates, and notes authored.
* **`dailyTrend`**: Daily study minutes across the time window.

### D. Goals
* **`totalGoals`**: Count of all user goals.
* **`completedGoals`**: Count of goals with `status = 'Completed'` or `progress_percentage = 100`.
* **`inProgressGoals`**: Count of goals with `status = 'In Progress'`.
* **`notStartedGoals`**: Count of goals with `status = 'Not Started'`.
* **`overdueGoals`**: Count of incomplete goals where `target_date < CURDATE()`.
* **`goalCompletionRate`**:
  $$\text{goalCompletionRate} = \begin{cases} \text{round}\left(\frac{\text{completedGoals}}{\text{totalGoals}} \times 100, 1\right) & \text{if } \text{totalGoals} > 0 \\ 0.0 & \text{otherwise} \end{cases}$$

### E. Activity & Behavior Events (Phase 2 Integration)
* **`totalEvents`**: Total count of append-only `activity_events` logged in the period.
* **`byType`**: Breakdown of event counts grouped by controlled `event_type`.
* **`dailyTrend`**: Daily event frequency series.
* **`mostActiveDay`**: The date within the period with the peak event volume.

---

## 4. API Endpoints Reference

All endpoints require `Authorization: Bearer <token>`:

| Method | Endpoint | Query Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics` | `?period=7d` | Complete unified analytics payload (powers Stats page) |
| `GET` | `/api/analytics/overview` | `?period=7d` | High-level summary metrics across all domains |
| `GET` | `/api/analytics/productivity` | `?period=7d` | Task metrics, priority breakdown, and daily completion trend |
| `GET` | `/api/analytics/focus` | `?period=7d` | Pomodoro metrics, subject distribution, and focus trend |
| `GET` | `/api/analytics/learning` | `?period=7d` | Study sessions, subject breakdowns, and study trend |
| `GET` | `/api/analytics/goals` | `?period=7d` | Goal statuses, completion rates, and progress distributions |
| `GET` | `/api/analytics/activity` | `?period=7d` | Immutable event log aggregates and peak activity detection |
| `GET` | `/api/analytics/daily` | `?period=7d` | Unified daily time series for multi-metric charting |

---

## 5. Multi-Tenant Security & User Isolation

1. **Zero Client Trust:** Neither `user_id` nor any tenant identifier is ever accepted from `req.body`, `req.query`, or `req.params`.
2. **Strict Identity Injection:** `userId` is strictly extracted from `req.user.user_id` authenticated via JWT bearer token.
3. **Parameterized Scoping:** Every SQL statement enforces `WHERE user_id = ?`. Subqueries and table joins (`tasks`, `study_sessions`, `notes`, `pomodoro_sessions`, `activity_events`) explicitly filter on `user_id`.
4. **Zero Cross-User Leakage:** A user with zero records receives an empty, valid, zero-filled response without SQL errors or data cross-contamination.
