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

module.exports = {
    createNote
};