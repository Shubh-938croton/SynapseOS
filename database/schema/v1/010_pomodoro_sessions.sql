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