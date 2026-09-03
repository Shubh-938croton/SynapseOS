# 💻 SynapseOS Frontend Development & Progress Documentation

**Last Updated:** September 2026  
**Status:** ✅ Core UI/UX Redesign & Google Authentication Complete  
**Application Version:** `v1.3.0`

---

## 1. Frontend Tech Stack & Architecture

- **Core Framework:** React 19 (`^19.2.8`) + Vite (`^8.2.0`)
- **Routing:** React Router DOM (`^7.18.2`) with Declarative & Protected Routes
- **HTTP Client:** Axios (`^1.19.0`) with global request/response interceptors & Bearer JWT injection
- **Icons & Visualization:** React Icons (`^5.7.0`), Recharts (`^3.10.1`)
- **Design System:** Centralized CSS Custom Properties / Design Tokens (`theme.css`)
- **Authentication:** Dual Email/Password + Google Identity Services (GIS) OAuth 2.0
- **Notifications:** React Toastify (`^11.1.0`)

---

## 2. Project Directory Structure

```text
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   │   ├── AddEventModal/         # Event creation dialog
│   │   ├── AddGoalModal/          # Goal tracking dialog
│   │   ├── AddNoteModal/          # Markdown note creation
│   │   ├── AddStudySessionModal/  # Deep work logging
│   │   ├── AddTaskModal/          # Task creation dialog
│   │   ├── Contest/               # AddContestModal & ContestList
│   │   ├── EditEventModal/        # Event modification dialog
│   │   ├── EditGoalModal/         # Goal progress & status editor
│   │   ├── EditStudySessionModal/ # Study session editor
│   │   ├── Layout/                # DashboardLayout & responsive grid
│   │   ├── Navbar/                # Frosted glass header with breadcrumbs
│   │   ├── NotesCard/             # Pinned & tag-highlighted note cards
│   │   ├── Notification/          # NotificationBell & unread drawer
│   │   ├── Pomodoro/              # PomodoroTimer & PomodoroHistory
│   │   ├── Sidebar/               # Collapsible dark SaaS navigation
│   │   ├── Summarycard/           # Elevated stat cards with top accent glow
│   │   ├── TaskCard/              # Priority-badged task cards
│   │   └── ProtectedRoute.jsx     # Route security barrier
│   │
│   ├── context/
│   │   └── SettingsContext.jsx    # Global theme and application preferences
│   │
│   ├── pages/
│   │   ├── Calendar/              # Month view with timezone-safe event mapping
│   │   ├── Contests/              # Coding contest hub (LeetCode, Codeforces, etc.)
│   │   ├── Dashboard/             # Command-center metrics & hero banner
│   │   ├── Goals/                 # Goal cards with gradient progress meters
│   │   ├── Login/                 # Dark glassmorphic auth + Google SSO
│   │   ├── Notes/                 # Tag-filterable knowledge workspace
│   │   ├── Pomodoro/              # Deep work digital clock & history logs
│   │   ├── Profile/               # User profile, bio, and password management
│   │   ├── Register/              # Dark registration card + Google SSO
│   │   ├── Settings/              # Theme switcher, study sliders & toggles
│   │   ├── Stats/                 # 4-card overview, daily bars & subject charts
│   │   ├── StudySessions/         # Time logs with subject pills & duration
│   │   ├── Tasks/                 # Task board with search, filters & status
│   │   └── YouTube/               # Focus learning hub with embedded 16:9 player
│   │
│   ├── routes/
│   │   └── AppRoutes.jsx          # Central application routing table
│   │
│   ├── services/
│   │   ├── api.js                 # Central Axios instance with JWT interceptor
│   │   ├── authService.js         # loginUser, registerUser, googleLogin
│   │   ├── calendarService.js     # Calendar event CRUD APIs
│   │   ├── contestService.js      # Contest scheduling APIs
│   │   ├── dashboardService.js    # Metric aggregation APIs
│   │   ├── goalService.js         # Goal tracking APIs
│   │   ├── googleAuth.js          # Google Identity Services SDK popup integration
│   │   ├── noteService.js         # Note management APIs
│   │   ├── notificationService.js # Notification retrieval & read status
│   │   ├── pomodoroService.js     # Pomodoro session logging
│   │   ├── profileService.js      # User profile & password update
│   │   ├── settingsService.js     # App settings persistence
│   │   ├── studySessionService.js # Study session logging APIs
│   │   ├── taskService.js         # Task CRUD APIs
│   │   └── youtubeService.js      # YouTube Data API search & video details
│   │
│   ├── styles/
│   │   └── theme.css              # Central design tokens (Dark/Light themes)
│   ├── App.jsx                    # Root component with providers
│   └── main.jsx                   # React 19 entrypoint
```

---

## 3. Design System & Theme Engine

SynapseOS features a custom **Obsidian Dark SaaS Theme** (Linear & Vercel inspired) driven by CSS variables in `src/styles/theme.css`:

### Color Hierarchy
- **Base Surfaces:**
  - `--bg-primary: #090d16` (Deep obsidian background)
  - `--bg-secondary: #111726` (Card and panel surface)
  - `--bg-tertiary: #172033` (Filter and elevated containers)
  - `--bg-elevated: #1e293b` (Modal overlays & dropdown drawers)
  - `--bg-glass: rgba(17, 23, 38, 0.85)` (Frosted backdrop with `backdrop-filter: blur(16px)`)
