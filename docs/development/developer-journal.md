# 🚀 SynapseOS --- Developer Journal

**Developer:** Shubh Kamal\
**Project:** SynapseOS\
**Project Start:** July 2026\
**Current Focus:** Full-stack productivity platform with a React
frontend, Node/Express backend, MySQL database, authentication,
productivity modules, analytics, and future AI features.

------------------------------------------------------------------------

# 1. Project Overview

SynapseOS is a productivity and study-management platform designed to
bring a student's tasks, notes, goals, calendar, study sessions,
Pomodoro sessions, contests, analytics, and personalized insights into
one application.

## Technology Stack

### Frontend

-   React
-   JavaScript
-   HTML/CSS
-   Vite
-   React Icons

### Backend

-   Node.js
-   Express.js
-   REST APIs
-   JWT authentication
-   bcrypt

### Database

-   MySQL
-   MySQL Workbench
-   mysql2

### Development Tools

-   VS Code
-   Postman
-   Git
-   GitHub
-   Git Bash
-   PowerShell

------------------------------------------------------------------------

# 2. Core Architecture

SynapseOS follows a layered MVC-style backend architecture.

``` text
React Frontend
      ↓
REST API
      ↓
Express Routes
      ↓
Controllers
      ↓
Models
      ↓
MySQL Database
```

Authentication adds another layer:

``` text
Client
  ↓
JWT Bearer Token
  ↓
Authentication Middleware
  ↓
Controller
  ↓
Model
  ↓
MySQL
```

The main architectural rule learned throughout development is
**Separation of Concerns**:

-   Routes handle endpoints.
-   Controllers handle request/response logic.
-   Models handle database communication and SQL.
-   Middleware handles cross-cutting concerns such as authentication.
-   Frontend services communicate with backend APIs.
-   React components handle UI and user interaction.

------------------------------------------------------------------------

# 3. Day 1 --- Backend Architecture

## Objective

Set up the initial backend architecture for SynapseOS.

## Completed

-   Created backend folder structure.
-   Initialized Node.js project.
-   Installed:
    -   express
    -   mysql2
    -   dotenv
    -   cors
    -   nodemon
-   Created `app.js`.
-   Created `server.js`.
-   Created MVC folders.

``` text
backend/
└── src/
    ├── config/
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── services/
    ├── utils/
    ├── app.js
    └── server.js
```

## Learned

### MVC

``` text
Browser
   ↓
Routes
   ↓
Controllers
   ↓
Models
   ↓
Database
```

Each layer has a single responsibility.

## Problem

Node could not find controller files.

### Cause

The controller filename and import path did not match.

### Solution

Corrected the controller filename/import.

## Interview Note

**Why MVC?**

MVC separates application logic into independent layers. This improves
maintainability, debugging, testing, and scalability.

------------------------------------------------------------------------

# 4. Day 2 --- MySQL Connection

## Objective

Connect the Express backend to MySQL.

## Completed

-   Installed `mysql2`.
-   Created `database.js`.
-   Connected Node.js to MySQL.
-   Created `.env`.
-   Moved database credentials into environment variables.

## Learned

Never hardcode database credentials.

Use:

``` javascript
process.env.DB_HOST
process.env.DB_USER
process.env.DB_PASSWORD
process.env.DB_NAME
```

## Problem

Database connection failed.

### Cause

Incorrect MySQL credentials.

### Solution

Verified and corrected the credentials.

## Security Lesson

Sensitive values such as database passwords should never be committed to
GitHub.

------------------------------------------------------------------------

# 5. Day 3 --- Database Design

## Objective

Design the SynapseOS relational database.

## Database

``` text
synapseos
```

## Main Tables

-   users
-   subjects
-   tasks
-   goals
-   progress
-   calendar_events
-   notes
-   settings
-   pomodoro_sessions
-   contests

Relationships were established using foreign keys.

Example:

``` text
User
 ↓
Subjects
 ↓
Tasks
```

## Learned

Foreign keys maintain **referential integrity**.

## Problem --- Empty Tables

Tables existed in MySQL Workbench but contained no data.

### Cause

The schema had been created, but no `INSERT` statements had been
executed.

### Solution

Inserted sample records.

## Problem --- Error 1452

Foreign key constraint failed.

### Cause

A task referenced a `subject_id` that did not exist.

### Solution

Inserted the parent record in `subjects` before inserting the child
record in `tasks`.

## Interview Note

Foreign keys prevent invalid references and maintain consistency between
related tables.

------------------------------------------------------------------------

# 6. Day 4 --- GET Tasks API

## Objective

Replace hardcoded task data with MySQL data.

## Completed

Implemented:

``` text
GET /api/tasks
```

Request flow:

``` text
Browser
   ↓
Express
   ↓
Route
   ↓
Controller
   ↓
Model
   ↓
MySQL
   ↓
JSON Response
   ↓
Browser
```

## Important Design Decision

SQL was moved out of controllers and into models.

Controllers should:

1.  Receive requests.
2.  Call models.
3.  Send responses.

Models should:

1.  Communicate with the database.
2.  Execute SQL queries.
3.  Return database results.

## Problems Solved

### Server Crash

`package.json` pointed to:

``` text
index.js
```

while the project used:

``` text
server.js
```

Corrected the project configuration.

### MySQL Access Denied

Incorrect `DB_PASSWORD` was corrected in `.env`.

