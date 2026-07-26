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