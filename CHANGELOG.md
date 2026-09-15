# 📜 SynapseOS Changelog & Release Notes

All notable changes and engineering milestones for **SynapseOS** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2026-09-15

### Added
- **Comprehensive Documentation Suite:** Complete open-source documentation overhaul covering system architecture, backend MVC structure, frontend SPA patterns, database ER diagrams, dual-channel authentication flows, REST API references, local setup, cloud deployment, and contribution workflows under `docs/`.
- **In-Modal Inline Subject Creation:** Enabled real-time creation and auto-selection of study subjects within Task, Note, and Study Session modal dialogs without page reload.
- **Dynamic Contest Calendar Integration:** Connected competitive programming contest dates directly into the interactive monthly calendar grid with platform badges and external URLs.

### Fixed
- **Contest Date Normalization:** Resolved timezone offset discrepancies between SQL `DATETIME` storage and client-side calendar date keying.
- **Google OAuth Signup Invariant:** Added cryptographically generated bcrypt passwords for Google SSO users to satisfy MySQL `password_hash NOT NULL` constraints.
- **Cascading Integrity on Subject Deletion:** Confirmed and standardized `ON DELETE CASCADE` across tasks, notes, and study sessions.

---

## [1.2.0] - 2026-09-10

### Added
- **Coding Contest Tracker Subsystem:** Multi-platform tracker supporting LeetCode, Codeforces, CodeChef, HackerRank, and AtCoder with status toggles (`Upcoming`, `Participated`, `Missed`).
- **YouTube Focus Hub:** Educational video search proxy querying YouTube Data API v3 with distraction-free categories and embedded 16:9 player.
- **In-App Notification Center:** Contextual notifications and alert drawer with read/unread tracking.
- **Cloud Database Integration:** Aiven Cloud MySQL configuration with TLS/SSL Base64 certificate support.

---

## [1.1.0] - 2026-08-25

### Added
- **Cybernetic Dark Theme Redesign:** Modern glassmorphism UI with custom gradients, glowing accents, and responsive layouts.
- **Graphical Analytics Engine:** Recharts integration displaying day-wise study histograms (Mon–Sun), subject time distributions, and multi-factor productivity score (0–100).
- **Goal Management Engine:** Visual goal cards with target deadlines and 0–100% progress sliders.
- **Study Session Logger:** Deep work session logger with automatic start/end time duration computation.

---

## [1.0.0] - 2026-08-01

### Added
- **Core Full-Stack Architecture:** Initial release of SynapseOS with React SPA frontend and Node.js/Express MVC backend.
- **Dual Authentication System:** Email/Password registration, bcrypt password encryption, and stateless JWT token authentication.
- **Relational Database Schema:** MySQL database with InnoDB tables for users, subjects, tasks, notes, calendar events, and pomodoro sessions.
- **Task & Note Management:** Full CRUD task management with priority levels and markdown note-taking.
- **Pomodoro Focus Timer:** 25/5/15 minute interval timer with start/pause/reset states and history logging.