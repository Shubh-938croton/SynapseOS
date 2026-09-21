const calendarModel = require("../models/calendarModel");
const { recordEvent, EVENT_TYPES, ENTITY_TYPES } = require("../services/activityEventService");


// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            status
        } = req.body;


        // =========================
        // VALIDATION
        // =========================

        if (!title || !title.trim()) {

            return res.status(400).json({
                message: "Event title is required"
            });

        }


        if (!event_date) {

            return res.status(400).json({
                message: "Event date is required"
            });

        }


        // =========================
        // CREATE EVENT OBJECT
        // =========================

        const event = {

            user_id: userId,

            title: title.trim(),

            description:
                description?.trim() || null,

            event_date,

            start_time:
                start_time || null,

            end_time:
                end_time || null,

            reminder_minutes:
                reminder_minutes !== undefined &&
                reminder_minutes !== null
                    ? Number(reminder_minutes)
                    : 30,

            status:
                status || "Upcoming"

        };


        // =========================
        // SAVE TO DATABASE
        // =========================

        calendarModel.createEvent(
            event,
            (err, result) => {

                if (err) {

                    console.error(
                        "Create event database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to create event"
                    });

                }


                // Record CALENDAR_EVENT_CREATED event
                recordEvent({
                    userId: userId,
                    eventType: EVENT_TYPES.CALENDAR_EVENT_CREATED,
                    entityType: ENTITY_TYPES.CALENDAR_EVENT,
                    entityId: result.insertId,
                    metadata: {
                        title: event.title,
                        event_date: event.event_date,
                        start_time: event.start_time,
                        end_time: event.end_time,
                        status: event.status
                    }
                });

                return res.status(201).json({

                    message:
                        "Event created successfully",

                    event_id:
                        result.insertId

                });

            }
        );


    } catch (error) {

        console.error(
            "Create event controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// GET ALL EVENTS
// =====================================================

const getAllEvents = (req, res) => {

    try {

        const userId =
            req.user.user_id;


        calendarModel.getAllEvents(
            userId,
            (err, events) => {

                if (err) {

                    console.error("Get all events database error:", err);
                    return res.status(500).json({
                        message: "Failed to fetch events"
                    });

                }


                return res.status(200).json({

                    count:
                        events ? events.length : 0,

                    events:
                        events || []

                });

            }
        );


    } catch (error) {

        console.error("Get all events controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// GET EVENT BY ID
// =====================================================

const getEventById = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const eventId =
            req.params.id;


        calendarModel.getEventById(
            userId,
            eventId,
            (err, events) => {

                if (err) {

                    console.error("Get event by ID database error:", err);
                    return res.status(500).json({
                        message: "Failed to fetch event"
                    });

                }


                if (!events || events.length === 0) {

                    return res.status(404).json({

                        message:
                            "Event not found"

                    });

                }


                return res.status(200).json({

                    event:
                        events[0]

                });

            }
        );


    } catch (error) {

        console.error("Get event by ID controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// UPDATE EVENT
// =====================================================

const updateEvent = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const eventId =
            req.params.id;


        const {
            title,
            description,
            event_date,
            start_time,
            end_time,
            reminder_minutes,
            status
        } = req.body;


        // =========================
        // VALIDATION
        // =========================

        if (!title || !title.trim()) {

            return res.status(400).json({

                message:
                    "Event title is required"

            });

        }


        if (!event_date) {

            return res.status(400).json({

                message:
                    "Event date is required"

            });

        }


        const event = {

            title:
                title.trim(),

            description:
                description?.trim() || null,

            event_date,

            start_time:
                start_time || null,

            end_time:
                end_time || null,

            reminder_minutes:
                reminder_minutes ?? 30,

            status:
                status || "Upcoming"

        };


        calendarModel.updateEvent(
            userId,
            eventId,
            event,
            (err, result) => {

                if (err) {

                    console.error("Update event database error:", err);
                    return res.status(500).json({
                        message: "Failed to update event"
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        message:
                            "Event not found"

                    });

                }


                // Record CALENDAR_EVENT_UPDATED event
                recordEvent({
                    userId: userId,
                    eventType: EVENT_TYPES.CALENDAR_EVENT_UPDATED,
                    entityType: ENTITY_TYPES.CALENDAR_EVENT,
                    entityId: Number(eventId),
                    metadata: {
                        title: event.title,
                        event_date: event.event_date,
                        status: event.status
                    }
                });

                return res.status(200).json({

                    message:
                        "Event updated successfully"

                });

            }
        );


    } catch (error) {

        console.error("Update event controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =====================================================
// DELETE EVENT
// =====================================================

const deleteEvent = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const eventId =
            req.params.id;


        calendarModel.deleteEvent(
            userId,
            eventId,
            (err, result) => {

                if (err) {

                    console.error("Delete event database error:", err);
                    return res.status(500).json({
                        message: "Failed to delete event"
                    });

                }


                if (result.affectedRows === 0) {

                    return res.status(404).json({

                        message:
                            "Event not found"

                    });

                }


                // Record CALENDAR_EVENT_DELETED event
                recordEvent({
                    userId: userId,
                    eventType: EVENT_TYPES.CALENDAR_EVENT_DELETED,
                    entityType: ENTITY_TYPES.CALENDAR_EVENT,
                    entityId: Number(eventId)
                });

                return res.status(200).json({

                    message:
                        "Event deleted successfully"

                });

            }
        );


    } catch (error) {

        console.error("Delete event controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
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