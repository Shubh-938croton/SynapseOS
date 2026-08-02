const calendarModel = require("../models/calendarModel");

// Create Event
const createEvent = (req, res) => {

    try {

        const user_id = req.user.user_id;

        const {
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            event_type
        } = req.body;

        const event = {
            user_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            event_type
        };

        calendarModel.createEvent(event, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            return res.status(201).json({
                message: "Event created successfully",
                event_id: result.insertId
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Get All Events
const getAllEvents = (req, res) => {

    try {

        const userId = req.user.user_id;

        calendarModel.getAllEvents(userId, (err, events) => {

    if (err) {
        return res.status(500).json({
            message: "Database error",
            error: err.message
        });
    }

    return res.status(200).json({
    message: "Events fetched successfully",
    events
});

});

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Get Event By ID
const getEventById = (req, res) => {

    try {

        const userId = req.user.user_id;
        const eventId = req.params.id;

        calendarModel.getEventById(userId, eventId, (err, events) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (events.length === 0) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }

            return res.status(200).json({
                message: "Event fetched successfully",
                event: events[0]
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Update Event
const updateEvent = (req, res) => {

    try {

        const user_id = req.user.user_id;
        const event_id = req.params.id;

        const {
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            status
        } = req.body;

        const event = {
            event_id,
            user_id,
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            status
        };

        calendarModel.updateEvent(event, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }

            return res.status(200).json({
                message: "Event updated successfully"
            });

        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });

    }

};

// Delete Event
const deleteEvent = (req, res) => {

    try {

        const userId = req.user.user_id;
        const eventId = req.params.id;

        calendarModel.deleteEvent(userId, eventId, (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Event not found"
                });
            }

            return res.status(200).json({
                message: "Event deleted successfully"
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
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent
};