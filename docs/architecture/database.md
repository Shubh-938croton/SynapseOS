# 🗄️ SynapseOS Database Schema & Architecture

## 1. Database Overview

SynapseOS uses **MySQL 8** (hosted on **Aiven Cloud** in production) configured with the **InnoDB** storage engine to provide strict ACID compliance, transactional integrity, and referential enforcement through foreign key constraints.

### Core Architecture Highlights:
- **Tenant Isolation:** Every primary entity is directly scoped to a `user_id` referencing `users(user_id)`.
- **Cascading Integrity:** Foreign keys on user ownership specify `ON DELETE CASCADE` so deleting a user account automatically purges all related subjects, tasks, notes, calendar events, goals, and sessions without orphaned rows.
- **Dynamic Derivation:** Analytics, weekly histograms, and productivity scores are calculated dynamically via optimized SQL aggregations (`SUM`, `AVG`, `COUNT`, `CASE WHEN`) rather than duplicated in static analytics tables.

---

## 2. Entity Relationship Diagram (ERD)

```text
       ┌──────────────┐
       │    users     │
       └──────┬───────┘
              │ (1)
              │
              ├─── (∞) ───► subjects ────────┬─── (∞) ───► tasks
              │                │             │
              │                ├─── (∞) ───► notes
              │                │             │
              │                └─── (∞) ───► study_sessions
              │                              │
              ├─── (∞) ──────────────────────┴─── (∞) ───► pomodoro_sessions
              │
              ├─── (∞) ───► calendar_events
              │
              ├─── (∞) ───► goals
              │
              ├─── (∞) ───► contests
              │
              ├─── (1) ───► settings
              │
              └─── (∞) ───► notifications
```

---

## 3. Detailed Table Specifications

### 1. `users`
Stores authenticated user accounts, profile details, and bcrypt password hashes.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `user_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique user identifier |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | User's display name |
| `username` | `VARCHAR(50)` | `UNIQUE`, `NOT NULL` | Unique account handle |
| `email` | `VARCHAR(100)` | `UNIQUE`, `NOT NULL` | Unique email address |
| `password_hash`| `VARCHAR(225)` | `NOT NULL` | 60-character bcrypt hash |
| `profile_picture`| `VARCHAR(225)` | `NULL` | Optional avatar image URL |
| `bio` | `TEXT` | `NULL` | User biography snippet |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Account creation timestamp |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last updated timestamp |

---

### 2. `subjects`
Stores study subjects or academic courses that categorize tasks, notes, and study sessions.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `subject_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique subject identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `subject_name`| `VARCHAR(100)` | `NOT NULL` | Title of the subject/course |
| `description` | `TEXT` | `NULL` | Optional subject description |
| `color` | `VARCHAR(20)` | `NULL` | Hex color tag for UI badges (e.g. `#3b82f6`) |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Subject creation timestamp |

---

### 3. `tasks`
Stores actionable study items and academic assignments linked to subjects.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `task_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique task identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `subject_id` | `INT` | `NOT NULL`, `FK` | References `subjects(subject_id) ON DELETE CASCADE` |
| `title` | `VARCHAR(200)` | `NOT NULL` | Task title |
| `description` | `TEXT` | `NULL` | Extended task details |
| `priority` | `ENUM('Low','Medium','High')` | `DEFAULT 'Medium'` | Priority level |
| `status` | `ENUM('Pending','Completed')` | `DEFAULT 'Pending'` | Task completion status |
| `due_date` | `DATE` | `NULL` | Deadline date |
| `completed_at`| `DATETIME` | `NULL` | Timestamp when marked completed |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 4. `notes`
Stores markdown-formatted notes and revision summaries organized by subject.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `note_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique note identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `subject_id` | `INT` | `NOT NULL`, `FK` | References `subjects(subject_id) ON DELETE CASCADE` |
| `title` | `VARCHAR(200)` | `NOT NULL` | Note headline |
| `content` | `LONGTEXT` | `NOT NULL` | Full markdown/rich content |
| `is_pinned` | `BOOLEAN` | `DEFAULT FALSE` | Pinned to top of notes list |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last updated timestamp |

---

### 5. `calendar_events`
Stores user-created academic milestones, exams, and scheduled events.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `event_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique event identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `title` | `VARCHAR(200)` | `NOT NULL` | Event title |
| `description` | `TEXT` | `NULL` | Event details |
| `event_date` | `DATE` | `NOT NULL` | Scheduled date (`YYYY-MM-DD`) |
| `start_time` | `TIME` | `NULL` | Starting time (`HH:MM:SS`) |
| `end_time` | `TIME` | `NULL` | Ending time (`HH:MM:SS`) |
| `reminder_minutes` | `INT` | `DEFAULT 30` | Minutes prior to notify |
| `status` | `ENUM('Upcoming','Completed','Cancelled')` | `DEFAULT 'Upcoming'` | Event status |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 6. `goals`
Stores long-term learning goals and milestone percentages.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `goal_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique goal identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `title` | `VARCHAR(200)` | `NOT NULL` | Goal title |
| `description` | `TEXT` | `NULL` | Target description |
| `target_date` | `DATE` | `NULL` | Expected completion date |
| `progress_percentage` | `INT` | `DEFAULT 0 CHECK (0-100)` | Progress percentage |
| `status` | `ENUM('Not Started','In Progress','Completed')` | `DEFAULT 'Not Started'` | Goal progress status |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last updated timestamp |

