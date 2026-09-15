# SynapseOS Bug Fixes & Diagnostic Documentation

**Date:** August 2026  
**Status:** Resolved  
**Scope:** Backend MVC, Database Connectivity, Frontend Routes, Components, Field Mappings, and Navigation

---

## Overview

During a comprehensive inspection of the SynapseOS codebase, several critical bugs, security vulnerabilities, field mismatches, routing disconnections, and missing components were identified and resolved. This document details each bug, its root cause, impact, and the resolution applied.

---

## 1. Study Session Update Server Crash & Argument Mismatch

* **Category:** Runtime Crash / API Error
* **Impact:** Critical — calling `PUT /api/study-sessions/:id` threw `TypeError: callback is not a function` and caused request failure.
* **Affected Files:**
  - `backend/src/controllers/studySessionController.js`
  - `backend/src/models/studySessionModel.js`
* **Root Cause:** 
  In `studySessionController.js`, `updateStudySession` passed a single `session` object `(session, callback)`:
  ```javascript
  studySessionModel.updateStudySession(session, (err, result) => { ... })
  ```
  However, `studySessionModel.js` expected 9 individual positional arguments:
  ```javascript
  const updateStudySession = (userId, sessionId, subjectId, topic, startTime, endTime, durationMinutes, sessionNotes, callback) => { ... }
  ```
  As a result, `userId` received the `session` object, `sessionId` received the callback function, and `callback` was `undefined`.
* **Resolution:** 
  Updated `createStudySession` and `updateStudySession` in `studySessionModel.js` to support both object input `(session, callback)` and positional arguments dynamically, preventing crashes and ensuring reliable updates.

---

## 2. Study Session Frontend Field Mapping Mismatch

* **Category:** UI Data Display Bug
* **Impact:** Medium — Study session cards always displayed the fallback title `"Study Session"` instead of the session topic, and session notes were never shown.
* **Affected File:**
  - `frontend/src/pages/StudySessions/StudySessions.jsx`
* **Root Cause:**
  `StudySessions.jsx` accessed `session.title` and `session.description`, while the MySQL schema and backend API return `topic` and `session_notes`.
* **Resolution:**
  Updated `StudySessions.jsx` to render `session.topic || session.title || "Study Session"` and `(session.session_notes || session.description)`.

---

## 3. Insecure Task Operations (Missing User Scoping)

* **Category:** Security / Multi-Tenant Isolation
* **Impact:** High — Authenticated users could read, update, or delete tasks belonging to other users simply by supplying a target `task_id`.
* **Affected Files:**
  - `backend/src/models/taskModel.js`
  - `backend/src/controllers/taskController.js`
* **Root Cause:**
  Queries in `taskModel.js` for `getTaskById`, `updateTask`, and `deleteTask` filtered solely by `WHERE task_id = ?` without checking `AND user_id = ?`.
* **Resolution:**
  - Updated `taskController.js` to extract `user_id = req.user.user_id` from the JWT token and pass it to all task model operations.
  - Updated `taskModel.js` queries (`getTaskById`, `updateTask`, `deleteTask`) to enforce `WHERE task_id = ? AND user_id = ?`.

---

## 4. Missing Register Page UI

* **Category:** Missing Core Feature
* **Impact:** High — Users could not sign up for SynapseOS through the web interface because `Register.jsx` was an empty 9-line stub.
* **Affected Files:**
  - `frontend/src/pages/Register/Register.jsx`
  - `frontend/src/pages/Register/Register.css`
* **Root Cause:**
  The registration frontend was never implemented even though the backend `/api/auth/register` endpoint was fully functional.
* **Resolution:**
  Implemented a full, responsive Register UI component matching the styling and animations of `Login.jsx`. Included inputs for Full Name, Username, Email, Password, and Confirm Password, client-side validation, error/success messaging, integration with `authService.registerUser`, and automatic redirect to `/login`.

---

## 5. Coding Contests Route Disconnection & Import Errors

* **Category:** Frontend Routing & Component Disconnection
* **Impact:** High — Navigating to `/contests` bypassed the full Contests management page, and `Contests.jsx` had a broken import that caused build failure.
* **Affected Files:**
  - `frontend/src/routes/AppRoutes.jsx`
  - `frontend/src/pages/Contests/Contests.jsx`
  - `frontend/src/pages/Contests/Contest.css`
* **Root Cause:**
  1. `AppRoutes.jsx` directly mounted `ContestList` instead of `Contests.jsx`.
  2. `Contests.jsx` imported `../../components/Contest/ContestModal` (which does not exist; the actual file is `AddContestModal.jsx`).
  3. `Contests.jsx` imported `./Contests.css` instead of `./Contest.css`.
* **Resolution:**
  - Fixed `AddContestModal` and `Contest.css` imports in `Contests.jsx`.
  - Configured `AddContestModal` conditional rendering with proper callback hooks.
  - Updated `AppRoutes.jsx` to mount `Contests` on `/contests`.

---

## 6. Sidebar Full Page Reloads & Missing Contests Navigation