### Browser Still Showing Hardcoded Tasks

The controller was still using a hardcoded array.

Solution:

-   Created `taskModel.js`.
-   Moved SQL into the model.
-   Connected controller → model → database.

------------------------------------------------------------------------

# 7. Day 5 --- Task CRUD Development

## Objective

Build the Task CRUD APIs.

## Completed

### Create Task

``` text
POST /api/tasks
```

Implemented:

-   `createTask()` model
-   `createTask()` controller
-   POST route
-   Postman testing
-   MySQL insertion

## Concepts Learned

-   `req.body`
-   `express.json()`
-   Parameterized SQL queries
-   HTTP `201 Created`

## Problem

``` text
TypeError: argument handler must be a function
```

### Cause

`createTask` was not exported correctly.

### Solution

Corrected `module.exports`.

------------------------------------------------------------------------

# 8. GET Task by ID

Implemented:

``` text
GET /api/tasks/:id
```

Components:

-   `getTaskById()` model
-   `getTaskById()` controller
-   Route configuration
-   Postman testing

SQL:

``` sql
SELECT *
FROM tasks
WHERE task_id = ?;
```

## API Verification

  Method   Endpoint           Status
  -------- ------------------ ------------
  GET      `/api/tasks`       ✅ Working
  GET      `/api/tasks/:id`   ✅ Working
  POST     `/api/tasks`       ✅ Working

------------------------------------------------------------------------

# 9. Backend Debugging Lessons

## Error --- Cannot GET

``` text
Cannot GET /api/tasks/1
```

### Solution

Verified:

-   HTTP method
-   URL
-   Express route registration
-   `app.js`
-   Server restart
-   Postman configuration

## Postman Mistake

The following was mistakenly entered into the URL field:

``` text
GET http://localhost:5000/api/tasks/1
```

Correct usage:

-   Method: `GET`
-   URL:

``` text
http://localhost:5000/api/tasks/1
```

## Error --- ERR_HTTP_HEADERS_SENT

``` text
Cannot set headers after they are sent to the client
```

### Cause

`taskModel.js` had incorrect function/bracket structure. Part of the
INSERT logic was accidentally placed inside another model function.

### Solution

-   Refactored `taskModel.js`.
-   Corrected braces.
-   Separated model functions.
-   Ensured each request sends exactly one response.

------------------------------------------------------------------------

# 10. JavaScript Concepts Learned

A major debugging lesson was JavaScript function scope.

Functions declared inside another function are not available outside
that function.

Example:

``` javascript
const createTask = () => {

    const getTaskById = () => {

    };

};
```

`getTaskById` cannot be exported from outside the scope in which it was
declared.

This helped identify backend bugs caused by incorrect function
structure.

------------------------------------------------------------------------

# 11. Authentication Module

## Registration

Implemented:

-   User registration
-   bcrypt password hashing
-   Duplicate email validation
-   Duplicate username validation
-   Postman testing

## JWT Authentication

Implemented:

-   JWT token generation
-   Login API
-   bcrypt password verification
-   Authentication middleware
-   Bearer-token authentication
-   Protected routes

Core concepts:

``` text
Register
   ↓
Hash Password
   ↓
Store User
```

Login:

``` text
Credentials
   ↓
Find User
   ↓
bcrypt.compare()
   ↓
JWT Generation
   ↓
Client
```

Protected request:

``` text
Authorization: Bearer <token>
```

## Security Improvement

Task creation no longer depends on a client-provided `user_id`.

Instead:

``` javascript
req.user.user_id
```

is taken from the authenticated JWT.

This prevents users from simply changing the user ID in the request body
to access another user's data.

------------------------------------------------------------------------

# 12. User Profile Module

## Objective

Build secure profile-management APIs.

## Completed

### Get Profile

-   Created `userModel.js`.
-   Implemented profile retrieval.
-   Used authenticated user ID from JWT.
-   Excluded sensitive fields such as `password_hash`.

### Update Profile

Implemented:

-   Profile updates
-   Duplicate username validation
-   Duplicate email validation
-   JWT-based user identification

### Change Password

Implemented:

-   `findUserById()`
-   `updatePassword()`
-   Current-password verification using bcrypt
-   New-password hashing
-   Password update

## Security Improvements

-   Do not trust `user_id` from the client.
-   Use `req.user.user_id`.
-   Protect profile routes.
-   Store hashed passwords.
-   Prevent duplicate usernames/emails.

------------------------------------------------------------------------

# 13. Subjects Module

Implemented complete Subject CRUD.

## Completed

-   Create Subject
-   Get All Subjects
-   Get Subject By ID
-   Update Subject
-   Delete Subject

## Concepts Learned

-   JWT ownership
-   CRUD operations
-   Route protection
-   MVC architecture
-   Database queries
-   Secure resource access

------------------------------------------------------------------------

# 14. Notes Module

Implemented complete Notes CRUD.

## Completed

-   Create Note
-   Get All Notes
-   Get Note By ID
-   Update Note
-   Delete Note

This follows the same MVC + JWT ownership pattern used by the other
modules.

------------------------------------------------------------------------

# 15. Calendar Module --- Backend

The Calendar module was implemented as a complete CRUD feature.

## Core Data

Calendar events contain:

-   Event title
-   Description
-   Event date
-   Start time
-   End time
-   Reminder
-   Status
-   Event ID
-   User ownership

## Backend Operations

