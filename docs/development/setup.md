# 💻 SynapseOS Local Development & Setup Guide

This guide walks you through setting up a complete, working local development environment for **SynapseOS** from scratch.

---

## 1. Prerequisites & System Requirements

Before beginning, ensure your workstation has the following installed:

| Requirement | Minimum Version | Recommended | Notes |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.x LTS` or higher | JavaScript server runtime |
| **npm** | `v9.0.0` | `v10.x` or higher | Package manager |
| **MySQL Server** | `v8.0` | `v8.0+` or Aiven Cloud | Relational database engine |
| **Git** | `v2.30+` | Latest | Version control |

---

## 2. Clone the Repository

```bash
git clone https://github.com/Shubh-938croton/SynapseOS.git
cd SynapseOS
```

---

## 3. Database Initialization (MySQL)

You can use either a **local MySQL Server** or a cloud instance such as **Aiven MySQL**.

### Option A: Local MySQL Server
1. Log into your MySQL CLI:
   ```bash
   mysql -u root -p
   ```
2. Execute the schema migration scripts located in `database/schema/v1/` in order:
   ```sql
   SOURCE database/schema/v1/001_create_database.sql;
   SOURCE database/schema/v1/002_users.sql;
   SOURCE database/schema/v1/003_subjects.sql;
   SOURCE database/schema/v1/004_tasks.sql;
   SOURCE database/schema/v1/005_notes.sql;
   SOURCE database/schema/v1/006_calendar_events.sql;
   SOURCE database/schema/v1/007_goals.sql;
   SOURCE database/schema/v1/008_study_sessions.sql;
   SOURCE database/schema/v1/010_pomodoro_sessions.sql;
   SOURCE database/schema/v1/011_contests.sql;
   SOURCE database/schema/v1/012_settings.sql;
   SOURCE database/schema/v1/013_indexes.sql;
   SOURCE database/schema/v1/0014_notifications.sql;
   ```

---

## 4. Backend Configuration & Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create your local `.env` file from the provided template:
   ```bash
   cp .env.example .env
   ```
4. Populate `backend/.env` with your environment values:
   ```env
   # Server Configuration
   PORT=5000
   CORS_ORIGIN=http://localhost:5173

   # Database Configuration (MySQL)
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=synapseos

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com

   # YouTube Data API Configuration
   YOUTUBE_API_KEY=your_youtube_api_key_here

   # Database SSL CA Certificate Path (Local development with SSL MySQL / Aiven)
   DB_SSL_CA_PATH=D:/Test/ca.pem
   ```
   > **Note on Database SSL:** When connecting locally to an SSL-enabled MySQL instance (such as Aiven Cloud MySQL), set `DB_SSL_CA_PATH` to the absolute file path of your `ca.pem` certificate.
5. Start the backend development server (with auto-reload via `nodemon`):
   ```bash
   npm run dev
   ```
   *The backend should output: `Server running on port 5000` and `Database connected successfully`.*

---

## 5. Frontend Configuration & Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create your local `.env` file:
   ```bash
   cp .env.example .env
   ```
4. Populate `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id.apps.googleusercontent.com
   ```
5. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *Vite will start at: `http://localhost:5173`.*

---

## 6. Verification Checklist

After launching both servers:
1. Open your browser and navigate to `http://localhost:5000/api/health` — it should return `{"status":"ok"}`.
2. Open `http://localhost:5173` — the SynapseOS Login page should render cleanly with dark theme styling.
3. Click **"Sign up"** to register a new local user account.
4. Verify that you are redirected to the **Dashboard** and that task/subject creation succeeds.
