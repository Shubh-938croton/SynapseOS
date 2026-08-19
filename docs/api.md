# API Documentation

GET /api/tasks

Description

Returns all tasks.

Response

200 OK

[
   ...
]

# Current API Status — August 2026

## Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

## User Profile

Protected endpoints for the authenticated user:

- `GET /api/user/profile`
- `PUT /api/user/profile`
- Password-change endpoint implemented by the user controller/routes

Profile operations use the authenticated `user_id` from JWT.

## Core Productivity APIs

Implemented modules include:

- Subjects
- Tasks
- Notes
- Calendar
- Goals
- Study Sessions
- Pomodoro
- Dashboard
- Analytics
- Notifications

## YouTube Productivity API

**Status: Not implemented yet.**

The planned architecture is:

```text
React Frontend
      ↓
SynapseOS Backend
      ↓
YouTube Data API v3
```

The YouTube API key will remain in the backend `.env` and must never be exposed in the React application.

## API Security

Private APIs use:

```text
Authorization: Bearer <JWT>
```

The backend extracts the authenticated `user_id` and scopes user-owned resources accordingly.
