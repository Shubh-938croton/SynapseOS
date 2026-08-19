# Database Design

Database Name

```text
synapseos
```

---

## Users Table

```text
user_id (PK)
full_name
username
email
password_hash
created_at
```

---

## Subjects Table

```text
subject_id (PK)
user_id (FK)
subject_name
description
created_at
```

---

## Tasks Table

```text
task_id (PK)
user_id (FK)
subject_id (FK)
title
description
priority
status
deadline
created_at
updated_at
```

---

## Notes Table

```text
note_id (PK)
user_id (FK)
subject_id (FK)
title
content
is_pinned
created_at
updated_at
```

---

## Relationships

```text
Users
│
├──────── Subjects
│             │
│             ├──────── Tasks
│             │
│             └──────── Notes
```

---

## Entity Relationship Diagram

```text
Users
(user_id)
     │
     │1
     │
     │∞
Subjects
(subject_id)
     │
 ┌───┴────┐
 │        │
 │∞       │∞
 │        │
Tasks    Notes
```

---

## Security Rules

- Every Subject belongs to one User.
- Every Task belongs to one User.
- Every Note belongs to one User.
- JWT determines the authenticated user.
- Users cannot access other users' data.
- Foreign keys enforce referential integrity.

---

## Constraints

- Email must be unique.
- Username must be unique.
- Passwords are stored using bcrypt hashing.
- JWT authentication protects all private APIs.



## Calendar Events Table

| Column | Type |
|---------|------|
| event_id | INT (PK) |
| user_id | INT (FK) |
| title | VARCHAR(200) |
| description | TEXT |
| event_date | DATE |
| start_time | TIME |
| end_time | TIME |
| reminder_minutes | INT |
| status | ENUM |
| created_at | TIMESTAMP |

Relationship

Users (1)
   │
   │
   └──────── Calendar Events (∞)







   # Goals Table

Table Name : goals

Purpose

Stores long-term study goals.

Columns

- goal_id
- user_id
- title
- description
- target_date
- progress_percentage
- status
- created_at
- updated_at

Relationship

users
    │
    └──────< goals

Features

- Progress Tracking
- Goal Status
- User Isolation

=====================================================

# Study Sessions Table

Table Name : study_sessions

Purpose

Stores every study session completed by a user.

Columns

- session_id
- user_id
- subject_id
- topic
- start_time
- end_time
- duration_minutes
- session_notes
- created_at

Relationship

users
    │
    ├──────< study_sessions >────── subjects
    │
    └──────< goals

Features

- Subject-wise Study Tracking
- Automatic Duration Calculation
- Session Notes
- User Isolation




## Pomodoro Sessions Table

Table Name

pomodoro_sessions

Purpose

Stores every completed Pomodoro focus session.

Columns

- session_id (Primary Key)
- user_id (Foreign Key)
- subject_id (Foreign Key)
- task_id (Foreign Key)
- duration_minutes
- break_minutes
- session_status
- started_at
- ended_at
- created_at

Relationships

users
   │
   ├──────< pomodoro_sessions >────── subjects
   │
   └──────< pomodoro_sessions >────── tasks

Features

- Subject-wise focus tracking
- Task-wise focus tracking
- Automatic duration calculation
- Break time recording
- User-specific data


## Dashboard Analytics

The Dashboard module does not store data in a separate table.

Instead, it aggregates information from existing tables.

Data Sources

- users
- subjects
- tasks
- notes
- goals
- study_sessions
- pomodoro_sessions

Aggregated Metrics

- Total Subjects
- Total Tasks
- Completed Tasks
- Pending Tasks
- Total Notes
- Total Goals
- Completed Goals
- Total Study Sessions
- Total Study Hours
- Total Pomodoro Sessions
- Total Pomodoro Hours

Purpose

Provide a real-time overview of the user's productivity without duplicating data.



## Subject Analytics

Purpose

Provides subject-wise productivity statistics.

Data Sources

- subjects
- study_sessions
- pomodoro_sessions

Aggregated Metrics

- Total Study Sessions
- Total Study Hours
- Total Pomodoro Sessions
- Total Pomodoro Hours

Implementation

Uses aggregated subqueries with LEFT JOIN to avoid duplicate rows and ensure accurate calculations.



## Weekly Analytics

Purpose

Provides day-wise study activity statistics for visualization and productivity tracking.

Data Source

- study_sessions

Aggregated Metrics

- Study Sessions per Day
- Study Hours per Day

Implementation

Uses SQL aggregation with

- DAYNAME()
- WEEKDAY()
- GROUP BY
- SUM()
- COUNT()

The backend ensures all seven days are returned even if no study sessions exist for a particular day.


## Goal Analytics

Purpose

Provides statistics related to goal completion and user progress.

Data Source

- goals

Aggregated Metrics

- Total Goals
- Completed Goals
- In Progress Goals
- Not Started Goals
- Average Progress Percentage

Implementation

Uses SQL aggregate functions:

- COUNT()
- SUM(CASE WHEN ...)
- AVG()
- ROUND()
- IFNULL()

The backend ensures zero values are returned instead of NULL for users without goals.



## Pomodoro Analytics

Purpose

Provides aggregated statistics about Pomodoro sessions.

Data Source

- pomodoro_sessions

Aggregated Metrics

- Total Sessions
- Completed Sessions
- Interrupted Sessions
- Total Focus Hours
- Average Session Duration
- Longest Session

Implementation

Uses SQL aggregate functions:

- COUNT()
- SUM(CASE WHEN ...)
- SUM()
- AVG()
- MAX()
- ROUND()
- IFNULL()


# Productivity Score

Purpose

Calculates an overall productivity score using multiple productivity metrics.

Data Sources

- goals
- study_sessions
- pomodoro_sessions
- tasks

Calculated Metrics

- Goal Progress
- Study Hours
- Completed Pomodoro Sessions
- Task Completion

Output

- Productivity Score
- Grade
- Recommendation Message

Implementation

Uses

- COUNT()
- SUM()
- AVG()
- CASE WHEN
- IFNULL()

# Current Database Status — August 2026

## Current Application Data Model

The relational database now supports the core productivity modules:

- users
- subjects
- tasks
- notes
- calendar_events
- goals
- study_sessions
- pomodoro_sessions

Dashboard and analytics are derived from existing transactional tables rather than duplicated into a separate analytics table.

## User Profile

Profile management currently uses the existing `users` table.

Profile fields in the current `users` table include:

- `user_id`
- `full_name`
- `username`
- `email`
- `password_hash`
- `profile_picture` (optional)
- `bio` (optional)
- `created_at`
- `updated_at`

No separate profile table is required.

### Avatar

The database already contains an optional `profile_picture` field, but the avatar upload/storage flow is **not yet integrated into the application**. Avatar support is intentionally deferred to final polishing.

## Security

User-owned records are scoped using the authenticated JWT `user_id`.

Passwords are stored as bcrypt hashes.
