USE synapseos;

CREATE TABLE subjects(
    subject_id INT AUTO_INCREMENT PRIMARY KEY ,
    user_id INT NOT NULL ,
    subject_name VARCHAR(100) NOT NULL,


    description TEXT ,

    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE        -- if it delete there so delete here also 

);