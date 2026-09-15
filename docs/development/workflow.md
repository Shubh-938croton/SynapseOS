# 🛠️ SynapseOS Developer Workflow & Contribution Standards

This guide outlines the standard development patterns, safety invariants, and quality rules for contributing features and bug fixes to SynapseOS.

---

## 1. Core Engineering Invariants

When modifying or expanding the codebase, you must adhere to these core rules:

1. **Strict Multi-Tenant Scoping:** Never query or mutate user data without filtering by `user_id = ?` derived from `req.user.userId`.
2. **Parameterized SQL Queries:** Never interpolate variables into SQL strings (e.g., `` `WHERE id = ${id}` `` is forbidden). Always use prepared statement question marks (`?`).
3. **No Direct Database Calls in Controllers:** Controllers must orchestrate logic through Models. SQL queries belong exclusively in `models/*Model.js`.
4. **Decoupled Frontend Services:** Never make raw `axios.get` calls inside React components. All network requests must flow through `services/*Service.js` using the centralized `api.js` client.
5. **No Hardcoded Secrets:** Never commit `.env` files, API keys, passwords, or JWT secrets to version control.

---

## 2. End-to-End Feature Development Workflow

When implementing a new module or extending existing functionality, follow this standard pattern:

### Step 1: Database Schema Migration
1. If adding a new table or column, create a new numbered SQL script in `database/schema/v1/` (or `v2/`).
2. Include explicit foreign keys referencing `users(user_id) ON DELETE CASCADE`.
3. Add appropriate indexes in `013_indexes.sql` for query performance.

### Step 2: Backend Model (`backend/src/models/`)
1. Create or update `models/<feature>Model.js`.
2. Export async functions that accept `(userId, ...args)`.
3. Use the connection pool: `const [result] = await db.query(sql, [userId, ...args]);`.

### Step 3: Backend Controller (`backend/src/controllers/`)
1. Create or update `controllers/<feature>Controller.js`.
2. Extract `userId` from `req.user.userId`.
3. Validate request parameters and handle errors gracefully using try/catch blocks.

### Step 4: Backend Route (`backend/src/routes/`)
1. Create `routes/<feature>Routes.js`.
2. Apply `authMiddleware.verifyToken` to protected routes.
3. Mount the router in `backend/src/app.js` under `/api/<feature>`.

### Step 5: Frontend Service Layer (`frontend/src/services/`)
1. Create `services/<feature>Service.js`.
2. Export modular functions wrapping `api.get`, `api.post`, `api.put`, and `api.delete`.

### Step 6: Frontend UI Components & Page (`frontend/src/pages/`)
1. Create the page view under `frontend/src/pages/<Feature>/<Feature>.jsx`.
2. Mount the view in `frontend/src/routes/AppRoutes.jsx` wrapped inside `<ProtectedRoute>`.
3. Add the navigation item to `frontend/src/components/Sidebar/Sidebar.jsx`.

---

## 3. Local Verification & Pre-Commit Checklist

Before pushing changes or submitting a Pull Request, run the verification checklist:

1. **Verify Frontend Build:**
   ```bash
   cd frontend
   npm run build
   ```
   *Confirm the build completes with zero errors.*

2. **Verify Backend Health:**
   ```bash
   cd backend
   node -e "require('./src/app')"
   ```
   *Confirm all routes and controllers load without syntax or import errors.*

3. **Check Secret Isolation:**
   - Verify that `.env` is listed in `.gitignore` and no private keys or tokens are staged in git.
