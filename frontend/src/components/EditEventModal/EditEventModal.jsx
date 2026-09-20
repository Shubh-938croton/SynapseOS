import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";

import { updateEvent } from "../../services/calendarService";

import "./EditEventModal.css";

function EditEventModal({
    event,
    onClose,
    onUpdated
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [reminderMinutes, setReminderMinutes] = useState(30);
    const [status, setStatus] = useState("Upcoming");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!event) return;

        setTitle(event.title || "");
        setDescription(event.description || "");
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
        setReminderMinutes(event.reminder_minutes ?? 30);
        setStatus(event.status || "Upcoming");
    }, [event]);

    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!event) return;

        if (!title.trim()) {
            alert("Please enter an event title.");
            return;
        }

        if (!eventDate) {
            alert("Please select an event date.");
            return;
        }

        if (
            startTime &&
            endTime &&
            endTime <= startTime
        ) {
            alert("End time must be after start time.");
            return;
        }

        try {
            setLoading(true);

            const eventData = {
                title: title.trim(),
                description: description.trim() || null,
                event_date: eventDate,
                start_time: startTime || null,
                end_time: endTime || null,
                reminder_minutes: Number(reminderMinutes),
                status: status
            };

            await updateEvent(event.event_id, eventData);

            if (onUpdated) {
                await onUpdated();
            }

            onClose();
        } catch (error) {
            console.error("Update event error:", error);
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update event."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!event) return null;

    return (
        <div className="edit-event-overlay" onClick={handleClose}>
            <div className="edit-event-modal" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="edit-event-header">
                    <div>
                        <h2>Edit Event</h2>
                        <p>Update your scheduled commitment or deadline.</p>
                    </div>

                    <button
                        type="button"
                        className="edit-event-close"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                </div>

                {/* FORM */}
                <form className="edit-event-form" onSubmit={handleSubmit}>
                    <div className="edit-form-group">
                        <label>Event Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter event title"
                            disabled={loading}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="edit-form-group">
                        <label>Description <span className="optional-tag">(Optional)</span></label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add event description..."
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    <div className="edit-form-group">
                        <label>Event Date</label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="edit-form-row">
                        <div className="edit-form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="edit-form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="edit-form-row">
                        <div className="edit-form-group">
                            <label>Reminder</label>
                            <select
                                value={reminderMinutes}
                                onChange={(e) => setReminderMinutes(e.target.value)}
                                disabled={loading}
                            >
                                <option value="0">No reminder</option>
                                <option value="5">5 minutes before</option>
                                <option value="10">10 minutes before</option>
                                <option value="15">15 minutes before</option>
                                <option value="30">30 minutes before</option>
                                <option value="60">1 hour before</option>
                                <option value="1440">1 day before</option>
                            </select>
                        </div>

                        <div className="edit-form-group">
                            <label>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={loading}
                            >
                                <option value="Upcoming">Upcoming</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>

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
                            <FiCheck />
                            <span>{loading ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditEventModal;