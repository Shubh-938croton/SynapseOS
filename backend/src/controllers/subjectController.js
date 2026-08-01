const subjectModel = require("../models/subjectModel");

// Create Subject
const createSubject = (req, res) => {

    try {

        // Get logged-in user's ID from JWT
        const user_id = req.user.user_id;

        const {
            subject_name,
            description
        } = req.body;

        // Basic validation
        if (!subject_name) {
            return res.status(400).json({
                message: "Subject name is required"
            });
        }

        const subject = {
            user_id,
            subject_name,
            description
        };

        subjectModel.createSubject(subject, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Failed to create subject",
                    error: err.message
                });
            }

            return res.status(201).json({
                message: "Subject created successfully",
                subjectId: result.insertId
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Get all subjects
const getAllSubjects = (req, res) => {

    try {

        const userId = req.user.user_id;

        subjectModel.getAllSubjects(userId, (err, subjects) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(200).json({
                count: subjects.length,
                subjects
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Get single subject
const getSubjectById = (req, res) => {

    try {

        const userId = req.user.user_id;
        const subjectId = req.params.id;

        subjectModel.getSubjectById(userId, subjectId, (err, results) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }

            return res.status(200).json(results[0]);

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Update Subject
const updateSubject = (req, res) => {

    try {

        const userId = req.user.user_id;
        const subjectId = req.params.id;

        const {
            subject_name,
            description
        } = req.body;

        const subject = {
            subject_name,
            description
        };

        subjectModel.updateSubject(
            userId,
            subjectId,
            subject,
            (err, result) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error",
                        error: err.message
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Subject not found"
                    });
                }

                return res.status(200).json({
                    message: "Subject updated successfully"
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

// Delete Subject
const deleteSubject = (req, res) => {

    try {

        const userId = req.user.user_id;
        const subjectId = req.params.id;

        subjectModel.deleteSubject(userId, subjectId, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }

            return res.status(200).json({
                message: "Subject deleted successfully"
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
    createSubject,
    getAllSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
};