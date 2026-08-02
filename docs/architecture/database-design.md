# Database Design

Database Name

```text
synapseos
```

---

## Users Table

```text
user_id (PK)
full_name
username
email
password_hash
created_at
```

---

## Subjects Table

```text
subject_id (PK)
user_id (FK)
subject_name
description
created_at
```

---

## Tasks Table

```text
task_id (PK)
user_id (FK)
subject_id (FK)
title
description
priority
status
deadline
created_at
updated_at
```

---

## Notes Table

```text
note_id (PK)
user_id (FK)
subject_id (FK)
title
content
is_pinned
created_at
updated_at
```

---

## Relationships

```text
Users
│
├──────── Subjects
│             │
│             ├──────── Tasks
│             │
│             └──────── Notes
```

---

## Entity Relationship Diagram

```text
Users
(user_id)
     │
     │1
     │
     │∞
Subjects
(subject_id)
     │
 ┌───┴────┐
 │        │
 │∞       │∞
 │        │
Tasks    Notes
```

---

## Security Rules

- Every Subject belongs to one User.
- Every Task belongs to one User.
- Every Note belongs to one User.
- JWT determines the authenticated user.
- Users cannot access other users' data.
- Foreign keys enforce referential integrity.

---

## Constraints

- Email must be unique.
- Username must be unique.
- Passwords are stored using bcrypt hashing.
- JWT authentication protects all private APIs.