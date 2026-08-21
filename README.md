# 🧠 SynapseOS

> A full-stack cognitive productivity platform for learning, focus, progress tracking, and academic workflow management.

---

## 📖 About

SynapseOS is a personal productivity operating system designed for students and developers to manage their complete learning journey from a single dashboard.

The platform brings together productivity, learning, planning, study tracking, coding contests, analytics, and personalization into one application.

SynapseOS is being developed as a long-term full-stack software engineering project, with a focus on:

* Full-stack development
* REST API design
* Database architecture
* Authentication and authorization
* React frontend development
* Backend engineering
* Data-driven productivity features
* Software engineering practices

---

## 🎯 Vision

The goal of SynapseOS is to provide a centralized platform that helps users:

* 🎯 Stay focused
* 📚 Manage their learning
* ✅ Organize tasks and goals
* 📝 Maintain notes
* 📅 Manage academic events
* ⏱️ Track study sessions and focus time
* 📊 Analyze productivity
* 🏆 Track coding contests
* ⚙️ Personalize their experience
* 📈 Build long-term consistency

---

# ✨ Features

## 📊 Dashboard

* Personalized dashboard
* Study summary
* Productivity statistics
* Daily information
* Dashboard analytics
* Summary cards
* Integrated navigation

**Status:** ✅ Completed

---

## 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Protected routes
* Authenticated API requests
* Logout functionality
* Password hashing

**Status:** ✅ Completed

---

## ✅ Task Manager

* Create tasks
* View tasks
* Update tasks
* Delete tasks
* Task organization
* Priority and deadline support

**Status:** ✅ Completed

---

## 📝 Notes

* Create notes
* View notes
* Update notes
* Delete notes
* Organized note management

**Status:** ✅ Completed

---

## 🎯 Goals

* Goal management
* Goal creation
* Goal updates
* Goal tracking

**Status:** ✅ Completed

---

## 📅 Calendar

* Academic events
* Assignments
* Exams
* Calendar event management
* Event creation, updating and deletion

**Status:** ✅ Completed

---

## 📚 Study Sessions

* Create study sessions
* Track study topics
* Record start and end time
* Automatically calculate session duration
* View study sessions
* Update study sessions
* Delete study sessions

**Status:** ✅ Completed

---

## 🍅 Pomodoro

* Pomodoro focus sessions
* Short breaks
* Long breaks
* Configurable Pomodoro durations
* Productivity-focused workflow

**Status:** 🚧 Functional — settings synchronization is being refined

---

## 📈 Analytics

* Study analytics
* Productivity statistics
* Backend analytics API
* Frontend analytics dashboard

**Status:** ✅ Completed

---

## 👤 Profile

* View user profile
* Edit profile information
* Update username
* Update email
* Update full name
* Change password
* Password verification using bcrypt

**Status:** ✅ Completed

---

## ⚙️ Settings

SynapseOS includes an interactive settings system.

### Appearance

* Light theme
* Dark theme selection
* Interactive theme selector

### Notifications

* Enable/disable notifications
* Interactive toggle

### Daily Study Goal

* Configurable daily study goal
* Interactive slider
* Live time representation

### Pomodoro Configuration

* Focus duration
* Short break duration
* Long break duration
* Live Pomodoro cycle preview

### Other

* Save settings
* Reset settings to defaults
* Persistent settings stored in MySQL

**Status:** ✅ Completed

---

## 🏆 Coding Contest Tracker

Planned support for:

* Codeforces
* LeetCode
* CodeChef
* AtCoder

**Status:** 🚧 In Development

---

## 🎥 YouTube Focus Mode

The YouTube module is intended to provide a productivity-focused YouTube experience.

Planned functionality:

* Productive video search
* Study-focused content
* Study playlists
* Embedded video player
* Distraction-free experience

**Status:** 🚧 Next Major Feature

---

## 💻 GitHub Integration

Planned functionality:

* Contribution activity
* Repository information
* Coding statistics
* GitHub activity tracking

**Status:** 📌 Planned

---

# 🤖 Future AI Features

Future versions of SynapseOS may include:

* 🤖 AI Study Planner
* 🔄 Smart Revision Scheduler
* 🧠 AI Quiz Generator
* 📝 Note Summarizer
* 📊 Intelligent Productivity Analysis
* 🎯 Personalized Learning Recommendations

**Status:** 📌 Future Development

---

# 🛠️ Tech Stack

## Frontend

* React
* Vite
* JavaScript
* HTML5
* CSS3
* React Router
* React Icons

## Backend

* Node.js
* Express.js
* JavaScript
* REST APIs
* JWT Authentication
* bcrypt

## Database

* MySQL
* MySQL Workbench

## Development Tools

* Git
* GitHub
* VS Code
* PowerShell
* Git Bash
* npm

---

# 🏗️ Architecture

SynapseOS follows a client-server architecture:

```text
┌─────────────────────────────┐
│        React Frontend       │
│          Vite               │
└──────────────┬──────────────┘
               │
               │ REST API
               │
┌──────────────▼──────────────┐
│       Node.js Backend       │
│         Express.js          │
└──────────────┬──────────────┘
               │
               │ SQL
               │
┌──────────────▼──────────────┐
│          MySQL              │
│        SynapseOS DB         │
└─────────────────────────────┘
```

