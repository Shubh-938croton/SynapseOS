# 📡 SynapseOS REST API Reference Documentation

**Base URL (Local):** `http://localhost:5000/api`  
**Base URL (Production):** `https://synapseos-backend.onrender.com/api`  
**Authentication Header:** `Authorization: Bearer <JWT_TOKEN>`  
**Default Content-Type:** `application/json`

---

## 1. System & Health Check

### Health Check Probe
- **Method:** `GET`
- **Endpoints:** `/health` or `/api/health`
- **Auth Required:** No
- **Success Response:** `200 OK`
  ```json
  {
    "status": "ok",
    "uptime": 1420.52,
    "timestamp": "2026-09-15T09:00:00.000Z"
  }
  ```

---

## 2. Authentication (`/api/auth`)

### Register User
- **Method:** `POST`
- **Endpoint:** `/api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "full_name": "Jane Doe",
    "username": "janedoe",
    "email": "jane@university.edu",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "userId": 1
  }
  ```
- **Error Responses:**
  - `400 Bad Request` — Missing required fields or duplicate email/username.

### Login User
- **Method:** `POST`
- **Endpoint:** `/api/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "jane@university.edu",
    "password": "SecurePassword123!"
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "user_id": 1,
      "full_name": "Jane Doe",
      "username": "janedoe",
      "email": "jane@university.edu"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request` — Missing email or password.
  - `401 Unauthorized` — Invalid email or incorrect password.

### Google OAuth 2.0 Sign-In
- **Method:** `POST`
- **Endpoint:** `/api/auth/google`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "access_token": "ya29.a0AfH6...",
    "id_token": "optional_id_token"
  }
  ```
- **Success Response:** `200 OK` or `201 Created`
  ```json
  {
    "message": "Google login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "user_id": 1,
      "full_name": "Jane Doe",
      "username": "janedoe",
      "email": "jane@gmail.com",
      "profile_picture": "https://lh3.googleusercontent.com/..."
    }
  }
  ```

---

## 3. User Profile Management (`/api/users`)

### Get Profile
- **Method:** `GET`
- **Endpoint:** `/api/users/profile`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "message": "Profile fetched successfully",
    "profile": {
      "user_id": 1,
      "full_name": "Jane Doe",
      "username": "janedoe",
      "email": "jane@university.edu",
      "profile_picture": null,
      "bio": "CS Major & Systems Engineering enthusiast",
      "created_at": "2026-08-01T12:00:00.000Z",
      "updated_at": "2026-09-01T14:30:00.000Z"
    }
  }
  ```

### Update Profile
- **Method:** `PUT`
- **Endpoint:** `/api/users/profile`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "full_name": "Jane Doe",
    "username": "jane_doe_cs",
    "email": "jane.doe@university.edu",
    "bio": "Updated bio text",
    "profile_picture": null
  }
  ```
- **Success Response:** `200 OK`

### Change Password
- **Method:** `PUT`
- **Endpoint:** `/api/users/change-password`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "current_password": "OldPassword123!",
    "new_password": "NewSecurePassword456!"
  }
  ```
- **Success Response:** `200 OK`

---

## 4. Subject Management (`/api/subjects`)

### Get All Subjects
- **Method:** `GET`
- **Endpoint:** `/api/subjects`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  [
    {
      "subject_id": 1,
      "user_id": 1,
      "subject_name": "Data Structures & Algorithms",
      "description": "Trees, Graphs, Dynamic Programming",
      "color": "#3b82f6",
      "created_at": "2026-08-10T10:00:00.000Z"
    }
  ]
  ```

### Create Subject
- **Method:** `POST`
- **Endpoint:** `/api/subjects`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "subject_name": "Operating Systems",
    "description": "Processes, Memory Management, File Systems",
    "color": "#10b981"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "message": "Subject created successfully",
    "subject_id": 2
  }
  ```

