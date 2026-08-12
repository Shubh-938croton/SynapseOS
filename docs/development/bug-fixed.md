# 🐛 SynapseOS — Bug Fix Log

This document records the major bugs, debugging issues, database inconsistencies, security issues, analytics problems, and frontend issues encountered during SynapseOS development and how they were resolved.

---

# 1. Initial Backend Bugs

## Bug #1 — MODULE_NOT_FOUND

**Issue**

`MODULE_NOT_FOUND`

**Reason**

Wrong controller filename.

**Solution**

Renamed the file to match the expected controller name.

**Status**

✅ Fixed

---

## Bug #2 — ER_ACCESS_DENIED_ERROR

**Issue**

MySQL returned:

`ER_ACCESS_DENIED_ERROR`

**Reason**

Wrong database password.

**Solution**

Updated the database credentials in `.env`.

**Status**

✅ Fixed

---

## Bug #3 — Error 1452

**Issue**

MySQL returned foreign-key constraint error `1452`.

**Reason**

A child record was inserted before its required parent record existed.

**Solution**

Inserted the parent-table record before inserting the dependent child record.

**Lesson**

Always respect foreign-key dependency order when inserting relational data.

**Status**

✅ Fixed

---

# 2. Task Module Bugs

## Bug #4 — Cannot find module '../controllers/taskController'

**Issue**

```text
Cannot find module '../controllers/taskController'
```

**Reason**

Incorrect controller file path.

**Solution**

Moved the controller into the correct folder and updated the import/require path.

**Status**

✅ Fixed

---

# 3. Authentication Bugs

## Bug #5 — JWT Token Expired

**Issue**

API requests failed because the JWT token was no longer valid.

**Reason**

An old JWT token was being used after the JWT secret/configuration had changed.

**Solution**

Logged in again and generated a fresh JWT token.

**Status**

✅ Fixed

---

# 4. Notes Module Bugs

## Bug #6 — Cannot POST /api/note

**Issue**

```text
Cannot POST /api/note
```

**Reason**

Wrong API endpoint.

**Solution**

Changed the endpoint from:

```text
/api/note
```

to:

```text
/api/notes
```

**Status**

✅ Fixed

---

## Bug #7 — Cannot find module '../controllers/noteController'

**Issue**

```text
Cannot find module '../controllers/noteController'
```

**Reason**

Spelling mistake in the controller filename.

**Solution**

Corrected the filename and synchronized the import path.

**Status**

✅ Fixed

---

## Bug #8 — Table 'synapseos.notes' doesn't exist

**Issue**

MySQL reported:

```text
Table 'synapseos.notes' doesn't exist
```

**Reason**

The `notes` table had not yet been created.

**Solution**

Created the `notes` table in MySQL and synchronized the backend with the schema.

**Status**

✅ Fixed

---

## Bug #9 — Unknown column 'n.note_id'

**Issue**

```text
Unknown column 'n.note_id'
```

**Reason**

The primary key was accidentally created as:

```text
node_id
```

instead of:

```text
note_id
```

**Solution**

Renamed the database column to `note_id`.

**Lesson**

Database naming must remain consistent across:

- schema
- model
- controller
- SQL queries
- frontend API responses

**Status**

✅ Fixed

---

# 5. Subject Module Bugs

## Bug #10 — Subject Not Found

**Issue**

A user could not access a subject.

**Reason**

The subject belonged to another user.

**Solution**

Created/accessed the subject under the authenticated user's account and enforced user ownership.

**Lesson**

Every user-owned resource must be scoped to the authenticated `user_id`.

**Status**

✅ Fixed

---

# 6. GitHub Contribution Bug

## Bug #11 — Commits Not Appearing on GitHub Contribution Graph

**Issue**

Commits were not appearing on the GitHub contribution graph.

**Reason**

The commits were made in a private repository and private contribution visibility was not enabled.

**Solution**

Enabled private contribution visibility in GitHub settings.

**Status**

✅ Fixed

---

# 7. Calendar Module Backend Bugs

## Bug #12 — Unknown column 'start_time'

**Issue**

```text
Unknown column 'start_time'
```

**Reason**

The database schema and backend model were inconsistent.

**Solution**