``` text
POST   /api/calendar
GET    /api/calendar
GET    /api/calendar/:id
PUT    /api/calendar/:id
DELETE /api/calendar/:id
```

The frontend communicates with these endpoints through
`calendarService.js`.

------------------------------------------------------------------------

# 16. Calendar Module --- Frontend

## Objective

Connect the React calendar UI to the database and make calendar events
fully interactive.

The calendar now:

-   Displays the current month.
-   Supports previous/next month navigation.
-   Supports a Today button.
-   Fetches events from the backend.
-   Displays events inside calendar cells.
-   Supports adding events.
-   Supports editing events.
-   Supports deleting events.

The completed calendar UI displays events directly inside the correct
day cells.

Example:

``` text
August 2026

             11
       ┌──────────────────────┐
       │ Updated Operating    │
       │ Systems Lab           │
       │ 11:00 - 21:04        │
       │ Edit   Delete         │
       └──────────────────────┘
```

------------------------------------------------------------------------

# 17. Calendar Frontend --- Add Event

Created:

``` text
AddEventModal.jsx
AddEventModal.css
```

## Add Event Form

Fields:

-   Event Title
-   Description
-   Event Date
-   Start Time
-   End Time
-   Reminder
-   Status

## Frontend Flow

``` text
User clicks "+ Add Event"
        ↓
AddEventModal opens
        ↓
User fills form
        ↓
Validation
        ↓
calendarService.createEvent()
        ↓
POST /api/calendar
        ↓
Backend
        ↓
MySQL
        ↓
fetchEvents()
        ↓
Calendar updates
```

## Validation Added

-   Event title required.
-   Event date required.
-   End time must be later than start time.

## Debugging

Initially, clicking the button only produced a console message.

The issue was traced through:

``` text
Button
 ↓
Modal state
 ↓
Modal component
 ↓
Form submit
 ↓
API service
```

The frontend connection was corrected.

------------------------------------------------------------------------

# 18. Calendar CSS Debugging

The Add Event modal initially appeared as unstyled browser-default HTML.

Symptoms:

-   Default browser fonts
-   Default input styling
-   Default buttons
-   No modal layout
-   No overlay styling

### Cause

The modal CSS was not correctly connected/imported.

### Solution

Connected:

``` javascript
import "./AddEventModal.css";
```

and verified the CSS file path.

The modal then displayed with the intended UI styling.

------------------------------------------------------------------------

# 19. Calendar Date Bug

## Problem

An event selected for date `20` appeared on date `19`.

This was caused by JavaScript date parsing/timezone conversion.

A value such as:

``` text
2026-08-20T18:30:00.000Z
```

could be converted into a local date that appeared as the previous
calendar day.

## Solution

Dates are now treated as date strings instead of converting them through
`new Date()` unnecessarily.

Calendar matching uses:

``` javascript
const dateString =
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

return events.filter(
    (event) =>
        event.event_date?.split("T")[0] === dateString
);
```

For editing an event, the date field uses:

``` javascript
String(event.event_date).substring(0, 10)
```

This preserves:

``` text
2026-08-20
```

instead of allowing timezone conversion to change it to:

``` text
2026-08-19
```

## Lesson

For calendar-only date fields, avoid unnecessary JavaScript `Date`
conversion when the database already provides the correct `YYYY-MM-DD`
portion.

------------------------------------------------------------------------

# 20. Calendar Event Display

The React calendar creates a list of calendar days and checks which
backend events belong to each day.

Conceptually:

``` text
Calendar Cell
     ↓
Build YYYY-MM-DD
     ↓
Compare with event.event_date
     ↓
Matching events
     ↓
Render event inside cell
```

This successfully connected the backend event data to the calendar grid.

The browser console was used extensively to verify:

``` text
Calendar cell: 2026-08-20
Events from backend: Array(...)
```

This confirmed that:

1.  Events were arriving from the backend.
2.  Calendar cells were generating correct date strings.
3.  The remaining issue was date matching/timezone handling rather than
    API connectivity.

------------------------------------------------------------------------

# 21. Calendar Edit Event

Created:

``` text
EditEventModal.jsx
EditEventModal.css
```

## Edit Flow

``` text
User clicks Edit
        ↓
Selected event stored in state
        ↓
EditEventModal opens
        ↓
Existing event data loaded
        ↓
User changes fields
        ↓
Validation
        ↓
updateEvent()
        ↓
PUT /api/calendar/:id
        ↓
fetchEvents()
        ↓
Calendar refreshes
```

## Existing Data Loaded Into Form

-   Title
-   Description
-   Date
-   Start time
-   End time
-   Reminder
-   Status

## Important Date Handling

The edit modal preserves the date using:

``` javascript
String(event.event_date).substring(0, 10)
```

This prevents the previously discovered timezone bug.

## Edit Validation

-   Event must exist.
-   Title required.
-   Date required.
-   End time must be later than start time.

## UI

The edit modal was initially unstyled.

After adding the correct CSS, the modal became visually consistent with
the Add Event modal.

------------------------------------------------------------------------

# 22. Calendar Delete Event

Implemented delete functionality.

## Delete Flow

``` text
User clicks Delete
        ↓
Confirmation dialog
        ↓
deleteEvent(event.event_id)
        ↓
DELETE /api/calendar/:id
        ↓
Backend deletes record
        ↓
fetchEvents()
        ↓
Calendar refreshes
```

