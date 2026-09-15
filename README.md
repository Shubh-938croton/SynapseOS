# 🧠 SynapseOS

> **A full-stack cognitive productivity and academic workflow platform engineered for students, self-directed learners, and competitive programmers.**

[![Status](https://img.shields.io/badge/status-active%20development-blue.svg)](https://github.com/Shubh-938croton/SynapseOS)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/Shubh-938croton/SynapseOS/blob/main/LICENSE)
[![React](https://img.shields.io/badge/frontend-React%2019%20%7C%20Vite%208-61dafb.svg)](https://react.dev/)
[![Node](https://img.shields.io/badge/backend-Node.js%20%7C%20Express%205-339933.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/database-MySQL%208%20%7C%20Aiven-4479a1.svg)](https://www.mysql.com/)
[![Deployment](https://img.shields.io/badge/deployment-Vercel%20%7C%20Render-black.svg)](https://vercel.com/)

🌐 **Live Application:** [https://synapse-os-kappa.vercel.app](https://synapse-os-kappa.vercel.app)  
💻 **GitHub Repository:** [https://github.com/Shubh-938croton/SynapseOS](https://github.com/Shubh-938croton/SynapseOS)  
📚 **Complete Documentation Hub:** [docs/README.md](docs/README.md)

---

## 📖 About SynapseOS

**SynapseOS** is an open-source productivity operating system designed to bring deep-work focus, structured academic planning, markdown notes, task execution, coding contest tracking, and cognitive analytics into a single cohesive workspace.

Instead of switching between disconnected tools for tasks, timers, notes, calendar schedules, and contest tracking, SynapseOS connects everything around **Subjects** — allowing students and developers to maintain momentum, measure study velocity, and build long-term consistency.

---

## ✨ Key Features

| Module | Description | Status |
| :--- | :--- | :---: |
| **📊 Command Center** | Contextual greeting, study summaries, task counters, and quick actions | ✅ Production Ready |
| **🔐 Dual Authentication** | Email/Password with bcrypt + Google OAuth 2.0 Single Sign-On | ✅ Production Ready |
| **📚 Subject Subsystem** | Course management, custom color tags, and inline modal creation | ✅ Production Ready |
| **✅ Task Engine** | Subject-scoped tasks with priority badges, deadlines, and filters | ✅ Production Ready |
| **📝 Knowledge Base** | Markdown-enabled revision notes with pinning and instant search | ✅ Production Ready |
| **🎯 Goal Tracker** | Long-term target tracking with 0–100% interactive progress meters | ✅ Production Ready |
| **📅 Smart Calendar** | Academic milestones integrated dynamically with coding contests | ✅ Production Ready |
| **⏱️ Deep Work Sessions** | Study session logger with automatic start/end duration computation | ✅ Production Ready |
| **🍅 Pomodoro Engine** | 25/5/15 focus intervals, cycle timers, and session audit history | ✅ Production Ready |
| **🏆 Contest Tracker** | LeetCode, Codeforces, CodeChef, HackerRank, and AtCoder tracking | ✅ Production Ready |
| **📈 Visual Analytics** | Day-by-day Recharts histograms, subject distribution, and productivity score | ✅ Production Ready |
| **🎥 YouTube Focus Hub** | Distraction-free educational search proxy and embedded player | ✅ Production Ready |
| **👤 Profile & Settings** | Account details, password security, dark/light theme, and timer configs | ✅ Production Ready |

---

## 🏗️ System Architecture

SynapseOS follows a modern, cloud-native 3-tier client-server architecture:

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

## 🛠️ Technology Stack

- **Frontend:** React 19, Vite 8, React Router DOM v7, Axios, Recharts, React Icons, React Toastify
- **Backend:** Node.js, Express 5, MySQL2 (Connection Pool), bcrypt (Salt rounds: 10), jsonwebtoken (JWT), google-auth-library
- **Database:** MySQL 8 (InnoDB Engine with Foreign Keys & Cascade Deletion)
- **Hosting & Infrastructure:** Vercel (Frontend), Render (Backend), Aiven Cloud (MySQL)

---

## ⚡ Quick Start Guide (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/Shubh-938croton/SynapseOS.git
cd SynapseOS
```

### 2. Start the Backend
```bash
cd backend
npm install
cp .env.example .env    # Configure your MySQL credentials and JWT_SECRET
npm run dev             # Starts on http://localhost:5000
```

### 3. Start the Frontend
```bash
cd ../frontend
npm install
cp .env.example .env    # Set VITE_API_URL=http://localhost:5000/api
npm run dev             # Starts on http://localhost:5173
```

👉 *For detailed database migration steps and cloud configuration, see the **[Local Setup Guide](docs/development/setup.md)**.*

---

## 📚 Documentation Index

Explore our comprehensive documentation suite:

- **Architecture:**
  - 🏛️ [System Architecture Overview](docs/architecture/overview.md)
  - ⚙️ [Backend MVC Architecture](docs/architecture/backend.md)
  - 🎨 [Frontend SPA Architecture](docs/architecture/frontend.md)
  - 🗄️ [Database Schema & ERD](docs/architecture/database.md)
  - 🔐 [Authentication & Security Flow](docs/architecture/authentication.md)
  - 📚 [Subject Subsystem & Lifecycle](docs/architecture/subjects.md)
  - 🏆 [Contests & Calendar Integration](docs/architecture/contests-calendar.md)
- **API Reference:**
  - 📡 [Complete REST API Specification](docs/api.md)
- **Development & Operations:**
  - 💻 [Local Setup Guide](docs/development/setup.md)
  - 🛠️ [Developer Workflow & Coding Standards](docs/development/workflow.md)
  - 🚀 [Production Deployment (Vercel, Render, Aiven)](docs/development/deployment.md)
  - 🔍 [Troubleshooting Guide](docs/development/troubleshooting.md)
- **Roadmap & Contributing:**
  - 🗺️ [Project Roadmap & AI Vision](docs/roadmap.md)
  - ✨ [Full Feature Catalog](docs/features.md)
  - 🤝 [Contributing Guidelines](CONTRIBUTING.md)
  - 📜 [Changelog](CHANGELOG.md)

---

## 🤝 Contributing

Contributions are always welcome! Please read our **[Contributing Guidelines](CONTRIBUTING.md)** before submitting pull requests.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).