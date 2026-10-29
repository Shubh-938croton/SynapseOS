-- ==============================================================================
-- SynapseOS Production Database Schema Initialization Script
-- Turnkey schema for all 15 tables, indexes, and cascades
-- ==============================================================================

-- >>> 001_create_database.sql <<<
-- =====================================================
-- SynapseOS Database
-- Author  : Shubh Kamal
-- Database: synapseos
-- =====================================================


CREATE DATABASE IF NOT EXISTS synapseos
CHARACTER SET utf8mb4                       --  tell which characters can this database store.
COLLATE utf8mb4_unicode_ci;                 -- help in ordering and comparison.

USE synapseos;

-- >>> 002_users.sql <<<
USE synapseos;

CREATE TABLE users(
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(225) NOT NULL,
    profile_picture VARCHAR(225),
    google_id VARCHAR(255) UNIQUE,          -- stores the path or url to the user's image .

    bio TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    ON UPDATE CURRENT_TIMESTAMP
);

-- >>> 003_subjects.sql <<<
USE synapseos;

CREATE TABLE subjects(
    subject_id INT AUTO_INCREMENT PRIMARY KEY ,
    user_id INT NOT NULL ,
    subject_name VARCHAR(100) NOT NULL,


    description TEXT ,

    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE        -- if it delete there so delete here also 

);

-- >>> 004_tasks.sql <<<
USE synapseos;

CREATE TABLE tasks (
    task_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,

    description TEXT ,

    priority ENUM('Low','Medium','High') DEFAULT 'Medium',
    status ENUM('Pending','Completed') DEFAULT 'Pending',

    due_date DATE,
    completed_at DATETIME,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES  users(user_id)
        ON DELETE CASCADE,


    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE

);

-- >>> 005_notes.sql <<<
USE synapseos;

CREATE TABLE notes (
    note_id INT AUTO_INCREMENT PRIMARY KEY ,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,

    content LONGTEXT NOT NULL,

    is_pinned BOOLEAN DEFAULT FALSE,    

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE ,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE
);

-- >>> 006_calendar_events.sql <<<
USE synapseos;

