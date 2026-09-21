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
