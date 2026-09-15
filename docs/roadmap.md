# 🗺️ SynapseOS Engineering Roadmap

## 1. Roadmap Overview

The SynapseOS roadmap is organized into four distinct tiers:
1. **Completed (v1.0.0 - v1.2.x):** Foundational architecture, core productivity modules, dual authentication, and cloud deployment.
2. **In Active Development (v1.3.0):** Feature enhancements, YouTube Focus Hub, and interactive notifications.
3. **Planned (v1.4.0+):** Developer integrations, GitHub activity tracking, and cross-platform export tools.
4. **Future AI Vision (v2.0.0+):** Cognitive AI study scheduling, automated active recall, and adaptive learning workflows.

---

## 2. Milestone Breakdown

### ✅ Phase 1: Core Productivity Architecture (v1.0.0 — Completed)
- [x] Relational MySQL 8 database schema with InnoDB foreign keys and cascading deletes.
- [x] Stateless Node.js / Express 5 backend with 3-tier MVC architecture.
- [x] Dual-channel authentication: Email/Password + Google OAuth 2.0 (`google-auth-library`).
- [x] Cryptographic password security via `bcrypt` (10 salt rounds) and signed JWT tokens.
- [x] Dedicated Subject management subsystem (`/subjects`) and in-modal inline creation lifecycle.
- [x] Full CRUD modules: Tasks, Notes (Markdown), Goals, Study Sessions, Calendar Events, Pomodoro Logs.
- [x] Real-time aggregated productivity scoring and Recharts analytics dashboards.
- [x] Production cloud deployments: Vercel (Frontend), Render (Backend), Aiven (Cloud MySQL).

---

### 🚧 Phase 2: Refinement & Specialized Learning Hubs (v1.3.0 — In Progress)
- [x] Competitive Programming Contest Tracker with platform badges (LeetCode, Codeforces, CodeChef, HackerRank, AtCoder).
- [x] Dynamic Calendar integration aggregating academic events and coding contests from a single source of truth.
- [x] YouTube Focus Study Hub: Distraction-free search proxy querying YouTube Data API v3 without recommendation rabbit holes.
- [ ] User avatar upload and cloud storage integration (AWS S3 or Cloudinary).
- [ ] Customizable sound alerts for Pomodoro work and break transitions.
- [ ] Export study notes to Markdown (.md) and PDF formats.

---

### 📌 Phase 3: Developer & Academic Integrations (v1.4.0 — Planned)
- [ ] **GitHub Activity Integration:** Embed real-time commit heatmaps and repository statistics onto the student dashboard.
- [ ] **Spaced Repetition Flashcards:** Leitner 5-box spaced repetition system integrated directly with study notes.
- [ ] **Offline PWA Support:** Service worker caching for local offline note-taking and Pomodoro tracking.
- [ ] **Collaborative Study Rooms:** WebRTC-powered virtual study rooms for peer accountability.

---

### 🤖 Phase 4: Cognitive AI Study Suite (v2.0.0+ — Future Vision)
- [ ] **AI Study Plan Optimizer:** Analyzes task deadlines, historical study velocity, and subject difficulty to generate optimized daily study schedules.
- [ ] **Smart Quiz & Flashcard Synthesizer:** Automatically extracts key concepts from user notes and generates practice quizzes with multiple-choice and short-answer prompts.
- [ ] **AI Note Summarizer:** Summarizes lecture notes into concise bulleted executive summaries.
- [ ] **Predictive Burnout & Consistency Detection:** ML model monitoring focus patterns and providing actionable recovery suggestions before burnout occurs.