* **Category:** UX & SPA Navigation Architecture
* **Impact:** Medium — Clicking any navigation link in the sidebar forced a complete page reload and reset application context state. The Contests page was also missing from the sidebar.
* **Affected File:**
  - `frontend/src/components/Sidebar/Sidebar.jsx`
* **Root Cause:**
  `Sidebar.jsx` used HTML `<a>` tags instead of React Router's `<NavLink>`.
* **Resolution:**
  - Replaced all `<a>` tags with `<NavLink to="...">` for fast, client-side SPA navigation.
  - Added the **Contests** (`/contests`) navigation link with trophy icon (`FaTrophy`).
  - Active tab highlighting is automatically maintained by React Router and existing CSS.

---

## 7. Database Connection Upgraded to Connection Pool

* **Category:** Reliability & Scalability
* **Impact:** Medium — A single MySQL connection (`mysql.createConnection`) drops after idle timeouts and cannot handle concurrent user requests.
* **Affected File:**
  - `backend/src/config/database.js`
* **Root Cause:**
  Single connection driver was used instead of a managed connection pool.
* **Resolution:**
  Upgraded to `mysql.createPool({ connectionLimit: 10, waitForConnections: true, queueLimit: 0 })` while preserving the exact `query(sql, values, callback)` signature used by models.

---

## 8. SummaryCard Component Import Casing

* **Category:** Cross-Platform Build Bug
* **Impact:** Low on Windows, Breaking on Linux/CI environments.
* **Affected File:**
  - `frontend/src/pages/Dashboard/Dashboard.jsx`
* **Root Cause:**
  Directory name on disk is `Summarycard` (lowercase `c`), but `Dashboard.jsx` imported from `../../components/SummaryCard/SummaryCard`.
* **Resolution:**
  Updated import path to `../../components/Summarycard/SummaryCard`.

---

## 9. Global Error Handler Middleware Implemented

* **Category:** Error Handling & Resilience
* **Impact:** Low-Medium — Unhandled asynchronous or synchronous errors could crash the Node.js process.
* **Affected Files:**
  - `backend/src/middleware/errorHandler.js`
  - `backend/src/app.js`
* **Root Cause:**
  `backend/src/middleware/errorHandler.js` was a 0-byte empty file and was never mounted in `app.js`.
* **Resolution:**
  Implemented Express 4-parameter error-handling middleware in `errorHandler.js` and mounted it at the end of `app.js`.

---

---

## 10. Google OAuth User Provisioning & Password Constraint Handling

* **Category:** Authentication / Database Schema Compatibility
* **Impact:** Critical — Google sign-in attempts for new users threw MySQL `ER_BAD_NULL_ERROR: Column 'password_hash' cannot be null`.
* **Affected Files:**
  - `backend/src/models/authModel.js`
  - `backend/src/controllers/authController.js`
* **Root Cause:**
  The `users` table requires `password_hash NOT NULL`. Google OAuth users do not supply passwords.
* **Resolution:**
  - Generated a cryptographically secure random 32-byte string on user creation.
  - Hashed the random secret with `bcrypt` (10 rounds) before inserting via `registerGoogleUser`.
  - Allowed seamless user creation while preserving database integrity.

---

## 11. Google Identity Services (GIS) Frontend Integration & Token Verification

* **Category:** Authentication / Third-Party Integration
* **Impact:** High — "Continue with Google" button on Login and Register pages was a non-functioning UI placeholder.
* **Affected Files:**
  - `frontend/src/services/googleAuth.js`
  - `frontend/src/services/authService.js`
  - `frontend/src/pages/Login/Login.jsx`
  - `frontend/src/pages/Register/Register.jsx`
  - `backend/src/controllers/authController.js`
  - `backend/src/routes/authRoutes.js`
* **Root Cause:**
  Google Sign-In was neither wired to Google's Identity Services SDK on the frontend nor supported with a token verification endpoint on the backend.
* **Resolution:**
  - Integrated `google-auth-library` on the backend and added `POST /api/auth/google`.
  - Built `frontend/src/services/googleAuth.js` with dynamic GIS SDK injection and interactive token popup handling.
  - Connected loading indicators, error toast notifications, and automatic redirect to `/dashboard`.

---

## 12. Security Remediation — Phase 1

* **Category:** Security Hardening & Vulnerability Mitigation
* **Date:** September 2026
* **Status:** Resolved & Verified
* **Scope:** Rate Limiting, HTTP Security Headers, Account Enumeration, Error Sanitization, URL Scheme Validation, CORS Hardening, Dependency Fixes

### Overview of Phase 1 Remediations

Following the comprehensive SynapseOS security audit, a targeted Phase 1 security remediation was implemented across the backend server and frontend client:

1. **Express Rate Limiting:**
   - Integrated `express-rate-limit` middleware in `backend/src/middleware/rateLimiter.js`.
   - Applied `authRateLimiter` (15 requests per 15 minutes window) to sensitive authentication endpoints:
     - `POST /api/auth/login`
     - `POST /api/auth/register`
     - `POST /api/auth/google`
   - Applied `youtubeRateLimiter` (60 requests per 15 minutes window) to external API proxy endpoints:
     - `GET /api/youtube/search`
     - `GET /api/youtube/video/:id`
   - Configured custom HTTP 429 JSON response: `{ "message": "Too many requests. Please try again later." }`.
   - Kept `/health` unrestricted for cloud health probes.

