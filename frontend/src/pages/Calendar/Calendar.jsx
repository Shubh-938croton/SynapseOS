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
    // EVENTS
    // =========================

    const [events, setEvents] = useState([]);

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
    // FETCH EVENTS
    // =========================

    const fetchEvents = async () => {

        try {

            setLoading(true);

            const response = await getAllEvents();

            console.log(
                "Calendar events:",
                response
            );

            setEvents(response || []);

        } catch (error) {

            console.error(
                "Error fetching calendar events:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to fetch calendar events"
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


        /*
         * Create the calendar date manually.
         *
         * Example:
         * 20 August 2026
         *
         * becomes:
         * 2026-08-20
         */

        const dateString =
            `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


        return events.filter(
            (event) => {

                if (!event.event_date) {

                    return false;

                }


                /*
                 * IMPORTANT:
                 *
                 * Do NOT use:
                 *
                 * new Date(event.event_date)
                 *
                 * because MySQL DATE values can
                 * shift by one day because of timezone
                 * conversion.
                 *
                 * We compare the YYYY-MM-DD portion
                 * directly.
                 */

                const eventDate =
                    String(event.event_date)
                        .substring(0, 10);


                return (
                    eventDate === dateString
                );

            }
        );

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
                                                                        event.status ===
                                                                        "Completed"
                                                                            ? "completed"
                                                                            : event.status ===
                                                                              "Cancelled"
                                                                            ? "cancelled"
                                                                            : ""
                                                                    }
                                                                `}

                                                            >


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
                                                                            String(
                                                                                event.start_time
                                                                            ).substring(
                                                                                0,
                                                                                5
                                                                            )
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


                                                                {/* =========================
                                                                    EVENT ACTIONS
                                                                ========================= */}

                                                                <div
                                                                    className="calendar-event-actions"
                                                                >


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