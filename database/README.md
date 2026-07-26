# 🗄️ SynapseOS Database

## 📖 Overview

This directory contains the complete database architecture for **SynapseOS**, a personalized productivity operating system designed to help students and developers organize their learning, tasks, notes, study sessions, and progress.

The database follows relational database design principles and is structured to be scalable, maintainable, and ready for future full-stack development using **Node.js**, **Express.js**, and **MySQL**.

---

# 🎯 Objectives

The database is designed to support:

- User Authentication
- Task Management
- Subject Management
- Notes Management
- Calendar & Events
- Goal Tracking
- Study Session Tracking
- Pomodoro Timer History
- Coding Contest Tracking
- Progress Analytics
- User Settings
- Future AI Integration

---

# 🛠️ Database Information

| Property | Value |
|----------|-------|
| Database Name | `synapseos` |
| Database Type | MySQL |
| Design | Relational Database |
| Normalization | Third Normal Form (3NF) |
| Primary Keys | Auto Increment |
| Relationships | One-to-One & One-to-Many |

---

# 📂 Folder Structure

```text
database/
│
├── README.md
│
├── schema/
│   ├── 001_create_database.sql
│   ├── 002_users.sql
│   ├── 003_subjects.sql
│   ├── 004_tasks.sql
│   ├── 005_notes.sql
│   ├── 006_calendar_events.sql
│   ├── 007_goals.sql
│   ├── 008_study_sessions.sql
│   ├── 009_progress.sql
│   ├── 010_pomodoro_sessions.sql
│   ├── 011_contests.sql
│   ├── 012_youtube_focus.sql
│   ├── 013_settings.sql
│   └── 014_indexes.sql
│
├── seed/
│   ├── demo_users.sql
│   ├── demo_subjects.sql
│   ├── demo_tasks.sql
│   ├── demo_notes.sql
│   └── demo_calendar_events.sql
│
├── queries/
│   ├── user_queries.sql
│   ├── task_queries.sql
│   ├── analytics_queries.sql
│   └── reports.sql
│
├── diagrams/
│   └── er-diagram.png
│
└── backups/
    └── README.md
```

---

# 📁 Directory Description

## 📌 schema/

Contains the complete database schema.

Includes:

- Database Creation
- Table Creation
- Primary Keys
- Foreign Keys
- Constraints
- Indexes

---

## 📌 seed/

Contains sample data for development and testing.

Includes demo records for:

- Users
- Subjects
- Tasks
- Notes
- Calendar Events

---

## 📌 queries/

Contains reusable SQL queries used during development.

Examples include:

- SELECT Queries
- INSERT Queries
- UPDATE Queries
- DELETE Queries
- JOIN Queries
- GROUP BY
- ORDER BY
- Aggregate Functions
- Reports
- Analytics

---

## 📌 diagrams/

Contains the visual database design.

Includes:

- Entity Relationship Diagram (ER Diagram)
- Future Database Architecture

---

## 📌 backups/

Reserved for future database backup files.

---

# 🗃️ Database Tables

| Table | Description |
|--------|-------------|
| users | Stores user account information |
| subjects | Stores study subjects |
| tasks | Stores daily tasks and assignments |
| notes | Stores personal study notes |
| calendar_events | Stores schedules, reminders and deadlines |
| goals | Stores long-term academic and personal goals |
| study_sessions | Stores study session history |
| progress | Stores productivity statistics |
| pomodoro_sessions | Stores Pomodoro timer sessions |
| contests | Stores coding contest information |
| youtube_focus | Stores YouTube focus preferences |
| settings | Stores application settings |

---

# 🔗 Database Relationships

## Users

One user can have multiple:

- Subjects
- Tasks
- Notes
- Goals
- Study Sessions
- Calendar Events
- Pomodoro Sessions
- Progress Records

---

## Subjects

One subject can contain multiple:

- Tasks
- Notes

---

## Tasks

Each task:

- Belongs to one user
- Belongs to one subject
- Can contribute to progress tracking when completed

---

# 📊 Features Supported

The database supports:

- User Authentication
- Daily Task Management
- Subject Organization
- Notes System
- Calendar Scheduling
- Goal Tracking
- Study History
- Pomodoro Timer
- Progress Analytics
- Coding Contest Management
- Personalized Settings

---

# 🚀 Future Enhancements

The current database design allows future expansion with features such as:

- AI Study Recommendations
- Smart Task Prioritization
- Learning Analytics Dashboard
- Achievement & Badge System
- Daily Streak Tracking
- Notifications & Reminders
- File Attachments
- Cloud Synchronization
- Team Collaboration
- Activity Logs
- Machine Learning Integration

---

# 🖼️ Entity Relationship Diagram

The complete database architecture is illustrated in:

```text
database/diagrams/er-diagram.png
```

The ER Diagram includes:

- Table Structure
- Primary Keys
- Foreign Keys
- Relationships
- Database Architecture

---

# ⚙️ Setup Instructions

### Step 1

Create the database by executing all SQL files inside the **schema/** folder in numerical order.

Example:

```text
001_create_database.sql
002_users.sql
003_subjects.sql
...
```

---

### Step 2

Populate the database using the SQL files inside the **seed/** folder.

---

### Step 3

Run the SQL scripts inside the **queries/** folder for:

- Testing
- Practice
- Reports
- Analytics

---

# 💻 Technology Stack

- MySQL
- SQL
- Relational Database Design
- Entity Relationship Modeling (ER Modeling)

---

# 📚 Learning Objectives

This database is part of the **SynapseOS** project and is intended to demonstrate:

- Database Design
- SQL Development
- Database Normalization
- Relational Modeling
- Foreign Key Relationships
- Scalable Schema Design
- Full-Stack Backend Preparation

---

# 👨‍💻 Author

**Shubh Kamal**

**Project:** SynapseOS

*A full-stack productivity platform designed to help students learn, focus, organize, and track their academic journey.*

---

# 📄 License

This project is licensed under the **MIT License**.

---

⭐ If you find this project interesting, feel free to fork it, explore the database design, and contribute to its development.