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