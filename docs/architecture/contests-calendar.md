# 🏆 SynapseOS Contests & Calendar Integration Architecture

## 1. Overview & Vision

For computer science students and competitive programmers, tracking contests across platforms (LeetCode, Codeforces, CodeChef, HackerRank, AtCoder) is essential.

SynapseOS provides a **unified contest tracking subsystem** that bridges competitive programming schedules directly into the student's **academic calendar** without redundant data entry.

---

## 2. Platform Support & Data Representation

### Supported Platforms:
- 🟡 **LeetCode**
- 🔴 **Codeforces**
- 🟤 **CodeChef**
- 🟢 **HackerRank**
- ⚪ **AtCoder**
- 🟣 **Other / Custom Competitions**

### Database Schema (`contests` table):
```sql
CREATE TABLE contests (
    contest_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    platform ENUM('LeetCode','Codeforces','CodeChef','HackerRank','AtCoder','Other') NOT NULL,
    contest_name VARCHAR(200) NOT NULL,
    contest_date DATETIME NOT NULL,
    contest_url VARCHAR(255),
    participation_status ENUM('Upcoming','Participated','Missed') DEFAULT 'Upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

## 3. Dual-View Architecture & Dynamic Calendar Aggregation

Rather than duplicating contest records into the `calendar_events` table (which would introduce synchronization drift and double-deletion anomalies), SynapseOS implements a **Single Source of Truth** pattern.

```text
                                  ┌────────────────────────┐
                                  │      Aiven MySQL       │
                                  └───────────┬────────────┘
                                              │
                    ┌─────────────────────────┴─────────────────────────┐
                    │                                                   │
                    ▼                                                   ▼
         GET /api/calendar                                    GET /api/contests
    (Academic events, exams)                             (Scheduled CP contests)
                    │                                                   │
                    │                                                   │
                    ▼                                                   ▼
       [calendarEvents Array]                                [contests Array]
                    │                                                   │
                    └─────────────────────────┬─────────────────────────┘
                                              │
                                              ▼
                             [Calendar Page Event Normalizer]
                                              │
                      • Formats `event_date` & `contest_date` to `YYYY-MM-DD`
                      • Tags contests with `isContest: true` and platform badges
                      • Injects direct contest URL and status
                                              │
                                              ▼
                             ┌──────────────────────────────────┐
                             │       Monthly Calendar Grid      │
                             │                                  │
                             │  [Exam: OS Midterm]              │
                             │  [🏆 LeetCode: Weekly Contest]   │
                             │  [🏆 Codeforces: Round 950]      │
                             └──────────────────────────────────┘
```

---

## 4. Date Normalization & Timezone Safety

A critical architectural challenge when bridging SQL `DATETIME` fields with JavaScript date grids is timezone offset drift.

### Solution Pattern:
1. **Server Storage:** Contest and event dates are stored in standard UTC timestamps in MySQL.
2. **Client Transformation:** The Calendar view normalizes both `calendar_events.event_date` and `contests.contest_date` into clean `YYYY-MM-DD` day keys using deterministic local date extraction (`new Date(item.contest_date).toISOString().split('T')[0]`), ensuring events land on the correct day regardless of browser timezone.

---

## 5. UI Features & User Flow

### 1. Dedicated Contest View (`/contests`)
- Filter contests by platform badge or status (Upcoming, Participated, Missed).
- 1-click launch to external challenge URL in a secure new tab (`target="_blank" rel="noopener noreferrer"`).
- Mark status as "Participated" upon competition completion.

### 2. Integrated Calendar View (`/calendar`)
- Contests render as distinct, brightly colored contest pills on the day grid.
- Clicking a contest pill displays the competition name, platform icon, start time, and a direct link to the contest arena.