Renamed/synchronized the database column and updated the model to match the schema.

**Status**

✅ Fixed

---

## Bug #13 — Cannot find module '../config/db'

**Issue**

```text
Cannot find module '../config/db'
```

**Reason**

The configuration file was named:

```text
database.js
```

instead of:

```text
db.js
```

**Solution**

Updated imports to use the actual `database.js` configuration file.

**Status**

✅ Fixed

---

## Bug #14 — Unknown column 'event_type'

**Issue**

```text
Unknown column 'event_type'
```

**Reason**

The database schema used:

```text
status
```

while the backend model still referenced:

```text
event_type
```

**Solution**

Updated the model and controller to use `status`, matching the database schema.

**Status**

✅ Fixed

---

# 8. Calendar Frontend Bugs

## Bug #15 — Add Event Import Error

**Issue**

Vite reported an import/transform error in:

```text
frontend/src/pages/Calendar/Calendar.jsx
```

**Reason**

The `AddEventModal` import path contained a spelling mistake.

**Solution**

Corrected the component import path.

**Status**

✅ Fixed

---

## Bug #16 — Add Event Button Appeared to Do Nothing

**Issue**

Clicking `+ Add Event` appeared to have no effect.

**Debugging**

Added a console log:

```javascript
console.log("Add event clicked");
```

The message appeared in the browser console, proving that the button click handler was connected to the frontend.

**Reason**

The issue was not the button itself; the modal/component integration was being debugged.

**Solution**

Connected the button to the modal state:

```javascript
setShowAddEventModal(true);
```

and rendered the modal conditionally.

**Status**

✅ Fixed

---

## Bug #17 — Add Event Modal Had No CSS

**Issue**

The Add Event modal initially appeared as unstyled HTML:

- plain inputs
- plain buttons
- no overlay
- no modal layout
- no visual hierarchy

**Reason**

The modal CSS file was missing/not imported correctly.

**Solution**

Created/connected:

```text
frontend/src/components/AddEventModal/AddEventModal.css
```

and imported it from:

```javascript
import "./AddEventModal.css";
```

**Status**

✅ Fixed

---

## Bug #18 — Create Event Button Was Not Connected Correctly

**Issue**

Clicking the Create Event button initially produced a test message:

```text
BUTTON CLICKED
```

but did not create the event.

**Reason**

The button was being tested independently before the complete form submission/API flow was connected.

**Solution**

Implemented the complete `handleSubmit` flow:

1. Prevent default form submission.
2. Validate title.
3. Validate date.
4. Validate start/end time.
5. Build `eventData`.
6. Call `createEvent(eventData)`.
7. Refresh calendar events.
8. Close the modal.
9. Handle API errors.

**Status**

✅ Fixed

---

# 9. Calendar Event Date / Timezone Bug

## Bug #19 — Event Displayed One Day Earlier

**Issue**

When an event was created for day `20`, it appeared on day `19` in the calendar.

**Reason**

The frontend was treating the database date/timestamp as a JavaScript `Date` and timezone conversion shifted the date backward.

Example:

```text
2026-08-20
```

could become a timestamp representing the previous local calendar day.

**Solution**

Calendar date matching was changed to compare the raw date portion instead of converting the event date through JavaScript timezone conversion.

The calendar constructs dates as:

```javascript
const dateString =
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
```

and compares against:

```javascript
event.event_date?.split("T")[0]
```

The edit modal also preserves the date using:

```javascript
String(event.event_date).substring(0, 10)
```

instead of `new Date(event.event_date)`.

**Result**

An event created for August 20 remains on August 20.

**Status**

✅ Fixed

---

# 10. Calendar Event Display Debugging

## Bug #20 — Events Were Fetched but Their Calendar Cell Was Unclear

**Issue**

Events were successfully returned from the backend, but debugging was required to verify that the calendar grid was checking the correct dates.

**Debugging**

Added logs such as:

```javascript
console.log("Calendar cell:", dateString);
```

and inspected backend events using:

```javascript
console.table(
    events.map((event) => ({
        id: event.event_id,
        title: event.title,
        event_date: event.event_date
    }))
);
```

**Solution**

Verified that:

