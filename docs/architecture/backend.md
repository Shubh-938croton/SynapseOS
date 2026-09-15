# ⚙️ SynapseOS Backend Architecture

## 1. Overview & Framework

The SynapseOS backend is built on **Node.js** and **Express 5** using CommonJS module architecture. It operates as a stateless REST API layer that mediates between the React frontend client and the Aiven MySQL database.

The backend is structured strictly following the **3-Tier Model-View-Controller (MVC)** architectural pattern, enforcing clear separation of concerns across routing, authentication, business orchestration, and database access.

---

## 2. Directory Layout & Module Structure

```text
backend/
├── src/
│   ├── config/
│   │   └── database.js             # MySQL2 connection pool & SSL configuration
│   ├── controllers/                # Business logic, request validation & HTTP response formatting
│   │   ├── analyticsController.js
│   │   ├── authController.js
│   │   ├── calendarController.js
│   │   ├── contestController.js
│   │   ├── dashboardController.js
│   │   ├── goalController.js
│   │   ├── noteController.js
│   │   ├── notificationController.js
│   │   ├── pomodoroController.js
│   │   ├── settingsController.js
│   │   ├── studySessionController.js
│   │   ├── subjectController.js
│   │   ├── taskController.js
│   │   ├── userController.js
│   │   └── youtubeController.js
│   ├── middleware/                 # Cross-cutting concerns
│   │   ├── authMiddleware.js       # JWT extraction, verification & req.user injection
│   │   └── errorHandler.js         # Centralized error handler & status formatting
│   ├── models/                     # Data access layer executing parameterized SQL queries
│   │   ├── analyticsModel.js
│   │   ├── authModel.js
│   │   ├── calendarModel.js
│   │   ├── contestModel.js
│   │   ├── dashboardModel.js
│   │   ├── goalModel.js
│   │   ├── noteModel.js
│   │   ├── notificationModel.js
│   │   ├── pomodoroModel.js
│   │   ├── settingsModel.js
│   │   ├── studySessionModel.js
│   │   ├── subjectModel.js
│   │   ├── taskModel.js
│   │   └── userModel.js
│   ├── routes/                     # REST endpoint definitions & middleware bindings
│   │   ├── analyticsRoutes.js
│   │   ├── authRoutes.js
│   │   ├── calendarRoutes.js
│   │   ├── contestRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── noteRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── pomodoroRoutes.js
│   │   ├── settingsRoutes.js
│   │   ├── studySessionRoutes.js
│   │   ├── subjectRoutes.js
│   │   ├── taskRoutes.js
│   │   ├── userRoutes.js
│   │   └── youtubeRoutes.js
│   ├── app.js                      # Express app setup, CORS, JSON parser & route mounts
│   └── server.js                   # Server entrypoint, port binding & lifecycle management
├── package.json
└── .env.example
```

---

## 3. Layered Responsibilities

```text
HTTP Request (Client)
         │
         ▼
┌──────────────────┐
│  Routes Layer    │  Maps URL & HTTP verb to middleware and controller action
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Middleware Layer │  Verifies JWT signature, enforces CORS, parses JSON body
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Controller Layer │  Validates inputs, executes domain logic, formats HTTP response
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Model Layer    │  Constructs and runs parameterized SQL queries against MySQL
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Database Layer  │  MySQL engine persists data with ACID guarantees & FK cascades
└──────────────────┘
```

### 1. Routes (`routes/*Routes.js`)
- Define HTTP route paths and methods (`GET`, `POST`, `PUT`, `DELETE`).
- Mount security middleware (`authMiddleware.verifyToken`) on protected endpoints.
- Route incoming requests to the appropriate controller method.

### 2. Middleware (`middleware/`)
- `authMiddleware.js`: Extracts the Bearer token from the `Authorization` header, verifies the cryptographic signature with `JWT_SECRET`, extracts `{ userId, email }`, and attaches it to `req.user`. If invalid or expired, immediately terminates the request with `401 Unauthorized`.
- `errorHandler.js`: Intercepts unhandled errors, logs diagnostic information server-side, and returns a sanitized JSON response `{ error: "..." }` with status `500` (or the specified error code).

