# 🏛️ SynapseOS System Architecture Overview

## 1. System Summary

**SynapseOS** is an open-source, full-stack student productivity and academic workflow platform designed to provide a unified environment for daily organization, deep-focus study tracking, task execution, note-taking, contest tracking, and long-term goal management.

The architecture is built around three core layers:
1. **Client Tier (Frontend):** A modern Single Page Application (SPA) built with **React 19**, bundled using **Vite 8**, and deployed globally on **Vercel**.
2. **Application Tier (Backend):** A stateless RESTful API server built on **Node.js** and **Express 5**, implementing an **MVC (Model-View-Controller)** pattern, deployed on **Render**.
3. **Data Tier (Database):** A relational **MySQL 8** database hosted on **Aiven Cloud**, enforcing strict relational integrity, foreign key cascading, and user-scoped data segregation.

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
│  │  • 15 Modular Route Handlers     • Google Auth Library (OAuth)    │  │
│  │  • Business Logic Controllers    • Global Error Handling          │  │
│  └─────────────────────────────────┬─────────────────────────────────┘  │
└────────────────────────────────────┼────────────────────────────────────┘
                                     │
                                     │ TLS 1.3 / MySQL Binary Protocol
                                     │ Connection Pool (mysql2/promise)
                                     │ Parameterized SQL Queries (?)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            DATA TIER (STORAGE)                          │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                     Aiven Managed MySQL 8.x                       │  │
│  │                                                                   │  │
│  │  • 14 Relational Tables          • Foreign Key Constraints (FK)   │  │
│  │  • Cascade Deletes & Updates     • Performance B-Tree Indexes     │  │
│  │  • Encrypted Connection (SSL/TLS)• User Isolation (user_id)       │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack Breakdown

| Layer | Technology | Version | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **Frontend UI** | React | `^19.2.8` | Component-driven declarative UI library |
| **Frontend Tooling** | Vite | `^8.2.0` | Fast development server & optimized production bundler |
| **Client Routing** | React Router DOM | `^7.18.2` | Client-side routing with `ProtectedRoute` navigation guards |
| **HTTP Client** | Axios | `^1.19.0` | Promise-based HTTP client with request/response interceptors |
| **Data Visualization**| Recharts | `^3.10.1` | Declarative charting for analytics and study histograms |
| **UI Notifications** | React Toastify | `^11.1.0` | Toast notifications for async user actions |
| **Backend Runtime** | Node.js | `>=18.x` | High-performance asynchronous JavaScript server runtime |
| **Backend Framework**| Express | `^5.2.1` | REST API routing and middleware composition |
| **Database Driver** | MySQL2 | `^3.23.2` | Fast MySQL client supporting promise-based async queries & connection pooling |
| **Password Hashing**| bcrypt | `^6.0.0` | Secure cryptographic password hashing (salt rounds: 10) |
| **Authentication** | jsonwebtoken | `^9.0.3` | Cryptographically signed JSON Web Tokens for stateless session management |
| **OAuth 2.0 SDK** | google-auth-library | `^11.0.2` | Server-side verification of Google OAuth tokens |
| **Database** | MySQL | `8.x` | ACID-compliant relational database engine |
| **Cloud Hosting** | Vercel, Render, Aiven | Production | Globally distributed frontend, managed backend, and cloud database |

---

## 4. End-to-End Request Lifecycle

Every user action that reads or mutates data follows a deterministic 8-step lifecycle:

```text
[User Interaction in UI]
          │
          ▼
1. Component Event Handler invokes specialized Frontend Service (e.g. taskService.createTask)
          │
          ▼
2. Centralized Axios instance (`api.js`) intercepts request, injects `Authorization: Bearer <token>`
          │
          ▼
3. HTTPS request traverses internet to Render-hosted Express server; passes CORS middleware
          │
          ▼
4. Express Router matches endpoint and invokes `authMiddleware.verifyToken`
          │
          ▼
5. JWT is cryptographically verified with `JWT_SECRET`; `req.user = { userId, email }` attached
          │
          ▼
6. Controller executes business logic, validates input parameters and ownership
          │
          ▼
7. Model executes parameterized SQL query (`WHERE user_id = ?`) via `mysql2` connection pool
          │
          ▼
8. Database returns result set -> Model -> Controller formats standard JSON -> Client renders updated state
```

---

## 5. Architectural Principles

1. **Stateless Backend:** No session state is held in server memory. Every incoming request is authenticated via signed JWT headers, enabling seamless vertical or horizontal scaling.
2. **Multi-Tenant Data Isolation:** Every protected database query includes an explicit `user_id = ?` clause derived directly from the verified JWT, ensuring absolute isolation between users.
3. **Single Source of Truth:** Relational entities enforce normalization. Computed values (e.g., total study hours, weekly productivity histograms) are dynamically computed via optimized SQL aggregate queries rather than stored redundantly.
4. **Resilient Error Boundaries:** Centralized global error handling on the backend prevents unhandled promise rejections from crashing the Node.js process, returning predictable error payloads (`{ error: string }`) with appropriate HTTP status codes.

---

## 🔗 Detailed Architectural Deep-Dives

- ⚙️ **[Backend MVC Architecture](./backend.md)** — Express route mounts, controllers, models, and connection pooling.
- 🎨 **[Frontend SPA Architecture](./frontend.md)** — React 19 component hierarchy, services, and route guards.
- 🗄️ **[Database Architecture & Schema](./database.md)** — InnoDB tables, foreign keys, cascades, and indexes.
- 🔐 **[Authentication & Security Architecture](./authentication.md)** — JWT, bcrypt, and Google OAuth 2.0.
- 📚 **[Subject Subsystem & Lifecycle](./subjects.md)** — Organizational hierarchy and inline modal creation.
- 🏆 **[Contests & Calendar Integration](./contests-calendar.md)** — Competitive programming tracker and dynamic aggregation.
- 🔄 **[API Request & Data Flow Diagrams](./api-flow.md)** — Visual sequence flowcharts for key platform interactions.
