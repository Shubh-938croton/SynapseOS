const db = require("../config/database");

// Create Subject
const createSubject = (subject, callback) => {

    const query = `
        INSERT INTO subjects
        (user_id, subject_name, description)
        VALUES (?, ?, ?)
    `;

    db.query(
        query,
        [
            subject.user_id,
            subject.subject_name,
            subject.description
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

// Get all subjects of logged-in user
const getAllSubjects = (userId, callback) => {

    const query = `
        SELECT
            subject_id,
            subject_name,
            description,
            created_at
        FROM subjects
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

// Get subject by ID
const getSubjectById = (userId, subjectId, callback) => {

    const query = `
        SELECT
            subject_id,
            subject_name,
            description,
            created_at
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

// Update Subject
const updateSubject = (userId, subjectId, subject, callback) => {

    const query = `
        UPDATE subjects
        SET
            subject_name = ?,
            description = ?
        WHERE subject_id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            subject.subject_name,
            subject.description,
            subjectId,
            userId
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};

module.exports = {
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject
};