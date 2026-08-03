# Bugs Fixed

---

## Bug 1

MODULE_NOT_FOUND

Reason

Wrong controller filename.

Solution

Renamed file.

---

## Bug 2

ER_ACCESS_DENIED_ERROR

Reason

Wrong database password.

Solution

Updated .env.

---

## Bug 3

Error 1452

Reason

Foreign key constraint.

Solution

Inserted parent table before child table.



# Bug Fix Log

This document records major issues encountered during backend development and how they were resolved.

---

## Bug #1

Issue :Cannot find module '../controllers/taskController'
Reason

Incorrect file path.

Solution

Moved controller into the correct folder and updated require path.

Status

✅ Fixed

---

## Bug #2

Issue:JWT Token Expired

Reason

Old JWT token used after changing secret.

Solution

Generated a fresh token by logging in again.

Status

✅ Fixed

---

## Bug #3

Issue:Cannot POST /api/note

Reason

Wrong endpoint.

Solution

Changed endpoint to /api/notes.

Status

✅ Fixed

---

## Bug #4

Issue:Cannot find module '../controllers/noteController'


Reason

Spelling mistake in filename.

Solution

Corrected filename.

Status

✅ Fixed

---

## Bug #5

Issue:Table 'synapseos.notes' doesn't exist


Reason

Notes table had not been created.

Solution

Created notes table in MySQL.

Status

✅ Fixed

---

## Bug #6

Issue:Unknown column 'n.note_id'

Reason

Primary key was mistakenly created as node_id  
instead of note_id


Solution

Renamed column.

Status

✅ Fixed

---

## Bug #7

Issue:Subject not found


Reason

User attempted to access another user's subject.

Solution

Created subject under authenticated user account.

Status

✅ Fixed

---

## Bug #8

Issue

Git commits not appearing on GitHub contribution graph.

Reason

Commits were made to a private repository.

Solution

Enabled private contribution visibility in GitHub settings.

Status

✅ Fixed

---

## Lessons Learned

- Verify database schema before debugging queries.
- Maintain consistent naming conventions.
- Always validate resource ownership.
- Test every API immediately after implementation.
- Commit code frequently.



## Bug #9

Issue

Unknown column 'start_time'

Reason

Database schema and model were inconsistent.

Solution

Renamed the database column and synchronized the model with the schema.

Status

✅ Fixed



## Bug #10

Issue

Cannot find module '../config/db'

Reason

Configuration file was named `database.js` instead of `db.js`.

Solution

Updated all imports to use `database.js`.

Status

✅ Fixed



## Bug #11

Issue

Unknown column 'event_type'

Reason

The database schema used `status` instead of `event_type`, while the model still referenced `event_type`.

Solution

Updated the model and controller to match the database schema.

Status

✅ Fixed

# Goals Module

Problem

Users could modify another user's goals.

Solution

Added

WHERE goal_id = ?
AND user_id = ?

------------------------------------------------

Problem

Progress percentage could exceed 100%.

Solution

Added validation.

------------------------------------------------

Protected all Goal APIs using JWT Authentication.

====================================================

# Study Sessions Module

Problem

Users could manually send incorrect duration.

Solution

Duration is now calculated automatically.

------------------------------------------------

Problem

Negative duration possible.

Solution

Validation added.

Response

400 Bad Request

"End time must be after start time"

------------------------------------------------

Problem

Users could access another user's sessions.

Solution

Added

WHERE session_id = ?
AND user_id = ?

------------------------------------------------

Protected all Study Session APIs using JWT Authentication.




# Pomodoro Module Fixes

Problem

Users could manually send incorrect focus duration.

Solution

Focus duration is automatically calculated using:

ended_at - started_at

--------------------------------------------------------

Problem

Negative duration could be stored.

Solution

Added validation:

End time must be after start time.

--------------------------------------------------------

Problem

Negative break duration.

Solution

Added validation:

Break minutes cannot be negative.

--------------------------------------------------------

Problem

Users could access another user's Pomodoro sessions.

Solution

Every CRUD operation uses

WHERE session_id = ?
AND user_id = ?

--------------------------------------------------------

Protected all Pomodoro APIs using JWT Authentication.



# Dashboard Module Fixes

Problem

Dashboard statistics required multiple database queries.

Solution

Implemented a single optimized SQL query using subqueries to retrieve all summary metrics.

--------------------------------------------------------

Problem

Dashboard should only display the logged-in user's data.

Solution

Applied user_id filtering to every aggregated query.

--------------------------------------------------------

Problem

SUM() returned NULL when no study or pomodoro sessions existed.

Solution

Used IFNULL() to return 0 instead of NULL.




# Subject Analytics Fixes

Problem

Joining study_sessions and pomodoro_sessions directly produced duplicate rows, causing incorrect aggregate values.

Solution

Replaced direct joins with aggregated subqueries using GROUP BY before joining.

--------------------------------------------------------

Problem

SUM(DISTINCT duration_minutes) produced incorrect totals when multiple sessions had the same duration.

Solution

Removed DISTINCT and aggregated each table independently before joining.

--------------------------------------------------------

Result

- Accurate study hours
- Accurate pomodoro hours
- Better performance
- Production-ready SQL


# Weekly Analytics Fixes

Problem

ONLY_FULL_GROUP_BY generated an error while ordering grouped data.

Solution

Grouped using both DAYNAME(start_time) and WEEKDAY(start_time).

--------------------------------------------------------

Problem

SQL returned only days that contained study sessions.

Solution

Created a complete Monday-to-Sunday array in the backend and inserted zero values for missing days.

--------------------------------------------------------

Problem

Weekly data was returned in alphabetical order.

Solution

Ordered results using WEEKDAY(start_time) to ensure chronological Monday-Sunday ordering.



# Goal Analytics Fixes

Problem

SUM() and AVG() returned NULL when the user had no goals.

Solution

Wrapped aggregate functions using IFNULL() to return zero values.

--------------------------------------------------------

Problem

Goal statistics required multiple SQL queries.

Solution

Implemented conditional aggregation using SUM(CASE WHEN ...) to retrieve all statistics in a single optimized query.

--------------------------------------------------------

Result

- Accurate goal statistics
- Zero values instead of NULL
- Single optimized SQL query
- Production-ready analytics



# Pomodoro Analytics Fixes

Problem

Aggregate functions returned NULL when no Pomodoro sessions existed.

Solution

Used IFNULL() around SUM(), AVG(), and MAX().

--------------------------------------------------------

Problem

Multiple SQL queries would have been required.

Solution

Used conditional aggregation with SUM(CASE WHEN ...) to retrieve all statistics in one optimized query.










