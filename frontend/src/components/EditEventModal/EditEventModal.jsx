import { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

import { updateEvent } from "../../services/calendarService";

import "./EditEventModal.css";


function EditEventModal({
    event,
    onClose,
    onUpdated
}) {

    // =========================
    // FORM STATE
    // =========================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [reminderMinutes, setReminderMinutes] =
        useState(30);

    const [status, setStatus] =
        useState("Upcoming");

    const [loading, setLoading] =
        useState(false);


    // =========================
    // LOAD EVENT DATA
    // =========================

    useEffect(() => {

        if (!event) {
            return;
        }

        console.log(
            "Editing event:",
            event
        );


        setTitle(
            event.title || ""
        );

        setDescription(
            event.description || ""
        );


        // IMPORTANT:
        // Keep only YYYY-MM-DD.
        // This prevents the timezone bug
        // where 20 becomes 19.

        setEventDate(
            event.event_date
                ? String(event.event_date).substring(0, 10)
                : ""
        );


        setStartTime(
            event.start_time
                ? String(event.start_time).substring(0, 5)
                : ""
        );


        setEndTime(
            event.end_time
                ? String(event.end_time).substring(0, 5)
                : ""
        );


        setReminderMinutes(
            event.reminder_minutes ?? 30
        );


        setStatus(
            event.status || "Upcoming"
        );

    }, [event]);


    // =========================
    // HANDLE CLOSE
    // =========================

    const handleClose = () => {

        if (loading) {
            return;
        }

        onClose();

    };


    // =========================
    // HANDLE SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =========================
        // CHECK EVENT
        // =========================

        if (!event) {

            alert(
                "No event selected."
            );

            return;

        }


        // =========================
        // VALIDATION
        // =========================

        if (!title.trim()) {

            alert(
                "Please enter an event title."
            );

            return;

        }


        if (!eventDate) {

            alert(
                "Please select an event date."
            );

            return;

        }


        if (
            startTime &&
            endTime &&
            endTime <= startTime
        ) {

            alert(
                "End time must be after start time."
            );

            return;

        }


        try {

            setLoading(true);


            // =========================
            // UPDATED EVENT DATA
            // =========================

            const eventData = {

                title:
                    title.trim(),

                description:
                    description.trim() || null,

                event_date:
                    eventDate,

                start_time:
                    startTime || null,

                end_time:
                    endTime || null,

                reminder_minutes:
                    Number(reminderMinutes),

                status:
                    status

            };


            console.log(
                "Updating event:",
                event.event_id,
                eventData
            );


            // =========================
            // UPDATE EVENT
            // =========================

            await updateEvent(
                event.event_id,
                eventData
            );


            console.log(
                "Event updated successfully"
            );


            // =========================
            // REFRESH CALENDAR
            // =========================

            if (onUpdated) {

                await onUpdated();

            }


            // =========================
            // CLOSE MODAL
            // =========================

            onClose();


        } catch (error) {

            console.error(
                "Update event error:",
                error
            );


            alert(

                error.response?.data?.message ||

                error.response?.data?.error ||

                "Failed to update event."

            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DON'T RENDER
    // =========================

    if (!event) {

        return null;

    }


    // =========================
    // RENDER
    // =========================

    return (

        <div
            className="edit-event-overlay"
            onClick={handleClose}
        >


            <div
                className="edit-event-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >


                {/* =========================
                    HEADER
                ========================= */}

                <div className="edit-event-header">

                    <div>

                        <h2>
                            Edit Event
                        </h2>

                        <p>
                            Update your calendar event.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="edit-event-close"
                        onClick={handleClose}
                        disabled={loading}
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                <form
                    className="edit-event-form"
                    onSubmit={handleSubmit}
                >


                    {/* =========================
                        TITLE
                    ========================= */}

                    <div className="edit-form-group">

                        <label>
                            Event Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="Enter event title"
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        DESCRIPTION
                    ========================= */}

                    <div className="edit-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Add event description..."
                            rows="4"
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        DATE
                    ========================= */}

                    <div className="edit-form-group">

                        <label>
                            Event Date
                        </label>

                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) =>
                                setEventDate(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        START TIME
                    ========================= */}

                    <div className="edit-form-group">

                        <label>
                            Start Time
                        </label>

                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) =>
                                setStartTime(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        END TIME
                    ========================= */}

                    <div className="edit-form-group">

                        <label>
                            End Time
                        </label>

                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) =>
                                setEndTime(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        REMINDER
                    ========================= */}

                    <div className="edit-form-group">

                        <label>
                            Reminder
                        </label>

                        <select
                            value={reminderMinutes}
                            onChange={(e) =>
                                setReminderMinutes(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        >

                            <option value="0">
                                No reminder
                            </option>

                            <option value="5">
                                5 minutes before
                            </option>

                            <option value="10">
                                10 minutes before
                            </option>

                            <option value="15">
                                15 minutes before
                            </option>

                            <option value="30">
                                30 minutes before
                            </option>

                            <option value="60">
                                1 hour before
                            </option>

                            <option value="1440">
                                1 day before
                            </option>

                        </select>

                    </div>


                    {/* =========================
                        STATUS
                    ========================= */}

                    <div className="edit-form-group">

                        <label>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        >

                            <option value="Upcoming">
                                Upcoming
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                            <option value="Cancelled">
                                Cancelled
                            </option>

                        </select>

                    </div>


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <div className="edit-event-actions">

                        <button
                            type="button"
                            className="edit-cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="edit-save-btn"
                            disabled={loading}
                        >

                            <FaSave />

                            {loading
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    </div>


                </form>

            </div>

        </div>

    );

}


export default EditEventModal;