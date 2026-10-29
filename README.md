# 🧠 SynapseOS

> **An intelligent, closed-loop cognitive productivity platform engineered for students, self-directed learners, and competitive programmers.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Frontend: React 18](https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite%208-61dafb.svg)](https://react.dev/)
[![Backend: Node.js / Express](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%205-339933.svg)](https://nodejs.org/)
[![Database: MySQL 8.0](https://img.shields.io/badge/Database-MySQL%208.0%20%7C%20Aiven-4479a1.svg)](https://www.mysql.com/)
[![Deployment: Vercel & Render](https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-black.svg)](https://vercel.com/)
[![Test Suite: 430 Passing](https://img.shields.io/badge/Tests-430%20Passed%20%7C%20100%25-brightgreen.svg)](#-automated-testing--qa)

🌐 **Live Application:** [https://synapse-os-kappa.vercel.app](https://synapse-os-kappa.vercel.app)  
💻 **GitHub Repository:** [https://github.com/Shubh-938croton/SynapseOS](https://github.com/Shubh-938croton/SynapseOS)  
📚 **Documentation Hub:** [docs/README.md](docs/README.md)

---

## 📖 About SynapseOS

**SynapseOS** transforms personal productivity from a disconnected set of passive CRUD tools into a **grounded, human-in-the-loop, closed-loop intelligence system**.

Instead of manually switching between isolated apps for task tracking, Pomodoro timers, study logging, markdown notes, academic milestones, and coding contest calendars, SynapseOS unifies everything around **Academic Subjects** and transforms real behavioral telemetry into actionable, personalized study plans.

### The Problem SynapseOS Solves:
1. **Academic Fragmentation:** Students lose focus juggling tasks in one app, flashcards in another, notes in a third, and contest schedules on web bookmarks.
2. **Passive Productivity Tools:** Traditional apps simply record what you did; they cannot detect velocity drop-offs, goal stagnation, or subject neglect.
3. **Unchecked / Hallucinatory AI:** Generic AI wrappers query raw LLMs without grounding in factual history, or make destructive mutations without user consent.

---

## 🔄 The Closed Feedback Loop

SynapseOS strictly enforces a unidirectional, deterministic feedback pipeline:

```
REAL USER BEHAVIOR (Tasks, Pomodoros, Study Sessions, Goals)
        │
        ▼
ACTIVITY EVENTS (Phase 2 Immutable Append-Only Ledger)
        │
        ▼
ANALYTICS ENGINE (Phase 3 Multi-Range Aggregations & Trends)
        │
        ▼
AUTOMATION ENGINE (Phase 4 Scheduled Rollups, Streaks, Audits)
        │
        ▼
DETERMINISTIC SIGNALS ENGINE (Phase 6 Rule-Based Grounding)
        │
        ▼
STRUCTURED CONTEXT BUILDER (Data Minimization & Multi-Tenant Scoping)
        │
        ▼
AI INTELLIGENCE LAYER (Phase 5 Provider Abstraction & Daily Brief Synthesis)
        │
        ▼
STRUCTURED ACTION PROPOSALS (Strict Schema Validation & Entity Grounding)
        │
        ▼
USER REVIEW & EXPLICIT 1-CLICK APPROVAL (Dashboard Action Center / AI Hub)
        │
        ▼
DOMAIN SERVICE MUTATION (taskModel via aiActionService)
        │
        ▼
ACTIVITY EVENT EMISSION (TASK_RESCHEDULED, TASK_UPDATED, TASK_CREATED)
        │
        └───► Closes the loop! (Reflected in subsequent analytics & context)
```

---

## 🛡️ Core Safety & AI Invariants

| Invariant | Technical Implementation | Purpose & Guarantee |
| :--- | :--- | :--- |
| **Advisory-Only Invariant** | AI returns structured JSON action proposals (`RESCHEDULE_TASK`, `PRIORITIZE_TASK`, `CREATE_SUBTASK`, `UPDATE_TASK_DURATION`). | The AI layer **never** writes to or mutates the database directly. Real updates occur only on explicit user approval. |
| **Stale Proposal Defense** | Optimistic concurrency verification (`expectedCurrentValue === currentDbValue`). | Rejects outdated proposals with `409 Conflict` (`STALE_PROPOSAL`) if the entity was modified after proposal generation. |
| **Anti-Hallucination Grounding** | Output validator cross-references proposed `targetEntityId` against live active tasks. | Silently purges hallucinated task IDs before presentation to the user. |
| **Prompt Injection Defense** | Encapsulates all user-supplied strings inside inert `<user_data>` XML tags. | System prompts explicitly instruct models to treat enclosed text as passive data, preventing instruction overrides. |
| **Data Minimization & Key Shielding**| Context builder strips passwords, tokens, cookies, and secrets. API keys reside strictly on the server. | Zero credential exposure in LLM prompts or client bundles. |

---

## ✨ Key Features & Modules

| Module | Features & Capabilities |
| :--- | :--- |
| **📊 Command Center** | Real-time study metrics, task completion velocity, personalized Daily Brief banner, and 1-click action proposals. |
| **🧠 AI Intelligence Hub** | Personalized Insights, Smart Daily Planner, Task Decomposition, Academic Weak Area Analysis, and Weekly Retrospective. |
| **✅ Task Engine** | Subject-scoped task manager with priority tags (`High`, `Medium`, `Low`), deadlines, overdue detection, and status filtering. |
| **🍅 Pomodoro Focus Timer**| Customizable 25/5/15 intervals, cycle logging, abandonment tracking, and focus analytics. |
| **⏱️ Deep Work Sessions** | Manual/automated study session logger with duration aggregation and subject attribution. |
| **🎯 Goal Tracker** | Long-term academic milestone tracking with interactive progress bars and overdue warning audits. |
| **📝 Knowledge Base** | Markdown revision notes with subject tagging, search filtering, and color-coded cards. |
| **📅 Academic Calendar** | Synchronized calendar uniting personal study milestones with external coding contests. |
| **🏆 Contest Tracker** | Direct tracking for LeetCode, Codeforces, CodeChef, HackerRank, and AtCoder competitions. |
| **📈 Visual Analytics** | Multi-range Recharts visualizations (`today`, `1d`, `7d`, `30d`, `all`), study time distribution, and consistency trends. |
| **🎥 YouTube Focus Proxy** | Distraction-free educational search proxy and embedded study video player. |

---

## 🏗️ Production Architecture

```
                      ┌────────────────────────────────────────┐
                      │             Vercel Edge                │
                      │  https://synapse-os-kappa.vercel.app   │
                      │  (React 18 / Vite SPA Client Bundle)   │
                      └───────────────────┬────────────────────┘
                                          │
                                   HTTPS  │  JWT Bearer Auth
                                          ▼
                      ┌────────────────────────────────────────┐
                      │             Render Cloud               │
                      │  https://synapseos-api.onrender.com    │
                      │  (Node.js 20+ / Express REST API)      │
                      └───────────────────┬────────────────────┘
                                          │
                                  TLS/SSL │  Keep-Alive Connection Pool
                                          ▼
                      ┌────────────────────────────────────────┐
                      │             Aiven Cloud                │
                      │  MySQL 8.0 Managed Database Cluster    │
                      └────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend:** React 18, Vite 8, React Router DOM v7, Axios, Recharts, React Icons, React Toastify
- **Backend:** Node.js 20+, Express 5, MySQL2 (Connection Pool with Keep-Alive), bcrypt, jsonwebtoken, helmet, express-rate-limit
- **AI Intelligence:** Google Gemini API (`gemini-2.5-flash`), OpenAI API (`gpt-4o-mini`), Pluggable Provider Abstraction
- **Database:** Aiven Cloud MySQL 8.0 (InnoDB, Foreign Key Cascades, Composite Indexes)
- **Deployment:** Vercel (Frontend with SPA Rewrites), Render (Backend Web Service), GitHub (CI/CD)

---

## ⚡ Quick Start Guide (Local Development)

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **MySQL:** v8.0 or cloud MySQL instance (Aiven / Local MySQL)
- **npm:** v9.0+

### 2. Clone the Repository
```bash
git clone https://github.com/Shubh-938croton/SynapseOS.git
cd SynapseOS
```

### 3. Initialize the Database
Run the unified initialization script to create all 15 tables and performance indexes:
```bash
mysql -u root -p < database/schema/production_schema_init.sql
```

### 4. Start the Backend Server
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and configure DB_HOST, DB_PASSWORD, JWT_SECRET, and GEMINI_API_KEY
npm run dev
```
*Backend will start on `http://localhost:5000`.*

### 5. Start the Frontend Application
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```
*Frontend will start on `http://localhost:5173`.*

---

## 🧪 Automated Testing & QA

SynapseOS includes exhaustive automated test suites covering all system phases:

```bash
# Run all automated test suites
node scratch/test_activity_events_phase2.js      # Phase 2: Activity Event Ledger (86 tests)
node scratch/test_analytics_phase3.js            # Phase 3: Analytics Engine (77 tests)
node scratch/test_automation_phase4.js           # Phase 4: Automation & Scheduled Rollups (63 tests)
node scratch/test_ai_phase5.js                   # Phase 5: AI Intelligence Layer (41 tests)
node scratch/test_personalization_phase6.js      # Phase 6: Personalization & AI Actions (36 tests)
node scratch/test_system_validation_phase7.js    # Phase 7: Full System Validation (67 tests)
node scratch/test_deployment_production_qa.js    # Phase 8: Deployment & Production QA (60 tests)
```

**Total Test Coverage:** **430 / 430 Tests Passing (100% Pass Rate across 7 Suites)**

---

## 📂 Project Structure

```text
SynapseOS/
├── backend/
│   ├── src/
│   │   ├── ai/                 # AI Intelligence Layer (Providers, Prompts, Validators, Signals)
│   │   │   ├── actions/        # AI Action Execution Service & Stale Proposal Check
│   │   │   ├── prompts/        # Anti-Injection Prompt Builders (<user_data>)
│   │   │   ├── providers/      # Gemini, OpenAI, and Mock Provider Abstraction
│   │   │   ├── signals/        # Deterministic Rule-Based Signals Engine
│   │   │   └── validators/     # Grounding Validators & Schema Enforcement
│   │   ├── config/             # Database Connection Pool & Cron Scheduler
│   │   ├── constants/          # Immutable Event & Entity Type Constants
│   │   ├── controllers/        # Express Route Controllers
│   │   ├── jobs/               # Scheduled Automation Cron Jobs (Daily/Weekly/Audits)
│   │   ├── middleware/         # Auth (JWT), Rate Limiter, and Global Error Handler
│   │   ├── models/             # Data Access Models (MySQL Parameterized Queries)
│   │   ├── routes/             # Express API Route Definitions
│   │   ├── services/           # Business Logic Layer (Analytics, Automation, Events)
│   │   ├── utils/              # Timezone & Date Normalization Utilities
│   │   ├── app.js              # Express App Configuration & Security Headers
│   │   └── server.js           # Process Lifecycle & Graceful Shutdown
│   ├── .env.example            # Documented Backend Environment Template
│   └── package.json
├── database/
│   └── schema/
│       ├── production_schema_init.sql  # Unified Turnkey Initialization Script
│       └── v1/                         # 16 Incremental Migration SQL Files
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI Widgets, Modals, Navbar, Sidebar
│   │   ├── pages/              # 12 Application Views (Dashboard, AIHub, Tasks, etc.)
│   │   ├── routes/             # React Router v7 Protected Routing
│   │   ├── services/           # Axios Client API Layer with Auth Interceptors
│   │   └── App.jsx
│   ├── vercel.json             # Vercel SPA Wildcard Rewrites
│   ├── .env.example            # Documented Frontend Environment Template
│   └── package.json
├── docs/                       # Comprehensive Architecture & Deployment Guides
├── vercel.json                 # Monorepo Deployment Configuration
├── LICENSE                     # MIT License
└── README.md
```

---

## 📄 Documentation Hub

Detailed engineering documentation is available in [`docs/`](docs/):
- **[System Architecture Deep-Dive](docs/architecture/overview.md)**
- **[Personalization & AI Action Engine](docs/architecture/personalization-and-actions.md)**
- **[AI Intelligence Layer Design](docs/architecture/ai-intelligence.md)**
- **[Analytics Engine Architecture](docs/architecture/analytics.md)**
- **[Activity Events System](docs/architecture/activity-events.md)**
- **[Scheduled Automation System](docs/architecture/automation.md)**
- **[REST API Reference](docs/api.md)**
- **[Production Deployment Runbook](docs/deployment/production-guide.md)**
- **[Portfolio & Resume Summary](docs/portfolio/portfolio-summary.md)**
- **[Technical Interview Preparation Guide](docs/interview/interview-prep.md)**

---

## 📜 License

This project is open-source and licensed under the [MIT License](LICENSE).

Copyright © 2026 Shubh Kamal. All rights reserved.