The backend is organized into:

```text
Routes
   ↓
Controllers
   ↓
Models
   ↓
MySQL Database
```

Authentication is handled through JWT middleware.

---

# 📁 Project Structure

```text
SynapseOS/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   │
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── database/
│   ├── schema.sql
│   ├── seed.sql
│   ├── queries.sql
│   └── er-diagram.png
│
├── docs/
│   ├── architecture/
│   ├── development/
│   ├── Frontend_Progress.md
│   ├── api.md
│   ├── features.md
│   ├── roadmap.md
│   └── vision.md
│
├── assets/
│
└── README.md
```

---

# 🚀 Development Roadmap

## Phase 1 — Foundation

* [x] Project planning
* [x] Database design
* [x] Backend architecture
* [x] Frontend architecture
* [x] Authentication
* [x] JWT authentication
* [x] Protected routes

## Phase 2 — Core Productivity

* [x] Dashboard
* [x] Tasks
* [x] Notes
* [x] Goals
* [x] Calendar
* [x] Study Sessions
* [x] Pomodoro
* [x] Analytics

## Phase 3 — Personalization

* [x] Profile
* [x] Edit profile
* [x] Change password
* [x] Settings
* [x] Notification preferences
* [x] Daily study goal
* [x] Pomodoro preferences
* [x] Theme selection

## Phase 4 — External Integrations

* [ ] YouTube Focus Mode
* [ ] Coding Contest Integration
* [ ] GitHub Integration

## Phase 5 — Intelligence

* [ ] AI Study Planner
* [ ] Smart Revision Scheduler
* [ ] AI Quiz Generator
* [ ] AI Note Summarization
* [ ] Intelligent Productivity Recommendations

## Phase 6 — Production

* [ ] Global theme system
* [ ] Avatar upload
* [ ] Advanced UI polishing
* [ ] Loading states and skeletons
* [ ] Error handling improvements
* [ ] Security hardening
* [ ] Testing
* [ ] Production deployment

---

# 📊 Current Development Status

SynapseOS has moved beyond the initial prototype stage.

### Backend

* ✅ Express.js backend
* ✅ REST API architecture
* ✅ MySQL integration
* ✅ Authentication APIs
* ✅ JWT authentication
* ✅ Protected API routes
* ✅ User profile APIs
* ✅ Password management
* ✅ Task APIs
* ✅ Notes APIs
* ✅ Goals APIs
* ✅ Calendar APIs
* ✅ Study Session APIs
* ✅ Analytics APIs
* ✅ Settings APIs

### Frontend

* ✅ React + Vite
* ✅ React Router
* ✅ Authentication pages
* ✅ Protected routes
* ✅ Dashboard
* ✅ Sidebar navigation
* ✅ Tasks
* ✅ Notes
* ✅ Goals
* ✅ Calendar
* ✅ Study Sessions
* ✅ Pomodoro
* ✅ Analytics
* ✅ Profile
* ✅ Settings
* 🚧 YouTube Focus Mode

---

# 🏆 Completed Milestones

* ✅ Project architecture established
* ✅ MySQL database designed
* ✅ Backend architecture implemented
* ✅ Authentication system
* ✅ JWT authentication
* ✅ Protected routes
* ✅ Dashboard layout
* ✅ Sidebar
* ✅ Navbar
* ✅ Dashboard summary cards
* ✅ Backend dashboard APIs
* ✅ Frontend connected to backend APIs
* ✅ Task management
* ✅ Notes management
* ✅ Goals management
* ✅ Calendar management
* ✅ Study session management
* ✅ Pomodoro system
* ✅ Analytics system
* ✅ User profile management
* ✅ Password change functionality
* ✅ Interactive Settings system
* ✅ Persistent user settings
* ✅ Documentation structure
* ✅ Git versioning and release tags

---

# 🏷️ Version History

### `v1.0-backend-core`

Initial backend foundation and core backend architecture.

### `v1.0.0`

Initial SynapseOS release.

### `v1.1.0`

Major application feature development.

### `v1.1.1`

Feature improvements and fixes.

### `v1.1.2`

Interactive Settings system and personalization improvements.

---

# 🎓 Purpose

SynapseOS is being built to:

* Learn full-stack development
* Practice real-world software architecture
* Build REST APIs
* Work with relational databases
* Practice authentication and authorization
* Improve React development skills
* Strengthen backend development skills
* Practice Git and GitHub workflows
* Build a production-oriented portfolio project
* Develop a long-term software engineering project

---

# 📌 Current Status

> **SynapseOS is actively under development.**

The core productivity platform is now functional, including authentication, dashboard, task management, notes, goals, calendar, study sessions, Pomodoro, analytics, profile management, and interactive settings.

The next major feature is **YouTube Focus Mode**, followed by external integrations, UI polishing, testing, and deployment.

---

# 📄 License

This project is licensed under the MIT License.
