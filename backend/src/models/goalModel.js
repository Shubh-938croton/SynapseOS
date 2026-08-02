const db = require("../config/database");

// Create Goal
const createGoal = (goal, callback) => {

    const query = `
        INSERT INTO goals
        (
            user_id,
            title,
            description,
            target_date,
            progress_percentage,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            goal.user_id,
            goal.title,
            goal.description,
            goal.target_date,
            goal.progress_percentage,
            goal.status
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// Get All Goals
const getAllGoals = (userId, callback) => {

    const query = `
        SELECT *
        FROM goals
        WHERE user_id = ?
        ORDER BY created_at DESC
    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};


// Get Goal By ID
const getGoalById = (userId, goalId, callback) => {

    const query = `
        SELECT *
        FROM goals
        WHERE goal_id = ?
        AND user_id = ?
    `;

    db.query(query, [goalId, userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};


// Update Goal
const updateGoal = (goal, callback) => {

    const query = `
        UPDATE goals
        SET
            title = ?,
            description = ?,
            target_date = ?,
            progress_percentage = ?,
            status = ?
        WHERE goal_id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            goal.title,
            goal.description,
            goal.target_date,
            goal.progress_percentage,
            goal.status,
            goal.goal_id,
            goal.user_id
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// Delete Goal
const deleteGoal = (userId, goalId, callback) => {

    const query = `
        DELETE FROM goals
        WHERE goal_id = ?
        AND user_id = ?
    `;

    db.query(query, [goalId, userId], (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};

module.exports = {
    createGoal,
    getAllGoals,
    getGoalById,
    updateGoal,
    deleteGoal
};