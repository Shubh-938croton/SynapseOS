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