### Update Subject
- **Method:** `PUT`
- **Endpoint:** `/api/subjects/:id`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "subject_name": "Operating Systems & Concurrency",
    "description": "Updated course notes",
    "color": "#06b6d4"
  }
  ```
- **Success Response:** `200 OK`

### Delete Subject
- **Method:** `DELETE`
- **Endpoint:** `/api/subjects/:id`
- **Auth Required:** Yes
- **Description:** Cascades deletion across all tasks, notes, and study sessions linked to this subject.
- **Success Response:** `200 OK`

---

## 5. Task Management (`/api/tasks`)

### Get All Tasks
- **Method:** `GET`
- **Endpoint:** `/api/tasks`
- **Auth Required:** Yes
- **Success Response:** `200 OK` (includes joined `subject_name` and `color`)

### Create Task
- **Method:** `POST`
- **Endpoint:** `/api/tasks`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "subject_id": 1,
    "title": "Implement Red-Black Tree in C++",
    "description": "Handle left/right rotations and recoloring",
    "priority": "High",
    "due_date": "2026-09-20"
  }
  ```
- **Success Response:** `201 Created`

### Update Task / Toggle Status
- **Method:** `PUT`
- **Endpoint:** `/api/tasks/:id`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "subject_id": 1,
    "title": "Implement Red-Black Tree in C++",
    "description": "Completed rotations",
    "priority": "High",
    "status": "Completed",
    "due_date": "2026-09-20"
  }
  ```
- **Success Response:** `200 OK`

### Delete Task
- **Method:** `DELETE`
- **Endpoint:** `/api/tasks/:id`
- **Auth Required:** Yes
- **Success Response:** `200 OK`

---

## 6. Notes Knowledge Base (`/api/notes`)

### Get All Notes
- **Method:** `GET`
- **Endpoint:** `/api/notes`
- **Auth Required:** Yes

### Create Note
- **Method:** `POST`
- **Endpoint:** `/api/notes`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "subject_id": 1,
    "title": "B-Tree Indexing Deep Dive",
    "content": "# B-Tree Properties\n- All leaves at same depth\n- Node contains k-1 keys",
    "is_pinned": true
  }
  ```
- **Success Response:** `201 Created`

### Update Note / Toggle Pinned
- **Method:** `PUT`
- **Endpoint:** `/api/notes/:id`
- **Auth Required:** Yes

### Delete Note
- **Method:** `DELETE`
- **Endpoint:** `/api/notes/:id`
- **Auth Required:** Yes

---

## 7. Calendar Events (`/api/calendar`)

### Get All Events
- **Method:** `GET`
- **Endpoint:** `/api/calendar`
- **Auth Required:** Yes

