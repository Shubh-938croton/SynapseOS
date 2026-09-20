import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";

import { createEvent } from "../../services/calendarService";

import "./AddEventModal.css";

function AddEventModal({
    isOpen,
    onClose,
    onEventCreated
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
        if (isOpen) {
            setTitle("");
            setDescription("");
            setEventDate("");
            setStartTime("");
            setEndTime("");
            setReminderMinutes(30);
            setStatus("Upcoming");
            setLoading(false);
        }
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            await createEvent(eventData);

            if (onEventCreated) {
                await onEventCreated();
            }

            onClose();
        } catch (error) {
            console.error("Create event error:", error);
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create event"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="event-modal-overlay" onClick={onClose}>
            <div className="event-modal" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="event-modal-header">
                    <div>
                        <h2>Create Event</h2>
                        <p>Schedule an academic session or important deadline.</p>
                    </div>

                    <button
                        type="button"
                        className="event-modal-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                </div>

                {/* FORM */}
                <form className="event-modal-form" onSubmit={handleSubmit}>
                    <div className="event-form-group">
                        <label>Event Title <span className="required-star">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Physics Midterm Examination"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="event-form-group">
                        <label>Description <span className="optional-tag">(Optional)</span></label>
                        <textarea
                            placeholder="Add syllabus details, room numbers, or links..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows="3"
                        />
                    </div>

                    <div className="event-form-group">
                        <label>Event Date <span className="required-star">*</span></label>
                        <input
                            type="date"
                            value={eventDate}
                            onChange={(e) => setEventDate(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="event-form-row">
                        <div className="event-form-group">
                            <label>Start Time</label>
                            <input
                                type="time"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="event-form-group">
                            <label>End Time</label>
                            <input
                                type="time"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="event-form-row">
                        <div className="event-form-group">
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

                        <div className="event-form-group">
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

                    <div className="event-modal-actions">
                        <button
                            type="button"
                            className="event-cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="event-save-btn"
                            disabled={loading}
                        >
                            <FiCheck />
                            <span>{loading ? "Creating..." : "Create Event"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddEventModal;