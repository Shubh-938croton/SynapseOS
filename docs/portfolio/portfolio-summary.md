# 🚀 SynapseOS — Portfolio & Engineering Summary

**Live Application:** [https://synapse-os-kappa.vercel.app](https://synapse-os-kappa.vercel.app)  
**GitHub Repository:** [https://github.com/Shubh-938croton/SynapseOS](https://github.com/Shubh-938croton/SynapseOS)  
**Target Roles:** Full-Stack Software Engineer • Backend / Distributed Systems Engineer • AI Application Engineer

---

## 📌 Executive Pitch & Summary

> **SynapseOS** is a production-deployed, full-stack cognitive productivity operating system engineered for students and engineers. It combines deep-focus study tracking, task execution, coding contest management, and multi-factor productivity analytics with a **closed-loop AI intelligence layer** powered by Google Gemini.

Unlike conventional productivity apps that treat AI as an ungrounded chat interface, SynapseOS implements an **Advisory-Only Closed Feedback Loop**: real user activity logs feed deterministic analytics and rule-based automations to construct a personalized context payload. The AI proposes structured, actionable domain modifications (rescheduling tasks, decomposing complex work, prioritizing overdue items) which the user reviews and approves via optimistic concurrency control before any database mutation occurs.

---

## 🏆 Key Engineering Achievements & Metrics

- **430 Automated Test Cases:** 100% pass rate across 7 dedicated test suites covering activity event logging, analytics aggregation, automation rules, AI intelligence pipelines, action proposal approvals, system validation, and production QA.
- **Closed-Loop Feedback Architecture:** Seamless cycle connecting real user telemetry → immutable event logging → aggregated analytics → context generation → AI advisory proposals → optimistic approval → transactional domain service execution.
- **Zero-Mutation AI Safety Invariants:** Enforced strict advisory-only boundary where AI has zero direct database write permissions. Action proposals carry state snapshots (`expectedCurrentValue`) and reject stale proposals via `409 Conflict`.
- **High-Performance Multi-Tenant Backend:** Express 5 engine handling 17 modular route controllers with connection pooling, parameterized SQL queries, and strict `WHERE user_id = ?` tenant data isolation across 15 relational MySQL tables.
- **Production-Ready Cloud Deployment:** Deployed across Vercel Edge (React 19 SPA with client-side wildcard routing), Render Cloud (Node.js REST API with graceful shutdown and rate limiting), and Aiven Managed MySQL (SSL/TLS encrypted cloud database with automated connection keep-alives).

---

## 🏛️ System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER (Vercel)                         │
│   React 19 SPA • Vite 8 • React Router v7 • Axios • Recharts • Toast   │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS (JWT Auth)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         API ENGINE (Render)                            │
│   Express 5 • JWT Auth • Rate Limiting • AI Sanitizer & Validator      │
│   Event Bus • Scheduled Automation Workers • Proposal Executor         │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ TLS / MySQL                    │ REST API
                    ▼                                ▼
┌──────────────────────────────────────┐   ┌─────────────────────────────┐
│       DATABASE (Aiven MySQL 8)       │   │    AI (Google Gemini 1.5)   │
│   15 Relational Tables • FK Cascades │   │    Contextual Daily Brief   │
│   Event Stream • Daily Summaries     │   │    Study Planner & Insights │
└──────────────────────────────────────┘   └─────────────────────────────┘
```

---

## 💼 Resume Bullet Points

### Full-Stack Software Engineer
- **Engineered SynapseOS**, a full-stack academic productivity platform (React 19, Express 5, MySQL 8) deployed to production on Vercel and Render, serving unified workflows for task tracking, Pomodoro focus, and competitive programming.
- **Implemented a closed-loop AI intelligence pipeline** with Google Gemini that generates personalized study briefs and actionable task proposals grounded in real-time user activity analytics.
- **Architected a robust safety subsystem** utilizing optimistic concurrency control (`409 Conflict` detection) and anti-hallucination validators to prevent stale or invalid AI state mutations.
- **Built and validated 430 comprehensive automated test cases** spanning unit, integration, and end-to-end regression suites with a 100% pass rate.

### Backend / Distributed Systems Engineer
- **Designed a 15-table relational MySQL schema** on Aiven Cloud with foreign key cascading, B-tree indexes, and strict multi-tenant isolation ensuring zero cross-tenant data leakage.
- **Built an event-driven telemetry system** recording immutable activity logs (`activity_events`) and aggregating multi-dimensional productivity scores, focus time, and weekly rollups.
- **Engineered background automation workers** that evaluate rule triggers (neglected subject alerts, streak calculations, deadline monitoring) and dispatch real-time in-app notifications.
- **Hardened production API infrastructure** with tiered rate limiting, graceful SIGTERM/SIGINT shutdown routines, connection pooling with automatic keep-alive pings, and SSL CA normalization.

### AI Application Engineer
- **Designed an advisory-only AI service layer** integrating Google Gemini 1.5 with deterministic rule-engine fallbacks, guaranteeing zero service interruption during API outages.
- **Implemented prompt injection defenses** by wrapping untrusted user inputs in `<user_data>` boundary tags and sanitizing payloads before LLM inference.
- **Engineered a 15-minute TTL caching layer** for AI Daily Briefs, reducing redundant LLM API calls and optimizing token consumption by up to 80%.
- **Developed structured JSON output schemas** with client-side and server-side validation, mapping natural language user queries directly to deterministic database transactions.

---

## 🛠️ Technology Stack Breakdown

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite 8, React Router v7, Axios, Recharts, Lucide Icons, React Toastify, Tailwind CSS |
| **Backend** | Node.js, Express 5, MySQL2 (Promise Pool), JSON Web Tokens (JWT), bcrypt, Google Auth Library |
| **Database** | MySQL 8.x (InnoDB engine, 15 normalized tables, foreign key cascades, B-Tree indexes) |
| **AI / ML** | Google Gemini 1.5 Flash SDK, Grounded Prompt Engineering, Structured JSON Schemas |
| **Cloud & DevOps** | Vercel Edge CDN, Render Cloud Platform, Aiven Managed Database, Git / GitHub |
| **Testing & QA** | Custom Automated Test Suites (430 tests), Integration Mocking, Production Smoke QA |

---

## 🔍 Engineering Deep-Dives for Interviewers

- **[System Architecture & Design Overview](../architecture/overview.md)**
- **[Activity Events System](../architecture/activity-events.md)**
- **[Multi-Dimensional Analytics Engine](../architecture/analytics.md)**
- **[Automation & Rule Evaluation](../architecture/automation.md)**
- **[AI Intelligence Layer & Safety Invariants](../architecture/ai-intelligence.md)**
- **[Personalization & Action Proposal Approval](../architecture/personalization-and-actions.md)**
- **[Production Deployment & Runbook Guide](../deployment/production-guide.md)**
- **[20+ Architectural Interview Questions & Answers](../interview/interview-prep.md)**
