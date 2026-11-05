const syllabusModel = require("../models/syllabusModel");

// =======================================
// GET SYLLABUS FOR A SUBJECT
// =======================================
const getSubjectSyllabus = (req, res) => {
    const userId = req.user.user_id;
    const { subject_id } = req.query;

    if (!subject_id) {
        return res.status(400).json({
            message: "subject_id query parameter is required"
        });
    }

    syllabusModel.getSyllabusBySubject(userId, Number(subject_id), (err, result) => {
        if (err) {
            console.error("[Syllabus Controller] getSubjectSyllabus error:", err);
            return res.status(500).json({ message: "Failed to load syllabus" });
        }

        return res.status(200).json(result);
    });
};

// =======================================
// CREATE UNIT / MODULE
// =======================================
const createUnit = (req, res) => {
    const userId = req.user.user_id;
    const { subject_id, title, description, order_index } = req.body;

    if (!subject_id || !title || !title.trim()) {
        return res.status(400).json({
            message: "subject_id and title are required"
        });
    }

    syllabusModel.createUnit(
        userId,
        {
            subject_id: Number(subject_id),
            title: title.trim(),
            description: description ? description.trim() : null,
            order_index: Number(order_index) || 0
        },
        (err, result) => {
            if (err) {
                console.error("[Syllabus Controller] createUnit error:", err);
                return res.status(500).json({ message: "Failed to create unit" });
            }

            return res.status(201).json({
                message: "Unit created successfully",
                unit: result
            });
        }
    );
};

// =======================================
// UPDATE UNIT
// =======================================
const updateUnit = (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { title, description, order_index } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "title is required"
        });
    }

    syllabusModel.updateUnit(
        userId,
        Number(id),
        {
            title: title.trim(),
            description: description ? description.trim() : null,
            order_index: Number(order_index) || 0
        },
        (err, result) => {
            if (err) {
                console.error("[Syllabus Controller] updateUnit error:", err);
                return res.status(500).json({ message: "Failed to update unit" });
            }

            return res.status(200).json({
                message: "Unit updated successfully"
            });
        }
    );
};

// =======================================
// DELETE UNIT
// =======================================
const deleteUnit = (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;

    syllabusModel.deleteUnit(userId, Number(id), (err, result) => {
        if (err) {
            console.error("[Syllabus Controller] deleteUnit error:", err);
            return res.status(500).json({ message: "Failed to delete unit" });
        }

        return res.status(200).json({
            message: "Unit deleted successfully"
        });
    });
};

// =======================================
// CREATE TOPIC
// =======================================
const createTopic = (req, res) => {
    const userId = req.user.user_id;
    const { unit_id, subject_id, title, description, estimated_minutes, difficulty, order_index } = req.body;

    if (!unit_id || !subject_id || !title || !title.trim()) {
        return res.status(400).json({
            message: "unit_id, subject_id, and title are required"
        });
    }

    const validDifficulties = ["easy", "medium", "hard"];
    const diff = validDifficulties.includes(difficulty) ? difficulty : "medium";

    syllabusModel.createTopic(
        userId,
        {
            unit_id: Number(unit_id),
            subject_id: Number(subject_id),
            title: title.trim(),
            description: description ? description.trim() : null,
            estimated_minutes: Number(estimated_minutes) || 45,
            difficulty: diff,
            order_index: Number(order_index) || 0
        },
        (err, result) => {
            if (err) {
                console.error("[Syllabus Controller] createTopic error:", err);
                return res.status(500).json({ message: "Failed to create topic" });
            }

            return res.status(201).json({
                message: "Topic created successfully",
                topic: result
            });
        }
    );
};

// =======================================
// UPDATE TOPIC
// =======================================
const updateTopic = (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { title, description, estimated_minutes, difficulty, order_index } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "title is required"
        });
    }

    const validDifficulties = ["easy", "medium", "hard"];
    const diff = validDifficulties.includes(difficulty) ? difficulty : "medium";

    syllabusModel.updateTopic(
        userId,
        Number(id),
        {
            title: title.trim(),
            description: description ? description.trim() : null,
            estimated_minutes: Number(estimated_minutes) || 45,
            difficulty: diff,
            order_index: Number(order_index) || 0
        },
        (err, result) => {
            if (err) {
                console.error("[Syllabus Controller] updateTopic error:", err);
                return res.status(500).json({ message: "Failed to update topic" });
            }

            return res.status(200).json({
                message: "Topic updated successfully"
            });
        }
    );
};

