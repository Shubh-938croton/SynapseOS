backend/
│
├── src/
│   ├── config/
│   │     database.js
│   │
│   ├── constants/
│   │     eventTypes.js
│   │
│   ├── controllers/
│   │     authController.js
│   │     taskController.js
│   │     userController.js
│   │     subjectController.js
│   │     noteController.js
│   │     goalController.js
│   │     calendarController.js
│   │     studySessionController.js
│   │     pomodoroController.js
│   │     contestController.js
│   │     dashboardController.js
│   │     analyticsController.js
│   │     notificationController.js
│   │     settingsController.js
│   │     youtubeController.js
│   │
│   ├── middleware/
│   │     authMiddleware.js
│   │     rateLimiter.js
│   │     errorHandler.js
│   │
│   ├── models/
│   │     activityEventModel.js
│   │     taskModel.js
│   │     noteModel.js
│   │     goalModel.js
│   │     calendarModel.js
│   │     studySessionModel.js
│   │     pomodoroModel.js
│   │     subjectModel.js
│   │     contestModel.js
│   │     userModel.js
│   │     authModel.js
│   │     settingsModel.js
│   │     notificationModel.js
│   │     dashboardModel.js
│   │     analyticsModel.js
│   │
│   ├── routes/
│   │     ...
│   │
│   ├── services/
│   │     activityEventService.js
│   │     youtubeService.js
│   │
│   ├── app.js
│   └── server.js

# Current Backend Status — September 2026

## Implemented Layers

```text
React (Vite)
  ↓
REST API (Express Routes)
  ↓
Rate Limiting & Security Headers (Helmet, express-rate-limit)
  ↓
JWT Auth Middleware (req.user.user_id)
  ↓
Controllers
  ↓
Models (MySQL Database Pool)
  ├──→ Primary Entity Mutation (tasks, notes, goals, etc.)
  └──→ Activity Event Service (activityEventService.js)
            ↓
       activity_events (Append-Only Immutable Event Stream)
```

Implemented backend modules include authentication, users/profile, subjects, tasks, notes, calendar, goals, study sessions, Pomodoro, contests, dashboard, analytics, notifications, and the activity event tracking subsystem.

## YouTube Integration

YouTube is planned as an external API integration.

For YouTube:

```text
Route
  ↓
Controller
  ↓
YouTube Service
  ↓
YouTube Data API v3
```

The API key belongs only in backend environment variables.

The React frontend will communicate with SynapseOS backend endpoints rather than receiving the Google API key directly.