A confirmation is shown before deletion:

``` text
Are you sure you want to delete "Event Title"?
```

This prevents accidental deletion.

------------------------------------------------------------------------

# 23. Calendar Service

The frontend service layer now contains:

``` javascript
getAllEvents()
getEventById(eventId)
createEvent(eventData)
updateEvent(eventId, eventData)
deleteEvent(eventId)
```

The service communicates with:

``` text
/api/calendar
```

and keeps API logic out of React components.

This is another example of separation of concerns.

------------------------------------------------------------------------

# 24. Calendar Testing

The calendar was tested through several stages.

## Test 1 --- Add Event

Verified that:

-   Modal opens.
-   Form accepts input.
-   POST request reaches backend.
-   Event is inserted into MySQL.
-   Calendar refreshes.

## Test 2 --- Event Display

Verified that backend events appear inside the correct calendar cells.

## Test 3 --- Date Accuracy

Found and fixed the `20 → 19` timezone bug.

## Test 4 --- Edit Event

Verified that:

-   Edit button opens the correct event.
-   Existing values are loaded.
-   Changes are sent to backend.
-   Calendar refreshes after update.

## Test 5 --- Delete Event

Verified that:

-   Delete button works.
-   Confirmation appears.
-   Event is deleted.
-   Calendar refreshes.

------------------------------------------------------------------------

# 25. Git Workflow

Git and GitHub are being used throughout development.

General workflow:

``` bash
git status
git add .
git commit -m "meaningful message"
git push
```

The project is being committed feature-by-feature instead of making one
huge commit at the end.

Examples of feature-level milestones include:

-   Backend setup
-   Database work
-   Task APIs
-   Authentication
-   User profile
-   Subjects
-   Notes
-   Calendar
-   Add Event
-   Calendar event display
-   Edit Event
-   Delete Event

## Git Lesson

Commit after a complete, tested feature rather than after every tiny
code change.

------------------------------------------------------------------------

# 26. Current Backend Modules

## Authentication

-   Register
-   Login
-   JWT authentication
-   Protected routes

## User Profile

-   Get profile
-   Update profile
-   Change password

## Subjects

-   Create
-   Read
-   Update
-   Delete

## Tasks

-   Create
-   Read all
-   Read by ID
-   Update
-   Delete

## Notes

-   Create
-   Read all
-   Read by ID
-   Update
-   Delete

## Calendar

-   Create event
-   Read events
-   Read event by ID
-   Update event
-   Delete event

## Goals

-   Create Goal
-   Get All Goals
-   Get Goal By ID
-   Update Goal
-   Delete Goal
-   Track progress percentage
-   Goal status
-   JWT ownership

## Study Sessions

-   Create Study Session
-   Get All Study Sessions
-   Get Study Session By ID
-   Update Study Session
-   Delete Study Session
-   Automatic duration calculation
-   Session notes
-   JWT ownership

## Pomodoro

-   Create Pomodoro Session
-   Get All Pomodoro Sessions
-   Get Pomodoro Session By ID
-   Update Pomodoro Session
-   Delete Pomodoro Session
-   Focus-duration calculation
-   Subject-wise tracking
-   Task-wise tracking
-   Break tracking
-   JWT ownership

------------------------------------------------------------------------

# 27. Dashboard Analytics

The backend contains a dashboard summary system.

## Summary Endpoint

``` text
GET /api/dashboard/summary
```

The dashboard aggregates:

-   Total subjects
-   Total tasks
-   Completed tasks
-   Pending tasks
-   Total notes
-   Total goals
-   Completed goals
-   Total study sessions
-   Total study hours
-   Total Pomodoro sessions
-   Total Pomodoro hours

## Subject Analytics

``` text
GET /api/dashboard/subject-analysis
```

Provides:

-   Subject ID
-   Subject name
-   Total study sessions
-   Total study hours
-   Total Pomodoro sessions
-   Total Pomodoro hours

## Weekly Analytics

The weekly analytics system provides:

-   Study sessions per day
-   Study hours per day
-   Monday--Sunday ordering
-   Zero-filled missing days

Future enhancements:

-   Weekly study target
-   Weekly consistency score
-   Longest study streak
-   Weekly AI insights

------------------------------------------------------------------------

# 28. Database Modules

The database currently includes the core entities required by SynapseOS:

``` text
users
subjects
tasks
goals
progress
calendar_events
notes
settings
pomodoro_sessions
contests
```

The database is relational and uses foreign keys to enforce
relationships.

------------------------------------------------------------------------

# 29. Major Problems Solved

## Problem 1 --- Wrong Controller Filename

**Cause:** Import path did not match filename.\
**Solution:** Corrected filename/import.

## Problem 2 --- MySQL Connection Failure

**Cause:** Incorrect credentials.\
**Solution:** Corrected `.env`.

## Problem 3 --- Foreign Key Error 1452

**Cause:** Child record referenced a nonexistent parent.\
**Solution:** Inserted parent records first.

## Problem 4 --- Hardcoded Task Data

**Cause:** Controller still returned an array.\
**Solution:** Connected controller to model and MySQL.

## Problem 5 --- Handler Must Be a Function

**Cause:** Incorrect export.\
**Solution:** Corrected `module.exports`.

## Problem 6 --- ERR_HTTP_HEADERS_SENT

