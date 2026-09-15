# 🎨 SynapseOS Frontend Architecture

## 1. Overview & Tooling

The SynapseOS frontend is a high-performance Single Page Application (SPA) built using **React 19** and **Vite 8**. It communicates with the Express backend via RESTful APIs using a centralized Axios client.

### Core Frontend Stack:
- **Framework:** React 19 (`^19.2.8`)
- **Build Tool:** Vite 8 (`^8.2.0`)
- **Routing:** React Router DOM v7 (`^7.18.2`)
- **HTTP Client:** Axios (`^1.19.0`)
- **Data Visualization:** Recharts (`^3.10.1`)
- **Icons:** React Icons (`^5.7.0`)
- **Notifications:** React Toastify (`^11.1.0`)

---

## 2. Directory Layout & Module Structure

```text
frontend/
├── src/
│   ├── assets/                     # Static imagery, icons, and SVG illustrations
│   ├── components/                 # Reusable UI components and modal dialogs
│   │   ├── AddEventModal/          # Calendar event creation modal
│   │   ├── AddGoalModal/           # Long-term goal creation modal
│   │   ├── AddNoteModal/           # Markdown note creation modal
│   │   ├── AddStudySessionModal/   # Deep work session recording modal
│   │   ├── AddSubjectModal/        # Inline & standalone subject creation modal
│   │   ├── AddTaskModal/           # Task creation modal
│   │   ├── Auth/                   # Login & registration illustration components
│   │   ├── Contest/                # Contest cards, badges & modal components
│   │   ├── EditEventModal/         # Calendar event editing dialog
│   │   ├── EditGoalModal/          # Goal progress adjustment dialog
│   │   ├── EditStudySessionModal/  # Study session editing dialog
│   │   ├── EditTaskModal/          # Task modification dialog
│   │   ├── Layout/                 # DashboardLayout (Sidebar, Navbar, Main area)
│   │   ├── Navbar/                 # Top navigation header & user profile avatar
│   │   ├── NotesCard/              # Masonry note presentation cards
│   │   ├── Notification/           # Notification bell dropdown & item list
│   │   ├── ProtectedRoute/         # Route guard checking authentication state
│   │   ├── Sidebar/                # Responsive navigation sidebar
│   │   └── ViewNoteModal/          # Full-screen note inspection dialog
│   ├── context/                    # React Context providers
│   │   └── AuthContext.jsx         # Global authentication state & user session
│   ├── pages/                      # Top-level route views
│   │   ├── Calendar/               # Monthly calendar & contest integration
│   │   ├── Contests/               # Multi-platform coding contest tracker
│   │   ├── Dashboard/              # Command center productivity overview
│   │   ├── Goals/                  # Milestone tracking & progress meters
│   │   ├── Login/                  # Email/Password + Google Sign-In view
│   │   ├── Notes/                  # Knowledge base & pinned notes
│   │   ├── Pomodoro/               # 25/5/15 Pomodoro timer & history logs
│   │   ├── Profile/                # User profile management & password change
│   │   ├── Register/               # New user onboarding view
│   │   ├── Settings/               # Theme preferences & Pomodoro configuration
│   │   ├── Stats/                  # Recharts study histograms & productivity score
│   │   ├── StudySessions/          # Chronological deep-work session logger
│   │   ├── Subjects/               # Subject management & color tags
│   │   ├── Tasks/                  # Task board with priority filters
│   │   └── YouTube/                # Distraction-free study video hub & player
│   ├── routes/
│   │   └── AppRoutes.jsx           # Declarative React Router route configuration
│   ├── services/                   # Modular API client wrappers
│   │   ├── analyticsService.js
│   │   ├── api.js                  # Central Axios instance with JWT interceptor
│   │   ├── authService.js
│   │   ├── calendarService.js
│   │   ├── contestService.js
│   │   ├── dashboardService.js
│   │   ├── goalService.js
│   │   ├── googleAuth.js           # Google Identity Services SDK client
│   │   ├── noteService.js
│   │   ├── notificationService.js
│   │   ├── pomodoroService.js
│   │   ├── profileService.js
│   │   ├── settingsService.js
│   │   ├── studySessionService.js
│   │   ├── subjectService.js
│   │   ├── taskService.js
│   │   └── youtubeService.js
│   ├── styles/                     # Global styling tokens & CSS reset
│   │   ├── global.css
│   │   └── variables.css
│   ├── App.jsx                     # Root application wrapper
│   └── main.jsx                    # Vite entry point
├── package.json
├── vite.config.js
└── index.html
```

---

## 3. Client Routing & Route Guards

Client-side navigation is defined in `routes/AppRoutes.jsx` using `react-router-dom`:

### Route Protection Architecture (`ProtectedRoute.jsx`)
All private application views are wrapped inside `<ProtectedRoute>`:

```jsx
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
```

### Route Map:
- **Public Routes:** `/`, `/login`, `/register`
- **Protected Workspace:**
  - `/dashboard` — Productivity Command Center
  - `/subjects` — Academic Subjects Manager
  - `/tasks` — Task Manager
  - `/notes` — Markdown Knowledge Base
  - `/calendar` — Interactive Schedule & Contests
  - `/goals` — Goal Tracker
  - `/study-sessions` — Study Session Logger
  - `/pomodoro` — Pomodoro Focus Timer
  - `/analytics` — Graphical Analytics
  - `/contests` — Coding Contest Tracker
  - `/youtube` — YouTube Study Hub
  - `/youtube/watch/:videoId` — Focus Video Player
  - `/profile` — Account Profile & Password
  - `/settings` — Preferences & Timer Settings

---

## 4. Centralized API Service Layer & Axios Interceptors

SynapseOS abstracts all HTTP communication into specialized service modules located in `services/`.

Every service imports the centralized Axios instance (`services/api.js`):

```javascript
import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json"
    }
});

// Automatic JWT Injection Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
```

### Benefits:
1. **Zero Token Boilerplate:** Components and service functions do not need to manually pass headers or read from `localStorage`.
2. **Environment Portability:** Base URLs are automatically switched between local development (`http://localhost:5000/api`) and production deployment (`https://synapseos-backend.onrender.com/api`) using `import.meta.env.VITE_API_URL`.

---

## 5. UI/UX Design System & Layout Pattern

SynapseOS features a dark cybernetic aesthetic designed to minimize eye strain during extended study sessions.

### Layout Hierarchy:
- **`DashboardLayout.jsx`:** The persistent layout shell wrapping all protected views.
  - **Sidebar:** Left-aligned navigation featuring active route highlighting and quick module switching.
  - **Navbar:** Header containing contextual breadcrumbs, notification center with unread badge count, and user avatar.
  - **Main Content Area:** Scrollable viewport rendering the active page component with frosted glass card styling (`backdrop-filter: blur(12px)`).

### Notifications & Feedback:
- All asynchronous operations (saving notes, updating tasks, creating subjects, logging sessions) trigger non-blocking, accessible toast notifications via **React Toastify**.
