# 🏛️ SynapseOS System Architecture Overview

## 1. System Summary

**SynapseOS** is an open-source, full-stack student productivity and academic cognitive workflow platform designed to provide a unified environment for daily organization, deep-focus study tracking, task execution, note-taking, contest tracking, long-term goal management, and AI-assisted workflow optimization.

The architecture is built around three core tiers and a closed-loop data intelligence pipeline:
1. **Client Tier (Frontend):** A responsive Single Page Application (SPA) built with **React 19**, bundled using **Vite 8**, and deployed globally on **Vercel Edge**.
2. **Application Tier (Backend):** A stateless RESTful API server built on **Node.js** and **Express 5**, implementing an **MVC (Model-View-Controller)** pattern, deployed on **Render Cloud**.
3. **Data Tier (Database):** A relational **MySQL 8** database hosted on **Aiven Cloud**, enforcing strict relational integrity, foreign key cascading, and user-scoped data segregation across 15 normalized tables.
4. **Intelligence Layer:** An advisory-only AI service powered by **Google Gemini API** (with deterministic rule-engine fallbacks) consuming structured user analytics to generate actionable, ground-truth recommendations.

---

## 2. High-Level Architecture Diagram

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER (SPA)                             │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     React 19 + Vite 8 App                         │  │
│  │                                                                   │  │
│  │  • React Router v7 Routing       • React Context (Auth State)     │  │
│  │  • Centralized Axios Client      • Recharts Visualization         │  │
│  │  • Google Identity Services SDK  • Responsive Component Library   │  │
│  │  • AI Action Approval Modals     • Real-Time Optimistic UI        │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
                                     │ HTTPS / REST (JSON)
                                     │ Header: Authorization: Bearer <JWT>
                                     │ Configured CORS Whitelist
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION TIER (API)                          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    Express 5.x REST API Engine                    │  │
│  │                                                                   │  │
│  │  • CORS & Body Parsing           • Auth Middleware (JWT Verify)   │  │
│  │  • 17 Modular Route Handlers     • Google Auth Library (OAuth)    │  │
│  │  • Business Logic Controllers    • AI Prompt Sanitizer & Defense  │  │
│  │  • Event Bus & Activity Logger   • Scheduled Automation Workers   │  │
│  │  • Action Proposal Executor      • Global Error Handling          │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
                                     │ TLS 1.3 / MySQL Binary Protocol
                                     │ Connection Pool (mysql2/promise)
                                     │ Parameterized SQL Queries
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA TIER (STORAGE)                          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Aiven Managed MySQL 8.x                       │  │
│  │                                                                   │  │
│  │  • 15 Relational Tables          • Foreign Key Constraints (FK)   │  │
│  │  • Cascade Deletes & Updates     • Performance B-Tree Indexes     │  │
│  │  • Encrypted Connection (SSL/TLS)• User Isolation (user_id)       │  │
│  │  • Immutable Event Logs          • Materialized Summary Snapshots │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. The 6-Layer Closed Feedback Loop

SynapseOS is engineered around a strict, self-reinforcing closed-loop data architecture that turns everyday student activity into contextual intelligence without autonomous state mutation:

```text
               ┌─────────────────────────────────────────────────┐
               │              1. Real User Behavior              │
               │   (Tasks, Study Sessions, Pomodoros, Notes)     │
               └───────────────────────┬─────────────────────────┘
                                       │
                                       ▼
               ┌─────────────────────────────────────────────────┐
               │           2. Activity Event Stream              │
               │   (TASK_COMPLETED, SESSION_LOGGED, STREAK_HIT)  │
               └───────────────────────┬─────────────────────────┘
                                       │
                                       ▼
               ┌─────────────────────────────────────────────────┐
               │          3. Analytics & Summaries Engine        │
               │   (Productivity Scores, Weekly Rollups, Streaks)│
               └───────────────────────┬─────────────────────────┘
                                       │
                                       ▼
               ┌─────────────────────────────────────────────────┐
               │          4. Automation & Context Builder        │
               │   (Rules Evaluation, Neglected Subject Alerts)  │
               └───────────────────────┬─────────────────────────┘
                                       │
                                       ▼
               ┌─────────────────────────────────────────────────┐
               │         5. Grounded AI Intelligence             │
               │   (Daily Brief, Planner, Action Proposals)      │
               └───────────────────────┬─────────────────────────┘
                                       │
                                       ▼
               ┌─────────────────────────────────────────────────┐
               │          6. User Review & Approval UI           │
               │   (Diff Review, Optimistic Conflict Check)      │
               └───────────────────────┬─────────────────────────┘
                                       │
                                       ▼ (Explicit User Click)
               ┌─────────────────────────────────────────────────┐
               │         7. Domain Service Execution             │
               │   (Task reschedule, Priority update, Subtask)   │
               └───────────────────────┬─────────────────────────┘
                                       │
                                       └──────► Loops back to (2)
```

