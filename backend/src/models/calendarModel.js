const db = require("../config/database");

// Create Event
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


// Get All Events
const getAllEvents = (userId, callback) => {

    const query = `
        SELECT *
        FROM calendar_events
        WHERE user_id = ?
        ORDER BY event_date ASC, start_time ASC
    `;

    db.query(query, [userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// Get Event By ID
const getEventById = (userId, eventId, callback) => {

    const query = `
        SELECT *
        FROM calendar_events
        WHERE event_id = ?
        AND user_id = ?
    `;

    db.query(query, [eventId, userId], (err, results) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, results);

    });

};

// Update Event
const updateEvent = (event, callback) => {

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
        WHERE event_id = ?
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
            event.event_id,
            event.user_id
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );
};

// Delete Event
const deleteEvent = (userId, eventId, callback) => {

    const query = `
        DELETE FROM calendar_events
        WHERE event_id = ?
        AND user_id = ?
    `;

    db.query(query, [eventId, userId], (err, result) => {

        if (err) {
            return callback(err, null);
        }

        callback(null, result);

    });

};

module.exports = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};