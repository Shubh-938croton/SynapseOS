CREATE DATABASE synapseos;

USE synapseos;

-- users-- 
CREATE TABLE users(
 user_id INT PRIMARY KEY,


 full_name VARCHAR(100) NOT NULL ,
 username VARCHAR(50) UNIQUE NOT NULL,
 email VARCHAR(100) UNIQUE NOT NULL,
 password_hash VARCHAR(225) NOT NULL, 

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 ON UPDATE CURRENT_TIMESTAMP

);

--subjects--
CREATE TABLE subjects(

);

-- Tasks--
CREATE TABLE tasks(

);

-- notes--
CREATE TABLE notes(

);

-- calendar Events
CREATE TABLE calendar_events(

);

--Goals
CREATE TABLE goals (
    ...
);

-- Study Sessions
CREATE TABLE study_sessions (
    ...
);

-- Progress
CREATE TABLE progress (
    ...
);

-- Pomodoro Sessions
CREATE TABLE pomodoro_sessions (
    ...
);

-- Coding Contests
CREATE TABLE contests (
    ...
);

-- YouTube Focus
CREATE TABLE youtube_focus (
    ...
);

-- User Settings
CREATE TABLE settings (
    ...
);