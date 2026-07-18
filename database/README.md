# SynapseOS Database

## Overview

This folder contains the complete database design for the SynapseOS productivity application.

The database is designed to manage:

- Users
- Subjects
- Tasks
- Notes
- Calendar Events
- Goals
- Study Sessions
- Progress Tracking
- Pomodoro Sessions
- Coding Contests
- User Settings

---

## Database Name

```
synapseos
```

---

## Folder Structure

```
database/
│
├── schema.sql
├── seed.sql
├── queries.sql
├── er-diagram.png
└── README.md
```

---

## File Description

### schema.sql

Contains the complete database structure.

Includes:
- CREATE DATABASE
- CREATE TABLE
- Primary Keys
- Foreign Keys
- Constraints

---

### seed.sql

Contains sample data for testing.

Includes:
- INSERT statements

---

### queries.sql

Contains practice and application queries.

Examples:
- SELECT
- INSERT
- UPDATE
- DELETE
- JOIN
- GROUP BY

---

## Database Tables

| Table | Purpose |
|--------|---------|
| users | Stores user information |
| subjects | Stores study subjects |
| tasks | Stores daily tasks |
| notes | Stores study notes |
| calendar_events | Stores events and deadlines |
| goals | Stores long-term goals |
| study_sessions | Stores study history |
| progress | Stores learning progress |
| pomodoro_sessions | Stores Pomodoro sessions |
| contests | Stores coding contests |
| youtube_focus | Stores YouTube focus settings |
| settings | Stores application settings |

---

## Relationships

- One User can have many Subjects.
- One User can have many Tasks.
- One User can have many Notes.
- One Subject can have many Tasks.
- One Subject can have many Notes.

---

## Setup Instructions

1. Run `schema.sql`
2. Run `seed.sql`
3. Run `queries.sql`

---

## ER Diagram

The ER Diagram is available in:

```
er-diagram.png
```

---

## Author

**Shubh Kamal**

Project: SynapseOS