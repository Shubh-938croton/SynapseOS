const db = require("../config/database");

// Get all tasks
const getAllTasks = (callback) => {

    const query = "SELECT * FROM tasks";

    db.query(query, (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);
    });
};


// Create a new task
const createTask = (task, callback) => {

    const query = `
        INSERT INTO tasks
        (
            user_id,
            subject_id,
            title,
            description,
            priority,
            status,
            due_date
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            task.user_id,
            task.subject_id,
            task.title,
            task.description,
            task.priority,
            task.status,
            task.due_date
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );
};


// Export all functions
module.exports = {
    getAllTasks,
    createTask
};