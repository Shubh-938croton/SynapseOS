const db = require("../config/database");

/**
 * Get full structured syllabus for a subject (Units + Topics + Metrics)
 */
const getSyllabusBySubject = (userId, subjectId, callback) => {
    // 1. Fetch Units
    const unitsQuery = `
        SELECT
            unit_id,
            user_id,
            subject_id,
            title,
            description,
            order_index,
            created_at,
            updated_at
        FROM syllabus_units
        WHERE user_id = ? AND subject_id = ?
        ORDER BY order_index ASC, unit_id ASC
    `;

    // 2. Fetch Topics
    const topicsQuery = `
        SELECT
            topic_id,
            unit_id,
            user_id,
            subject_id,
            title,
            description,
            status,
            estimated_minutes,
            difficulty,
            order_index,
            completed_at,
            created_at,
            updated_at
        FROM syllabus_topics
        WHERE user_id = ? AND subject_id = ?
        ORDER BY order_index ASC, topic_id ASC
    `;

    db.query(unitsQuery, [userId, subjectId], (err, units) => {
        if (err) return callback(err, null);

        db.query(topicsQuery, [userId, subjectId], (err2, topics) => {
            if (err2) return callback(err2, null);

            // Group topics by unit_id
            const topicsByUnit = {};
            let totalTopics = 0;
            let completedTopics = 0;
            let inProgressTopics = 0;
            let notStartedTopics = 0;
            let totalEstimatedMinutes = 0;
            let remainingEstimatedMinutes = 0;

            topics.forEach((topic) => {
                totalTopics++;
                const mins = Number(topic.estimated_minutes) || 45;
                totalEstimatedMinutes += mins;

                if (topic.status === "completed") {
                    completedTopics++;
                } else if (topic.status === "in_progress") {
                    inProgressTopics++;
                    remainingEstimatedMinutes += mins;
                } else {
                    notStartedTopics++;
                    remainingEstimatedMinutes += mins;
                }

                if (!topicsByUnit[topic.unit_id]) {
                    topicsByUnit[topic.unit_id] = [];
                }
                topicsByUnit[topic.unit_id].push(topic);
            });

            // Attach topics to units and compute per-unit stats
            const structuredUnits = units.map((unit) => {
                const unitTopics = topicsByUnit[unit.unit_id] || [];
                const unitCompleted = unitTopics.filter((t) => t.status === "completed").length;
                const unitTotal = unitTopics.length;
                const unitProgress = unitTotal > 0 ? Math.round((unitCompleted / unitTotal) * 100) : 0;
                const unitMinutes = unitTopics.reduce((sum, t) => sum + (Number(t.estimated_minutes) || 45), 0);

                return {
                    ...unit,
                    topics: unitTopics,
                    stats: {
                        total_topics: unitTotal,
                        completed_topics: unitCompleted,
                        progress_percentage: unitProgress,
                        total_minutes: unitMinutes
                    }
                };
            });

            const overallProgress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

            const responsePayload = {
                subject_id: Number(subjectId),
                summary: {
                    total_units: units.length,
                    total_topics: totalTopics,
                    completed_topics: completedTopics,
                    in_progress_topics: inProgressTopics,
                    not_started_topics: notStartedTopics,
                    progress_percentage: overallProgress,
                    total_estimated_minutes: totalEstimatedMinutes,
                    remaining_estimated_minutes: remainingEstimatedMinutes
                },
                units: structuredUnits
            };

            callback(null, responsePayload);
        });
    });
};

/**
 * Create a new Unit/Module
 */
