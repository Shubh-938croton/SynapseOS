const db = require("../config/database");

// =========================
// Get All Tasks
// =========================
const getAllTasks = (user_id, callback) => {

    const query = `
        SELECT *
        FROM tasks
        WHERE user_id = ?
        ORDER BY due_date ASC
    `;

    db.query(query, [user_id], (err, results) => {

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

// update task 
const updateTask = (id, task, callback) => {

    const fields = [];
    const values = [];

    if (task.subject_id !== undefined) {
        fields.push("subject_id = ?");
        values.push(task.subject_id);
    }

    if (task.title !== undefined) {
        fields.push("title = ?");
        values.push(task.title);
    }

    if (task.description !== undefined) {
        fields.push("description = ?");
        values.push(task.description);
    }

    if (task.priority !== undefined) {
        fields.push("priority = ?");
        values.push(task.priority);
    }

    if (task.status !== undefined) {
        fields.push("status = ?");
        values.push(task.status);
    }

    if (task.due_date !== undefined) {
        fields.push("due_date = ?");
        values.push(task.due_date);
    }

    if (fields.length === 0) {
        return callback(
            new Error("No fields provided for update"),
            null
        );
    }

    const query = `
        UPDATE tasks
        SET ${fields.join(", ")}
        WHERE task_id = ?
    `;

    values.push(id);

    db.query(query, values, (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};

// delete task 
const deleteTask = (id, callback) => {

    const query = `
        DELETE FROM tasks
        WHERE task_id = ?
    `;

    db.query(query, [id], (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};

// =========================
// Export
// =========================
module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
};