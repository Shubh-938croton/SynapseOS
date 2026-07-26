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