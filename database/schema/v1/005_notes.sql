USE synapseos;

CREATE TABLE notes (
    node_id INT AUTO INCREMENT PRIMARY KEY ,
    user_id INT NOT NULL,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,

    content LONGTEXT NOT NULL,

    is_pinned BOOLEAN DEFAULT FALSE,    

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE ,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id)
        ON DELETE CASCADE
);