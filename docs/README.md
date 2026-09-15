# 📚 SynapseOS Documentation Hub

Welcome to the official developer and contributor documentation for **SynapseOS** — a full-stack, cognitive productivity platform engineered specifically for students, self-directed learners, and competitive programmers.

Whether you are a new open-source contributor, an architect reviewing system design, or a developer setting up a local development environment, this documentation provides a comprehensive guide to understanding, developing, and deploying SynapseOS.

---

## 🧭 Documentation Map

### 1. 🏛️ Architecture & System Design
Learn how SynapseOS is architected across client, server, and cloud infrastructure:
- **[System Architecture Overview](./architecture/overview.md)** — High-level system topology, 3-tier communication, and hosting infrastructure.
- **[Backend Architecture](./architecture/backend.md)** — Express 5 MVC framework, 15 route mounts, authentication middleware, controllers, and models.
- **[Frontend Architecture](./architecture/frontend.md)** — React 19 SPA, Vite build pipeline, React Router v7, centralized Axios interceptors, and state patterns.
- **[Database Schema & Design](./architecture/database.md)** — Relational MySQL schema (14 tables), ER diagram, foreign keys, cascading rules, and indexing strategy.
- **[Authentication & Security Architecture](./architecture/authentication.md)** — Dual authentication engine (Email/Password + Google OAuth 2.0), JWT lifecycle, bcrypt hashing, and multi-tenant data isolation.
- **[Subject Subsystem & Dependency Lifecycle](./architecture/subjects.md)** — Subject hierarchy, modal inline creation lifecycle, and cascading integrity across tasks, notes, and study sessions.
- **[Contests & Calendar Integration](./architecture/contests-calendar.md)** — Competitive programming tracker, platform badging, single source of truth, and dynamic calendar aggregation.
- **[API Request & Data Flow Diagrams](./architecture/api-flow.md)** — Visual sequence diagrams for Google OAuth, protected CRUD requests, YouTube search proxy, and dashboard aggregations.

---

### 2. 📡 API Reference
- **[REST API Reference](./api.md)** — Complete, exhaustive specification of all 15 backend API modules, endpoints, HTTP methods, request bodies, query parameters, authorization headers, and response formats.

---

### 3. 🛠️ Development & Operations
- **[Local Development Setup](./development/setup.md)** — Step-by-step instructions to clone, configure environment variables, initialize MySQL schemas, and run frontend and backend servers locally.
- **[Developer Workflow & Contribution Standards](./development/workflow.md)** — How to safely add features, modify database models, write endpoints, and maintain coding consistency.
- **[Deployment & Production Operations](./development/deployment.md)** — Deploying the frontend to Vercel, backend to Render, configuring Aiven Cloud MySQL with TLS/SSL, and managing CORS.
- **[Troubleshooting Guide](./development/troubleshooting.md)** — Real-world solutions for CORS mismatches, Aiven SSL connection errors, port conflicts, date timezone offsets, and token expiration.
- **[Security Audit Report](./security-audit.md)** — Complete security evaluation, vulnerability assessment, endpoint security matrix, and remediation plan.

---

### 4. 🗺️ Project Evolution & Roadmap
- **[Feature Catalog & Status](./features.md)** — Detailed breakdown of every feature, implementation status, and UI capabilities.
- **[Product Vision & Mission](./vision.md)** — Core mission, target audience, cognitive pillars, and design philosophy.
- **[Project Roadmap](./roadmap.md)** — Completed v1.2.0 milestone, active in-development modules, planned roadmap, and future AI vision.
- **[Frontend Progress & Design Tokens](./Frontend_Progress.md)** — Frontend engineering progress and Obsidian design tokens.
- **[Changelog](../CHANGELOG.md)** — Release notes and engineering milestones from v1.0.0 through v1.2.x.
- **[Contributing Guidelines](../CONTRIBUTING.md)** — How to fork, branch, test, commit, and submit pull requests to SynapseOS.

---

### 5. 📜 Engineering History & Journals
- **[Developer Journal](./development/developer-journal.md)** — Comprehensive chronological engineering journal and learning log by project creator.
- **[Milestone Checklist](./development/milestone.md)** — Granular feature milestone checklist from initial foundation to v1.2.x.
- **[Bug Fix Log](./development/bug-fixed.md)** — Historical diagnostic and bug resolution log across all development phases.
- **[Production Readiness Audit Fixes](./bug-fixes.md)** — Diagnostic report and fixes from the v1.2.0 production readiness audit.
- **[Learning Notes](./Learning/learning.md)** — Foundational web development and database concepts reference notes.

---

## ⚡ Quick Architecture Overview

```text
┌─────────────────────────────────────────────────────────┐
│                    React 19 Frontend                    │
│    (Vite 8 • React Router v7 • Axios • Recharts)        │
│                Hosted on Vercel Edge                    │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            │ Authorization: Bearer <JWT>
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Express 5 Backend                     │
│    (Node.js • MVC Architecture • Google Auth Library)   │
│                 Hosted on Render Cloud                  │
└───────────────────────────┬─────────────────────────────┘
                            │
                            │ TLS 1.3 / MySQL Protocol
                            │ Parameterized SQL Queries
                            ▼
┌─────────────────────────────────────────────────────────┐
│                 Aiven Cloud MySQL 8                     │
│    (14 Relational Tables • Foreign Keys • Cascades)     │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 Need Help or Want to Contribute?

- Read our **[Contributing Guidelines](../CONTRIBUTING.md)** before submitting pull requests.
- Explore the **[Local Setup Guide](./development/setup.md)** to spin up your local environment in minutes.
- Check open issues and discussions on **[GitHub](https://github.com/Shubh-938croton/SynapseOS)**.