---

### 7. `study_sessions`
Records actual deep-work study blocks with topics and automatic duration calculations.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique session identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `subject_id` | `INT` | `NOT NULL`, `FK` | References `subjects(subject_id) ON DELETE CASCADE` |
| `topic` | `VARCHAR(200)` | `NOT NULL` | Specific study topic studied |
| `start_time` | `DATETIME` | `NOT NULL` | Session start timestamp |
| `end_time` | `DATETIME` | `NOT NULL` | Session end timestamp |
| `duration_minutes` | `INT` | `NOT NULL` | Total elapsed duration in minutes |
| `session_notes` | `TEXT` | `NULL` | Post-session notes & takeaways |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 8. `pomodoro_sessions`
Maintains an audit trail of 25/5 focus cycles.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `session_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique session identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `subject_id` | `INT` | `NULL`, `FK` | References `subjects(subject_id) ON DELETE SET NULL` |
| `task_id` | `INT` | `NULL`, `FK` | References `tasks(task_id) ON DELETE SET NULL` |
| `duration_minutes` | `INT` | `NOT NULL` | Focused minutes logged |
| `break_minutes` | `INT` | `DEFAULT 5` | Break time elapsed |
| `session_status` | `ENUM('Completed','Interrupted')` | `DEFAULT 'Completed'` | Session outcome |
| `started_at` | `DATETIME` | `NOT NULL` | Focus block start time |
| `ended_at` | `DATETIME` | `NOT NULL` | Focus block end time |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Log creation timestamp |

---

### 9. `contests`
Tracks competitive programming contests across platforms with external registration links.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `contest_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique contest identifier |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `platform` | `ENUM('LeetCode','Codeforces','CodeChef','HackerRank','AtCoder','Other')` | `NOT NULL` | CP Platform |
| `contest_name` | `VARCHAR(200)` | `NOT NULL` | Name of the contest |
| `contest_date` | `DATETIME` | `NOT NULL` | Scheduled contest date & time |
| `contest_url` | `VARCHAR(255)` | `NULL` | Direct URL to contest page |
| `participation_status` | `ENUM('Upcoming','Participated','Missed')` | `DEFAULT 'Upcoming'` | Status |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

### 10. `settings`
Stores user-specific UI preferences and default timer configurations (1-to-1 relationship with `users`).

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `setting_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique setting record ID |
| `user_id` | `INT` | `UNIQUE`, `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `theme` | `ENUM('Light','Dark')` | `DEFAULT 'Light'` | Preferred visual theme |
| `notification_enabled` | `BOOLEAN` | `DEFAULT TRUE` | Global alert toggle |
| `daily_goal_minutes` | `INT` | `DEFAULT 120` | Daily study target in minutes |
| `pomodoro_duration` | `INT` | `DEFAULT 25` | Default focus duration |
| `short_break_duration` | `INT` | `DEFAULT 5` | Default short break |
| `long_break_duration` | `INT` | `DEFAULT 15` | Default long break |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |
| `updated_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Last updated timestamp |

---

### 11. `notifications`
Stores in-app contextual alerts and event reminders.

| Column | Data Type | Modifiers | Description |
| :--- | :--- | :--- | :--- |
| `notification_id` | `INT` | `AUTO_INCREMENT`, `PK` | Unique notification ID |
| `user_id` | `INT` | `NOT NULL`, `FK` | References `users(user_id) ON DELETE CASCADE` |
| `type` | `VARCHAR(50)` | `NOT NULL` | Alert category (e.g. `reminder`, `system`) |
| `title` | `VARCHAR(150)` | `NOT NULL` | Alert title |
| `message` | `VARCHAR(500)` | `NOT NULL` | Body text |
| `reference_type` | `VARCHAR(50)` | `NULL` | Related entity (`task`, `event`, `contest`) |
| `reference_id` | `INT` | `NULL` | ID of the related entity |
| `is_read` | `BOOLEAN` | `DEFAULT FALSE` | Read status |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Creation timestamp |

---

## 4. Indexing Strategy (`013_indexes.sql`)

To guarantee high-throughput query performance under multi-tenant workloads, B-Tree indexes are applied to all high-cardinality foreign keys and date-filtering columns:

```sql
CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_subject ON tasks(subject_id);
CREATE INDEX idx_notes_user ON notes(user_id);
CREATE INDEX idx_notes_subject ON notes(subject_id);
CREATE INDEX idx_calendar_user_date ON calendar_events(user_id, event_date);
CREATE INDEX idx_study_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_study_sessions_date ON study_sessions(start_time);
CREATE INDEX idx_pomodoro_user ON pomodoro_sessions(user_id);
CREATE INDEX idx_contests_user_date ON contests(user_id, contest_date);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
```
