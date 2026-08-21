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
const getTaskById = (userIdOrId, idOrCallback, callback) => {

    let userId, id, cb;

    if (typeof callback === "function") {
        userId = userIdOrId;
        id = idOrCallback;
        cb = callback;
    } else {
        id = userIdOrId;
        cb = idOrCallback;
    }

    let query = `
        SELECT *
        FROM tasks
        WHERE task_id = ?
    `;
    const params = [id];

    if (userId !== undefined) {
        query += ` AND user_id = ?`;
        params.push(userId);
    }

    db.query(query, params, (err, results) => {

        if (err) {
            return cb(err, null);
        }

        cb(null, results);

    });

};

// update task 
const updateTask = (userIdOrId, idOrTask, taskOrCallback, callback) => {

    let userId, id, task, cb;

    if (typeof callback === "function") {
        userId = userIdOrId;
        id = idOrTask;
        task = taskOrCallback;
        cb = callback;
    } else {
        id = userIdOrId;
        task = idOrTask;
        cb = taskOrCallback;
    }

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
        return cb(
            new Error("No fields provided for update"),
            null
        );
    }

    let query = `
        UPDATE tasks
        SET ${fields.join(", ")}
        WHERE task_id = ?
    `;
    values.push(id);

    if (userId !== undefined) {
        query += ` AND user_id = ?`;
        values.push(userId);
    }

    db.query(query, values, (err, result) => {

        if (err) {
            return cb(err, null);
        }

        cb(null, result);

    });

};

// delete task 
const deleteTask = (userIdOrId, idOrCallback, callback) => {

    let userId, id, cb;

    if (typeof callback === "function") {
        userId = userIdOrId;
        id = idOrCallback;
        cb = callback;
    } else {
        id = userIdOrId;
        cb = idOrCallback;
    }

    let query = `
        DELETE FROM tasks
        WHERE task_id = ?
    `;
    const params = [id];

    if (userId !== undefined) {
        query += ` AND user_id = ?`;
        params.push(userId);
    }

    db.query(query, params, (err, result) => {

        if (err) {
            return cb(err, null);
        }

        cb(null, result);

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