USE synapseos;

-- =====================================================
-- TABLE: syllabus_units
-- Modular, non-threatening breakdown of subject curricula
-- =====================================================

CREATE TABLE IF NOT EXISTS syllabus_units (
    unit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NULL,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE
);

-- =====================================================
-- TABLE: syllabus_topics
-- Bite-sized milestones and checkpoints within units
-- =====================================================

CREATE TABLE IF NOT EXISTS syllabus_topics (
    topic_id INT AUTO_INCREMENT PRIMARY KEY,
    unit_id INT NOT NULL,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('not_started', 'in_progress', 'completed') DEFAULT 'not_started',
    estimated_minutes INT DEFAULT 45,
    difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'medium',
    order_index INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (unit_id)
        REFERENCES syllabus_units(unit_id)
        ON DELETE CASCADE,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

CREATE INDEX idx_units_user_subject ON syllabus_units(user_id, subject_id);
CREATE INDEX idx_topics_unit ON syllabus_topics(unit_id);
CREATE INDEX idx_topics_user_status ON syllabus_topics(user_id, status);
CREATE INDEX idx_topics_subject ON syllabus_topics(subject_id);