### Create Event
- **Method:** `POST`
- **Endpoint:** `/api/calendar`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "title": "Operating Systems Midterm Exam",
    "description": "Chapters 1-6 coverage",
    "event_date": "2026-09-28",
    "start_time": "10:00:00",
    "end_time": "12:00:00",
    "reminder_minutes": 60,
    "status": "Upcoming"
  }
  ```

### Update / Delete Event
- `PUT /api/calendar/:id`
- `DELETE /api/calendar/:id`

---

## 8. Goal Tracking (`/api/goals`)

### Get All Goals
- `GET /api/goals`

### Create Goal
- **Method:** `POST`
- **Endpoint:** `/api/goals`
- **Request Body:**
  ```json
  {
    "title": "Solve 200 LeetCode Mediums",
    "description": "Focus on Graphs & DP",
    "target_date": "2026-12-31",
    "progress_percentage": 45,
    "status": "In Progress"
  }
  ```

### Update Goal
- `PUT /api/goals/:id` (Updates title, target date, progress percentage `0-100`, status)

### Delete Goal
- `DELETE /api/goals/:id`

---

## 9. Study Sessions & Deep Work (`/api/study-sessions`)

### Get All Study Sessions
- `GET /api/study-sessions`

### Log Study Session
- **Method:** `POST`
- **Endpoint:** `/api/study-sessions`
- **Request Body:**
  ```json
  {
    "subject_id": 1,
    "topic": "Graph Dijkstra & Bellman-Ford",
    "start_time": "2026-09-15 14:00:00",
    "end_time": "2026-09-15 16:30:00",
    "duration_minutes": 150,
    "session_notes": "Solved 3 path problems"
  }
  ```

### Update / Delete Study Session
- `PUT /api/study-sessions/:id`
- `DELETE /api/study-sessions/:id`

---

## 10. Pomodoro Focus Engine (`/api/pomodoro`)

### Get Pomodoro Logs
- `GET /api/pomodoro`

### Record Pomodoro Session
- **Method:** `POST`
- **Endpoint:** `/api/pomodoro`
- **Request Body:**
  ```json
  {
    "subject_id": 1,
    "task_id": 4,
    "duration_minutes": 25,
    "break_minutes": 5,
    "session_status": "Completed",
    "started_at": "2026-09-15 17:00:00",
    "ended_at": "2026-09-15 17:25:00"
  }
  ```

---

## 11. Coding Contest Tracker (`/api/contests`)

### Get All Contests
- `GET /api/contests`

### Create Contest
- **Method:** `POST`
- **Endpoint:** `/api/contests`
- **Request Body:**
  ```json
  {
    "platform": "LeetCode",
    "contest_name": "Weekly Contest 415",
    "contest_date": "2026-09-21 08:00:00",
    "contest_url": "https://leetcode.com/contest/weekly-contest-415",
    "participation_status": "Upcoming"
  }
  ```

### Update Contest Status
- `PUT /api/contests/:id` (e.g., mark as `Participated` or `Missed`)

### Delete Contest
- `DELETE /api/contests/:id`

---

## 12. Dashboard (`/api/dashboard`)

- `GET /api/dashboard/summary` — Returns user-scoped task counters, total study hours, Pomodoro blocks, and active goals.
- `GET /api/dashboard/subject-analysis` — Computes study hours and session counts broken down by subject.
- `GET /api/dashboard/weekly` — Day-by-day weekly study hour aggregations (Mon–Sun).
- `GET /api/dashboard/goals` — Aggregated goal completion rate and average progress.
- `GET /api/dashboard/pomodoro` — Pomodoro completion ratios and total focus time.
- `GET /api/dashboard/productivity` — Multi-factor productivity score (0-100), calculated grade, and recommendations.

---

## 13. Notifications (`/api/notifications`)

- `GET /api/notifications` — Returns all notifications ordered by creation date descending.
- `PUT /api/notifications/:id/read` — Marks a specific notification as read.
- `PUT /api/notifications/read-all` — Marks all notifications for the authenticated user as read.

---

## 14. Settings & Preferences (`/api/settings`)

- `GET /api/settings` — Returns user's theme, notification flags, daily study goal, and Pomodoro interval settings.
- `PUT /api/settings` — Updates settings payload with persistence in MySQL.

---

## 15. YouTube Focus Search Proxy (`/api/youtube`)

- `GET /api/youtube/search?query=react+tutorial&maxResults=12` — Queries YouTube Data API v3 securely using the backend server's `YOUTUBE_API_KEY` and returns sanitized video metadata.
- `GET /api/youtube/video/:videoId` — Fetches specific video metadata and player configuration.

---

## 16. Multi-Dimensional Analytics Engine (`/api/analytics`)

Unified analytics engine computing deterministic metrics from raw activity logs and domain entities.

### Full Consolidated Analytics
- **Method:** `GET`
- **Endpoint:** `/api/analytics`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "overview": {
      "totalStudyMinutes": 720,
      "completedTasks": 14,
      "activeGoals": 3,
      "currentStreak": 5
    },
    "productivity": {
      "productivityScore": 86,
      "hourlyDistribution": [ ... ]
    },
    "focus": {
      "completedPomodoros": 12,
      "deepWorkMinutes": 300
    },
    "learning": {
      "subjectBreakdown": [ ... ]
    },
    "goals": {
      "completionRate": 66.7,
      "avgProgress": 72.0
    },
    "activity": {
      "recentEvents": [ ... ],
      "dailyTimeline": [ ... ]
    }
  }
  ```

