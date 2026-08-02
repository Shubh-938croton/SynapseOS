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


// Get all notes of logged-in user
const getAllNotes = (userId, callback) => {

    const query = `
        SELECT
            n.note_id,
            n.title,
            n.content,
            n.created_at,
            s.subject_name
        FROM notes n
        INNER JOIN subjects s
            ON n.subject_id = s.subject_id
        WHERE n.user_id = ?
        ORDER BY n.created_at DESC
    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// Get Note By ID
const getNoteById = (userId, noteId, callback) => {

    const query = `
        SELECT
            n.note_id,
            n.title,
            n.content,
            n.created_at,
            n.updated_at,
            s.subject_name
        FROM notes n
        INNER JOIN subjects s
            ON n.subject_id = s.subject_id
        WHERE
            n.note_id = ?
            AND n.user_id = ?
    `;

    db.query(query, [noteId, userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// Update Note
const updateNote = (userId, noteId, note, callback) => {

    const query = `
        UPDATE notes
        SET
            subject_id = ?,
            title = ?,
            content = ?,
            is_pinned = ?
        WHERE
            note_id = ?
            AND user_id = ?
    `;

    db.query(
        query,
        [
            note.subject_id,
            note.title,
            note.content,
            note.is_pinned,
            noteId,
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


// Delete Note
const deleteNote = (userId, noteId, callback) => {

    const query = `
        DELETE FROM notes
        WHERE note_id = ?
        AND user_id = ?
    `;

    db.query(query, [noteId, userId], (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};

module.exports = {
    createNote,
    findSubjectById,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote
};