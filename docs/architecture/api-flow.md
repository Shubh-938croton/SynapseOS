# API Flow Documentation

## Backend Architecture

The backend follows the MVC (Model-View-Controller) architecture.

Request Flow

Client (Postman / Frontend)
        │
        ▼
Express Route
        │
        ▼
Authentication Middleware (JWT)
        │
        ▼
Controller
        │
        ▼
Model
        │
        ▼
MySQL Database
        │
        ▼
Model
        │
        ▼
Controller
        │
        ▼
JSON Response
        │
        ▼
Client


## Authentication Flow

User Login
     │
     ▼
Verify Email
     │
Verify Password
     │
Generate JWT
     │
Return Token

## Protected Route Flow
Client Request
      │
Authorization Header
      │
verifyToken Middleware
      │
JWT Verification
      │
req.user
      │
Controller
      │
Database
      │
Response

## Create Subject Flow
POST /api/subjects
      │
JWT Authentication
      │
Extract user_id
      │
Insert Subject
      │
Return Success


## Create Task Flow
POST /api/tasks
      │
Verify JWT
      │
Verify Subject Ownership
      │
Insert Task
      │
Return Task ID


## Create Note Flow
POST /api/notes
      │
Verify JWT
      │
Verify Subject Ownership
      │
Insert Note
      │
Return Note ID


## Folder Responsibilities
Routes
↓
Receive Request

Controllers
↓
Business Logic

Models
↓
Database Queries

Database
↓
Persistent Storage


## Calendar Request Flow
Client

↓

JWT Authentication

↓

Calendar Routes

↓

Calendar Controller

↓

Calendar Model

↓

MySQL Database

↓

JSON Response








# Goals API Flow

Create Goal

Client
    ↓
POST /api/goals
    ↓
JWT Authentication
    ↓
Goal Controller
    ↓
Goal Model
    ↓
MySQL
    ↓
Success Response

-----------------------------------------------------

Get All Goals

Client
    ↓
GET /api/goals
    ↓
JWT Authentication
    ↓
Goal Controller
    ↓
Goal Model
    ↓
Database
    ↓
Response

-----------------------------------------------------

Get Goal By ID

Client
    ↓
GET /api/goals/:id
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

-----------------------------------------------------

Update Goal

Client
    ↓
PUT /api/goals/:id
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

-----------------------------------------------------

Delete Goal

Client
    ↓
DELETE /api/goals/:id
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

=====================================================

# Study Sessions API Flow

Create Study Session

Client
    ↓
POST /api/study-sessions
    ↓
JWT Authentication
    ↓
Calculate Duration
    ↓
Validation
    ↓
Controller
    ↓
Model
    ↓
MySQL
    ↓
Success Response

-----------------------------------------------------

Get All Study Sessions

Client
    ↓
GET /api/study-sessions
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

-----------------------------------------------------

Get Study Session By ID

Client
    ↓
GET /api/study-sessions/:id
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

-----------------------------------------------------

Update Study Session

Client
    ↓
PUT /api/study-sessions/:id
    ↓
JWT Authentication
    ↓
Calculate Duration
    ↓
Validation
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

-----------------------------------------------------

Delete Study Session

Client
    ↓
DELETE /api/study-sessions/:id
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response




# Pomodoro Sessions API Flow

---------------------------------------------------------

Create Pomodoro Session

Client
    ↓
POST /api/pomodoro
    ↓
JWT Authentication
    ↓
Extract Request Body
    ↓
Calculate duration automatically
    ↓
Validate session data
    ↓
pomodoroController.createPomodoroSession()
    ↓
pomodoroModel.createPomodoroSession()
    ↓
MySQL Database
    ↓
Success Response

---------------------------------------------------------

Get All Pomodoro Sessions

Client
    ↓
GET /api/pomodoro
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

---------------------------------------------------------

Get Pomodoro Session By ID

Client
    ↓
GET /api/pomodoro/:id
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

---------------------------------------------------------

Update Pomodoro Session

Client
    ↓
PUT /api/pomodoro/:id
    ↓
JWT Authentication
    ↓
Automatic Duration Calculation
    ↓
Validation
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response

---------------------------------------------------------

Delete Pomodoro Session

Client
    ↓
DELETE /api/pomodoro/:id
    ↓
JWT Authentication
    ↓
Controller
    ↓
Model
    ↓
Database
    ↓
Response




# Dashboard Summary API Flow

---------------------------------------------------------

Client

↓

GET /api/dashboard/summary

↓

JWT Authentication

↓

dashboardController.getDashboardSummary()

↓

dashboardModel.getDashboardSummary()

↓

MySQL Database

↓

Collect Statistics

• Subjects

• Tasks

• Notes

• Goals

• Study Sessions

• Pomodoro Sessions

↓

Return Dashboard Summary

↓

JSON Response


## Dashboard

### Dashboard Summary

GET /api/dashboard/summary

Authentication

Bearer Token Required

Response

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





# Subject Analytics API Flow

Client

↓

GET /api/dashboard/subject-analysis

↓

JWT Authentication

↓

dashboardController.getSubjectAnalytics()

↓

dashboardModel.getSubjectAnalytics()

↓

subjects

↓

study_sessions (Aggregated)

↓

pomodoro_sessions (Aggregated)

↓

Combine Results

↓

Return JSON


# Weekly Analytics API Flow

---------------------------------------------------------

Client

↓

GET /api/dashboard/weekly

↓

JWT Authentication

↓

dashboardController.getWeeklyAnalytics()

↓

dashboardModel.getWeeklyAnalytics()

↓

study_sessions

↓

Aggregate Data

• DAYNAME()

• WEEKDAY()

• COUNT()

• SUM()

↓

Generate Complete Week

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

Sunday

↓

Return JSON Response


# Goal Analytics API Flow

---------------------------------------------------------

Client

↓

GET /api/dashboard/goals

↓

JWT Authentication

↓

dashboardController.getGoalAnalytics()

↓

dashboardModel.getGoalAnalytics()

↓

goals

↓

Aggregate Data

• COUNT()

• SUM(CASE WHEN)

• AVG()

↓

Return JSON Response