- backend events were loaded into `events`
- calendar cells generated the expected `YYYY-MM-DD`
- event dates were compared using the raw date component
- matching events were rendered inside the correct calendar cell

**Status**

✅ Fixed

---

# 11. Edit Event Module Bugs

## Bug #21 — Edit Event Modal Was Empty

**Issue**

The Edit Event modal existed but initially had no form implementation.

**Reason**

The component had been created as an empty placeholder.

**Solution**

Implemented the complete `EditEventModal` component with:

- event loading
- title editing
- description editing
- date editing
- start-time editing
- end-time editing
- reminder editing
- status editing
- validation
- update API call
- calendar refresh
- close handling
- loading state

**Status**

✅ Fixed

---

## Bug #22 — Edit Event Button Appeared Not to Work

**Issue**

The Edit button looked like it was not working.

**Reason**

The Edit Event modal did open, but the modal had no proper CSS, making it appear as an unstyled section of the page.

**Solution**

Added the Edit Event modal stylesheet and connected:

```text
frontend/src/components/EditEventModal/EditEventModal.css
```

to:

```javascript
import "./EditEventModal.css";
```

**Status**

✅ Fixed

---

## Bug #23 — Edit Event Date Could Reintroduce Timezone Bug

**Issue**

Editing an event could potentially shift the selected date if the timestamp was converted using JavaScript `Date`.

**Reason**

Timezone conversion can move midnight timestamps to the previous local date.

**Solution**

The Edit Event modal loads the date using:

```javascript
setEventDate(
    event.event_date
        ? String(event.event_date).substring(0, 10)
        : ""
);
```

This keeps only:

```text
YYYY-MM-DD
```

**Status**

✅ Fixed

---

# 12. Delete Event Module

## Bug #24 — Delete Event Integration

**Issue**

Delete functionality needed to be connected to the calendar UI and backend.

**Solution**

Implemented:

```javascript
deleteEvent(event.event_id);
```

with:

- confirmation dialog
- backend DELETE request
- event refresh
- error handling

Example confirmation:

```javascript
const confirmed = window.confirm(
    `Are you sure you want to delete "${event.title}"?`
);
```

**Result**

Events can be deleted directly from the calendar.

**Status**

✅ Fixed / Implemented

---

# 13. Goals Module Security Fixes

## Problem — Users Could Modify Another User's Goals

**Reason**

Queries were not sufficiently scoped to the authenticated user.

**Solution**

Added ownership checks:

```sql
WHERE goal_id = ?
AND user_id = ?
```

**Status**

✅ Fixed

---

## Problem — Progress Percentage Could Exceed 100%

**Reason**

No validation restricted progress values.

**Solution**

Added progress validation to prevent values above the allowed maximum.

**Status**

✅ Fixed

---

## Authentication

All Goal APIs were protected using JWT authentication.

**Status**

✅ Fixed

---

# 14. Study Sessions Module Fixes

## Problem — Users Could Manually Send Incorrect Duration

**Reason**

Duration was accepted from the client instead of being calculated from timestamps.

**Solution**

Duration is calculated automatically from:

```text
end_time - start_time
```

**Status**

✅ Fixed

---

## Problem — Negative Duration Possible

**Reason**

End time could be earlier than start time.

**Solution**

Added validation.

Response:

```text
400 Bad Request
End time must be after start time
```

**Status**

✅ Fixed

---

## Problem — Users Could Access Another User's Sessions

**Solution**

Added ownership filtering:

```sql
WHERE session_id = ?
AND user_id = ?
```

**Status**

✅ Fixed

---

## Authentication

All Study Session APIs are protected using JWT authentication.

**Status**

✅ Fixed

---

# 15. Pomodoro Module Fixes

## Problem — Incorrect Focus Duration

**Reason**

Users could manually submit an incorrect focus duration.

**Solution**

Focus duration is calculated automatically using:

```text
ended_at - started_at
```

**Status**

✅ Fixed

---

## Problem — Negative Focus Duration

**Reason**

End time could occur before start time.

**Solution**

Added validation:

```text
End time must be after start time.
```

**Status**

✅ Fixed

---

## Problem — Negative Break Duration

**Reason**

Negative break values could be submitted.

**Solution**

Added validation:

```text
Break minutes cannot be negative.
```

