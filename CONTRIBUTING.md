# 🤝 Contributing to SynapseOS

Thank you for your interest in contributing to **SynapseOS**! We welcome contributions from developers, students, designers, and open-source enthusiasts.

---

## 📜 Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors regardless of experience level, gender identity, sexual orientation, disability, race, or religion. Please be respectful and constructive in all interactions.

---

## 🛠️ Getting Started

1. **Fork the repository** to your personal GitHub account.
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/<your-username>/SynapseOS.git
   cd SynapseOS
   ```
3. Set up the development environment by following the **[Local Development Setup Guide](docs/development/setup.md)**.

---

## 🌿 Git Branching Strategy

Always create a new branch from `main` before starting any work:

| Type | Branch Naming Convention | Example |
| :--- | :--- | :--- |
| **New Feature** | `feat/<feature-name>` | `feat/pomodoro-audio-alert` |
| **Bug Fix** | `fix/<bug-description>` | `fix/calendar-timezone-offset` |
| **Documentation** | `docs/<doc-topic>` | `docs/api-guide-update` |
| **Refactoring** | `refactor/<module-name>` | `refactor/task-service-cleanup` |
| **Testing** | `test/<test-scope>` | `test/auth-controller-tests` |

---

## 📝 Commit Message Conventions

We follow the **Conventional Commits** specification:

```text
<type>(<scope>): <short summary>

[optional longer description]
```

### Supported Types:
- `feat:` A new feature or user-facing capability
- `fix:` A bug fix or patch
- `docs:` Documentation additions or updates
- `style:` Formatting, whitespace, or visual CSS tweaks without logic changes
- `refactor:` Code restructuring without changing external behavior
- `perf:` Performance optimizations
- `test:` Adding or updating unit/integration tests
- `chore:` Dependency updates or build tooling changes

### Examples:
- `feat(contests): add AtCoder platform badge and filter pill`
- `fix(auth): resolve Google OAuth username collision on signup`
- `docs(database): update ERD with contests table constraints`

---

## 🔒 Architectural Rules & Quality Invariants

All submitted code must follow these mandatory rules:

1. **Multi-Tenant Data Isolation:** Always filter database queries by `user_id = ?` derived from `req.user.userId`.
2. **Parameterized SQL Queries:** Never use template literals or string concatenation in SQL queries. Always use prepared statement question marks (`?`).
3. **Layer Separation:** Never put database queries inside Express controllers; keep all SQL in `models/`.
4. **Service-Layer Encapsulation:** Never call raw Axios requests inside React components; use dedicated functions in `services/`.
5. **Zero Hardcoded Secrets:** Never commit `.env` files, API keys, passwords, or JWT secrets.

---

## ✅ Pull Request Checklist

Before opening a Pull Request, verify the following:

- [ ] `cd frontend && npm run build` completes successfully with zero errors.
- [ ] Backend starts cleanly and passes all health check routes (`node -e "require('./src/app')"`).
- [ ] Code adheres to the style and architectural guidelines outlined in the **[Developer Workflow Guide](docs/development/workflow.md)**.
- [ ] No private environment variables or secrets are included in the commits.
- [ ] PR description clearly explains the **problem being solved**, the **changes made**, and **how the changes were tested**.

---

## 📬 Submitting Your Pull Request

1. Push your branch to your forked repository:
   ```bash
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request against the `main` branch of `Shubh-938croton/SynapseOS`.
3. Provide a descriptive title and fill out the PR description with testing steps.
4. Maintainers will review your PR and provide feedback promptly!
