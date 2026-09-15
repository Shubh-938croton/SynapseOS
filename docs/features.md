# ✨ SynapseOS Feature Catalog & Capabilities

SynapseOS is a complete, full-stack productivity and academic management platform. Below is the detailed catalog of all implemented and active features.

---

## 1. 🔐 Dual-Channel Authentication & Security
- **Email + Password Authentication:** Register and log in securely with `bcrypt` password encryption (salt rounds: 10).
- **Google OAuth 2.0 Single Sign-On:** Official Google Identity Services SDK integration offering 1-click popup authentication.
- **Stateless JWT Security:** Cryptographically signed tokens authorizing protected API routes.
- **Multi-Tenant Data Isolation:** Enforced server-side `WHERE user_id = ?` scoping across all database operations.
- **Client Route Guards:** Seamless navigation protection via `<ProtectedRoute>` wrapper.

---

## 2. 📊 Command Center Dashboard
- **Contextual Welcome Hero:** Dynamic greeting adjusting for time of day, displaying user handle and status.
- **Live Productivity Metric Cards:**
  - Active Subjects Count
  - Pending vs Completed Task Counter
  - Cumulative Study Hours Logged
  - Completed Pomodoro Focus Blocks
- **Quick Action Bar:** 1-click shortcuts to schedule calendar events, start a Pomodoro timer, create tasks, and write notes.

---

## 3. 📚 Subject Management Subsystem
- **Dedicated Subject Manager:** Create, view, edit, and delete academic courses and study domains.
- **Color Coding:** Select distinct hex color tags to visually distinguish subjects across the entire application.
- **Inline Modal Creation:** Create new subjects on the fly within Task, Note, and Study Session modals without context switching.
- **Cascading Data Integrity:** Automatic MySQL cascading deletion of associated tasks, notes, and study logs upon subject removal.

---

## 4. ✅ Task Management Engine
- **Task Organization:** Categorized by subject with visual priority badges (🔴 High, 🟡 Medium, 🟢 Low).
- **Status Toggling:** Animated completion checkboxes dynamically updating database records.
- **Dynamic Filtering:** Filter tasks by priority level, completion status, or search keywords.
- **Deadline Tracking:** Calendar date pickers for setting and monitoring due dates.

---

## 5. 📝 Notes & Knowledge Base
- **Markdown Support:** Write notes with rich text styling, bullet lists, headers, and monospace code snippets.
- **Pinning Mechanism:** Pin critical revision notes to the top of the masonry grid.
- **Subject Association:** Organize notes by academic subject with color-coded badges.
- **Real-Time Search:** Instant filtering across note titles and content.

---

## 6. 🎯 Goals & Milestone Tracking
- **Visual Goal Cards:** Grid view of learning targets with target completion dates.
- **Interactive Progress Meters:** Gradient progress bars tracking completion percentages from `0%` to `100%`.
- **Milestone Status Toggling:** Categorize goals as *Not Started*, *In Progress*, or *Completed*.

---

## 7. 📅 Calendar & Schedule Coordination
- **Monthly Grid View:** Clear day cells, previous/next month navigation, and "Today" highlighting.
- **Full Event CRUD:** Create, update, view, and delete academic milestones and assignment deadlines.
- **Timezone-Safe Synchronization:** Normalized date strings (`YYYY-MM-DD`) preventing timezone drift.
- **Dynamic Contest Integration:** Upcoming competitive programming contests appear directly on the calendar grid with platform badges and links.

---

## 8. ⏱️ Study Sessions & Deep Work Logger
- **Deep Work Tracking:** Record focused study sessions by subject and topic.
- **Automatic Duration Engine:** Automatically calculates total minutes elapsed between start and end timestamps.
- **Session Notes:** Attach key takeaways and revision points to each logged study block.

---

## 9. 🍅 Pomodoro Focus Timer
- **Precision Interval Control:** Switch between Focus (25m), Short Break (5m), and Long Break (15m).
- **Interactive Controls:** Start, Pause, Resume, Reset, and Interrupt session handlers.
- **Audit History Logs:** Chronological table of completed and interrupted sessions with duration metrics.

---

## 10. 🏆 Competitive Programming Contest Tracker
- **Multi-Platform Badging:** Specialized badge colors and platform labels for LeetCode, Codeforces, CodeChef, HackerRank, AtCoder, and custom contests.
- **Contest Scheduler:** Log upcoming contests with date, time, and direct external challenge URLs.
- **Status Management:** Track competitions across *Upcoming*, *Participated*, and *Missed* statuses.

---

## 11. 📈 Analytics & Productivity Engine
- **Recharts Visualizations:**
  - Day-by-day weekly study activity histogram (Monday–Sunday).
  - Subject study time distribution breakdown.
- **Aggregated Performance Metrics:** Goal completion percentages, Pomodoro completion ratios, and task velocity.
- **Productivity Scoring:** Dynamic algorithmic score (0–100) with grade evaluations and personalized recommendations.

---

## 12. 🎥 YouTube Focus Study Hub
- **Distraction-Free Search:** Query educational videos via backend YouTube Data API v3 proxy without algorithmic rabbit holes.
- **Study Category Quick Filters:** Instant searches for C++ DSA, Machine Learning, Operating Systems, DBMS, and Web Development.
- **Embedded Player:** Clean 16:9 responsive video player view with channel details and descriptions.

---

## 13. 👤 User Profile & Security Settings
- **Profile Hub:** Edit display name, username, email, and biography snippet.
- **Password Security:** Change account password with current password verification and bcrypt encryption.

---

## 14. ⚙️ Application Preferences & Settings
- **Theme Selection:** Dark and Light mode toggles.
- **Daily Study Target:** Set daily study goal minutes with live visual feedback.
- **Pomodoro Configuration:** Customize work interval and break durations saved directly to MySQL.

---

## 15. 🔔 Notifications & Alerts
- **In-App Notification Center:** Dropdown alerts with unread badge counter.
- **Read State Management:** Mark individual notifications or all notifications as read.
