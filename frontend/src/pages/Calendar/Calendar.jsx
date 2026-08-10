import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import {
    getAllEvents
} from "../../services/calendarService";

import "./Calendar.css";


function Calendar() {

    const today = new Date();


    // =========================
    // STATE
    // =========================

    const [currentDate, setCurrentDate] = useState(
        new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        )
    );


    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);


    // =========================
    // MONTH / YEAR
    // =========================

    const month = currentDate.getMonth();

    const year = currentDate.getFullYear();


    const monthName = currentDate.toLocaleDateString(
        "en-IN",
        {
            month: "long"
        }
    );


    // =========================
    // FETCH EVENTS
    // =========================

    const fetchEvents = async () => {

        try {

            setLoading(true);

            const data = await getAllEvents();

            setEvents(data || []);

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
    // DAYS IN MONTH
    // =========================

    const firstDayOfMonth = new Date(
        year,
        month,
        1
    ).getDay();


    const daysInMonth = new Date(
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
    // GET EVENTS FOR DATE
    // =========================

    const getEventsForDay = (day) => {

        if (!day) {
            return [];
        }


        const dateString = `${year}-${String(
            month + 1
        ).padStart(2, "0")}-${String(day).padStart(
            2,
            "0"
        )}`;


        return events.filter(
            (event) =>
                event.event_date?.split("T")[0] ===
                dateString
        );

    };


    // =========================
    // FORMAT TIME
    // =========================

    const formatTime = (time) => {

        if (!time) {
            return "";
        }


        const [hours, minutes] = time
            .split(":")
            .map(Number);


        const date = new Date();

        date.setHours(hours);
        date.setMinutes(minutes);


        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit"
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
                            Plan your tasks, events and important activities.
                        </p>

                    </div>


                    <button
                        className="add-event-btn"
                        onClick={() => {
                            console.log(
                                "Add event clicked"
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


                        <div className="calendar-navigation">

                            <button
                                onClick={
                                    handlePreviousMonth
                                }
                            >
                                ‹
                            </button>


                            <button
                                onClick={
                                    handleNextMonth
                                }
                            >
                                ›
                            </button>

                        </div>


                        <h2>

                            {monthName} {year}

                        </h2>


                        <button
                            className="today-btn"
                            onClick={handleToday}
                        >
                            Today
                        </button>

                    </div>



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
                                        className={`calendar-day ${
                                            day &&
                                            isToday(day)
                                                ? "today"
                                                : ""
                                        }`}
                                    >


                                        {day && (

                                            <>

                                                <span className="day-number">

                                                    {day}

                                                </span>



                                                {/* EVENTS */}

                                                <div className="day-events">


                                                    {dayEvents.map(
                                                        (
                                                            event
                                                        ) => (

                                                            <div
                                                                key={
                                                                    event.event_id
                                                                }
                                                                className="calendar-event"
                                                                title={
                                                                    event.description ||
                                                                    event.title
                                                                }
                                                            >

                                                                <strong>
                                                                    {
                                                                        event.title
                                                                    }
                                                                </strong>


                                                                {event.start_time && (

                                                                    <span>

                                                                        {formatTime(
                                                                            event.start_time
                                                                        )}

                                                                    </span>

                                                                )}

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



                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="calendar-loading">

                        Loading events...

                    </div>

                )}


            </div>

        </DashboardLayout>

    );

}


export default Calendar;