**Cause:** Incorrect function/bracket structure and multiple response
paths.\
**Solution:** Refactored model/controller logic so every request sends
one response.

## Problem 7 --- JWT Verification Issue

**Cause:** Token verification/configuration issue during authentication
development.\
**Solution:** Debugged and resolved the JWT flow.

## Problem 8 --- React Add Event Did Nothing

**Cause:** Frontend interaction was not correctly connected to modal
state/API flow.\
**Solution:** Connected the Add Event button → modal → service →
backend.

## Problem 9 --- Add Event Modal Had No CSS

**Cause:** CSS import/path issue.\
**Solution:** Corrected the stylesheet connection.

## Problem 10 --- Calendar Date Shifted by One Day

**Cause:** UTC/local timezone conversion.\
**Solution:** Compared date strings directly and used `substring(0, 10)`
for form initialization.

## Problem 11 --- Edit Modal Had No Styling

**Cause:** Edit modal CSS was missing/not connected.

**Solution:** Added and connected `EditEventModal.css`.

------------------------------------------------------------------------

# 30. Important Development Lessons

## 1. Separate Responsibilities

Do not put everything inside one file.

``` text
Component → Service → API → Controller → Model → Database
```

## 2. Debug One Layer at a Time

When something fails:

``` text
Frontend?
   ↓
Service?
   ↓
API?
   ↓
Route?
   ↓
Controller?
   ↓
Model?
   ↓
Database?
```

Do not randomly modify multiple files.

## 3. Read Error Messages Carefully

Stack traces often reveal:

-   exact file
-   exact line
-   exact import
-   exact missing module
-   exact function causing the problem

## 4. SQL Belongs in Models

Controllers should not contain database queries.

## 5. Never Trust Client-Supplied Ownership

Use:

``` javascript
req.user.user_id
```

from the JWT instead of trusting:

``` javascript
req.body.user_id
```

## 6. Dates Are Tricky

Database dates and JavaScript `Date` objects can interact badly with UTC
conversion.

For date-only calendar values, preserve:

``` text
YYYY-MM-DD
```

instead of unnecessarily converting them into `Date` objects.

## 7. Build Complete Features

A better development strategy is:

``` text
Backend
 ↓
API
 ↓
Frontend service
 ↓
Frontend UI
 ↓
Testing
 ↓
Git commit
```

instead of starting many incomplete modules.

------------------------------------------------------------------------

# 31. Current Project Status

## Backend

  Module                     Status
  -------------------------- ----------------
  Express Server             ✅ Complete
  MySQL Connection           ✅ Complete
  MVC Architecture           ✅ Complete
  Environment Variables      ✅ Complete
  Authentication             ✅ Complete
  User Profile               ✅ Complete
  Subjects                   ✅ Complete
  Tasks                      ✅ Complete
  Notes                      ✅ Complete
  Calendar Backend           ✅ Complete
  Goals                      ✅ Implemented
  Study Sessions             ✅ Implemented
  Pomodoro                   ✅ Implemented
  Dashboard Analytics        ✅ Implemented
  AI Recommendation Engine   ⬜ Pending

## Frontend

  Feature                  Status
  ------------------------ -------------
  React Application        ✅ Started
  Dashboard Layout         ✅ In use
  Calendar UI              ✅ Complete
  Add Event Modal          ✅ Complete
  Event Display            ✅ Complete
  Edit Event Modal         ✅ Complete
  Delete Event             ✅ Complete
  Calendar Navigation      ✅ Complete
  Today Button             ✅ Complete
  Calendar Date Bug        ✅ Fixed
  Calendar Styling         ✅ Complete
  Frontend Documentation   🟡 Next

------------------------------------------------------------------------

# 32. Calendar Feature --- Final State

The calendar currently supports the complete event lifecycle:

``` text
CREATE
  ↓
POST /api/calendar
  ↓
MySQL
  ↓
DISPLAY
  ↓
React Calendar Grid
  ↓
EDIT
  ↓
PUT /api/calendar/:id
  ↓
DISPLAY UPDATED EVENT
  ↓
DELETE
  ↓
DELETE /api/calendar/:id
  ↓
REFRESH CALENDAR
```

The calendar is therefore no longer a static frontend component. It is
connected to the backend and database.

------------------------------------------------------------------------

# 33. Next Development Priorities

## Immediate

1.  Update frontend documentation.
2.  Clean up temporary `console.log()` statements.
3.  Improve calendar event styling.
4.  Add better event status styling.
5.  Improve delete confirmation UI.
6.  Test calendar after page refresh.
7.  Test calendar across month navigation.
8.  Test multiple events on the same day.

## Frontend Expansion

Next modules can be connected using the same pattern:

``` text
React Component
     ↓
Service
     ↓
REST API
     ↓
Controller
     ↓
Model
     ↓
MySQL
```

Recommended order:

1.  Tasks frontend
2.  Notes frontend
3.  Subjects frontend
4.  Goals frontend
5.  Study Sessions frontend
6.  Pomodoro frontend
7.  Dashboard Analytics frontend

## Later

-   Contest integration
-   Advanced analytics
-   Productivity score visualization
-   AI recommendation engine
-   Personalized insights
-   Deployment
-   Azure AI integration

------------------------------------------------------------------------

# 34. Interview Preparation Notes

## Explain SynapseOS in One Answer

