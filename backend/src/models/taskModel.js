const db = require("../config/database");

// =========================
// Get All Tasks
// =========================
const getAllTasks = (callback) => {

    const query = "SELECT * FROM tasks";

    db.query(query, (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// =========================
// Create Task
// =========================
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

// =========================
// Get Task By ID
// =========================
const getTaskById = (id, callback) => {

    const query = `
        SELECT *
        FROM tasks
        WHERE task_id = ?
    `;

    db.query(query, [id], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};


const updateTask = (id, task, callback) => {

    const query = `
        UPDATE tasks
        SET
            subject_id = ?,
            title = ?,
            description = ?,
            priority = ?,
            status = ?,
            due_date = ?
        WHERE task_id = ?
    `;

    db.query(
        query,
        [
            task.subject_id,
            task.title,
            task.description,
            task.priority,
            task.status,
            task.due_date,
            id
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// =========================
// Export
// =========================
module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask
};