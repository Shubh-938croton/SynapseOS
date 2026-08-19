backend/
│
├── src/
│   ├── config/
│   │
│   ├── controllers/
│   │     authController.js
│   │     taskController.js
│   │     userController.js
│   │     subjectController.js
│   │     noteController.js
│   │
│   ├── middleware/
│   │     authMiddleware.js
│   │
│   ├── models/
│   │     authModel.js
│   │     taskModel.js
│   │     userModel.js
│   │     subjectModel.js
│   │     noteModel.js
│   │
│   ├── routes/
│   │     authRoutes.js
│   │     taskRoutes.js
│   │     userRoutes.js
│   │     subjectRoutes.js
│   │     noteRoutes.js
│   │
│   ├── app.js
│   └── server.js

# Current Backend Status — August 2026

## Implemented Layers

```text
React
  ↓
REST API
  ↓
Express Routes
  ↓
JWT Middleware
  ↓
Controllers
  ↓
Models
  ↓
MySQL
```

Implemented backend modules include authentication, users/profile, subjects, tasks, notes, calendar, goals, study sessions, Pomodoro, dashboard/analytics, and notifications.

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
