const noteModel = require("../models/noteModel");

// Create Note
const createNote = (req, res) => {

    try {

        const user_id = req.user.user_id;

        const {
            subject_id,
            title,
            content
        } = req.body;

        if (!subject_id || !title) {
            return res.status(400).json({
                message: "Subject and title are required"
            });
        }

        // Verify subject ownership
        noteModel.findSubjectById(
            user_id,
            subject_id,
            (err, subjects) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });
                }

                if (subjects.length === 0) {
                    return res.status(404).json({
                        message: "Subject not found"
                    });
                }

                const note = {
                    user_id,
                    subject_id,
                    title,
                    content
                };

                noteModel.createNote(note, (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Failed to create note",
                            error: err.message
                        });
                    }

                    return res.status(201).json({
                        message: "Note created successfully",
                        noteId: result.insertId
                    });

                });

            }
        );

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};


// Get All Notes
const getAllNotes = (req, res) => {

    try {

        const userId = req.user.user_id;

        noteModel.getAllNotes(userId, (err, notes) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                count: notes.length,
                notes
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Get Note By ID
const getNoteById = (req, res) => {

    try {

        const userId = req.user.user_id;
        const noteId = req.params.id;

        noteModel.getNoteById(userId, noteId, (err, notes) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (notes.length === 0) {
                return res.status(404).json({
                    message: "Note not found"
                });
            }

            return res.status(200).json(notes[0]);

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Update Note
const updateNote = (req, res) => {

    try {

        const userId = req.user.user_id;
        const noteId = req.params.id;

        const {
            subject_id,
            title,
            content,
            is_pinned
        } = req.body;

        // Verify subject belongs to logged-in user
        noteModel.findSubjectById(userId, subject_id, (err, subjects) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (subjects.length === 0) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }

            const note = {
                subject_id,
                title,
                content,
                is_pinned
            };

            noteModel.updateNote(userId, noteId, note, (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Note not found"
                    });
                }

                return res.status(200).json({
                    message: "Note updated successfully"
                });

            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};


// Delete Note
const deleteNote = (req, res) => {

    try {

        const userId = req.user.user_id;
        const noteId = req.params.id;

        noteModel.deleteNote(userId, noteId, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Note not found"
                });
            }

            return res.status(200).json({
                message: "Note deleted successfully"
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote
};