// =======================================
// UPDATE TOPIC STATUS
// =======================================
const updateTopicStatus = (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["not_started", "in_progress", "completed"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: "Status must be one of: not_started, in_progress, completed"
        });
    }

    syllabusModel.updateTopicStatus(userId, Number(id), status, (err, result) => {
        if (err) {
            console.error("[Syllabus Controller] updateTopicStatus error:", err);
            return res.status(500).json({ message: "Failed to update topic status" });
        }

        return res.status(200).json({
            message: "Status updated successfully",
            topic: result
        });
    });
};

// =======================================
// DELETE TOPIC
// =======================================
const deleteTopic = (req, res) => {
    const userId = req.user.user_id;
    const { id } = req.params;

    syllabusModel.deleteTopic(userId, Number(id), (err, result) => {
        if (err) {
            console.error("[Syllabus Controller] deleteTopic error:", err);
            return res.status(500).json({ message: "Failed to delete topic" });
        }

        return res.status(200).json({
            message: "Topic deleted successfully"
        });
    });
};

// =======================================
// SMART RAW TEXT PARSER (Heuristic)
// Parses typical course syllabus text into units & topics
// =======================================
const parseRawSyllabus = (req, res) => {
    const { text } = req.body;

    if (!text || !text.trim()) {
        return res.status(400).json({
            message: "Syllabus text is required"
        });
    }

    const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
    const modules = [];
    let currentModule = null;

    const unitRegex = /^(?:unit|module|chapter|section|part|week)\s*(\d+|[ivxlcdm]+)[:\s\-\.]*(.*)$/i;

    lines.forEach((line) => {
        const unitMatch = line.match(unitRegex);

        if (unitMatch) {
            if (currentModule) {
                modules.push(currentModule);
            }
            const unitNumber = unitMatch[1];
            const unitTitle = unitMatch[2] ? unitMatch[2].trim() : `Unit ${unitNumber}`;
            currentModule = {
                title: unitMatch[2] ? `Unit ${unitNumber}: ${unitTitle}` : `Unit ${unitNumber}`,
                description: "",
                topics: []
            };
        } else if (currentModule) {
            // Remove bullet points / numbering
            const cleanTopic = line.replace(/^[\*\-\•\–\—\d+\.\)]+\s*/, "").trim();
            if (cleanTopic.length > 2) {
                currentModule.topics.push({
                    title: cleanTopic,
                    estimated_minutes: 45,
                    difficulty: "medium"
                });
            }
        } else {
            // First header without explicit "Unit" keyword
            currentModule = {
                title: line.replace(/^#+\s*/, "").trim(),
                description: "",
                topics: []
            };
        }
    });

    if (currentModule) {
        modules.push(currentModule);
    }

    // Fallback if no units were detected (group into a single module)
    if (modules.length === 0 && lines.length > 0) {
        modules.push({
            title: "Course Overview & Topics",
            description: "",
            topics: lines.map((l) => ({
                title: l.replace(/^[\*\-\•\–\—\d+\.\)]+\s*/, "").trim(),
                estimated_minutes: 45,
                difficulty: "medium"
            })).filter((t) => t.title.length > 1)
        });
    }

    return res.status(200).json({
        modules
    });
};

// =======================================
// BULK IMPORT PARSED SYLLABUS
// =======================================
const bulkImport = (req, res) => {
    const userId = req.user.user_id;
    const { subject_id, modules } = req.body;

    if (!subject_id || !modules || !Array.isArray(modules) || modules.length === 0) {
        return res.status(400).json({
            message: "subject_id and non-empty modules array are required"
        });
    }

    syllabusModel.bulkImportSyllabus(userId, Number(subject_id), modules, (err, result) => {
        if (err) {
            console.error("[Syllabus Controller] bulkImport error:", err);
            return res.status(500).json({ message: "Failed to import syllabus" });
        }

        return res.status(201).json({
            message: "Syllabus imported successfully",
            result
        });
    });
};

module.exports = {
    getSubjectSyllabus,
    createUnit,
    updateUnit,
    deleteUnit,
    createTopic,
    updateTopic,
    updateTopicStatus,
    deleteTopic,
    parseRawSyllabus,
    bulkImport
};
