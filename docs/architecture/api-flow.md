# 🔄 SynapseOS API Request & Data Flow Architecture

---

## 1. Google OAuth 2.0 Authentication Flow

```text
User                      React Client                SynapseOS Backend              Google OAuth / API             MySQL
 │                             │                              │                              │                        │
 │── Click "Google Sign-In" ──>│                              │                              │                        │
 │                             │── google.accounts.oauth2 ───>│                              │                        │
 │                             │   .initTokenClient()         │                              │                        │
 │                             │                              │                              │                        │
 │<────── OAuth Popup ─────────│                              │                              │                        │
 │── Authorize Google Account ─│                              │                              │                        │
 │                             │<── Returns Access/ID Token ──│                              │                        │
 │                             │                              │                              │                        │
 │                             │── POST /api/auth/google ────>│                              │                        │
 │                             │   { access_token }           │                              │                        │
 │                             │                              │── GET /oauth2/v3/userinfo ──>│                        │
 │                             │                              │   Bearer access_token        │                        │
 │                             │                              │<── Returns User Profile ─────│                        │
 │                             │                              │   { email, name, picture }   │                        │
 │                             │                              │                              │                        │
 │                             │                              │── findUserByEmail(email) ────────────────────────────>│
 │                             │                              │<── Result (Exists or Null) ───────────────────────────│
 │                             │                              │                                                       │
 │                             │                              │   [If New User]:                                      │
 │                             │                              │   - Generate unique username                          │
 │                             │                              │   - Hash random password (bcrypt)                     │
 │                             │                              │── registerGoogleUser() ──────────────────────────────>│
 │                             │                              │<── Result (Insert Success) ───────────────────────────│
 │                             │                              │                                                       │
 │                             │                              │── Issue SynapseOS JWT                                 │
 │                             │                              │   jwt.sign({ user_id, email })                        │
 │                             │<── JSON Response 200 OK ─────│                                                       │
 │                             │    { token, user }           │                                                       │
 │                             │                              │                                                       │
 │── Redirect to /dashboard ──>│                              │                                                       │
```

---

## 2. Protected Route & CRUD Request Flow

```text
React Component               Axios Service Interceptor          authMiddleware.js             Controller & Model               MySQL
      │                                   │                              │                             │                          │
      │── createEvent(eventData) ────────>│                              │                             │                          │
      │                                   │── Inject Header: ───────────>│                             │                          │
      │                                   │   Authorization:             │                             │                          │
      │                                   │   Bearer <token>             │                             │                          │
      │                                   │                              │── jwt.verify(token)         │                          │
      │                                   │                              │   Extract req.user.user_id  │                          │
      │                                   │                              │── next() ──────────────────>│                          │
      │                                   │                              │                             │── Execute SQL: ─────────>│
      │                                   │                              │                             │   INSERT INTO ...        │
      │                                   │                              │                             │   VALUES (user_id, ...)  │
      │                                   │                              │                             │<── Result (insertId) ────│
      │                                   │<── Response 201 Created ─────┴─────────────────────────────│                          │
      │<── Update State & Refresh UI ─────│                                                                                       │
```

---

## 3. YouTube Focus Search & Proxy Flow

```text
User Search                      React Client                   youtubeController.js          youtubeService.js          Google YouTube Data API v3
     │                                │                                  │                            │                              │
     │── Enter "C++ DSA" & Search ───>│                                  │                            │                              │
     │                                │── GET /api/youtube/search ──────>│                            │                              │
     │                                │   ?query=C%2B%2B+DSA             │                            │                              │
     │                                │                                  │── searchVideos(query) ────>│                              │
     │                                │                                  │                            │── Axios GET request ────────>│
     │                                │                                  │                            │   https://www.googleapis...  │
     │                                │                                  │                            │   key=YOUTUBE_API_KEY        │
     │                                │                                  │                            │<── Raw YouTube Payload ──────│
     │                                │                                  │<── Normalized JSON Array ──│                              │
     │                                │<── HTTP 200 JSON Response ───────│                                                           │
     │                                │    [{ videoId, title, thumb }]   │                                                           │
     │<── Render Responsive Cards ────│                                                                                              
```

---

## 4. Dashboard Summary & Aggregation Flow

```text
Dashboard.jsx                    api.js                         dashboardController.js        dashboardModel.js          MySQL (synapseos)
      │                            │                                      │                           │                        │
      │── getDashboardSummary() ──>│                                      │                           │                        │
      │                            │── GET /api/dashboard/summary ───────>│                           │                        │
      │                            │   (with Bearer token)                │                           │                        │
      │                            │                                      │── getDashboardSummary() ─>│                        │
      │                            │                                      │                           │── Run Aggregations ───>│
      │                            │                                      │                           │   - COUNT(tasks)       │
      │                            │                                      │                           │   - SUM(study_minutes) │
      │                            │                                      │                           │   - COUNT(pomodoro)    │
      │                            │                                      │                           │   - COUNT(subjects)    │
      │                            │                                      │                           │<── Aggregated Row ─────│
      │                            │<── HTTP 200 JSON ────────────────────┴───────────────────────────│                        │
      │<── Populate Summary Cards ─│
```

