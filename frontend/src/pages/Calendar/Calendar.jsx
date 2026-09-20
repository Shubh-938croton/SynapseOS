import { useEffect, useState } from "react";
import {
    FiPlus,
    FiChevronLeft,
    FiChevronRight,
    FiCalendar,
    FiClock,
    FiExternalLink,
    FiEdit2,
    FiTrash2
} from "react-icons/fi";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import AddEventModal from "../../components/AddEventModal/AddEventModal";
import EditEventModal from "../../components/EditEventModal/EditEventModal";

import {
    getAllEvents,
    deleteEvent
} from "../../services/calendarService";

import {
    getAllContests
} from "../../services/contestService";

import "./Calendar.css";

function Calendar() {
    const today = new Date();

    const [currentDate, setCurrentDate] = useState(
        new Date(today.getFullYear(), today.getMonth(), 1)
    );

    const [events, setEvents] = useState([]);
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showAddEventModal, setShowAddEventModal] = useState(false);
    const [eventToEdit, setEventToEdit] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);

            const [eventsRes, contestsRes] = await Promise.allSettled([
                getAllEvents(),
                getAllContests()
            ]);

            if (eventsRes.status === "fulfilled") {
                const rawEvents = eventsRes.value;
                setEvents(Array.isArray(rawEvents) ? rawEvents : (rawEvents?.events || []));
            } else {
                console.error("Error fetching calendar events:", eventsRes.reason);
            }

            if (contestsRes.status === "fulfilled") {
                const rawContests = contestsRes.value;
                setContests(Array.isArray(rawContests) ? rawContests : (rawContests?.contests || []));
            } else {
                console.error("Error fetching contests for calendar:", contestsRes.reason);
            }
        } catch (error) {
            console.error("Error fetching calendar data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleEditEvent = (event) => {
        setEventToEdit(event);
    };

    const handleDeleteEvent = async (event) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${event.title}"?`
        );

        if (!confirmed) return;

        try {
            await deleteEvent(event.event_id);
            await fetchEvents();
        } catch (error) {
            console.error("Delete event error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to delete event."
            );
        }
    };

    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();

    const monthName = currentDate.toLocaleDateString("en-IN", {
        month: "long"
    });

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePreviousMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const handleToday = () => {
        setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    };

    const isToday = (day) => {
        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );
    };

    const getEventsForDay = (day) => {
        if (!day) return [];

        const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Regular calendar events
        const dayEvents = events.filter((event) => {
            if (!event.event_date) return false;
            const eventDate = String(event.event_date).substring(0, 10);
            return eventDate === dateString;
        });

        // Contests
        const dayContests = contests.filter((contest) => {
            if (!contest.contest_date) return false;

            let cDate = new Date(contest.contest_date);
            if (Number.isNaN(cDate.getTime()) && typeof contest.contest_date === "string") {
                cDate = new Date(contest.contest_date.replace(" ", "T"));
            }

            if (Number.isNaN(cDate.getTime())) {
                return String(contest.contest_date).substring(0, 10) === dateString;
            }

            const cYear = cDate.getFullYear();
            const cMonth = String(cDate.getMonth() + 1).padStart(2, "0");
            const cDay = String(cDate.getDate()).padStart(2, "0");

            return `${cYear}-${cMonth}-${cDay}` === dateString;
        }).map((contest) => {
            let cDate = new Date(contest.contest_date);
            if (Number.isNaN(cDate.getTime()) && typeof contest.contest_date === "string") {
                cDate = new Date(contest.contest_date.replace(" ", "T"));
            }

            let timeStr = "";
            if (!Number.isNaN(cDate.getTime())) {
                timeStr = cDate.toLocaleTimeString("en-IN", {
                    hour: "numeric",
                    minute: "2-digit"
                });
            }

            return {
                event_id: `contest_${contest.contest_id}`,
                title: contest.contest_name,
                platform: contest.platform,
                start_time: timeStr,
                contest_url: contest.contest_url,
                status: contest.participation_status,
                isContest: true,
                rawContest: contest
            };
        });

        return [...dayEvents, ...dayContests];
    };

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    return (
        <DashboardLayout>
            <AddEventModal
                isOpen={showAddEventModal}
                onClose={() => setShowAddEventModal(false)}
                onEventCreated={fetchEvents}
            />

            <EditEventModal
                event={eventToEdit}
                onClose={() => setEventToEdit(null)}
                onUpdated={fetchEvents}
            />

            <div className="calendar-page">
                {/* HEADER */}
                <div className="calendar-header">
                    <div>
                        <span className="calendar-label">SCHEDULE</span>
                        <h1>Academic Calendar</h1>
                        <p>
                            Plan study commitments, deadlines, and competitive programming events.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-event-btn"
                        onClick={() => setShowAddEventModal(true)}
                    >
                        <FiPlus />
                        <span>Add Event</span>
                    </button>
                </div>

                {/* CALENDAR MAIN CARD */}
                <div className="calendar-card">
                    {/* TOOLBAR */}
                    <div className="calendar-toolbar">
                        <div className="calendar-navigation">
                            <button
                                type="button"
                                onClick={handlePreviousMonth}
                                title="Previous Month"
                            >
                                <FiChevronLeft />
                            </button>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                title="Next Month"
                            >
                                <FiChevronRight />
                            </button>
                        </div>

                        <h2>{monthName} {year}</h2>

                        <button
                            type="button"
                            className="today-btn"
                            onClick={handleToday}
                        >
                            Today
                        </button>
                    </div>

                    {loading && (
                        <div className="calendar-loading">
                            Loading schedule...
                        </div>
                    )}

                    {/* WEEKDAYS */}
                    <div className="calendar-weekdays">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                    </div>

                    {/* CALENDAR GRID */}
                    <div className="calendar-grid">
                        {calendarDays.map((day, index) => {
                            const dayEvents = getEventsForDay(day);

                            return (
                                <div
                                    key={index}
                                    className={`calendar-day ${day && isToday(day) ? "today" : ""} ${!day ? "empty" : ""}`}
                                >
                                    {day && (
                                        <>
                                            <span className="day-number">{day}</span>

                                            <div className="day-events">
                                                {dayEvents.map((event) => (
                                                    <div
                                                        key={event.event_id}
                                                        className={`calendar-event ${event.isContest ? "calendar-contest-event" : ""} ${
                                                            event.status === "Completed" || event.status === "Participated"
                                                                ? "completed"
                                                                : event.status === "Cancelled" || event.status === "Missed"
                                                                  ? "cancelled"
                                                                  : ""
                                                        }`}
                                                        title={
                                                            event.isContest
                                                                ? `[${event.platform}] ${event.title}`
                                                                : event.title
                                                        }
                                                        onClick={() => {
                                                            if (event.isContest && event.contest_url) {
                                                                window.open(event.contest_url, "_blank", "noopener,noreferrer");
                                                            }
                                                        }}
                                                    >
                                                        {event.isContest && (
                                                            <div className="calendar-contest-badge">
                                                                <span className={`platform-pill ${event.platform?.toLowerCase().replace(/\s+/g, "-") || "other"}`}>
                                                                    {event.platform}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="calendar-event-title">
                                                            {event.title}
                                                        </div>

                                                        {event.start_time && (
                                                            <div className="calendar-event-time">
                                                                {event.start_time}
                                                                {event.end_time && ` - ${String(event.end_time).substring(0, 5)}`}
                                                            </div>
                                                        )}

                                                        <div className="calendar-event-actions">
                                                            {!event.isContest ? (
                                                                <>
                                                                    <button
                                                                        type="button"
                                                                        className="calendar-event-edit"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleEditEvent(event);
                                                                        }}
                                                                        title="Edit event"
                                                                    >
                                                                        <FiEdit2 />
                                                                    </button>

                                                                    <button
                                                                        type="button"
                                                                        className="calendar-event-delete"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleDeleteEvent(event);
                                                                        }}
                                                                        title="Delete event"
                                                                    >
                                                                        <FiTrash2 />
                                                                    </button>
                                                                </>
                                                            ) : event.contest_url ? (
                                                                <a
                                                                    href={event.contest_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="calendar-contest-link"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <FiExternalLink />
                                                                </a>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Calendar;