### Overview Metrics
- **Method:** `GET`
- **Endpoint:** `/api/analytics/overview`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Summary counters of study time, tasks, pomodoros, and streaks.

### Productivity Analytics
- **Method:** `GET`
- **Endpoint:** `/api/analytics/productivity`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Productivity score (0–100), completion ratios, and hourly activity heatmaps.

### Focus & Pomodoro Metrics
- **Method:** `GET`
- **Endpoint:** `/api/analytics/focus`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Focus session durations, break intervals, and completion percentages.

### Learning & Subject Distribution
- **Method:** `GET`
- **Endpoint:** `/api/analytics/learning`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Time spent per subject, subject task counts, and learning distribution.

### Goal Velocity & Completion
- **Method:** `GET`
- **Endpoint:** `/api/analytics/goals`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Goal progress velocity, completion rate, and target deadlines.

### Activity Timeline & Events
- **Method:** `GET`
- **Endpoint:** `/api/analytics/activity`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Chronological event stream and daily activity distribution.

### Daily Normalized Time-Series
- **Method:** `GET`
- **Endpoint:** `/api/analytics/daily`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Time-series study minutes and task completion for trend charts.

---

## 17. Automated Periodic Summaries (`/api/summaries`)

Aggregated daily and weekly rollups computed automatically by scheduled workers and on-demand queries.

### Get Daily Summary
- **Method:** `GET`
- **Endpoint:** `/api/summaries/daily?date=2026-09-20`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "summary_id": 14,
    "user_id": 1,
    "summary_date": "2026-09-20",
    "study_minutes": 180,
    "tasks_completed": 5,
    "pomodoro_count": 6,
    "score": 88,
    "notes_created": 2,
    "created_at": "2026-09-20T23:59:00.000Z"
  }
  ```

### Get Weekly Summary
- **Method:** `GET`
- **Endpoint:** `/api/summaries/weekly?week_start=2026-09-14`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Aggregated weekly metrics, day-by-day distribution, and trend comparison.

### Get User Streak
- **Method:** `GET`
- **Endpoint:** `/api/summaries/streak`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "currentStreak": 5,
    "longestStreak": 14,
    "lastActiveDate": "2026-09-20"
  }
  ```

### Get Historical Summary Snapshots
- **Method:** `GET`
- **Endpoint:** `/api/summaries/history?limit=30`
- **Auth Required:** Yes
- **Success Response:** `200 OK` — Array of historical daily summary records for trend analysis.

---

## 18. AI Intelligence & Personalization Layer (`/api/ai`)

*Advisory-Only Invariant: The AI Layer NEVER mutates database state directly. It generates structured action proposals that require explicit user approval.*

