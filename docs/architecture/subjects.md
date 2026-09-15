# 📚 SynapseOS Subject Subsystem & Dependency Lifecycle

## 1. Role of Subjects in SynapseOS

In **SynapseOS**, a **Subject** represents an academic course, study module, or distinct domain of learning (e.g., *Data Structures & Algorithms*, *Distributed Systems*, *Organic Chemistry*).

Subjects act as the **primary organizational backbone** of the entire application. Nearly all cognitive and productivity entities are indexed by or associated with a subject:
- **Tasks:** Scoped to a specific subject with priority and deadlines.
- **Notes:** Grouped under subjects for modular knowledge bases.
- **Study Sessions:** Logged against subjects with topic tracking and time calculation.
- **Pomodoro Sessions:** Optionally attributed to a subject to track focused study hours per domain.
- **Analytics:** Computes subject-wise study distribution, histograms, and time allocations.

---

## 2. Relational Hierarchy & Foreign Key Dependencies

```text
                             ┌───────────────────┐
                             │       users       │
                             └─────────┬─────────┘
                                       │ (1)
                                       │
                                       ▼ (∞)
                             ┌───────────────────┐
                             │     subjects      │
                             └─────────┬─────────┘
                                       │
          ┌────────────────────────────┼────────────────────────────┐
          │ (1)                        │ (1)                        │ (1)
          ▼ (∞)                        ▼ (∞)                        ▼ (∞)
┌───────────────────┐        ┌───────────────────┐        ┌───────────────────┐
│       tasks       │        │       notes       │        │  study_sessions   │
│ (ON DELETE CASCADE)│        │ (ON DELETE CASCADE)│        │ (ON DELETE CASCADE)│
└───────────────────┘        └───────────────────┘        └───────────────────┘
          │                                                         │
          └────────────────────────────┬────────────────────────────┘
                                       │ (1)
                                       ▼ (∞)
                             ┌───────────────────┐
                             │ pomodoro_sessions │
                             │(ON DELETE SET NULL)│
                             └───────────────────┘
```

### Cascade Rules:
1. **`ON DELETE CASCADE` on Tasks, Notes, and Study Sessions:** If a subject is deleted by the user, all associated tasks, notes, and study sessions are automatically and atomically purged by the MySQL engine to maintain referential integrity.
2. **`ON DELETE SET NULL` on Pomodoro Sessions:** If a subject is deleted, past completed Pomodoro focus logs are preserved for historical audit trails, with their `subject_id` set to `NULL`.

---

## 3. Dedicated Subject Management (`/subjects`)

Users can manage their subjects directly from the **Subjects Page** (`frontend/src/pages/Subjects/Subjects.jsx`):
- **Create Subject:** Name, description, and custom hex color tag for UI badge recognition.
- **View Subjects:** Grid of cards displaying subject titles, descriptions, and linked task/note counters.
- **Edit Subject:** Update subject title, notes, or color palette.
- **Delete Subject:** Confirmation dialog warning the user that cascading deletions will occur.

---

## 4. In-Modal Inline Subject Creation Pattern

To prevent friction when creating tasks, notes, or study sessions, SynapseOS implements an **inline subject creation flow** inside all content creation modals (`AddTaskModal`, `AddNoteModal`, `AddStudySessionModal`):

```text
[User opens Add Task Modal]
          │
          ▼
[Subject Dropdown displays existing subjects + "+ Add New Subject" option]
          │
          ├─── [User selects existing subject] ──► Task created with subject_id
          │
          └─── [User clicks "+ Add New Subject"]
                   │
                   ▼
       [Inline Subject Creation Form unfolds inside modal]
                   │
                   ▼
       [User enters Subject Name & Color -> clicks "Create Subject"]
                   │
                   ▼
       [POST /api/subjects creates record in MySQL]
                   │
                   ▼
       [New subject is returned with newly generated subject_id]
                   │
                   ▼
       [Dropdown list dynamically updates & auto-selects new subject]
                   │
                   ▼
       [User continues creating Task without navigating away]
```

### Implementation Advantages:
- **Zero Context Switching:** Students never need to leave their task or note workflow to register a new course.
- **Synchronous State Propagation:** The modal triggers a lightweight callback that refreshes the parent page's subject list in real time.
