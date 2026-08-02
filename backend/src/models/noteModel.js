const db = require("../config/database");

// Create Note
const createNote = (note, callback) => {

    const query = `
        INSERT INTO notes
        (
            user_id,
            subject_id,
            title,
            content
        )
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            note.user_id,
            note.subject_id,
            note.title,
            note.content
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// Check if subject belongs to logged-in user
const findSubjectById = (userId, subjectId, callback) => {

    const query = `
        SELECT subject_id
        FROM subjects
        WHERE subject_id = ?
        AND user_id = ?
    `;

    db.query(query, [subjectId, userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

module.exports = {
    createNote,
    findSubjectById
};