### AI Provider Status
- **Method:** `GET`
- **Endpoint:** `/api/ai/status`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "provider": "gemini",
    "model": "gemini-1.5-flash",
    "ready": true,
    "features": ["daily-brief", "planner", "task-breakdown", "weak-areas", "weekly-review", "action-proposals"]
  }
  ```

### Personalized Daily Brief
- **Method:** `GET` or `POST`
- **Endpoint:** `/api/ai/daily-brief`
- **Auth Required:** Yes (AI Rate Limiter: 10 req/min)
- **Caching:** 15-minute TTL per user to optimize token usage.
- **Success Response:** `200 OK`
  ```json
  {
    "greeting": "Good morning, Jane!",
    "summary": "You have 3 high-priority tasks due today and an Operating Systems exam in 2 days.",
    "topPriorities": [
      "Implement Red-Black Tree in C++",
      "Review Virtual Memory slides"
    ],
    "proposals": [
      {
        "actionType": "RESCHEDULE_TASK",
        "actionPayload": {
          "taskId": 4,
          "taskTitle": "Implement Red-Black Tree in C++",
          "currentDueDate": "2026-09-20",
          "suggestedDueDate": "2026-09-18",
          "reason": "Clear dependency before Friday's lab submission"
        },
        "expectedCurrentValue": {
          "due_date": "2026-09-20"
        }
      }
    ]
  }
  ```

### Approve Action Proposal
- **Method:** `POST`
- **Endpoint:** `/api/ai/actions/approve`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "actionType": "RESCHEDULE_TASK",
    "actionPayload": {
      "taskId": 4,
      "suggestedDueDate": "2026-09-18"
    },
    "expectedCurrentValue": {
      "due_date": "2026-09-20"
    }
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "actionType": "RESCHEDULE_TASK",
    "message": "Task rescheduled successfully",
    "updatedEntity": { ... }
  }
  ```
- **Error Responses:**
  - `400 Bad Request` — Unsupported action type or missing parameters.
  - `409 Conflict` (`code: "STALE_PROPOSAL"`) — The target entity was modified by the user or another process after the AI generated the proposal.

### Batch Approve Action Proposals
- **Method:** `POST`
- **Endpoint:** `/api/ai/actions/batch-approve`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "proposals": [
      {
        "actionType": "PRIORITIZE_TASK",
        "actionPayload": { "taskId": 4, "suggestedPriority": "High" },
        "expectedCurrentValue": { "priority": "Medium" }
      },
      {
        "actionType": "RESCHEDULE_TASK",
        "actionPayload": { "taskId": 7, "suggestedDueDate": "2026-09-22" },
        "expectedCurrentValue": { "due_date": "2026-09-25" }
      }
    ]
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "executedCount": 2,
    "results": [ ... ]
  }
  ```

### Contextual Productivity Insights
- **Method:** `POST`
- **Endpoint:** `/api/ai/insights`
- **Auth Required:** Yes (AI Rate Limiter)
- **Success Response:** `200 OK` — Personalized productivity insights grounded in recent activity history.

### AI Daily Schedule Planner
- **Method:** `POST`
- **Endpoint:** `/api/ai/planner`
- **Auth Required:** Yes (AI Rate Limiter)
- **Request Body:** `{ "availableHours": 4, "targetDate": "2026-09-20" }`
- **Success Response:** `200 OK` — Structured time-blocked study schedule with optional task proposals.

### AI Task Breakdown
- **Method:** `POST`
- **Endpoint:** `/api/ai/task-breakdown`
- **Auth Required:** Yes (AI Rate Limiter)
- **Request Body:** `{ "taskId": 4, "depth": "detailed" }`
- **Success Response:** `200 OK` — Actionable subtasks with estimated durations and execution sequence.

### AI Subject Weak-Area Detection
- **Method:** `POST`
- **Endpoint:** `/api/ai/weak-areas`
- **Auth Required:** Yes (AI Rate Limiter)
- **Success Response:** `200 OK` — Identifies neglected subjects or overdue task patterns with remediation steps.

### AI Weekly Retrospective Review
- **Method:** `POST`
- **Endpoint:** `/api/ai/weekly-review`
- **Auth Required:** Yes (AI Rate Limiter)
- **Success Response:** `200 OK` — Weekly performance synthesis, consistency ratings, and recommendations for the upcoming week.

### AI Natural Language Task Parser
- **Method:** `POST`
- **Endpoint:** `/api/ai/parse-task`
- **Auth Required:** Yes (AI Rate Limiter)
- **Request Body:** `{ "prompt": "Read chapter 4 of OS by tomorrow 5pm high priority" }`
- **Success Response:** `200 OK` — Parsed structured task JSON (`{ title, due_date, priority, subject_id }`).
