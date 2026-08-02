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