const createUnit = (userId, unitData, callback) => {
    const query = `
        INSERT INTO syllabus_units
        (user_id, subject_id, title, description, order_index)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            userId,
            unitData.subject_id,
            unitData.title,
            unitData.description || null,
            unitData.order_index || 0
        ],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, { unit_id: result.insertId, ...unitData });
        }
    );
};

/**
 * Update an existing Unit
 */
const updateUnit = (userId, unitId, unitData, callback) => {
    const query = `
        UPDATE syllabus_units
        SET
            title = ?,
            description = ?,
            order_index = ?
        WHERE unit_id = ? AND user_id = ?
    `;

    db.query(
        query,
        [
            unitData.title,
            unitData.description || null,
            unitData.order_index || 0,
            unitId,
            userId
        ],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        }
    );
};

/**
 * Delete a Unit (cascades to topics via FK)
 */
const deleteUnit = (userId, unitId, callback) => {
    const query = `
        DELETE FROM syllabus_units
        WHERE unit_id = ? AND user_id = ?
    `;

    db.query(query, [unitId, userId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

/**
 * Create a new Topic
 */
const createTopic = (userId, topicData, callback) => {
    const query = `
        INSERT INTO syllabus_topics
        (unit_id, user_id, subject_id, title, description, status, estimated_minutes, difficulty, order_index)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            topicData.unit_id,
            userId,
            topicData.subject_id,
            topicData.title,
            topicData.description || null,
            topicData.status || "not_started",
            topicData.estimated_minutes || 45,
            topicData.difficulty || "medium",
            topicData.order_index || 0
        ],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, { topic_id: result.insertId, ...topicData });
        }
    );
};

/**
 * Update Topic details
 */
const updateTopic = (userId, topicId, topicData, callback) => {
    const query = `
        UPDATE syllabus_topics
        SET
            title = ?,
            description = ?,
            estimated_minutes = ?,
            difficulty = ?,
            order_index = ?
        WHERE topic_id = ? AND user_id = ?
    `;

    db.query(
        query,
        [
            topicData.title,
            topicData.description || null,
            topicData.estimated_minutes || 45,
            topicData.difficulty || "medium",
            topicData.order_index || 0,
            topicId,
            userId
        ],
        (err, result) => {
            if (err) return callback(err, null);
            callback(null, result);
        }
    );
};

/**
 * Update Topic Status (not_started, in_progress, completed)
 */
const updateTopicStatus = (userId, topicId, status, callback) => {
    const completedAt = status === "completed" ? new Date() : null;

    const query = `
        UPDATE syllabus_topics
        SET
            status = ?,
            completed_at = ?
        WHERE topic_id = ? AND user_id = ?
    `;

    db.query(query, [status, completedAt, topicId, userId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, { topic_id: topicId, status, completed_at: completedAt });
    });
};

/**
 * Delete a Topic
 */
const deleteTopic = (userId, topicId, callback) => {
    const query = `
        DELETE FROM syllabus_topics
        WHERE topic_id = ? AND user_id = ?
    `;

    db.query(query, [topicId, userId], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
};

/**
 * Bulk Import Modules & Topics (e.g. from structured parser)
 */
const bulkImportSyllabus = (userId, subjectId, modules, callback) => {
    if (!modules || !Array.isArray(modules) || modules.length === 0) {
        return callback(new Error("No modules provided for import"), null);
    }

    db.getConnection(async (err, connection) => {
        if (err) return callback(err, null);

        try {
            await connection.promise().beginTransaction();

            for (let mIdx = 0; mIdx < modules.length; mIdx++) {
                const mod = modules[mIdx];
                const [uResult] = await connection.promise().query(
                    `INSERT INTO syllabus_units (user_id, subject_id, title, description, order_index) VALUES (?, ?, ?, ?, ?)`,
                    [userId, subjectId, mod.title || `Module ${mIdx + 1}`, mod.description || null, mIdx]
                );
                const unitId = uResult.insertId;

                const topics = mod.topics || [];
                for (let tIdx = 0; tIdx < topics.length; tIdx++) {
                    const top = topics[tIdx];
                    const title = typeof top === "string" ? top : (top.title || `Topic ${tIdx + 1}`);
                    const est = (typeof top === "object" && top.estimated_minutes) ? top.estimated_minutes : 45;
                    const diff = (typeof top === "object" && top.difficulty) ? top.difficulty : "medium";

                    await connection.promise().query(
                        `INSERT INTO syllabus_topics (unit_id, user_id, subject_id, title, estimated_minutes, difficulty, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [unitId, userId, subjectId, title, est, diff, tIdx]
                    );
                }
            }

            await connection.promise().commit();
            connection.release();
            callback(null, { success: true, modules_imported: modules.length });
        } catch (txErr) {
            await connection.promise().rollback();
            connection.release();
            callback(txErr, null);
        }
    });
};

module.exports = {
    getSyllabusBySubject,
    createUnit,
    updateUnit,
    deleteUnit,
    createTopic,
    updateTopic,
    updateTopicStatus,
    deleteTopic,
    bulkImportSyllabus
};
