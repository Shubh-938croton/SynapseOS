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