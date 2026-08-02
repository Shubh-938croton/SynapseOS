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