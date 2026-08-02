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