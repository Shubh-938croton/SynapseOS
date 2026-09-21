const noteModel = require("../models/noteModel");
const { recordEvent, EVENT_TYPES, ENTITY_TYPES } = require("../services/activityEventService");


// =========================
// CREATE NOTE
// =========================

const createNote = (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            subject_id,
            title,
            content,
            is_pinned
        } = req.body;


        // -------------------------
        // Validate input
        // -------------------------

        if (!subject_id) {

            return res.status(400).json({
                message: "Subject is required"
            });

        }

        if (!title || !title.trim()) {

            return res.status(400).json({
                message: "Note title is required"
            });

        }


        // -------------------------
        // Check subject ownership
        // -------------------------

        noteModel.findSubjectById(
            userId,
            subject_id,
            (err, subjects) => {

                if (err) {

                    console.error(
                        "Find subject error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to create note"
                    });

                }


                if (!subjects || subjects.length === 0) {

                    return res.status(404).json({
                        message: "Subject not found"
                    });

                }


                // -------------------------
                // Prepare note
                // -------------------------

                const note = {

                    user_id: userId,

                    subject_id: subject_id,

                    title: title.trim(),

                    content:
                        content !== undefined &&
                        content !== null
                            ? String(content)
                            : "",

                    is_pinned:
                        is_pinned === true ||
                        is_pinned === 1

                };


                // -------------------------
                // Create note
                // -------------------------

                noteModel.createNote(
                    note,
                    (err, result) => {

                        if (err) {

                            console.error(
                                "Create note error:",
                                err
                            );

                            return res.status(500).json({
                                message: "Failed to create note"
                            });

                        }


                        // Record NOTE_CREATED event
                        recordEvent({
                            userId: userId,
                            eventType: EVENT_TYPES.NOTE_CREATED,
                            entityType: ENTITY_TYPES.NOTE,
                            entityId: result.insertId,
                            metadata: {
                                title: note.title,
                                subject_id: note.subject_id,
                                is_pinned: note.is_pinned
                            }
                        });

                        return res.status(201).json({

                            message:
                                "Note created successfully",

                            noteId:
                                result.insertId

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Create note controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// GET ALL NOTES
// =========================

const getAllNotes = (req, res) => {

    try {

        const userId = req.user.user_id;


        noteModel.getAllNotes(
            userId,
            (err, notes) => {

                if (err) {

                    console.error(
                        "Get all notes error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch notes"
                    });

                }


                return res.status(200).json({

                    message:
                        "Notes fetched successfully",

                    count:
                        notes ? notes.length : 0,

                    notes:
                        notes || []

                });

            }
        );

    } catch (error) {

        console.error(
            "Get all notes controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// GET NOTE BY ID
// =========================

const getNoteById = (req, res) => {

    try {

        const userId = req.user.user_id;

        const noteId = req.params.id;


        if (!noteId) {

            return res.status(400).json({
                message: "Note ID is required"
            });

        }


        noteModel.getNoteById(
            userId,
            noteId,
            (err, notes) => {

                if (err) {

                    console.error(
                        "Get note by ID error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to fetch note"
                    });

                }


                if (
                    !notes ||
                    notes.length === 0
                ) {

                    return res.status(404).json({
                        message: "Note not found"
                    });

                }


                return res.status(200).json({

                    message:
                        "Note fetched successfully",

                    note:
                        notes[0]

                });

            }
        );

    } catch (error) {

        console.error(
            "Get note controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// UPDATE NOTE
// =========================

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


        // -------------------------
        // Validate input
        // -------------------------

        if (!subject_id) {

            return res.status(400).json({
                message: "Subject is required"
            });

        }

        if (!title || !title.trim()) {

            return res.status(400).json({
                message: "Note title is required"
            });

        }


        if (!noteId) {

            return res.status(400).json({
                message: "Note ID is required"
            });

        }


        // -------------------------
        // Verify subject ownership
        // -------------------------

        noteModel.findSubjectById(
            userId,
            subject_id,
            (err, subjects) => {

                if (err) {

                    console.error(
                        "Find subject error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to update note"
                    });

                }


                if (
                    !subjects ||
                    subjects.length === 0
                ) {

                    return res.status(404).json({
                        message: "Subject not found"
                    });

                }


                // -------------------------
                // Prepare updated note
                // -------------------------

                const note = {

                    subject_id,

                    title:
                        title.trim(),

                    content:
                        content !== undefined &&
                        content !== null
                            ? String(content)
                            : "",

                    is_pinned:
                        is_pinned === true ||
                        is_pinned === 1

                };


                // -------------------------
                // Update note
                // -------------------------

                noteModel.updateNote(
                    userId,
                    noteId,
                    note,
                    (err, result) => {

                        if (err) {

                            console.error(
                                "Update note error:",
                                err
                            );

                            return res.status(500).json({
                                message:
                                    "Failed to update note"
                            });

                        }


                        if (
                            !result ||
                            result.affectedRows === 0
                        ) {

                            return res.status(404).json({
                                message:
                                    "Note not found"
                            });

                        }


                        // Record NOTE_UPDATED event
                        recordEvent({
                            userId: userId,
                            eventType: EVENT_TYPES.NOTE_UPDATED,
                            entityType: ENTITY_TYPES.NOTE,
                            entityId: Number(noteId),
                            metadata: {
                                title: note.title,
                                subject_id: note.subject_id,
                                is_pinned: note.is_pinned
                            }
                        });

                        return res.status(200).json({

                            message:
                                "Note updated successfully"

                        });

                    }
                );

            }
        );

    } catch (error) {

        console.error(
            "Update note controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// DELETE NOTE
// =========================

const deleteNote = (req, res) => {

    try {

        const userId = req.user.user_id;

        const noteId = req.params.id;


        if (!noteId) {

            return res.status(400).json({
                message: "Note ID is required"
            });

        }


        noteModel.deleteNote(
            userId,
            noteId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Delete note error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to delete note"
                    });

                }


                if (
                    !result ||
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({
                        message:
                            "Note not found"
                    });

                }


                // Record NOTE_DELETED event
                recordEvent({
                    userId: userId,
                    eventType: EVENT_TYPES.NOTE_DELETED,
                    entityType: ENTITY_TYPES.NOTE,
                    entityId: Number(noteId)
                });

                return res.status(200).json({
                    message: "Note deleted successfully"
                });

            }
        );

    } catch (error) {

        console.error(
            "Delete note controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

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