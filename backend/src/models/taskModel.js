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

module.exports = {
    getAllTasks
};