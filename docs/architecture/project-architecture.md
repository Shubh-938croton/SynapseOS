# Project Architecture

# SynapseOS Backend Architecture

## Overview

SynapseOS follows the **MVC (Model-View-Controller)** architecture to ensure scalability, maintainability, and separation of concerns.

The backend is built using:

- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt Password Hashing

---

# Architecture Diagram

```
                Client
        (Frontend / Postman)
                  │
                  ▼
        Express Routing Layer
                  │
                  ▼
      JWT Authentication Middleware
                  │
                  ▼
            Controllers
                  │
                  ▼
              Models
                  │
                  ▼
             MySQL Database
```

---

# Project Structure

```
backend/
│
├── src/
│
├── config/
│      db.js
│
├── controllers/
│      authController.js
│      userController.js
│      subjectController.js
│      taskController.js
│      noteController.js
│
├── middleware/
│      authMiddleware.js
│
├── models/
│      authModel.js
│      userModel.js
│      subjectModel.js
│      taskModel.js
│      noteModel.js
│
├── routes/
│      authRoutes.js
│      userRoutes.js
│      subjectRoutes.js
│      taskRoutes.js
│      noteRoutes.js
│
├── app.js
├── server.js
│
└── docs/
```

---

# Layer Responsibilities

## 1. Routes

Responsibilities

- Receive HTTP requests
- Match API endpoints
- Call the correct controller
- Apply middleware

Example

```
POST /api/tasks
```

↓

```
taskRoutes.js
```

↓

```
taskController.createTask()
```

---

## 2. Middleware

Responsibilities

- Verify JWT token
- Authenticate users
- Attach authenticated user information

Example

```
Authorization Header

↓

verifyToken()

↓

req.user

↓

Controller
```

---

## 3. Controllers

Responsibilities

- Receive validated request
- Execute business logic
- Validate ownership
- Handle errors
- Return JSON response

Controllers never communicate directly with MySQL.

Instead they call Models.

---

## 4. Models

Responsibilities

- Execute SQL queries
- Return database results
- Isolate database logic

Only Models communicate with MySQL.

---

## 5. Database

Responsibilities

Store persistent data

Current tables

- users
- subjects
- tasks
- notes

Future tables

- calendar_events
- goals
- study_sessions
- pomodoro_sessions
- analytics

---

# Authentication Flow

```
User Login

↓

Email Verification

↓

Password Verification

↓

Generate JWT

↓

Client Stores Token

↓

Protected API

↓

verifyToken()

↓

Access Granted
```

---

# Data Ownership

Every resource belongs to one authenticated user.

```
User

│

├── Subjects

│      ├── Tasks

│      └── Notes
```

Before every protected operation the backend verifies ownership.

Example

```
Update Note

↓

JWT

↓

Extract user_id

↓

Check note belongs to user

↓

Allow Update
```

---

# Security Features

Implemented

- JWT Authentication
- bcrypt Password Hashing
- Protected Routes
- User Resource Ownership Validation
- SQL Parameterized Queries
- Foreign Key Constraints

Future

- Refresh Tokens
- Rate Limiting
- Input Validation
- Request Logging
- Role Based Access Control

---

# Design Principles

The backend follows these principles:

- Separation of Concerns
- Single Responsibility Principle
- Modular Folder Structure
- Reusable Middleware
- Consistent API Design
- RESTful Endpoints

---

# Current Modules

Completed

- Authentication
- User Profile
- Subjects
- Tasks
- Notes

Upcoming

- Calendar
- Goals
- Study Sessions
- Pomodoro
- Dashboard Analytics
- AI Recommendation Engine

---

# Scalability

The architecture allows new modules to be added with minimal changes.

Each new feature follows the same pattern:

```
Route

↓

Controller

↓

Model

↓

Database
```

This keeps the project maintainable even as the codebase grows.

---

# Future Vision

SynapseOS is designed to evolve from a CRUD-based productivity application into an AI-powered personal productivity platform.

Future capabilities include:

- AI Study Recommendations
- Productivity Analytics
- Personalized Learning Insights
- Habit Tracking
- Smart Scheduling
- Performance Prediction
- Intelligent Dashboard



Client
   │
   ▼
Express Routes
   │
   ▼
JWT Middleware
   │
   ▼
Controllers
   │
   ├── Authentication
   ├── User
   ├── Subject
   ├── Task
   ├── Note
   └── Calendar
   │
   ▼
Models
   │
   ▼
MySQL