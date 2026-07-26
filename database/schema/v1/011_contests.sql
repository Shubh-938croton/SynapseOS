USE synapseos;

CREATE TABLE contests (

    contest_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    platform ENUM(
        'LeetCode',
        'Codeforces',
        'CodeChef',
        'HackerRank',
        'AtCoder',
        'Other'
    ) NOT NULL,

    contest_name VARCHAR(200) NOT NULL,

    contest_date DATETIME NOT NULL,

    contest_url VARCHAR(255),

    participation_status ENUM(
        'Upcoming',
        'Participated',
        'Missed'
    ) DEFAULT 'Upcoming',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE

);