**Status**

✅ Fixed

---

## Problem — Users Could Access Another User's Pomodoro Sessions

**Solution**

Every CRUD operation uses:

```sql
WHERE session_id = ?
AND user_id = ?
```

**Status**

✅ Fixed

---

## Authentication

All Pomodoro APIs are protected using JWT authentication.

**Status**

✅ Fixed

---

# 16. Dashboard Module Fixes

## Problem — Dashboard Statistics Required Multiple Queries

**Reason**

Each dashboard statistic was initially treated as a separate database operation.

**Solution**

Implemented a single optimized SQL query using subqueries to retrieve summary metrics.

**Status**

✅ Fixed

---

## Problem — Dashboard Could Display Other Users' Data

**Solution**

Applied `user_id` filtering to every aggregated query.

**Status**

✅ Fixed

---

## Problem — SUM() Returned NULL

**Reason**

No study or Pomodoro sessions existed for some users.

**Solution**

Used:

```sql
IFNULL(...)
```

to return `0` instead of `NULL`.

**Status**

✅ Fixed

---

# 17. Subject Analytics Fixes

## Problem — Duplicate Rows From Direct Joins

**Issue**

Joining `study_sessions` and `pomodoro_sessions` directly produced duplicate rows and incorrect aggregate values.

**Solution**

Aggregated each table independently using `GROUP BY` before joining the results.

**Status**

✅ Fixed

---

## Problem — SUM(DISTINCT duration_minutes) Produced Incorrect Totals

**Reason**

Different sessions can legitimately have the same duration. `DISTINCT` therefore removed valid repeated durations.

**Solution**

Removed `DISTINCT` and independently aggregated each table before joining.

**Result**

- Accurate study hours
- Accurate Pomodoro hours
- Better performance
- More reliable production SQL

**Status**

✅ Fixed

---

# 18. Weekly Analytics Fixes

## Problem — ONLY_FULL_GROUP_BY Error

**Reason**

Grouped data was being ordered using a column that was not properly represented in the grouping.

**Solution**

Grouped using both:

```sql
DAYNAME(start_time)
```

and:

```sql
WEEKDAY(start_time)
```

**Status**

✅ Fixed

---

## Problem — Missing Days

**Issue**

SQL returned only days containing study sessions.

**Solution**

Created a complete Monday-to-Sunday array in the backend and inserted zero values for missing days.

**Result**

Every weekly analytics response contains all seven days.

**Status**

✅ Fixed

---

## Problem — Weekly Data Returned Alphabetically

**Reason**

Day names were treated as ordinary strings.

**Solution**

Ordered using:

```sql
WEEKDAY(start_time)
```

to produce chronological Monday-to-Sunday ordering.

**Status**

✅ Fixed

---

# 19. Goal Analytics Fixes

## Problem — SUM() and AVG() Returned NULL

**Reason**

The user had no goals.

**Solution**

Wrapped aggregate functions using:

```sql
IFNULL(...)
```

to return zero values.

**Status**

✅ Fixed

---

## Problem — Goal Statistics Required Multiple SQL Queries

**Solution**

Implemented conditional aggregation:

```sql
SUM(CASE WHEN ... THEN ... END)
```

to retrieve multiple goal statistics in one optimized query.

**Result**

- Accurate goal statistics
- Zero instead of NULL
- Single optimized SQL query
- Production-ready analytics

**Status**

✅ Fixed

---

# 20. Pomodoro Analytics Fixes

## Problem — Aggregate Functions Returned NULL

**Reason**

No Pomodoro sessions existed for the user.

**Solution**

Used `IFNULL()` around:

- `SUM()`
- `AVG()`
- `MAX()`

**Status**

✅ Fixed

---

## Problem — Multiple Queries Required

**Solution**

Used conditional aggregation with:

```sql
SUM(CASE WHEN ... THEN ... END)
```

to retrieve multiple statistics in one query.

**Status**

✅ Fixed

---

# 21. Productivity Score Fixes

## Problem — Analytics Were Scattered Across Multiple APIs

**Solution**

Created a unified productivity score combining data from multiple productivity modules.

**Status**

✅ Fixed

---

## Problem — Division by Zero When Users Had No Tasks

