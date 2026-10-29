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
