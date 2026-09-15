# 🧠 SynapseOS

> **A full-stack cognitive productivity platform for learning, focus, progress tracking, and academic workflow management.**

[![Status](https://img.shields.io/badge/status-active%20development-blue)](https://github.com/Shubh-938croton/SynapseOS)
[![License](https://img.shields.io/badge/license-MIT-green)](https://github.com/Shubh-938croton/SynapseOS)

🌐 **Live:** https://synapse-os-kappa.vercel.app  
💻 **GitHub:** https://github.com/Shubh-938croton/SynapseOS

---

## 📖 About

**SynapseOS** is a student-focused productivity platform built to bring learning, planning, study tracking, notes, tasks, academic events, coding contests, and personalization into one application.

The project started as a learning and productivity idea and evolved into a deployed full-stack application with a React frontend, Node.js/Express backend, cloud-hosted MySQL database, authentication, REST APIs, and production deployment.

The project is also a long-term software engineering learning journey focused on building, debugging, deploying, and improving a real application rather than only creating isolated tutorials or prototypes.

---

## 🎯 Vision

SynapseOS aims to help students:

- 🎯 Stay focused
- 📚 Organize their learning
- 📝 Maintain notes
- ✅ Manage tasks and goals
- 📅 Manage academic and personal events
- ⏱️ Track study sessions and focus time
- 📊 Understand productivity and study patterns
- 🏆 Track coding contests
- 📚 Organize work by subject
- ⚙️ Personalize their experience
- 📈 Build long-term consistency

---

# ✨ Features

## 📊 Dashboard

- Personalized dashboard
- Study summary
- Productivity statistics
- Daily information
- Dashboard analytics
- Summary cards
- Quick actions
- Integrated navigation

**Status:** ✅ Completed

---

## 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Protected API routes
- Authenticated API requests
- Logout
- Password hashing with bcrypt
- Google authentication support through the existing backend flow

**Status:** ✅ Completed

---

## 📚 Subject Management

Subjects provide the organizational layer for subject-dependent features.

Users can:

- Create/add subjects
- View subjects
- Edit subjects
- Delete subjects where supported
- Select subjects while creating related content

Subject relationships are integrated with features such as notes, tasks, and study sessions.

**Status:** ✅ Completed

---

## ✅ Task Manager

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Task organization
- Priority support
- Deadline support
- Subject association

**Status:** ✅ Completed

---

## 📝 Notes

- Create notes
- View notes
- Update notes
- Delete notes
- Subject association
- Organized note management

**Status:** ✅ Completed

---

## 🎯 Goals

- Goal creation
- Goal updates
- Goal tracking
- Goal management

**Status:** ✅ Completed

---

## 📅 Calendar

- Academic events
- Assignments
- Exams
- Event creation
- Event updating
- Event deletion
- Upcoming coding contests integrated into the calendar

**Status:** ✅ Completed

---

## 📚 Study Sessions

- Create study sessions
- Track study topics
- Record start and end time
- Automatically calculate session duration
- View study sessions
- Update study sessions
- Delete study sessions
- Subject association

**Status:** ✅ Completed

---

## 🍅 Pomodoro

- Focus sessions
- Short breaks
- Long breaks
- Configurable durations
- Productivity-focused workflow

**Status:** 🚧 Functional — settings synchronization and refinement continue

---

## 📈 Analytics

- Study analytics
- Productivity statistics
- Backend analytics APIs
- Frontend analytics dashboard

**Status:** ✅ Completed

---

## 👤 Profile

- View profile
- Edit profile
- Update username
- Update email
- Update full name
- Change password
- Password verification using bcrypt

**Status:** ✅ Completed

---

## ⚙️ Settings

Interactive settings include:

### Appearance

- Light theme
- Dark theme
- Interactive theme selection

### Notifications

- Enable/disable notifications

### Daily Study Goal

- Configurable daily study goal
- Interactive control
- Live time representation

### Pomodoro Configuration

- Focus duration
- Short break duration
- Long break duration
- Live Pomodoro cycle preview

### Persistence

- Save settings
- Reset settings to defaults
- Persistent settings stored in MySQL

**Status:** ✅ Completed

---

## 🏆 Coding Contest Tracker

The contest module provides coding-contest tracking and connects upcoming contests with the calendar.

Supported/planned contest sources include:

- Codeforces
- LeetCode
- CodeChef
- AtCoder

**Status:** 🚧 Active development / integration refinement

---

## 🎥 YouTube Focus Mode

The YouTube module is designed as a productivity-focused learning experience.

Current/ongoing work includes:

- Productive video search
- Study-focused content
- Study playlists
- Embedded video experience
- Distraction-aware learning workflow

**Status:** 🚧 Next major feature / active development

---

## 💻 GitHub Integration

Planned functionality:

- Contribution activity
- Repository information
- Coding statistics
- GitHub activity tracking

**Status:** 📌 Planned

---

# 🤖 Future AI Features

Future versions of SynapseOS may include:

- 🤖 AI Study Planner
- 🔄 Smart Revision Scheduler
- 🧠 AI Quiz Generator
- 📝 AI Note Summarization
- 📊 Intelligent Productivity Analysis
- 🎯 Personalized Learning Recommendations

**Status:** 📌 Future development

---

# 🛠️ Technology Stack

## Frontend

- React
- Vite
- JavaScript
- HTML5
- CSS3
- React Router
- React Icons
- Axios

## Backend

- Node.js
- Express.js
- JavaScript
- REST APIs
- JWT authentication
- bcrypt
- MySQL2

## Database

- MySQL
- Aiven Cloud
- Relational database design
- Primary/foreign-key relationships

## Development & Version Control

- Git
- GitHub
- VS Code
- PowerShell
- Git Bash
- npm

## Deployment

- **Vercel** — React/Vite frontend
- **Render** — Node.js/Express backend
- **Aiven** — MySQL database

---

# 🏗️ Architecture

SynapseOS follows a client-server architecture:

```text
┌──────────────────────────────┐
│       React Frontend         │
│          Vite                │
│       Vercel Hosting         │
└──────────────┬───────────────┘
               │
               │ HTTPS / REST API
               ▼
┌──────────────────────────────┐
│       Node.js Backend        │
│         Express.js           │
│       Render Hosting         │
└──────────────┬───────────────┘
               │
               │ SQL
               ▼
┌──────────────────────────────┐
│          MySQL               │
│        Aiven Cloud           │
│        SynapseOS DB          │
└──────────────────────────────┘