- **Accents:**
  - `--accent-color: #3b82f6` (Electric Blue core)
  - `--accent-hover: #2563eb` (Deep blue hover state)
  - `--accent-subtle: rgba(59, 130, 246, 0.12)` (Translucent pill background)
  - `--accent-glow: 0 0 24px rgba(59, 130, 246, 0.28)`
  - `--accent-gradient: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)`
- **Typography:**
  - Primary font: `Plus Jakarta Sans`, sans-serif
  - Monospace font: `JetBrains Mono`, monospace (used for timers, durations, and metrics)
  - High contrast slate hierarchy (`--text-primary: #f8fafc`, `--text-secondary: #94a3b8`, `--text-muted: #64748b`)

---

## 4. Completed Feature Modules

### 1. Authentication & Google SSO
- Email & password registration with validation and duplicate prevention.
- Email & password login with JWT token and user persistence in `localStorage`.
- **"Continue with Google" Button Integration:**
  - Integrated via `frontend/src/services/googleAuth.js` utilizing official Google Identity Services (`https://accounts.google.com/gsi/client`).
  - Native popup authentication with select-account prompt.
  - Active loading state (`Connecting with Google...`) and multi-click prevention.
  - Automatic new user provisioning or existing user login without friction.
  - Direct redirection to `/dashboard`.

### 2. Dashboard Command Center
- Hero welcome banner with glowing AI aura.
- 4-column summary metric grid (Total Subjects, Tasks Pending, Study Hours, Pomodoro Focus).
- Quick action shortcuts to schedule events, start Pomodoro, add tasks, and take notes.

### 3. Task Management
- Task board with live search and multi-criteria filters (Priority: High/Medium/Low; Status: Pending/Completed).
- Custom animated completion checkboxes.
- Add and Edit task modal dialogs with date pickers and subject selectors.

### 4. Notes Workspace
- Responsive 2-column masonry grid.
- Pinned notes highlights and color tag categorization.
- Real-time search and filter toolbar.

### 5. Goals & Milestones
- 3-column responsive goal grid.
- Electric blue gradient progress bar meters (`0%` to `100%`).
- Progress adjustment slider modal and target date tracking.

### 6. Interactive Calendar
- Month navigation, "Today" quick-jump button, and day cell layout.
- Timezone-safe date string parsing (`YYYY-MM-DD`) preventing 1-day offset bugs.
- Add, Edit, and Delete event modal dialogs.

### 7. Study Sessions & Deep Work Logging
- Subject-specific deep work cards with duration readouts in `JetBrains Mono`.
- Start time, end time, and automatic duration calculation.

### 8. Pomodoro Focus Engine
- Large digital clock display with tabular glowing numerals.
- Mode switcher: Work (25 min), Short Break (5 min), Long Break (15 min).
- Start, Pause, Reset, and Interrupt controls with session history logging.

### 9. Competitive Programming Contests
- Multi-platform tracker with badge styling for LeetCode, Codeforces, CodeChef, HackerRank, and AtCoder.
- Direct external challenge links and contest scheduler.

### 10. Analytics & Statistics
- Recharts visualizations: Daily vertical study bar charts and subject progress breakdown meters.
- Multi-metric cards: Task completion ratios, goal metrics, Pomodoro focus totals.

### 11. YouTube Study Hub & Focus Player
- Curated topic search (C++ DSA, Machine Learning, DBMS, Web Development, Java).
- 3-column responsive video grid with 16:9 thumbnail previews and hover play triggers.
- Embedded video watch player with channel metadata, custom actions, and distraction-free viewing.

### 12. Profile & Settings
- Glassmorphic profile card with avatar initial fallback and bio.
- Profile update (full name, username, email) with duplicate validation.
- Secure change password form with current password verification.
- Application preferences and appearance settings.

---

## 5. Frontend Progress Checklist

| Module | UI Component | Service Layer | Backend API | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Email/Password Auth** | ✅ | ✅ | ✅ | **Complete** |
| **Google OAuth SSO** | ✅ | ✅ | ✅ | **Complete** |
| **Protected Routing** | ✅ | ✅ | ✅ | **Complete** |
| **Dark Theme Tokens** | ✅ | ✅ | N/A | **Complete** |
| **Dashboard** | ✅ | ✅ | ✅ | **Complete** |
| **Tasks** | ✅ | ✅ | ✅ | **Complete** |
| **Notes** | ✅ | ✅ | ✅ | **Complete** |
| **Calendar** | ✅ | ✅ | ✅ | **Complete** |
| **Goals** | ✅ | ✅ | ✅ | **Complete** |
| **Study Sessions** | ✅ | ✅ | ✅ | **Complete** |
| **Pomodoro Timer** | ✅ | ✅ | ✅ | **Complete** |
| **Contests** | ✅ | ✅ | ✅ | **Complete** |
| **Analytics (Stats)** | ✅ | ✅ | ✅ | **Complete** |
| **Notifications** | ✅ | ✅ | ✅ | **Complete** |
| **YouTube Study Hub** | ✅ | ✅ | ✅ | **Complete** |
| **Profile Management** | ✅ | ✅ | ✅ | **Complete** |
| **Settings** | ✅ | ✅ | ✅ | **Complete** |

---

## 6. Build & Packaging Verification

- **Production Build:** `npm run build` generates optimized chunks via Vite in **< 300ms**.
- **Bundle Output:**
  - `dist/index.html` (~0.47 kB)
  - `dist/assets/index-*.css` (~123.4 kB)
  - `dist/assets/index-*.js` (~404.7 kB)
- **Zero Errors / Zero Broken Imports.**

