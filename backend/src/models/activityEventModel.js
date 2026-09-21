const db = require("../config/database");

// =====================================================
// CREATE ACTIVITY EVENT (APPEND-ONLY)
// =====================================================

const createEvent = (eventData, callback) => {
    const query = `
        INSERT INTO activity_events
        (
            user_id,
            event_type,
            entity_type,
            entity_id,
            metadata_json
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const metadataValue = eventData.metadata_json !== undefined && eventData.metadata_json !== null
        ? (typeof eventData.metadata_json === "string" ? eventData.metadata_json : JSON.stringify(eventData.metadata_json))
        : null;

    db.query(
        query,
        [
            eventData.user_id,
            eventData.event_type,
            eventData.entity_type,
            eventData.entity_id || null,
            metadataValue
        ],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};

// =====================================================
// CREATE EVENT WITH TRANSACTIONAL CONNECTION
// =====================================================

const createEventWithConnection = (connection, eventData, callback) => {
    const query = `
        INSERT INTO activity_events
        (
            user_id,
            event_type,
            entity_type,
            entity_id,
            metadata_json
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    const metadataValue = eventData.metadata_json !== undefined && eventData.metadata_json !== null
        ? (typeof eventData.metadata_json === "string" ? eventData.metadata_json : JSON.stringify(eventData.metadata_json))
        : null;

    connection.query(
        query,
        [
            eventData.user_id,
            eventData.event_type,
            eventData.entity_type,
            eventData.entity_id || null,
            metadataValue
        ],
        (err, result) => {
            if (err) {
                return callback(err, null);
            }
            callback(null, result);
        }
    );
};

// =====================================================
// GET EVENTS BY USER (READ-ONLY FOR AUDIT / TESTS)
// =====================================================

const getEventsByUserId = (userId, options = {}, callback) => {
    let limit = Number(options.limit) || 50;
    let offset = Number(options.offset) || 0;
    if (limit > 100) limit = 100;
    if (limit < 1) limit = 50;

    const query = `
        SELECT
            event_id,
            user_id,
            event_type,
            entity_type,
            entity_id,
            metadata_json,
            created_at
        FROM activity_events
        WHERE user_id = ?
        ORDER BY created_at DESC, event_id DESC
        LIMIT ? OFFSET ?
    `;

    db.query(query, [userId, limit, offset], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// =====================================================
// GET EVENTS BY ENTITY (READ-ONLY FOR ENTITY LIFECYCLE)
// =====================================================

const getEventsByEntity = (userId, entityType, entityId, callback) => {
    const query = `
        SELECT
            event_id,
            user_id,
            event_type,
            entity_type,
            entity_id,
            metadata_json,
            created_at
        FROM activity_events
        WHERE user_id = ?
        AND entity_type = ?
        AND entity_id = ?
        ORDER BY created_at ASC, event_id ASC
    `;

    db.query(query, [userId, entityType, entityId], (err, results) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, results);
    });
};

// =====================================================
// EXPORTS (STRICTLY NO UPDATE OR DELETE EXPOSED)
// =====================================================

module.exports = {
    createEvent,
    createEventWithConnection,
    getEventsByUserId,
    getEventsByEntity
};
