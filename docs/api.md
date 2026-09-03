# 📡 SynapseOS REST API Reference Documentation

**Base URL:** `http://localhost:5000/api`  
**Authentication Scheme:** `Authorization: Bearer <JWT_TOKEN>`  
**Content-Type:** `application/json`

---

## 1. Authentication & Google OAuth

### Register User (Email/Password)
- **Endpoint:** `POST /api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "full_name": "Alex Johnson",
    "username": "alexj",
    "email": "alex@example.com",
    "password": "secretpassword"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "message": "User registered successfully",
    "userId": 1
  }
  ```

### Login User (Email/Password)
- **Endpoint:** `POST /api/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "alex@example.com",
    "password": "secretpassword"
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "message": "Login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "user_id": 1,
      "full_name": "Alex Johnson",
      "username": "alexj",
      "email": "alex@example.com"
    }
  }
  ```

### Google Sign-In & Registration (OAuth 2.0)
- **Endpoint:** `POST /api/auth/google`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "access_token": "ya29.a0AfH6...", // Or "credential": "eyJhbGciOi..."
    "id_token": "optional_id_token"
  }
  ```
- **Description:** Verifies Google ID/Access token against Google OAuth servers. If user exists, generates JWT and logs in. If new user, generates a clean unique username & random hashed password (to satisfy MySQL `password_hash NOT NULL` constraints), inserts into database, and issues JWT.
- **Success Response:** `200 OK` or `201 Created`
  ```json
  {
    "message": "Google login successful",
    "token": "eyJhbGciOi...",
    "user": {
      "user_id": 1,
      "full_name": "Alex Johnson",
      "username": "alexj",
      "email": "alex@gmail.com",
      "profile_picture": "https://lh3.googleusercontent.com/..."
    }
  }
  ```

---

## 2. User Profile Management

### Get Profile
- **Endpoint:** `GET /api/users/profile`
- **Auth Required:** Yes (Bearer Token)
- **Response:** `200 OK`
  ```json
  {
    "message": "Profile fetched successfully",
    "profile": {
      "user_id": 1,
      "full_name": "Alex Johnson",
      "username": "alexj",
      "email": "alex@example.com",
      "profile_picture": null,
      "bio": "CS Student & Competitive Programmer",
      "created_at": "2026-08-01T12:00:00.000Z",
      "updated_at": "2026-08-20T14:30:00.000Z"
    }
  }
  ```

### Update Profile
- **Endpoint:** `PUT /api/users/profile`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "full_name": "Alexander Johnson",
    "username": "alex_j",
    "email": "alex.new@example.com",
    "profile_picture": null,
    "bio": "Updated bio text"
  }
  ```

### Change Password
- **Endpoint:** `PUT /api/users/change-password`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "current_password": "oldpassword",
    "new_password": "newsecurepassword"
  }
  ```

---

## 3. Core Productivity Modules

| Module | Method | Endpoint | Description |
| :--- | :---: | :--- | :--- |
| **Tasks** | `GET` | `/api/tasks` | Get all user tasks (with subject joins) |
| | `POST` | `/api/tasks` | Create new task |
| | `GET` | `/api/tasks/:id` | Get task by ID |
| | `PUT` | `/api/tasks/:id` | Update task details / toggle status |
| | `DELETE` | `/api/tasks/:id` | Delete task |
| **Notes** | `GET` | `/api/notes` | Get all user notes |
| | `POST` | `/api/notes` | Create note (supports markdown content) |
| | `GET` | `/api/notes/:id` | Get single note |
| | `PUT` | `/api/notes/:id` | Update note / toggle pinned status |
| | `DELETE` | `/api/notes/:id` | Delete note |
| **Subjects** | `GET` | `/api/subjects` | Get all user study subjects |
| | `POST` | `/api/subjects` | Create subject |
| | `PUT` | `/api/subjects/:id` | Update subject |
| | `DELETE` | `/api/subjects/:id` | Delete subject |
| **Calendar** | `GET` | `/api/calendar` | Get all scheduled events |
| | `POST` | `/api/calendar` | Create event (date, times, reminder) |
| | `PUT` | `/api/calendar/:id` | Update event details |
| | `DELETE` | `/api/calendar/:id` | Delete event |
| **Goals** | `GET` | `/api/goals` | Get long-term learning goals |
| | `POST` | `/api/goals` | Create goal with target date |
| | `PUT` | `/api/goals/:id` | Update progress percentage & status |
| | `DELETE` | `/api/goals/:id` | Delete goal |
| **Study Sessions** | `GET` | `/api/study-sessions` | Get deep work session logs |
| | `POST` | `/api/study-sessions` | Log study session with topic & times |
| | `PUT` | `/api/study-sessions/:id` | Update study session |
| | `DELETE` | `/api/study-sessions/:id` | Delete study session |
| **Pomodoro** | `GET` | `/api/pomodoro` | Get Pomodoro history logs |
| | `POST` | `/api/pomodoro` | Save completed or interrupted session |
| | `PUT` | `/api/pomodoro/:id` | Update Pomodoro session |
| | `DELETE` | `/api/pomodoro/:id` | Delete Pomodoro session |
| **Contests** | `GET` | `/api/contests` | Get upcoming programming contests |
| | `POST` | `/api/contests` | Schedule contest (platform, date, URL) |
| | `PUT` | `/api/contests/:id` | Update contest details |
| | `DELETE` | `/api/contests/:id` | Delete contest |
| **Notifications** | `GET` | `/api/notifications` | Get unread & read alerts |
| | `PUT` | `/api/notifications/:id/read`| Mark notification as read |
| **Settings** | `GET` | `/api/settings` | Get user preferences & theme |
| | `PUT` | `/api/settings` | Update settings payload |

---

## 4. Dashboard & Analytics Engine

All dashboard endpoints compute real-time aggregated metrics directly via SQL without redundant data duplication:

- `GET /api/dashboard/summary`: Overall productivity metrics (tasks pending/completed, study hours, Pomodoro totals, goals).
- `GET /api/dashboard/subject-analysis`: Subject-wise study hours and Pomodoro session breakdown.
- `GET /api/dashboard/weekly`: Day-by-day weekly study hours (Monday through Sunday with zero-filling).
- `GET /api/dashboard/goals`: Goal completion counts and average progress percentage.
- `GET /api/dashboard/pomodoro`: Total focus hours, completed vs interrupted ratio, and average session length.
- `GET /api/dashboard/productivity`: Unified productivity score (0–100), calculated performance grade, and recommendations.

---

## 5. YouTube Focus Data API

- **Search Videos:** `GET /api/youtube/search?query=react+tutorial&maxResults=12&pageToken=...`
  - Normalizes YouTube Data API v3 payload into `{ videoId, title, description, thumbnail, channelTitle, channelId, publishedAt }`.
- **Video Details:** `GET /api/youtube/video/:videoId`
  - Fetches complete metadata, description, and player attributes.
- **Security:** YouTube API Key is securely kept in backend `.env` (`YOUTUBE_API_KEY`) and never exposed to the client.