2. **HTTP Security Headers & Server Fingerprint Obfuscation:**
   - Integrated `helmet` middleware in `backend/src/app.js` with cross-origin policies configured for Google OAuth popups (`crossOriginResourcePolicy: { policy: "cross-origin" }`, `crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }`).
   - Disabled Express server fingerprinting via `app.disable("x-powered-by")`.
   - Verified headers returned: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Strict-Transport-Security`.

3. **CORS Hardening:**
   - Updated `backend/src/app.js` CORS configuration to disallow wildcard `*` reflection when `credentials: true` is enabled.
   - Enforced strict origin matching against configured whitelist (`CORS_ORIGIN`).
   - Updated global error handler `backend/src/middleware/errorHandler.js` to return a clean `403 Forbidden` (`{ "error": "CORS request rejected: Origin not allowed" }`) when unauthorized origins attempt access.

4. **Login Account Enumeration Protection:**
   - Modified `backend/src/controllers/authController.js` `loginUser` method to return uniform `HTTP 401 Unauthorized` with `{ "message": "Invalid email or password" }` regardless of whether the email is unregistered or the password is incorrect.
   - Eliminates username/email enumeration vulnerabilities.

5. **Controller 500 Error Sanitization:**
   - Standardized error handling across all 15 backend controllers:
     - `authController.js`, `userController.js`, `subjectController.js`, `taskController.js`, `noteController.js`, `calendarController.js`, `goalController.js`, `studySessionController.js`, `pomodoroController.js`, `contestController.js`, `dashboardController.js`, `analyticsController.js`, `notificationController.js`, `settingsController.js`, `youtubeController.js`.
   - Eliminated leaking internal database error messages, raw SQL queries, and stack traces (`error: err.message`) to clients.
   - Preserved `console.error` server-side logging for debugging and cloud monitoring.

6. **Contest URL Protocol Validation & Target Blank Hardening:**
   - Added regex and URL protocol validation (`^https?://`) in `backend/src/controllers/contestController.js` (`isValidContestUrl`).
   - Added frontend validation in `frontend/src/components/Contest/AddContestModal.jsx` before dispatching requests.
   - Verified `rel="noopener noreferrer"` attribute on external links in `frontend/src/components/Contest/ContestList.jsx` to prevent tab-nabbing and reverse tab-jacking.

7. **Frontend Transitive Dependency Vulnerability Mitigation:**
   - Executed `npm audit fix` in `frontend/` to upgrade `nanoid` from `3.3.17` to `3.3.19` (resolving DoS advisory `GHSA-2v37-7h3g-55p8`).
   - Confirmed 0 remaining vulnerabilities in frontend and backend dependency trees.
   - Verified clean production build (`npm run build`).

8. **Token Lifecycle & HttpOnly Cookie Migration Documentation:**
   - Documented token generation, expiration (`JWT_EXPIRES_IN`), authorization bearer transmission, client state synchronization, and the step-by-step roadmap for migrating from `localStorage` to `HttpOnly` / `SameSite=Strict` cookies in `docs/architecture/authentication.md`.

---

## Summary of Modified & Created Files

| File | Type | Changes |
| :--- | :--- | :--- |
| `backend/package.json` | Modify | Added `express-rate-limit` and `helmet` dependencies |
| `backend/src/middleware/rateLimiter.js` | New | Rate limiting middleware for auth (15/15m) and YouTube (60/15m) |
| `backend/src/app.js` | Modify | Added Helmet, disabled `x-powered-by`, hardened CORS, attached rate limiters |
| `backend/src/middleware/errorHandler.js` | Modify | Added CORS rejection handling (403) and sanitized 500 responses |
| `backend/src/controllers/authController.js` | Modify | Unified 401 login error responses and sanitized catch blocks |
| `backend/src/controllers/userController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/subjectController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/taskController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/noteController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/calendarController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/goalController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/studySessionController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/pomodoroController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/contestController.js` | Modify | Added `isValidContestUrl` protocol validation & sanitized errors |
| `backend/src/controllers/dashboardController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/analyticsController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/notificationController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/settingsController.js` | Modify | Sanitized 500 error responses |
| `backend/src/controllers/youtubeController.js` | Modify | Sanitized 500 error responses |
| `frontend/src/components/Contest/AddContestModal.jsx` | Modify | Enforced `http:`/`https:` protocol validation before submit |
| `frontend/src/components/Contest/ContestList.jsx` | Modify | Verified `rel="noopener noreferrer"` on external link targets |
| `frontend/package-lock.json` | Modify | Upgraded `nanoid` to 3.3.19 (0 vulnerabilities) |
| `docs/bug-fixes.md` | Modify | Documented Phase 1 Security Remediations and audit fixes |
| `docs/security-audit.md` | Modify | Updated vulnerability findings matrix to reflect Phase 1 resolutions |
| `docs/architecture/authentication.md` | Modify | Documented token lifecycle and HttpOnly cookie migration path |