### 3. Controllers (`controllers/*Controller.js`)
- Extract request parameters from `req.body`, `req.params`, `req.query`, and `req.user`.
- Perform business validation (e.g., verifying date formats, checking non-empty titles).
- Invoke one or more model methods to fetch or mutate data.
- Return structured HTTP responses with standardized status codes (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Internal Server Error`).

### 4. Models (`models/*Model.js`)
- Directly interact with the database via the connection pool.
- Write strict, parameterized SQL queries using placeholders (`?`) to guarantee absolute protection against SQL Injection.
- Return raw data rows or affected row counts back to the controller.

---

## 4. Database Connection & Pooling

The database layer is managed through `config/database.js` using `mysql2`:

```javascript
require("dotenv").config();
const fs = require("fs");
const mysql = require("mysql2");

const sslCa = process.env.DB_SSL_CA
    ? process.env.DB_SSL_CA
    : fs.readFileSync(process.env.DB_SSL_CA_PATH, "utf8");

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "synapseos",
    ssl: {
        ca: sslCa,
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
```

### Connection Characteristics:
- **Connection Pooling:** Maintains an active pool of up to 10 reusable connections (`connectionLimit: 10`) to handle concurrent requests efficiently.
- **SSL/TLS Encryption:** Fully supports SSL-enabled MySQL (e.g., Aiven Cloud MySQL) through the CA certificate. In local development, `DB_SSL_CA_PATH` specifies the file path on disk (e.g. `D:/Test/ca.pem`), while in cloud environments like Render, `DB_SSL_CA` can supply the raw certificate string directly without needing a physical file on disk.

---

## 5. Active Route Mounts

The Express application mounts 15 core routes in `app.js`:

| Prefix | Router Module | Description | Protected? |
| :--- | :--- | :--- | :---: |
| `/api/auth` | `authRoutes.js` | Register, login, and Google OAuth 2.0 | No |
| `/api/users` | `userRoutes.js` | Profile read/update, password change | Yes |
| `/api/subjects` | `subjectRoutes.js` | Subject CRUD and color management | Yes |
| `/api/tasks` | `taskRoutes.js` | Task CRUD, status toggling, subject filtering | Yes |
| `/api/notes` | `noteRoutes.js` | Note CRUD, pinning, markdown content | Yes |
| `/api/calendar` | `calendarRoutes.js` | Calendar event CRUD, date-based scheduling | Yes |
| `/api/goals` | `goalRoutes.js` | Goal tracking, progress updates (0-100%) | Yes |
| `/api/study-sessions` | `studySessionRoutes.js` | Study session logging, automatic duration | Yes |
| `/api/pomodoro` | `pomodoroRoutes.js` | Pomodoro session history and audit logs | Yes |
| `/api/dashboard` | `dashboardRoutes.js` | Aggregate productivity metrics and summaries | Yes |
| `/api/contests` | `contestRoutes.js` | Coding contest tracking and status updates | Yes |
| `/api/analytics` | `analyticsRoutes.js` | Histograms, subject distributions, scores | Yes |
| `/api/notifications` | `notificationRoutes.js` | In-app notification alerts and read flags | Yes |
| `/api/settings` | `settingsRoutes.js` | Theme preferences, Pomodoro durations | Yes |
| `/api/youtube` | `youtubeRoutes.js` | YouTube Data API v3 proxy and search | Yes |
| `/health` | `app.js` | Server uptime and health check probe | No |

---

## 6. Security Implementation

1. **Password Hashing:** Passwords are never stored in plaintext. `bcrypt` hashes passwords with 10 salt rounds during registration and verifies them using `bcrypt.compare` upon login.
2. **Parameterized SQL Queries:** Every database interaction strictly uses prepared statements (`db.query('SELECT ... WHERE user_id = ?', [userId])`).
3. **CORS Whitelisting:** The CORS configuration dynamically validates the origin against `process.env.CORS_ORIGIN`, preventing unauthorized cross-origin requests.
4. **Credential Isolation:** No tokens, API keys, or secrets are hardcoded in source files. Everything is read from environment variables.
