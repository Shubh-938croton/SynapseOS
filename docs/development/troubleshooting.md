# 🔍 SynapseOS Troubleshooting & Issue Resolution Guide

This guide details common development, connection, and runtime issues encountered during local development and cloud deployment, along with step-by-step diagnostic and resolution procedures.

---

## 1. Cross-Origin Resource Sharing (CORS) Errors

### Symptoms:
- Browser console displays: `Access to XMLHttpRequest at 'http://localhost:5000/api/tasks' from origin 'http://localhost:5173' has been blocked by CORS policy`.
- API calls fail with status code `0` or Network Error.

### Root Cause:
The backend `CORS_ORIGIN` environment variable does not match the exact origin URL (protocol + domain + port) of the frontend client.

### Solution:
1. Check `backend/.env`:
   ```env
   # Ensure exact match (no trailing slash)
   CORS_ORIGIN=http://localhost:5173
   ```
2. In production (Render), ensure `CORS_ORIGIN` contains your production Vercel domain:
   ```env
   CORS_ORIGIN=https://synapse-os-kappa.vercel.app
   ```
3. Multiple origins can be separated by commas (e.g. `http://localhost:5173,https://synapse-os-kappa.vercel.app`).

---

## 2. Aiven Cloud MySQL SSL / TLS Connection Errors

### Symptoms:
- Backend crashes on startup with: `Error: ENOENT: no such file or directory` or `HANDSHAKE_SSL_ERROR`.

### Root Cause:
Aiven Cloud requires an explicit Certificate Authority (CA) certificate to establish secure TLS connections, and the certificate was either not found at `DB_SSL_CA_PATH` or not provided in `DB_SSL_CA`.

### Solution:
1. **For Local Development:**
   - Download `ca.pem` from the Aiven Console to your computer (e.g., `D:/Test/ca.pem`).
   - In `backend/.env`, set:
     ```env
     DB_SSL_CA_PATH=D:/Test/ca.pem
     ```
   - Verify the path exists and is readable by your Node.js process.
2. **For Cloud Production (Render):**
   - Open `ca.pem` in a text editor and copy the entire certificate content.
   - In Render Dashboard -> Environment -> Add Environment Variable:
     - **Key:** `DB_SSL_CA`
     - **Value:** `<paste raw ca.pem certificate text>`
   - `backend/src/config/database.js` will automatically detect `process.env.DB_SSL_CA` and use it directly.

---

## 3. Port Conflict (`EADDRINUSE: :::5000`)

### Symptoms:
- `npm run dev` fails with: `Error: listen EADDRINUSE: address already in use :::5000`.

### Root Cause:
A previous instance of the Node.js backend server is still running in the background.

### Solution:
- **On Windows:**
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```
- **On Linux/macOS:**
  ```bash
  npx kill-port 5000
  ```

---

## 4. Expired or Invalid JWT Tokens (`401 / 403`)

### Symptoms:
- Navigation redirects back to `/login` immediately.
- Requests fail with `{ "error": "Invalid or expired token." }`.

### Solution:
1. Clear browser local storage:
   - Open Developer Tools (`F12`) -> **Application** tab -> **Local Storage** -> Clear `token` and `user`.
2. Log in again with fresh credentials to issue a new valid JWT token.

---

## 5. React Router 404 Errors on Production Page Refresh (Vercel)

### Symptoms:
- Directly visiting `/tasks` or refreshing any page on Vercel returns `404 NOT_FOUND`.

### Root Cause:
Vercel is attempting to locate a physical `/tasks/index.html` file on the edge server rather than passing the route to the React SPA router.

### Solution:
Ensure `frontend/vercel.json` exists with the rewrite rule:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 6. Calendar & Contest Timezone Offset Inaccuracies

### Symptoms:
- A contest scheduled for 8:00 AM on Sept 21 renders on Sept 20 in the calendar grid.

### Root Cause:
JavaScript's `Date.prototype.toISOString()` or timezone parsing shifted the date across the midnight boundary.

### Solution:
Ensure date normalizers extract local calendar year, month, and day strings consistently using local date formatters rather than raw UTC splits.
