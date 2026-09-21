const {
    EVENT_TYPES,
    ENTITY_TYPES,
    isValidEventType,
    isValidEntityType
} = require("../constants/eventTypes");
const activityEventModel = require("../models/activityEventModel");

// =====================================================
// SENSITIVE KEYS TO SANITIZE FROM METADATA
// =====================================================

const SENSITIVE_KEY_PATTERNS = [
    /password/i,
    /token/i,
    /secret/i,
    /key/i,
    /auth/i,
    /bearer/i,
    /cookie/i,
    /credential/i
];

/**
 * Recursively sanitize metadata object to prevent any confidential or oversized data
 * from entering the immutable event log.
 */
const sanitizeMetadata = (data, depth = 0) => {
    if (data === null || data === undefined) return null;
    if (depth > 3) return "[Nested Object Truncated]";

    if (typeof data !== "object") {
        if (typeof data === "string" && data.length > 1000) {
            return data.substring(0, 1000) + "...[truncated]";
        }
        return data;
    }

    if (Array.isArray(data)) {
        return data.slice(0, 20).map((item) => sanitizeMetadata(item, depth + 1));
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
        const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
        if (isSensitive) {
            continue; // Omit sensitive field
        }

        sanitized[key] = sanitizeMetadata(value, depth + 1);
    }

    return sanitized;
};

// =====================================================
// RECORD EVENT SERVICE
// =====================================================

/**
 * Record a domain activity event.
 *
 * @param {Object} params
 * @param {number} params.userId - Authenticated user ID (must come from req.user.user_id)
 * @param {string} params.eventType - Controlled event type from EVENT_TYPES
 * @param {string} params.entityType - Controlled entity type from ENTITY_TYPES
 * @param {number|null} [params.entityId] - Primary key of affected entity
 * @param {Object|null} [params.metadata] - Structured, sanitized event context
 * @param {Function} [callback] - Optional node-style callback (err, result)
 * @returns {Promise<Object>}
 */
const recordEvent = (params, callback) => {
    return new Promise((resolve, reject) => {
        const {
            userId,
            eventType,
            entityType,
            entityId,
            metadata
        } = params || {};

        // 1. Validate User ID
        const parsedUserId = Number(userId);
        if (!userId || !Number.isInteger(parsedUserId) || parsedUserId <= 0) {
            const err = new Error("Invalid or missing userId for activity event");
            if (typeof callback === "function") return callback(err, null);
            return reject(err);
        }

        // 2. Validate Event Type
        if (!isValidEventType(eventType)) {
            const err = new Error(`Invalid eventType: "${eventType}"`);
            if (typeof callback === "function") return callback(err, null);
            return reject(err);
        }

        // 3. Validate Entity Type
        if (!isValidEntityType(entityType)) {
            const err = new Error(`Invalid entityType: "${entityType}"`);
            if (typeof callback === "function") return callback(err, null);
            return reject(err);
        }

        // 4. Validate & Format Entity ID
        let parsedEntityId = null;
        if (entityId !== undefined && entityId !== null && entityId !== "") {
            const numId = Number(entityId);
            if (Number.isInteger(numId) && numId > 0) {
                parsedEntityId = numId;
            }
        }

        // 5. Sanitize & Serialize Metadata
        let sanitizedMeta = null;
        if (metadata && typeof metadata === "object") {
            try {
                sanitizedMeta = sanitizeMetadata(metadata);
            } catch (metaErr) {
                console.error("Metadata sanitization warning:", metaErr);
                sanitizedMeta = null;
            }
        }

        const eventData = {
            user_id: parsedUserId,
            event_type: eventType,
            entity_type: entityType,
            entity_id: parsedEntityId,
            metadata_json: sanitizedMeta
        };

        // 6. Persist to Database Model
        activityEventModel.createEvent(eventData, (err, result) => {
            if (err) {
                console.error("Activity event persistence error:", err.message);
                if (typeof callback === "function") return callback(err, null);
                // For non-callback calls, reject so async caller can handle if desired,
                // but log to server diagnostics
                return reject(err);
            }

            const response = {
                event_id: result.insertId,
                user_id: parsedUserId,
                event_type: eventType,
                entity_type: entityType,
                entity_id: parsedEntityId
            };

            if (typeof callback === "function") {
                return callback(null, response);
            }
            resolve(response);
        });
    }).catch((error) => {
        // If caller called fire-and-forget without .catch(), log and prevent unhandled rejection
        if (typeof callback !== "function") {
            console.error("Unhandled activity event record error:", error.message);
        }
        if (typeof callback === "function") {
            // Already called in promise
            return;
        }
        return null;
    });
};

/**
 * Record a domain activity event inside an existing database transaction.
 */
const recordEventWithConnection = (connection, params, callback) => {
    const {
        userId,
        eventType,
        entityType,
        entityId,
        metadata
    } = params || {};

    const parsedUserId = Number(userId);
    if (!userId || !Number.isInteger(parsedUserId) || parsedUserId <= 0) {
        return callback(new Error("Invalid userId for activity event"), null);
    }

    if (!isValidEventType(eventType)) {
        return callback(new Error(`Invalid eventType: "${eventType}"`), null);
    }

    if (!isValidEntityType(entityType)) {
        return callback(new Error(`Invalid entityType: "${entityType}"`), null);
    }

    let parsedEntityId = null;
    if (entityId !== undefined && entityId !== null && entityId !== "") {
        const numId = Number(entityId);
        if (Number.isInteger(numId) && numId > 0) {
            parsedEntityId = numId;
        }
    }

    const sanitizedMeta = metadata && typeof metadata === "object"
        ? sanitizeMetadata(metadata)
        : null;

    const eventData = {
        user_id: parsedUserId,
        event_type: eventType,
        entity_type: entityType,
        entity_id: parsedEntityId,
        metadata_json: sanitizedMeta
    };

    activityEventModel.createEventWithConnection(connection, eventData, (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, {
            event_id: result.insertId,
            user_id: parsedUserId,
            event_type: eventType,
            entity_type: entityType,
            entity_id: parsedEntityId
        });
    });
};

module.exports = {
    recordEvent,
    recordEventWithConnection,
    EVENT_TYPES,
    ENTITY_TYPES
};
