# 🚀 SynapseOS Production Deployment Guide

This guide provides step-by-step instructions for deploying SynapseOS across production cloud infrastructure:
- **Frontend SPA**: Vercel (React 18 + Vite)
- **Backend API**: Render (Node.js + Express)
- **Database**: Aiven (Cloud MySQL 8.0)
- **Repository**: GitHub

---

## 1. Architecture Overview

```
                      ┌────────────────────────────────────────┐
                      │             Vercel CDN                 │
                      │  https://synapseos.vercel.app          │
                      │  (React 18 / Vite Client Bundle)       │
                      └───────────────────┬────────────────────┘
                                          │
                                   HTTPS  │  JWT Bearer Auth
                                          ▼
                      ┌────────────────────────────────────────┐
                      │             Render Cloud               │
                      │  https://synapseos-api.onrender.com    │
                      │  (Node.js 20+ / Express REST API)      │
                      └───────────────────┬────────────────────┘
                                          │
                                  TLS/SSL │  Keep-Alive Pool
                                          ▼
                      ┌────────────────────────────────────────┐
                      │             Aiven MySQL                │
                      │  MySQL 8.0 Managed Database Cluster    │
                      └────────────────────────────────────────┘
```

---

## 2. Step 1: Provision & Initialize Aiven MySQL Database

1. **Create Aiven MySQL Service**:
   - Log into [Aiven Console](https://console.aiven.io/).
   - Create a new **MySQL** service (MySQL 8.0+, Startup or Business plan).
   - Select cloud region (e.g. AWS `ap-south-1` or Google Cloud `asia-south1`).
2. **Retrieve Connection Details**:
   - Hostname (e.g. `mysql-xxxx-xxxx.aivencloud.com`)
   - Port (e.g. `24856`)
   - User (`avnadmin`)
   - Password
   - Database name (`synapseos`)
   - Download the **CA Certificate** (`ca.pem`).
3. **Execute Production Schema Initialization**:
   - Connect using MySQL CLI or Workbench:
     ```bash
     mysql -h mysql-xxxx-xxxx.aivencloud.com -P 24856 -u avnadmin -p --ssl-ca=ca.pem < database/schema/production_schema_init.sql
     ```
   - All 15 domain tables, `activity_events` ledger, `automation_summaries`, and composite indexes will be created idempotently.

---

## 3. Step 2: Deploy Backend Web Service to Render

1. **Create Render Web Service**:
   - Log into [Render Dashboard](https://dashboard.render.com/).
   - Click **New** $\longrightarrow$ **Web Service** $\longrightarrow$ Connect your GitHub repository (`SynapseOS`).
2. **Configure Service Settings**:
   - **Name**: `synapseos-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Node Version**: `20` or higher
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free / Starter / Standard
3. **Configure Environment Variables**:
   In Render's **Environment** tab, add the following variables:

   | Variable Name | Description | Example / Production Value |
   | :--- | :--- | :--- |
   | `NODE_ENV` | Runtime environment | `production` |
   | `PORT` | Web port | `5000` (Render binds automatically) |
   | `CORS_ORIGIN` | Allowed Frontend URL(s) | `https://synapseos.vercel.app` |
   | `DB_HOST` | Aiven MySQL Hostname | `mysql-xxxx-xxxx.aivencloud.com` |
   | `DB_PORT` | Aiven MySQL Port | `24856` |
   | `DB_USER` | Aiven MySQL User | `avnadmin` |
   | `DB_PASSWORD` | Aiven MySQL Password | `your_aiven_password` |
   | `DB_NAME` | Database Name | `synapseos` |
   | `DB_SSL_CA` | Aiven CA Certificate String | `-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----` |
   | `JWT_SECRET` | Secret key for signing tokens | High-entropy 64-char hex string |
   | `JWT_EXPIRES_IN`| Token lifetime | `7d` |
   | `AUTOMATION_ENABLED` | Enable scheduled cron jobs | `true` |
   | `AUTOMATION_TIMEZONE`| Scheduler timezone | `Asia/Kolkata` |
   | `AI_ENABLED` | Enable AI features | `true` |
   | `AI_PROVIDER` | Active AI provider | `gemini` (or `openai`) |
   | `GEMINI_API_KEY` | Google Gemini API Secret | `AIzaSy...` |
   | `GOOGLE_CLIENT_ID` | OAuth verification | `xxx.apps.googleusercontent.com` |
   | `YOUTUBE_API_KEY` | YouTube Study Hub proxy | `AIzaSy...` |

4. **Verify Deployment & Health**:
   - Render will build and start the service.
   - Test the health endpoint: `curl https://synapseos-api.onrender.com/health`
   - Expect: `{"status":"ok","uptime":...,"timestamp":"..."}`

---

## 4. Step 3: Deploy Frontend SPA to Vercel

1. **Import Repository to Vercel**:
   - Log into [Vercel](https://vercel.com/).
   - Click **Add New** $\longrightarrow$ **Project** $\longrightarrow$ Import `SynapseOS`.
2. **Configure Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. **Configure Environment Variables**:
   In Vercel's **Environment Variables** section:

   | Variable Name | Description | Value |
   | :--- | :--- | :--- |
   | `VITE_API_URL` | Render Backend API URL | `https://synapseos-api.onrender.com/api` |
   | `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |

4. **Deploy**:
   - Click **Deploy**. Vercel will build the assets and deploy to edge servers worldwide.
   - SPA routing is automatically managed by `frontend/vercel.json` rewrites.

---

## 5. Production Health & Troubleshooting Checklist

- [x] **CORS Configuration**: If API requests fail with CORS errors, verify `CORS_ORIGIN` on Render matches your exact Vercel URL (e.g. `https://synapseos.vercel.app` without trailing slash).
- [x] **Database Connectivity**: If backend logs report `ENOTFOUND` or `HANDSHAKE` errors, verify `DB_SSL_CA` is set and `DB_PORT` matches Aiven's assigned port.
- [x] **Client-Side Routing**: If direct navigation to `/dashboard` gives a 404, verify `vercel.json` exists in `frontend/`.
- [x] **AI Graceful Fallback**: If `GEMINI_API_KEY` is not configured or fails, core features (Tasks, Notes, Goals, Analytics) continue operating at 100% availability.
