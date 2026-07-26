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