---

## 4. Core Safety Invariants

| Invariant | Mechanism | Description |
| :--- | :--- | :--- |
| **Advisory-Only Invariant** | Non-mutating AI Endpoints | AI responses contain structured recommendations (`proposals`) only. AI code has zero write access to domain database tables. |
| **Stale Proposal Defense** | Optimistic Concurrency (`409 Conflict`) | Every proposal payload carries `expectedCurrentValue`. If the user or another process altered the entity before approval, the backend rejects execution with `409 Conflict (code: "STALE_PROPOSAL")`. |
| **Anti-Hallucination Grounding** | Output Validator (`aiOutputValidator.js`) | Validates all AI suggested IDs against active database records belonging to the authenticated user. Hallucinated IDs are pruned before rendering. |
| **Prompt Injection Defense** | Input Sanitization (`<user_data>` Tagging) | User-supplied strings (task titles, notes) are XML-escaped and wrapped in `<user_data>` boundary tags inside LLM prompts to prevent prompt escape attacks. |
| **Multi-Tenant Isolation** | Scoped SQL Queries | Every single database query strictly requires `WHERE user_id = ?` injected from verified JWT claims. |

---

## 5. Technology Stack Breakdown

| Layer | Technology | Version | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React | `^19.2.8` | Component-driven declarative UI library |
| **Frontend Tooling** | Vite | `^8.2.0` | Fast development server & optimized production bundler |
| **Client Routing** | React Router DOM | `^7.18.2` | Client-side routing with `ProtectedRoute` navigation guards |
| **HTTP Client** | Axios | `^1.19.0` | Promise-based HTTP client with auth interceptors |
| **Data Visualization**| Recharts | `^3.10.1` | Declarative charting for analytics and study histograms |
| **UI Notifications** | React Toastify | `^11.1.0` | Toast notifications for async user actions |
| **Backend Runtime** | Node.js | `>=18.x` | High-performance asynchronous JavaScript server runtime |
| **Backend Framework**| Express | `^5.2.1` | REST API routing and middleware composition |
| **Database Driver** | MySQL2 | `^3.23.2` | Fast MySQL client with connection pooling & prepared statements |
| **AI Integration** | Google GenAI SDK | Gemini 1.5 | Contextual briefing, study planning, task parsing |
| **Password Hashing**| bcrypt | `^6.0.0` | Cryptographic password hashing (salt rounds: 10) |
| **Authentication** | jsonwebtoken | `^9.0.3` | Cryptographically signed JWTs for stateless session management |
| **OAuth 2.0 SDK** | google-auth-library | `^11.0.2` | Server-side verification of Google OAuth tokens |
| **Database Engine** | MySQL | `8.x` | ACID-compliant relational database engine on Aiven |
| **Cloud Hosting** | Vercel, Render, Aiven | Production | Globally distributed frontend, API server, and cloud database |

---

## 6. Detailed Architectural Deep-Dives

- 📊 **[Activity Events System](./activity-events.md)** — Event bus, event schema, and real-time activity logging.
- 📈 **[Analytics Engine Architecture](./analytics.md)** — Multi-dimensional metrics calculation, daily rollups, and time-series aggregation.
- ⚙️ **[Automation System](./automation.md)** — Rule evaluator, scheduled intelligence workers, and proactive triggers.
- 🤖 **[AI Intelligence Layer](./ai-intelligence.md)** — Grounded prompt engineering, validation pipelines, and rate limiting.
- 🔄 **[Personalization & AI Actions](./personalization-and-actions.md)** — Proposal generation, approval flow, and stale proposal conflict resolution.
- ⚙️ **[Backend MVC Architecture](./backend.md)** — Express route mounts, controllers, models, and connection pooling.
- 🎨 **[Frontend SPA Architecture](./frontend.md)** — React 19 component hierarchy, services, and route guards.
- 🗄️ **[Database Architecture & Schema](./database.md)** — 15 InnoDB tables, foreign keys, cascades, and indexes.
- 🔐 **[Authentication & Security Architecture](./authentication.md)** — JWT, bcrypt, and Google OAuth 2.0.
- 📚 **[Subject Subsystem & Lifecycle](./subjects.md)** — Organizational hierarchy and inline modal creation.
- 🏆 **[Contests & Calendar Integration](./contests-calendar.md)** — Competitive programming tracker and dynamic aggregation.
- 🔄 **[API Request & Data Flow Diagrams](./api-flow.md)** — Visual sequence flowcharts for key platform interactions.
