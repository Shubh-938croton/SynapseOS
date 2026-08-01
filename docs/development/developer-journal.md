# Developer Journal

---

## Milestone 1

### Objective

Create backend architecture.

### Completed

✔ Express Server

✔ Routes

✔ Controllers

✔ Models

### Learned

MVC Architecture

Browser

↓

Routes

↓

Controllers

↓

Models

↓

Database

### Problems

Problem

Cannot find module taskController

Reason

Wrong filename

Solution

Renamed file.

### Interview Notes

Why MVC?

MVC separates responsibilities.


# 🚀 SynapseOS Developer Journal

Developer: Shubh Kamal

Project: SynapseOS

Start Date: July 2026

Tech Stack:
- Node.js
- Express.js
- MySQL
- JavaScript
- Git & GitHub

---

# Day 1 (27/07/2026)

## Objective

Set up the backend architecture for SynapseOS.

## Completed

- Created backend folder structure.
- Initialized Node.js project.
- Installed dependencies:
  - express
  - mysql2
  - dotenv
  - cors
  - nodemon
- Created Express server.
- Created app.js and server.js.
- Created MVC folder structure.

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   └── server.js
```

## Learned

### MVC Architecture

Browser

↓

Routes

↓

Controllers

↓

Models

↓

Database

Each layer should have a single responsibility.

## Problems Faced

### Problem

Node could not find controller files.

### Reason

Controller filenames and import names did not match.

### Solution

Renamed controller files correctly.

## Interview Notes

Q: Why use MVC?

Answer:

MVC separates application logic into independent layers.

- Routes handle URLs.
- Controllers process requests.
- Models communicate with the database.

This improves maintainability and scalability.

---

# Day 2 (28/07/2026)

## Objective

Connect Express backend with MySQL.

## Completed

- Installed mysql2.
- Created database.js.
- Connected Node.js with MySQL.
- Created .env file.
- Stored database credentials securely.

## Learned

Never hardcode credentials.

Instead use

process.env

to improve security.

## Problems Faced

### Problem

Database connection failed.

### Reason

Incorrect MySQL credentials.

### Solution

Verified username and password.

Successfully connected backend with MySQL.

## Interview Notes

Q: Why use .env?

Answer

Sensitive information like database passwords should never be pushed to GitHub.

Environment variables improve security and portability.

---

# Day 3 (29/07/2026)

## Objective

Design SynapseOS database.

## Completed

Created database

synapseos

Created tables

- users
- subjects
- tasks
- goals
- progress
- calendar_events
- notes
- settings
- pomodoro_sessions
- contests

Established relationships using foreign keys.

## Learned

Relational databases maintain relationships using foreign keys.

One user

↓

Many subjects

↓

Many tasks

## Problems Faced

### Problem

Tables appeared in Workbench but contained no data.

### Reason

Schema was created but no INSERT statements had been executed.

### Solution

Inserted sample records.

---

### Problem

Error 1452

Foreign key constraint failed.

### Reason

Task referenced subject_id that did not exist.

### Solution

Inserted parent table (subjects) before child table (tasks).

## Interview Notes

Q: Why use foreign keys?

Answer

Foreign keys maintain referential integrity.

They prevent invalid references from being inserted into the database.

---

# Day 4 (30/07/2026)

## Objective

Replace hardcoded task data with MySQL.

## Completed

Created GET API

GET /api/tasks

Successfully connected

Browser

↓

Express

↓

Controller

↓

Model

↓

MySQL

↓

JSON Response

Inserted sample data into

users

subjects

tasks

Configured

database.js

using environment variables.

Successfully tested API.

http://localhost:5000/api/tasks

returned JSON from MySQL.

## Learned

The controller should never contain SQL.

SQL belongs inside models.

Controllers only

- receive requests
- call models
- send responses

## Problems Faced

### Problem

Server crashed.

Reason

package.json contained

"main":"index.js"

while the project used

server.js

Solution

Updated package.json.

---

### Problem

Access denied for user root.

Reason

Incorrect DB_PASSWORD.

Solution

Updated .env.

---

### Problem

Browser returned hardcoded tasks.

Reason

Controller still referenced hardcoded array.

Solution

Created taskModel.js.

Moved SQL queries into model.

Connected controller with model.

## Interview Notes

Q: Explain the request flow.

Answer

Browser

↓

Express Server

↓

Route

↓

Controller

↓

Model

↓

MySQL

↓

Controller

↓

Browser

---

Q: Why keep SQL inside Models?

Answer

Models are responsible for communicating with databases.

Keeping SQL out of controllers follows Separation of Concerns and improves maintainability.

---

# Current Project Status

Backend

✅ Express Server

✅ MySQL Connection

✅ MVC Architecture

✅ Environment Variables

✅ Users Table

✅ Subjects Table

✅ Tasks Table

✅ GET /api/tasks

Database

✅ Schema Designed

✅ Relationships Created

✅ Sample Data Inserted

Git

✅ GitHub Repository

✅ Regular Commits

---

# Skills Learned

Node.js

✔ Modules

✔ package.json

✔ npm

✔ Environment Variables

Express

✔ Routing

✔ Controllers

✔ Middleware

✔ JSON APIs

Database

✔ MySQL

✔ SQL

✔ Foreign Keys

✔ Relationships

✔ CRUD (Read Completed)

Git

✔ Commits

✔ Branches

✔ GitHub

Architecture

✔ MVC

✔ Layered Architecture

✔ REST API

---

# Next Goals

Task Module

⬜ POST /api/tasks

⬜ GET /api/tasks/:id

⬜ PUT /api/tasks/:id

⬜ DELETE /api/tasks/:id

Authentication

⬜ Register

⬜ Login

⬜ JWT

Frontend

⬜ React

⬜ Dashboard

⬜ Task Management

AI Module

⬜ Student Performance Analysis

⬜ Productivity Recommendation

⬜ Personalized Insights

Deployment

⬜ Backend

⬜ Database

⬜ Frontend

⬜ Azure AI Integration

---

# Biggest Lessons

1. Always separate responsibilities.

2. Never hardcode credentials.

3. Keep SQL inside models.

4. Debug one layer at a time.

5. Build one complete feature before starting another.

---

# Total Progress

Backend Setup        ██████████ 100%

Database             ██████████ 100%

GET API              ██████████ 100%

CRUD                 ██░░░░░░░░ 25%

Authentication       ░░░░░░░░░░ 0%

Frontend             ░░░░░░░░░░ 0%

AI Module            ░░░░░░░░░░ 0%

Deployment           ░░░░░░░░░░ 0%n



## Day 5 (31/07/2026)

### Objective
Implement POST /api/tasks.

### Completed
- Added createTask() model
- Added createTask() controller
- Added POST route
- Tested API using Postman
- Successfully inserted tasks into MySQL

### Learned
- req.body
- express.json()
- Parameterized SQL queries
- HTTP 201 Created

### Problems Faced
TypeError: argument handler must be a function

Reason:
createTask was not exported correctly from taskController.js.

Solution:
Exported createTask in module.exports.


# 📅 Development Journal — 31/07/2026

## 🎯 Objective

Continue backend development of SynapseOS by implementing the Task CRUD APIs, testing endpoints using Postman, debugging backend issues, and strengthening understanding of Express.js MVC architecture.

---

## ✅ Work Completed

### 1. Implemented GET Task by ID API

Implemented the following endpoint:

GET /api/tasks/:id

#### Components Completed

- Model (`getTaskById`)
- Controller (`getTaskById`)
- Route Configuration
- Postman Testing

SQL Query Used

```sql
SELECT *
FROM tasks
WHERE task_id = ?;
```

Successfully retrieved a task using its unique ID.

---

### 2. Successfully Tested APIs

Verified the following endpoints using Postman.

| Method | Endpoint | Status |
|---------|----------|--------|
| GET | /api/tasks | ✅ Working |
| GET | /api/tasks/:id | ✅ Working |
| POST | /api/tasks | ✅ Working |

Verified all database changes using MySQL Workbench.

---

### 3. Debugging Session

Today's work involved solving several backend issues.

#### Error 1 — Route Not Found

Received:

```
Cannot GET /api/tasks/1
```

Cause:
- Incorrect API request / routing verification.

Solution:
- Verified Express routing.
- Verified app.js route registration.
- Restarted server after saving files.
- Tested using correct Postman configuration.

---

#### Error 2 — Incorrect Postman Request

Mistakenly entered

```
GET http://localhost:5000/api/tasks/1
```

inside the URL field.

Solution:

Selected **GET** from the request method and entered only

```
http://localhost:5000/api/tasks/1
```

inside the URL.

---

#### Error 3 — ERR_HTTP_HEADERS_SENT

Received:

```
Cannot set headers after they are sent to the client
```

Cause:

Incorrect structure inside `taskModel.js`.

The `createTask()` function was closed too early, causing part of the INSERT query to be placed inside `getTaskById()`.

This resulted in callbacks being executed incorrectly and Express attempting to send multiple responses.

Solution:

- Refactored taskModel.js
- Properly separated each model function
- Fixed misplaced braces
- Ensured each callback executes exactly once

---

### 4. JavaScript Concepts Learned

Learned about JavaScript function scope.

Functions declared inside another function cannot be exported or accessed outside that function.

Example:

```javascript
const createTask = () => {

    const getTaskById = () => {

    };

};
```

Understanding function scope helped identify why `getTaskById` was not accessible earlier.

---

### 5. MVC Architecture Reinforcement

Current request flow:

Client
↓
Route
↓
Controller
↓
Model
↓
Database

This reinforced the responsibility of each backend layer and simplified debugging.

---

## 📚 Concepts Learned

- Route Parameters (`req.params`)
- SQL SELECT with WHERE clause
- REST API Design
- Express Routing
- Callback Flow
- JavaScript Function Scope
- Express Error Handling
- API Testing using Postman
- Backend Debugging Methodology

---

## 🛠 Current Project Progress

Backend Setup

✅ Express Server
✅ MySQL Connection
✅ MVC Folder Structure

Task Module

✅ GET /api/tasks
✅ GET /api/tasks/:id
✅ POST /api/tasks
🟡 PUT /api/tasks/:id (Next)
⬜ DELETE /api/tasks/:id

---

## 💡 Key Takeaways

- Always test APIs after implementation.
- Read stack traces carefully before changing code.
- Keep model, controller, and routes separated.
- Use Postman to verify every endpoint.
- JavaScript scope and callback flow are critical in backend development.

---

## 📅 Next Session Goals

- Implement PUT /api/tasks/:id
- Test Update API
- Implement DELETE /api/tasks/:id
- Complete Task CRUD module
- Merge feature branch after successful testing



## Day 6 - Authentication Module (Part 1)

### Completed
- Created Authentication Module
- Installed bcrypt and jsonwebtoken
- Implemented User Registration API
- Password hashing using bcrypt
- Added duplicate email validation
- Added duplicate username validation
- Tested registration successfully using Postman

### Concepts Learned
- Authentication flow
- Password hashing
- HTTP Status Codes (201, 409, 500)
- MVC architecture for authentication
- Express request lifecycle
- ERR_HTTP_HEADERS_SENT debugging

### Challenges Faced
- Duplicate registration logic caused ERR_HTTP_HEADERS_SENT.
- Learned that every request must send exactly one response.



## Day 6 - JWT Authentication

### Completed
- Implemented JWT token generation
- Added login API with bcrypt verification
- Created authentication middleware
- Protected task routes using middleware
- Tested authentication flow

### Concepts Learned
- JSON Web Tokens (JWT)
- jwt.sign()
- jwt.verify()
- Bearer Token authentication
- Express middleware
- Route protection

### Pending
- Fix JWT verification issue causing token rejection.



// resolved the error.
## Day 6 - Authentication & Task Security

### Completed
- Implemented JWT Authentication
- Added authentication middleware
- Protected task routes
- Integrated authenticated user into task creation
- Removed user_id from client requests
- Used req.user.user_id from JWT
- Tested secure task creation

### Concepts Learned
- JWT Authentication
- Express Middleware
- Authorization Header
- Secure API Design
- Using authenticated user context





## Date: 02 August 2026

### Module: User Profile

### Objectives
- Build secure User Profile APIs
- Integrate JWT authentication
- Allow users to manage their own profile
- Implement secure password change functionality

### Work Completed

#### Get Profile API
- Created `userModel.js`
- Implemented `getUserProfile()`
- Retrieved authenticated user's profile using JWT
- Excluded sensitive fields like `password_hash`

#### Update Profile API
- Added profile update functionality
- Implemented duplicate username/email validation
- Updated profile information securely
- Used authenticated user ID from JWT instead of request body

#### Change Password API
- Added `findUserById()`
- Added `updatePassword()`
- Verified current password using bcrypt
- Hashed new password before storing
- Successfully updated password in database

### Security Improvements
- Removed dependency on client-provided `user_id`
- Used `req.user.user_id` from JWT
- Protected all profile routes using authentication middleware
- Prevented duplicate usernames and emails
- Stored only hashed passwords

### Testing
- Tested Get Profile API
- Tested Update Profile API
- Tested Change Password API
- Verified login with new password
- Verified old password is rejected

### Concepts Learned
- JWT based authentication
- Secure API development
- Password hashing with bcrypt
- Password verification
- MVC architecture
- User profile management
- Route protection