> SynapseOS is a full-stack productivity and study-management platform
> built using React, Node.js, Express, and MySQL. The backend follows an
> MVC architecture and exposes REST APIs for modules such as
> authentication, tasks, notes, subjects, calendar events, goals, study
> sessions, Pomodoro sessions, and analytics. JWT is used for
> authentication and bcrypt is used for password hashing. The React
> frontend communicates with the backend through service modules.

## Explain MVC

> Routes define endpoints, controllers handle request and response
> logic, models communicate with the database, and middleware handles
> cross-cutting concerns such as authentication.

## Explain JWT

> After successful login, the server signs a JWT containing the
> authenticated user's identity. The client sends the token in the
> Authorization header, and middleware verifies it before allowing
> access to protected routes.

## Explain Calendar Architecture

> The React calendar fetches events through a frontend service. The
> service calls the REST API, the controller calls the calendar model,
> the model queries MySQL, and the resulting events are rendered into
> calendar cells by matching the `YYYY-MM-DD` date portion.

## Explain the Date Bug

> The event date was being affected by UTC-to-local timezone conversion.
> Because the calendar only needed a date rather than an instant in
> time, I stopped converting the date through JavaScript's `Date` object
> and compared the `YYYY-MM-DD` string directly.

------------------------------------------------------------------------

# 35. Final Development Philosophy

The most important lessons from building SynapseOS so far are:

1.  **Understand the architecture instead of only copying code.**
2.  **Debug systematically.**
3.  **Keep SQL inside models.**
4.  **Keep API calls inside service files.**
5.  **Do not trust client-provided ownership information.**
6.  **Test every feature before committing.**
7.  **Use Git to preserve stable milestones.**
8.  **Treat bugs as part of the learning process.**
9.  **Build one complete feature at a time.**
10. **Document what was learned, not just what was coded.**

------------------------------------------------------------------------

# 36. Current Milestone

## 🎯 Milestone: Calendar Feature Complete

### Completed

-   [x] Calendar page
-   [x] Month navigation
-   [x] Today button
-   [x] Fetch events from backend
-   [x] Display events in calendar grid
-   [x] Add Event
-   [x] Add Event validation
-   [x] Add Event API integration
-   [x] Edit Event
-   [x] Edit Event validation
-   [x] Edit Event API integration
-   [x] Delete Event
-   [x] Delete confirmation
-   [x] Calendar refresh after create/update/delete
-   [x] Date timezone bug fixed
-   [x] Add Event modal styling
-   [x] Edit Event modal styling
-   [x] Git commits for completed milestones

### Current Focus

**Move from Calendar implementation to frontend documentation and then
continue integrating the remaining SynapseOS modules.**

------------------------------------------------------------------------

# 📌 End of Current Journal

SynapseOS has progressed from a basic Express/MySQL backend into a
multi-module full-stack application with authentication, database-backed
CRUD features, analytics, and a working interactive calendar.

The Calendar module is the latest fully integrated frontend feature and
serves as a strong example of the complete SynapseOS architecture:

``` text
React UI
   ↓
Frontend Service
   ↓
REST API
   ↓
Express Route
   ↓
Controller
   ↓
Model
   ↓
MySQL
```

**Next milestone: Frontend module documentation and continued
integration of the remaining productivity features.**

# Latest Development Checkpoint — August 2026

## Profile Management

Completed:

- Profile retrieval
- Profile editing
- Username/email duplicate validation
- Password change
- Current-password verification
- bcrypt password hashing
- Frontend profile integration

The profile module was committed and the project was tagged at `v1.2.0`.

Avatar support was intentionally deferred to the final polishing phase.

## Notifications

The notification backend was completed and notification fetching was successfully verified.

## Frontend Navigation

Sidebar navigation was updated so the major dashboard sections use their actual React Router paths. Logout now removes the JWT token and stored user data before redirecting to login.

## YouTube Productivity — Starting

The next major feature is YouTube Productivity.

The first implementation task is configuring YouTube Data API v3 credentials.

Planned architecture:

```text
React
  ↓
SynapseOS Backend
  ↓
YouTube Data API v3
```

The API key must remain server-side in `.env`.

## Current Development Principle

Core functionality is being completed before final polishing.

Deferred polishing work includes:

- Avatar
- Dark theme
- Responsive refinement
- Final UI/UX improvements




37. Settings Integration

Objective

Connect the Settings page to the SynapseOS application so user settings
can affect the wider application.

Completed

Created frontend Settings API service.

Implemented getSettings().

Implemented updateSettings(settings).

Created SettingsContext.

Connected SettingsProvider to the React application.

Connected the Settings page to the shared context.

Added settings UI for appearance/preferences.

Improved Settings page responsiveness.

Architecture

Settings Page
      ↓
SettingsContext
      ↓
Settings Service
      ↓
REST API
      ↓
Settings Backend
      ↓
MySQL

Current Limitation

The global dark-mode toggle has not yet been made fully reliable across
the entire application.

The remaining task is to make the theme state propagate consistently to
the application root and all page/component styles.

38. YouTube Productivity --- Planning

Objective

Create a YouTube experience focused on learning and productivity instead
of unrestricted entertainment browsing.

The feature is intended to support:

educational video discovery

programming tutorials

AI/ML learning

DSA learning

DBMS learning

study resources

future notes

watch-time tracking

completion tracking

learning analytics

Initial Architecture

React YouTube UI
       ↓
Frontend Service
       ↓
