USE synapseos;

CREATE TABLE calendar_events(
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL ,

    description TEXT ,

    event_date DATE NOT NULL,
    start_date TIME,
    end_time TIME,
    reminder_minutes INT DEFAULT 30,

    status ENUM('Upcoming','Completed','Cancelled') DEFAULT 'Upcoming',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);