import { useEffect, useState } from "react";

import DashboardLayout
    from "../../components/Layout/DashboardLayout";

import AddEventModal
    from "../../components/AddEventModal/AddEventModal";

import EditEventModal
    from "../../components/EditEventModal/EditEventModal";

import {
    getAllEvents,
    deleteEvent
} from "../../services/calendarService";

import {
    getAllContests
} from "../../services/contestService";

import "./Calendar.css";


function Calendar() {

    // =========================
    // TODAY
    // =========================

    const today = new Date();


    // =========================
    // CURRENT DATE
    // =========================

    const [currentDate, setCurrentDate] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    );


    // =========================
    // EVENTS & CONTESTS
    // =========================

    const [events, setEvents] = useState([]);
    const [contests, setContests] = useState([]);

    const [loading, setLoading] = useState(true);


    // =========================
    // ADD EVENT MODAL
    // =========================

    const [showAddEventModal, setShowAddEventModal] =
        useState(false);


    // =========================
    // EDIT EVENT
    // =========================

    const [eventToEdit, setEventToEdit] =
        useState(null);


    // =========================
    // FETCH EVENTS & CONTESTS
    // =========================

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
                console.error(
                    "Error fetching calendar events:",
                    eventsRes.reason
                );
            }

            if (contestsRes.status === "fulfilled") {
                const rawContests = contestsRes.value;
                setContests(Array.isArray(rawContests) ? rawContests : (rawContests?.contests || []));
            } else {
                console.error(
                    "Error fetching contests for calendar:",
                    contestsRes.reason
                );
            }

        } catch (error) {

            console.error(
                "Error fetching calendar data:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchEvents();

    }, []);


    // =========================
    // EDIT EVENT
    // =========================

    const handleEditEvent = (event) => {

        console.log(
            "Editing event:",
            event
        );

        setEventToEdit(event);

    };


    // =========================
    // DELETE EVENT
    // =========================

    const handleDeleteEvent = async (event) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${event.title}"?`
        );


        if (!confirmed) {

            return;

        }


        try {

            await deleteEvent(
                event.event_id
            );


            console.log(
                "Event deleted successfully"
            );


            // Refresh calendar

            await fetchEvents();


        } catch (error) {

            console.error(
                "Delete event error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Failed to delete event."
            );

        }

    };


    // =========================
    // MONTH / YEAR
    // =========================

    const month =
        currentDate.getMonth();

    const year =
        currentDate.getFullYear();


    const monthName =
        currentDate.toLocaleDateString(
            "en-IN",
            {
                month: "long"
            }
        );


    // =========================
    // DAYS IN MONTH
    // =========================

    const firstDayOfMonth =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    // =========================
    // PREVIOUS MONTH
    // =========================

    const handlePreviousMonth = () => {

        setCurrentDate(
            new Date(
                year,
                month - 1,
                1
            )
        );

    };


    // =========================
    // NEXT MONTH
    // =========================

    const handleNextMonth = () => {

        setCurrentDate(
            new Date(
                year,
                month + 1,
                1
            )
        );

    };


    // =========================
    // TODAY
    // =========================

    const handleToday = () => {

        setCurrentDate(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        );

    };


    // =========================
    // CHECK TODAY
    // =========================

    const isToday = (day) => {

        return (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        );

    };


    // =========================
    // GET EVENTS FOR DAY
    // =========================

    const getEventsForDay = (day) => {

        if (!day) {
            return [];
        }

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

        // Regular calendar events
        const dayEvents = events.filter((event) => {
            if (!event.event_date) {
                return false;
            }
            const eventDate = String(event.event_date).substring(0, 10);
            return eventDate === dateString;
        });

        // Contests
        const dayContests = contests.filter((contest) => {
            if (!contest.contest_date) {
                return false;
            }

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


    // =========================
    // CALENDAR DAYS
    // =========================

    const calendarDays = [];


    // Empty cells before first day

    for (
        let i = 0;
        i < firstDayOfMonth;
        i++
    ) {

        calendarDays.push(null);

    }


    // Actual days

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        calendarDays.push(day);

    }


    // =========================
    // RENDER
    // =========================

    return (

        <DashboardLayout>


            {/* =========================
                ADD EVENT MODAL
            ========================= */}

            <AddEventModal

                isOpen={
                    showAddEventModal
                }

                onClose={() =>
                    setShowAddEventModal(false)
                }

                onEventCreated={
                    fetchEvents
                }

            />


            {/* =========================
                EDIT EVENT MODAL
            ========================= */}

            <EditEventModal

                event={
                    eventToEdit
                }

                onClose={() =>
                    setEventToEdit(null)
                }

                onUpdated={
                    fetchEvents
                }

            />


            {/* =========================
                CALENDAR PAGE
            ========================= */}

            <div className="calendar-page">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="calendar-header">


                    <div>

                        <h1>
                            My Calendar
                        </h1>


                        <p>
                            Plan your tasks, events and
                            important activities.
                        </p>

                    </div>


                    {/* ADD EVENT */}

                    <button

                        type="button"

                        className="add-event-btn"

                        onClick={() => {

                            console.log(
                                "Add event clicked"
                            );

                            setShowAddEventModal(
                                true
                            );

                        }}

                    >

                        + Add Event

                    </button>


                </div>


                {/* =========================
                    CALENDAR CARD
                ========================= */}

                <div className="calendar-card">


                    {/* =========================
                        TOOLBAR
                    ========================= */}

                    <div className="calendar-toolbar">


                        {/* NAVIGATION */}

                        <div className="calendar-navigation">


                            <button

                                type="button"

                                onClick={
                                    handlePreviousMonth
                                }

                            >

                                ‹

                            </button>


                            <button

                                type="button"

                                onClick={
                                    handleNextMonth
                                }

                            >

                                ›

                            </button>


                        </div>


                        {/* MONTH */}

                        <h2>

                            {monthName} {year}

                        </h2>


                        {/* TODAY */}

                        <button

                            type="button"

                            className="today-btn"

                            onClick={
                                handleToday
                            }

                        >

                            Today

                        </button>


                    </div>


                    {/* =========================
                        LOADING
                    ========================= */}

                    {loading && (

                        <div className="calendar-loading">

                            Loading events...

                        </div>

                    )}


                    {/* =========================
                        WEEKDAYS
                    ========================= */}

                    <div className="calendar-weekdays">

                        <div>Sun</div>

                        <div>Mon</div>

                        <div>Tue</div>

                        <div>Wed</div>

                        <div>Thu</div>

                        <div>Fri</div>

                        <div>Sat</div>

                    </div>


                    {/* =========================
                        CALENDAR GRID
                    ========================= */}

                    <div className="calendar-grid">


                        {calendarDays.map(
                            (day, index) => {

                                const dayEvents =
                                    getEventsForDay(
                                        day
                                    );


                                return (

                                    <div

                                        key={index}

                                        className={`
                                            calendar-day
                                            ${
                                                day &&
                                                isToday(day)
                                                    ? "today"
                                                    : ""
                                            }
                                        `}

                                    >


                                        {day && (

                                            <>

                                                {/* =========================
                                                    DAY NUMBER
                                                ========================= */}

                                                <span
                                                    className="day-number"
                                                >

                                                    {day}

                                                </span>


                                                {/* =========================
                                                    EVENTS
                                                ========================= */}

                                                <div
                                                    className="day-events"
                                                >


                                                    {dayEvents.map(
                                                        (event) => (

                                                            <div
                                                                key={
                                                                    event.event_id
                                                                }
                                                                className={`
                                                                    calendar-event
                                                                    ${
                                                                        event.isContest
                                                                            ? "calendar-contest-event"
                                                                            : ""
                                                                    }
                                                                    ${
                                                                        event.status ===
                                                                        "Completed" ||
                                                                        event.status ===
                                                                        "Participated"
                                                                            ? "completed"
                                                                            : event.status ===
                                                                              "Cancelled" ||
                                                                              event.status ===
                                                                              "Missed"
                                                                            ? "cancelled"
                                                                            : ""
                                                                    }
                                                                `}
                                                                title={
                                                                    event.isContest
                                                                        ? `[${event.platform}] ${event.title}`
                                                                        : event.title
                                                                }
                                                                onClick={() => {
                                                                    if (
                                                                        event.isContest &&
                                                                        event.contest_url
                                                                    ) {
                                                                        window.open(
                                                                            event.contest_url,
                                                                            "_blank",
                                                                            "noopener,noreferrer"
                                                                        );
                                                                    }
                                                                }}
                                                            >

                                                                {/* CONTEST BADGE */}
                                                                {event.isContest && (
                                                                    <div className="calendar-contest-badge">
                                                                        <span
                                                                            className={`platform-pill ${
                                                                                event.platform
                                                                                    ?.toLowerCase()
                                                                                    .replace(
                                                                                        /\s+/g,
                                                                                        "-"
                                                                                    ) ||
                                                                                "other"
                                                                            }`}
                                                                        >
                                                                            {
                                                                                event.platform
                                                                            }
                                                                        </span>
                                                                    </div>
                                                                )}

                                                                {/* EVENT TITLE */}
                                                                <div
                                                                    className="calendar-event-title"
                                                                >
                                                                    {
                                                                        event.title
                                                                    }
                                                                </div>

                                                                {/* EVENT TIME */}
                                                                {event.start_time && (
                                                                    <div
                                                                        className="calendar-event-time"
                                                                    >
                                                                        {
                                                                            event.start_time
                                                                        }
                                                                        {event.end_time && (
                                                                            <>
                                                                                {" - "}
                                                                                {
                                                                                    String(
                                                                                        event.end_time
                                                                                    ).substring(
                                                                                        0,
                                                                                        5
                                                                                    )
                                                                                }
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {/* EVENT ACTIONS */}
                                                                <div
                                                                    className="calendar-event-actions"
                                                                >
                                                                    {!event.isContest ? (
                                                                        <>
                                                                            {/* EDIT */}
                                                                            <button
                                                                                type="button"
                                                                                className="calendar-event-edit"
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    e.stopPropagation();
                                                                                    handleEditEvent(
                                                                                        event
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Edit
                                                                            </button>

                                                                            {/* DELETE */}
                                                                            <button
                                                                                type="button"
                                                                                className="calendar-event-delete"
                                                                                onClick={(
                                                                                    e
                                                                                ) => {
                                                                                    e.stopPropagation();
                                                                                    handleDeleteEvent(
                                                                                        event
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </>
                                                                    ) : event.contest_url ? (
                                                                        <a
                                                                            href={
                                                                                event.contest_url
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="calendar-contest-link"
                                                                            onClick={(
                                                                                e
                                                                            ) =>
                                                                                e.stopPropagation()
                                                                            }
                                                                        >
                                                                            Open ↗
                                                                        </a>
                                                                    ) : null}
                                                                </div>

                                                            </div>

                                                        )
                                                    )}


                                                </div>


                                            </>

                                        )}


                                    </div>

                                );

                            }
                        )}


                    </div>


                </div>


            </div>


        </DashboardLayout>

    );

}


export default Calendar;