REST API
       ↓
YouTube Controller
       ↓
YouTube Service
       ↓
YouTube Data API v3

39. Google Cloud / YouTube Data API v3

Objective

Connect SynapseOS to the public YouTube Data API.

Completed

Selected the Google Cloud project.

Located YouTube Data API v3 in the API Library.

Selected public data access.

Created API credentials.

Restricted the API key to the required YouTube API.

Stored the API key in backend environment variables.

Verified the credential using backend API testing.

Security Rule

The YouTube API key is never placed in React frontend code.

The frontend communicates only with the SynapseOS backend.

40. YouTube Backend Service

Created:

backend/src/services/youtubeService.js

The service uses Axios to communicate with:

https://www.googleapis.com/youtube/v3/search

Search Parameters

The backend sends:

part=snippet

search query

type=video

maxResults

regionCode=IN

relevanceLanguage=en

safeSearch=moderate

API key

optional pageToken

The service limits maxResults to 50.

Response Normalization

The backend converts YouTube API results into a frontend-friendly
format:

videoId
title
description
thumbnail
channelTitle
channelId
publishedAt

Pagination information is returned separately.

41. YouTube Controller

Created:

backend/src/controllers/youtubeController.js

The controller handles:

searchYouTubeVideos()
getYouTubeVideoDetails()

Search Flow

GET /api/youtube/search?q=...
        ↓
Controller validates query
        ↓
youtubeService.searchVideos()
        ↓
YouTube Data API
        ↓
Normalized response
        ↓
JSON response

The controller validates that the search query exists and is not empty.

42. YouTube Routes

Created:

backend/src/routes/youtubeRoutes.js

The route layer connects YouTube endpoints to the controller.

Current intended routes:

GET /api/youtube/search
GET /api/youtube/video/:videoId

The route import structure was debugged after a duplicate declaration
error.

43. YouTube Backend Debugging

Several API and JavaScript issues were encountered.

API Identity Error

The backend initially returned an error stating that the caller had no
established identity.

This was caused by the YouTube API request not including a valid API
key.

The service was corrected to send:

key: process.env.YOUTUBE_API_KEY

Invalid API Key

The API initially rejected the credential.

The Google Cloud credential configuration was corrected and the API key
was restricted appropriately.

Duplicate JavaScript Declaration

Node.js reported:

Identifier 'searchYouTubeVideos' has already been declared

The cause was duplicate destructuring imports in youtubeRoutes.js.

The route file was corrected so the controller is imported once.

Testing

The backend YouTube search endpoint was successfully tested using
Postman.

44. YouTube Frontend

Objective

Build a focused learning interface inside SynapseOS.

Created:

frontend/src/pages/YouTube/YouTube.jsx
frontend/src/pages/YouTube/YouTube.css
frontend/src/pages/YouTube/YouTubeWatch.jsx
frontend/src/pages/YouTube/YoutubeWatch.css
frontend/src/services/youtubeService.js

Added the YouTube route to:

frontend/src/routes/AppRoutes.jsx

Current Page

The YouTube page is available at:

http://localhost:5173/youtube

The page now renders successfully.

Current UI

The current interface contains:

YouTube Focus heading

productivity-focused subtitle

search field

search button

popular learning categories

empty-state learning message

YouTube watch-page component

Example categories:

C++ DSA
Machine Learning
DBMS
Java
Web Development

45. Current YouTube UI State

The UI is functional but is currently in the visual-polishing phase.

The current design has a large empty state when no search has been
performed.

The next improvement is a responsive video-card grid.

Target layout:

Search
   ↓
Video results
   ↓
┌────────────┐ ┌────────────┐ ┌────────────┐
│ Thumbnail  │ │ Thumbnail  │ │ Thumbnail  │
│            │ │            │ │            │
└────────────┘ └────────────┘ └────────────┘
  Title          Title          Title
  Channel        Channel        Channel
  Views          Views          Views

The UI should eventually support:

responsive cards

loading skeletons

search errors

empty search results

video metadata

watch page

save video

study resources

notes

focus mode

46. Git and Environment Security

During YouTube development, environment-variable handling was reviewed.

The repository contains:

node_modules/
.env

The backend API key is kept locally in:

backend/.env

and is not intended to be committed.

The tracked .env file was removed from Git tracking during cleanup.

Important Development Lesson

.gitignore prevents future tracking of matching untracked files. It
does not automatically remove a file that Git is already tracking.

The correct cleanup command is:

git rm --cached backend/.env

The API key was removed from the local .env before the cleanup commit.

47. Current Development Workflow

The project continues to use feature-based development:

Implement
   ↓
Test backend/API
   ↓
Connect frontend service
   ↓
Build UI
   ↓
Debug
   ↓
Test again
   ↓
Git commit

This approach has been especially useful during YouTube development
because API errors can be isolated from frontend rendering errors.

48. Current Project Status

Backend

Authentication        ✅
User Profile          ✅
Subjects              ✅
Tasks                 ✅
Notes                 ✅
Calendar              ✅
Goals                 ✅
Study Sessions        ✅
Pomodoro              ✅
Dashboard             ✅
Analytics             ✅
Notifications         ✅
Settings API          ✅
YouTube Search API    ✅

Frontend