**Solution**

Added validation before calculating the task score.

**Status**

✅ Fixed

---

## Problem — NULL Values From Aggregate Functions

**Solution**

Used `IFNULL()` for aggregate calculations.

**Status**

✅ Fixed

---

## Problem — Business Logic Mixed With Controller

**Reason**

Database calculations and request-handling logic were mixed together.

**Solution**

Moved database calculations into the model and kept the controller responsible primarily for request/response handling.

**Result**

Cleaner separation of responsibilities:

```text
Route
  ↓
Controller
  ↓
Model
  ↓
Database
```

**Status**

✅ Fixed

---

# 22. General Lessons Learned

## Database

- Verify the database schema before debugging SQL queries.
- Keep schema and backend model names synchronized.
- Maintain consistent primary-key and foreign-key naming.
- Respect foreign-key insertion order.
- Use `IFNULL()` for user-facing aggregate statistics.
- Avoid unnecessary `DISTINCT` in aggregate calculations.
- Aggregate tables independently before joining when one-to-many relationships can multiply rows.

## Authentication and Security

- Always validate JWT authentication.
- Scope user-owned resources using both resource ID and `user_id`.
- Never trust a client-provided user ID for ownership.
- Protect every CRUD endpoint for user-owned resources.

## Backend Architecture

- Keep controllers focused on request/response handling.
- Keep database operations and heavy calculations in models/services.
- Maintain consistent route → controller → model structure.
- Test every API immediately after implementation.

## Frontend

- Verify that button handlers actually fire before debugging deeper layers.
- Use console logging strategically to trace frontend/backend data flow.
- Check component import paths carefully.
- Ensure every component stylesheet is imported.
- Avoid converting date-only database values through JavaScript `Date` when timezone conversion is not desired.
- Keep modal state controlled from the parent component.

## Calendar

- Treat date-only values as calendar dates, not timezone-dependent timestamps.
- Compare dates using `YYYY-MM-DD`.
- Refresh calendar data after create, update, and delete operations.
- Test events across month boundaries and timezone-sensitive dates.

## Git

- Commit after completing a stable feature or bug fix.
- Use descriptive commit messages.
- Check `git status` before committing.
- Verify that important changes are staged before creating a commit.
- Keep project documentation updated alongside major features.

---

# 23. Current Calendar Milestone

The Calendar module currently supports:

- ✅ Calendar month navigation
- ✅ Today button
- ✅ Fetching events from backend
- ✅ Displaying events inside calendar cells
- ✅ Add Event modal
- ✅ Create Event API integration
- ✅ Edit Event modal
- ✅ Update Event API integration
- ✅ Delete Event functionality
- ✅ Event refresh after CRUD operations
- ✅ Date-only timezone bug fixed
- ✅ Add Event modal styling
- ✅ Edit Event modal styling
- ✅ Event validation
- ✅ JWT-protected backend operations

The Calendar CRUD workflow is now functionally complete.

---

# 24. Recommended Future Bug-Prevention Checklist

Before considering a new module complete:

- [ ] Test every GET endpoint
- [ ] Test every POST endpoint
- [ ] Test every PUT endpoint
- [ ] Test every DELETE endpoint
- [ ] Test invalid input
- [ ] Test empty input
- [ ] Test authentication failure
- [ ] Test expired JWT
- [ ] Test cross-user resource access
- [ ] Test missing database records
- [ ] Test NULL aggregate results
- [ ] Test frontend loading state
- [ ] Test frontend API error state
- [ ] Test modal open/close behavior
- [ ] Test date/time handling
- [ ] Test database constraints
- [ ] Test the feature after refreshing the page
- [ ] Commit stable changes to Git

---

# Final Status

The major backend and frontend bugs documented during the current SynapseOS development cycle have been resolved.

The most important recurring themes have been:

1. **Consistency** between database schema, models, controllers, and frontend.
2. **Authentication and ownership** for every user-specific resource.
3. **Correct aggregation** for analytics.
4. **Validation** of timestamps and numeric values.
5. **Timezone-safe date handling** in the Calendar.
6. **Frontend component and CSS integration**.
7. **Frequent testing and commits**.

**Current major milestone: Calendar CRUD is complete and stable.**