CREATE TABLE calendar_events(
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL ,

    description TEXT ,

    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    reminder_minutes INT DEFAULT 30,

    status ENUM('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- >>> 007_goals.sql <<<
USE synapseos;

CREATE TABLE goals (

    goal_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(200) NOT NULL,

    description TEXT,

    target_date DATE,

    progress_percentage INT DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),

    status ENUM(
        'Not Started',
        'In Progress',
        'Completed'
    ) DEFAULT 'Not Started',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

);

-- >>> 008_study_sessions.sql <<<
USE synapseos;

CREATE TABLE study_sessions (

    session_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    subject_id INT NOT NULL,

    topic VARCHAR(200) NOT NULL,

    start_time DATETIME NOT NULL,

    end_time DATETIME NOT NULL,

    duration_minutes INT NOT NULL,

    session_notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE

);

-- >>> 009_progess.sql <<<
USE synapseos;

CREATE TABLE progress (

    progress_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    subject_id INT NOT NULL,

    completion_percentage INT DEFAULT 0,

    total_study_minutes INT DEFAULT 0,

    tasks_completed INT DEFAULT 0,

    notes_created INT DEFAULT 0,

    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE

);

-- >>> 010_pomodoro_sessions.sql <<<
USE synapseos;

CREATE TABLE pomodoro_sessions (

    session_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    subject_id INT,

    task_id INT,

    duration_minutes INT NOT NULL,

    break_minutes INT DEFAULT 5,

    session_status ENUM(
        'Completed',
        'Interrupted'
    ) DEFAULT 'Completed',

    started_at DATETIME NOT NULL,

    ended_at DATETIME NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE SET NULL,

    FOREIGN KEY (task_id)
        REFERENCES tasks(task_id)
        ON DELETE SET NULL

);

-- >>> 011_contests.sql <<<
USE synapseos;

CREATE TABLE contests (

    contest_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    platform ENUM(
        'LeetCode',
        'Codeforces',
        'CodeChef',
        'HackerRank',
        'AtCoder',
        'Other'
    ) NOT NULL,

    contest_name VARCHAR(200) NOT NULL,

    contest_date DATETIME NOT NULL,

    contest_url VARCHAR(255),

    participation_status ENUM(
        'Upcoming',
        'Participated',
        'Missed'
    ) DEFAULT 'Upcoming',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

);

-- >>> 012_settings.sql <<<
USE synapseos;

CREATE TABLE settings (

    setting_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT UNIQUE NOT NULL,

    theme ENUM(
        'Light',
        'Dark'
    ) DEFAULT 'Light',

    notification_enabled BOOLEAN DEFAULT TRUE,

    daily_goal_minutes INT DEFAULT 120,

    pomodoro_duration INT DEFAULT 25,

    short_break_duration INT DEFAULT 5,

    long_break_duration INT DEFAULT 15,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

);

-- >>> 013_indexes.sql <<<
USE synapseos;            -- creating the index for make database faster.

CREATE INDEX idx_tasks_user
ON tasks(user_id);

CREATE INDEX idx_tasks_subject
ON tasks(subject_id);

CREATE INDEX idx_notes_user
ON notes(user_id);

CREATE INDEX idx_notes_subject
ON notes(subject_id);

CREATE INDEX idx_sessions_user
ON study_sessions(user_id);

CREATE INDEX idx_sessions_subject
ON study_sessions(subject_id);

CREATE INDEX idx_progress_user
ON progress(user_id);

CREATE INDEX idx_calendar_user
ON calendar_events(user_id);

CREATE INDEX idx_goals_user
ON goals(user_id);

CREATE INDEX idx_contests_user
ON contests(user_id);

-- >>> 0014_notifications.sql <<<
USE synapseos;

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message VARCHAR(500) NOT NULL,

    reference_type VARCHAR(50),
    reference_id INT,

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- >>> 015_activity_events.sql <<<
USE synapseos;

-- =====================================================
-- TABLE: activity_events
-- Append-only event store for user domain operations
-- =====================================================

CREATE TABLE IF NOT EXISTS activity_events (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT NULL,
    metadata_json JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- =====================================================
-- INDEXES FOR ACTIVITY EVENTS
-- =====================================================

-- 1. Single-column index on user_id for filtering user events
CREATE INDEX idx_events_user
ON activity_events(user_id);

-- 2. Composite index on user_id + created_at for user chronological activity streams (e.g. ORDER BY created_at DESC)
CREATE INDEX idx_events_user_created
ON activity_events(user_id, created_at);

-- 3. Composite index on user_id + event_type for fast query of specific user actions (e.g. all TASK_COMPLETED by user)
CREATE INDEX idx_events_user_type
ON activity_events(user_id, event_type);

-- 4. Composite index on entity_type + entity_id to track complete lifecycle / audit trail of a specific domain entity
CREATE INDEX idx_events_entity
ON activity_events(entity_type, entity_id);

-- 5. Temporal index on created_at for system-wide temporal analysis and time window partitioning
CREATE INDEX idx_events_created
ON activity_events(created_at);

-- >>> 016_automation_tables.sql <<<
USE synapseos;

-- =====================================================
-- TABLE: automation_summaries
-- Persistent, idempotent summary ledger for daily/weekly rollups
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_summaries (
    summary_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    summary_type ENUM('daily', 'weekly', 'monthly') NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    summary_data JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- Idempotency constraint: Exactly one summary per user, type, and period window
    UNIQUE KEY uk_user_summary_period (user_id, summary_type, period_start, period_end),

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);

-- Indexes for automation summaries
CREATE INDEX idx_user_summary_type_date
ON automation_summaries(user_id, summary_type, period_start);

CREATE INDEX idx_summary_period_type
ON automation_summaries(summary_type, period_start);


-- =====================================================
-- TABLE: automation_runs
-- Audit ledger for scheduler executions and job monitoring
-- =====================================================

CREATE TABLE IF NOT EXISTS automation_runs (
    run_id INT AUTO_INCREMENT PRIMARY KEY,
    job_name VARCHAR(100) NOT NULL,
    status ENUM('running', 'success', 'partial_failure', 'failed') NOT NULL DEFAULT 'running',
    users_processed INT DEFAULT 0,
    users_succeeded INT DEFAULT 0,
    users_failed INT DEFAULT 0,
    error_details JSON NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,

    INDEX idx_job_started (job_name, started_at),
    INDEX idx_run_status (status)
);

