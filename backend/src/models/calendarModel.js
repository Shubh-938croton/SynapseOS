const db = require("../config/database");


// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = (event, callback) => {

    const query = `
        INSERT INTO calendar_events
        (
            user_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            event.user_id,
            event.title,
            event.description,
            event.event_date,
            event.start_time,
            event.end_time,
            event.reminder_minutes,
            event.status
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
// GET ALL EVENTS
// =====================================================

const getAllEvents = (userId, callback) => {

    const query = `
        SELECT
            event_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            status,
            created_at
        FROM calendar_events
        WHERE user_id = ?
        ORDER BY event_date ASC, start_time ASC
    `;

    db.query(
        query,
        [userId],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);

        }
    );

};


// =====================================================
// GET EVENT BY ID
// =====================================================

const getEventById = (
    userId,
    eventId,
    callback
) => {

    const query = `
        SELECT
            event_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            status,
            created_at
        FROM calendar_events
        WHERE
            event_id = ?
            AND user_id = ?
    `;

    db.query(
        query,
        [eventId, userId],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);

        }
    );

};


// =====================================================
// UPDATE EVENT
// =====================================================

const updateEvent = (
    userId,
    eventId,
    event,
    callback
) => {

    const query = `
        UPDATE calendar_events
        SET
            title = ?,
            description = ?,
            event_date = ?,
            start_time = ?,
            end_time = ?,
            reminder_minutes = ?,
            status = ?
        WHERE
            event_id = ?
            AND user_id = ?
    `;

    db.query(
        query,
        [
            event.title,
            event.description,
            event.event_date,
            event.start_time,
            event.end_time,
            event.reminder_minutes,
            event.status,
            eventId,
            userId
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
// DELETE EVENT
// =====================================================

const deleteEvent = (
    userId,
    eventId,
    callback
) => {

    const query = `
        DELETE FROM calendar_events
        WHERE
            event_id = ?
            AND user_id = ?
    `;

    db.query(
        query,
        [eventId, userId],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};


module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};