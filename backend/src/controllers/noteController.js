const noteModel = require("../models/noteModel");


// =========================
// CREATE NOTE
// =========================

const createNote = (req, res) => {

    const userId = req.user.user_id;

    const {
        subject_id,
        title,
        content,
        is_pinned
    } = req.body;


    if (!subject_id || !title) {

        return res.status(400).json({
            message: "Subject and title are required"
        });

    }


    noteModel.findSubjectById(
        userId,
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

                user_id: userId,
                subject_id,
                title,
                content: content || "",
                is_pinned: is_pinned || false

            };


            noteModel.createNote(
                note,
                (err, result) => {

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

                }
            );

        }
    );

};


// =========================
// GET ALL NOTES
// =========================

const getAllNotes = (req, res) => {

    const userId = req.user.user_id;


    noteModel.getAllNotes(
        userId,
        (err, notes) => {

            if (err) {

                return res.status(500).json({
                    message: "Failed to fetch notes",
                    error: err.message
                });

            }


            return res.status(200).json({

                count: notes.length,

                notes

            });

        }
    );

};


// =========================
// GET NOTE BY ID
// =========================

const getNoteById = (req, res) => {

    const userId = req.user.user_id;

    const noteId = req.params.id;


    noteModel.getNoteById(
        userId,
        noteId,
        (err, notes) => {

            if (err) {

                return res.status(500).json({
                    message: "Failed to fetch note",
                    error: err.message
                });

            }


            if (notes.length === 0) {

                return res.status(404).json({
                    message: "Note not found"
                });

            }


            return res.status(200).json(
                notes[0]
            );

        }
    );

};


// =========================
// UPDATE NOTE
// =========================

const updateNote = (req, res) => {

    const userId = req.user.user_id;

    const noteId = req.params.id;


    const {
        subject_id,
        title,
        content,
        is_pinned
    } = req.body;


    if (!subject_id || !title) {

        return res.status(400).json({
            message: "Subject and title are required"
        });

    }


    // Verify subject belongs to user

    noteModel.findSubjectById(
        userId,
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

                subject_id,

                title,

                content: content || "",

                is_pinned: is_pinned || false

            };


            noteModel.updateNote(
                userId,
                noteId,
                note,
                (err, result) => {

                    if (err) {

                        return res.status(500).json({
                            message: "Failed to update note",
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

                }
            );

        }
    );

};


// =========================
// DELETE NOTE
// =========================

const deleteNote = (req, res) => {

    const userId = req.user.user_id;

    const noteId = req.params.id;


    noteModel.deleteNote(
        userId,
        noteId,
        (err, result) => {

            if (err) {

                return res.status(500).json({
                    message: "Failed to delete note",
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

        }
    );

};


// =========================
// EXPORT
// =========================

module.exports = {

    createNote,

    getAllNotes,

    getNoteById,

    updateNote,

    deleteNote

};