Dashboard              ✅
Tasks                  ✅
Notes                  ✅
Calendar               ✅
Goals                  ✅
Study Sessions         ✅
Pomodoro               ✅
Analytics              ✅
Notifications          ✅
Settings               🟡
YouTube page           ✅
YouTube search UI      🟡
51. Day 22 — Modern Dark SaaS UI/UX Overhaul

## Objective
Elevate the visual standard of SynapseOS from an early prototype into a professional, modern Dark SaaS product (inspired by Linear, Vercel, and Raycast) across all 12 modules while strictly preserving all backend routes, database models, and application functionality.

## Completed
- Built a centralized design token system in `frontend/src/styles/theme.css`:
  - Deep obsidian background (`#090d16`), elevated card surface (`#111726`), secondary containers (`#172033`), and dialog popovers (`#1e293b`).
  - Electric Blue core accent (`#3b82f6`) with hover states, subtle translucent backgrounds, and soft glow shadows.
  - Premium typography utilizing `Plus Jakarta Sans` for clean UI reading and `JetBrains Mono` for timers and data readouts.
- Redesigned all 12 core application pages:
  - **Dashboard:** Hero welcome banner with glowing AI aura, 4-card metric grid, and quick action bar.
  - **Tasks:** Priority-badged cards with custom animated completion checkboxes and search/filter toolbars.
  - **Notes:** 2-column masonry grid with pinned note highlights and color tag categorization.
  - **Calendar:** Timezone-safe month grid, clear day cell borders, and dark modal dialogs.
  - **Goals:** Responsive cards with gradient progress meters and slider update modals.
  - **Study Sessions & Pomodoro:** Modern digital focus timer with tabular numerals, mode switcher (25/5/15), and session audit history.
  - **Contests:** Multi-platform tracker with badges for LeetCode, Codeforces, CodeChef, HackerRank, and AtCoder.
  - **Stats / Analytics:** Recharts integration with custom tooltips, daily bar charts, and subject breakdown meters.
  - **YouTube Study Hub:** 3-column video grid with 16:9 thumbnail previews, hover play overlays, and embedded watch player.
  - **Auth:** Dark glassmorphic login and registration cards with ambient lighting orbs and brain artwork.
- Verified compilation with `npm run build` (0 errors, 0 broken imports, 298ms).

------------------------------------------------------------------------

52. Day 23 — Google OAuth 2.0 Full-Stack Integration

## Objective
Implement standard, secure Google Single Sign-On ("Continue with Google") on both Login and Register pages, integrating with the existing JWT authentication system and MySQL database without breaking email/password accounts.

## Completed
- Installed `google-auth-library` in `backend/package.json`.
- Implemented `googleLogin` controller in `backend/src/controllers/authController.js` supporting dual token verification:
  - Google ID token verification via `client.verifyIdToken`.
  - Google access token verification via Google OAuth2 userinfo endpoint.
- Implemented `registerGoogleUser` and `findUserByUsername` in `backend/src/models/authModel.js`:
  - Handled MySQL `password_hash NOT NULL` constraints by generating secure random bcrypt hashes.
  - Implemented auto-incrementing username suffix generation on collisions.
  - Registered `POST /api/auth/google` in `backend/src/routes/authRoutes.js`.
- Built `frontend/src/services/googleAuth.js` implementing dynamic Google Identity Services (GIS) script loading and popup authorization.
- Added `googleLogin` in `frontend/src/services/authService.js`.
- Wired the "Continue with Google" button on both `Login.jsx` and `Register.jsx` with active loading indicators and error handling.
- Created `backend/.env.example` and `frontend/.env.example` templates.
- Verified backend syntax (`node -c`) and frontend production build (`npm run build` in 214ms, 0 errors).

------------------------------------------------------------------------

53. Current Development Status Summary

### Backend
- Authentication (Email/Password + Google OAuth 2.0)  ✅ Complete
- User Profile & Password Change                     ✅ Complete
- Subjects Module                                    ✅ Complete
- Tasks Module                                       ✅ Complete
- Notes Base                                         ✅ Complete
- Calendar & Scheduling                              ✅ Complete
- Goals & Milestones                                 ✅ Complete
- Study Sessions                                     ✅ Complete
- Pomodoro Engine                                    ✅ Complete
- Dashboard Summary                                  ✅ Complete
- Analytics Engine                                   ✅ Complete
- Contests Tracker                                   ✅ Complete
- Notifications                                      ✅ Complete
- Settings API                                       ✅ Complete
- YouTube Data API Proxy                             ✅ Complete

### Frontend
- Obsidian Dark SaaS Design System                   ✅ Complete
- Dashboard Command Center                           ✅ Complete
- Tasks Workspace                                    ✅ Complete
- Notes Knowledge Base                               ✅ Complete
- Interactive Calendar                               ✅ Complete
- Goals Tracker                                      ✅ Complete
- Study Sessions Logger                              ✅ Complete
- Pomodoro Digital Clock                             ✅ Complete
- Contests Hub                                       ✅ Complete
- Analytics / Stats Visualizations                   ✅ Complete
- YouTube Focus Hub & 16:9 Watch Player              ✅ Complete
- User Profile & Settings                            ✅ Complete
- Auth Cards (Login / Register / Google SSO)         ✅ Complete

### Next Milestone: AI Study Suite & Cloud Deployment
- AI Study Plan Generator based on task deadlines and subject weights.
- Smart Flashcard and Notes Summarization Engine.
- Production Cloud Database & Containerized Deployment (Docker + CI/CD).

