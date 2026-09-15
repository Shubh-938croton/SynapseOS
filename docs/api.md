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

## 12. Dashboard & Analytics Engine (`/api/dashboard` & `/api/analytics`)

- `GET /api/dashboard/summary` — Returns user-scoped task counters, total study hours, Pomodoro blocks, and active goals.
- `GET /api/dashboard/subject-analysis` — Computes study hours and session counts broken down by subject.
- `GET /api/dashboard/weekly` — Day-by-day weekly study hour aggregations (Mon–Sun).
- `GET /api/dashboard/goals` — Aggregated goal completion rate and average progress.
- `GET /api/dashboard/pomodoro` — Pomodoro completion ratios and total focus time.
- `GET /api/dashboard/productivity` — Multi-factor productivity score (0-100), calculated grade, and recommendations.
- `GET /api/analytics` — Consolidated analytics payload for the graphical stats view.

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
