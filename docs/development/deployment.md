# 🚀 SynapseOS Production Deployment & Cloud Operations

## 1. Production Architecture Overview

SynapseOS is engineered for cloud-native deployment across three specialized managed cloud providers:

| Layer | Provider | Service Type | Deployment Mechanism |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel** | Edge Static / SPA Hosting | Automated Git deployments with edge caching |
| **Backend** | **Render** | Managed Web Service | Continuous deployment from main branch |
| **Database** | **Aiven** | Managed Cloud MySQL 8 | Cloud-hosted MySQL with SSL/TLS encryption |

---

## 2. Environment Variables Matrix

### A. Frontend Variables (Vercel)

| Variable Name | Required? | Safe to Expose? | Purpose |
| :--- | :---: | :---: | :--- |
| `VITE_API_URL` | **Yes** | Yes (Client-side) | Full URL of deployed Render backend API (`https://your-backend.onrender.com/api`) |
| `VITE_GOOGLE_CLIENT_ID` | Optional | Yes (Public Client ID) | Google OAuth 2.0 Web Client ID for Google Identity Services popup |

---

### B. Backend Variables (Render)

| Variable Name | Required? | Must Remain Secret? | Purpose |
| :--- | :---: | :---: | :--- |
| `PORT` | Optional | No | Server listen port (Render injects automatically; defaults to 5000) |
| `CORS_ORIGIN` | **Yes** | No | Comma-delimited list of allowed origins (e.g., `https://synapse-os-kappa.vercel.app`) |
| `DB_HOST` | **Yes** | Yes | Hostname of the Aiven MySQL server (`mysql-xxxx.aivencloud.com`) |
| `DB_PORT` | Optional | No | MySQL port (e.g., `12345`; defaults to `3306`) |
| `DB_USER` | **Yes** | Yes | Database username (e.g., `avnadmin`) |
| `DB_PASSWORD` | **Yes** | **YES (Critical)** | Aiven database password |
| `DB_NAME` | **Yes** | No | Target database schema (`synapseos` or `defaultdb`) |
| `DB_SSL_CA` | **Yes** (Production/Render) | Yes | Raw content of the Aiven `ca.pem` certificate string |
| `DB_SSL_CA_PATH`| **Yes** (Local SSL) | No | File path to local `ca.pem` (e.g., `D:/Test/ca.pem`) when `DB_SSL_CA` is omitted |
| `JWT_SECRET` | **Yes** | **YES (Critical)** | 256-bit cryptographically random signing secret (>= 32 characters) |
| `JWT_EXPIRES_IN` | Optional | No | JWT validity duration (e.g. `7d`) |
| `GOOGLE_CLIENT_ID`| Optional | No | Google OAuth Client ID for server-side token validation |
| `YOUTUBE_API_KEY` | Optional | **YES (Critical)** | Google Cloud API key for YouTube Data API v3 proxy |

---

## 3. Database Deployment (Aiven Cloud MySQL)

1. Provision an **Aiven MySQL** service.
2. Download the service `ca.pem` certificate from the Aiven Console.
3. For cloud deployment on **Render**, set the `DB_SSL_CA` environment variable to the raw text content of your `ca.pem` certificate file.
4. For local development, set `DB_SSL_CA_PATH` to the absolute file path of `ca.pem` on your local system.
5. Connect to Aiven MySQL using MySQL Workbench or CLI and run the migration scripts in `database/schema/v1/`.

---

## 4. Backend Deployment (Render)

1. Connect your GitHub repository to Render and create a **Web Service**.
2. Set the **Root Directory** to `backend`.
3. Set **Build Command** to `npm install`.
4. Set **Start Command** to `node src/server.js`.
5. Add all backend environment variables from the matrix above.
6. Verify deployment by probing the health check URL: `https://<your-service>.onrender.com/api/health`.

---

## 5. Frontend Deployment (Vercel)

1. Import your GitHub repository into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Set **Framework Preset** to `Vite`.
4. Set **Build Command** to `npm run build` and **Output Directory** to `dist`.
5. Add `VITE_API_URL` pointing to your Render backend URL.
6. Create a `frontend/vercel.json` rewrite file to support client-side React Router navigation:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
7. Deploy and verify the live application.
