const subjectModel = require("../models/subjectModel");
const { recordEvent, EVENT_TYPES, ENTITY_TYPES } = require("../services/activityEventService");

// Create Subject
const createSubject = (req, res) => {

    try {

        // Get logged-in user's ID from JWT
        const user_id = req.user.user_id;

        const {
            subject_name,
            description,
            color
        } = req.body;

        // Basic validation
        if (!subject_name || !subject_name.trim()) {
            return res.status(400).json({
                message: "Subject name is required"
            });
        }

        const subject = {
            user_id,
            subject_name: subject_name.trim(),
            description: description ? description.trim() : null,
            color: color ? color.trim() : null
        };

        subjectModel.createSubject(subject, (err, result) => {

            if (err) {
                console.error("Create subject database error:", err);
                return res.status(500).json({
                    message: "Failed to create subject"
                });
            }

            // Record SUBJECT_CREATED event
            recordEvent({
                userId: user_id,
                eventType: EVENT_TYPES.SUBJECT_CREATED,
                entityType: ENTITY_TYPES.SUBJECT,
                entityId: result.insertId,
                metadata: {
                    subject_name: subject.subject_name,
                    color: subject.color
                }
            });

            return res.status(201).json({
                message: "Subject created successfully",
                subjectId: result.insertId,
                subject: {
                    subject_id: result.insertId,
                    user_id,
                    subject_name: subject.subject_name,
                    description: subject.description,
                    color: subject.color
                }
            });

        });

    } catch (error) {

        console.error("Create subject controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};

// Get all subjects
const getAllSubjects = (req, res) => {

    try {

        const userId = req.user.user_id;

        subjectModel.getAllSubjects(userId, (err, subjects) => {

            if (err) {
                console.error("Get all subjects database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch subjects"
                });
            }

            return res.status(200).json({
                count: subjects.length,
                subjects: subjects || []
            });

        });

    } catch (error) {

        console.error("Get all subjects controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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
                console.error("Get subject by ID database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch subject"
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

        console.error("Get subject by ID controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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
            description,
            color
        } = req.body;

        if (!subject_name || !subject_name.trim()) {
            return res.status(400).json({
                message: "Subject name is required"
            });
        }

        const subject = {
            subject_name: subject_name.trim(),
            description: description ? description.trim() : null,
            color: color ? color.trim() : null
        };

        subjectModel.updateSubject(
            userId,
            subjectId,
            subject,
            (err, result) => {

                if (err) {
                    console.error("Update subject database error:", err);
                    return res.status(500).json({
                        message: "Failed to update subject"
                    });
                }

                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        message: "Subject not found"
                    });
                }

                // Record SUBJECT_UPDATED event
                recordEvent({
                    userId: userId,
                    eventType: EVENT_TYPES.SUBJECT_UPDATED,
                    entityType: ENTITY_TYPES.SUBJECT,
                    entityId: Number(subjectId),
                    metadata: {
                        subject_name: subject.subject_name,
                        color: subject.color
                    }
                });

                return res.status(200).json({
                    message: "Subject updated successfully"
                });

            }
        );

    } catch (error) {

        console.error("Update subject controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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
                console.error("Delete subject database error:", err);
                return res.status(500).json({
                    message: "Failed to delete subject"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Subject not found"
                });
            }

            // Record SUBJECT_DELETED event
            recordEvent({
                userId: userId,
                eventType: EVENT_TYPES.SUBJECT_DELETED,
                entityType: ENTITY_TYPES.SUBJECT,
                entityId: Number(subjectId)
            });

            return res.status(200).json({
                message: "Subject deleted successfully"
            });

        });

    } catch (error) {

        console.error("Delete subject controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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