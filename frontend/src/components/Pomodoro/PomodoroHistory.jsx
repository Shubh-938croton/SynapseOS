import { useEffect, useState } from "react";

import {
    getAllPomodoroSessions,
    deletePomodoroSession
} from "../../services/pomodoroService";

import "./PomodoroHistory.css";


function PomodoroHistory({ refreshTrigger }) {

    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);


    // =======================================
    // Fetch Pomodoro History
    // =======================================

    const fetchSessions = async () => {

        try {

            setLoading(true);

            const data = await getAllPomodoroSessions();

            setSessions(data || []);

        } catch (error) {

            console.error(
                "Failed to fetch Pomodoro sessions:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =======================================
    // Initial Load & Refresh on Trigger
    // =======================================

    useEffect(() => {

        fetchSessions();

    }, [refreshTrigger]);


    // =======================================
    // Delete Session
    // =======================================

    const handleDelete = async (sessionId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this Pomodoro session?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deletePomodoroSession(sessionId);

            await fetchSessions();

        } catch (error) {

            console.error(
                "Delete Pomodoro session error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete Pomodoro session."
            );

        }

    };


    // =======================================
    // Safe Date Parsing Helper
    // =======================================

    const parseDateSafe = (date) => {

        if (!date) return null;

        let parsed = new Date(date);

        if (Number.isNaN(parsed.getTime()) && typeof date === "string") {
            parsed = new Date(date.replace(" ", "T"));
        }

        return Number.isNaN(parsed.getTime()) ? null : parsed;

    };


    // =======================================
    // Format Date
    // =======================================

    const formatDate = (date) => {

        const parsedDate = parseDateSafe(date);

        if (!parsedDate) {
            return "--";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =======================================
    // Format Time
    // =======================================

    const formatTime = (date) => {

        const parsedDate = parseDateSafe(date);

        if (!parsedDate) {
            return "--";
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    };


    // =======================================
    // Format Duration
    // =======================================

    const formatDuration = (minutes) => {

        const value = Number(minutes) || 0;

        const hours = Math.floor(value / 60);

        const remainingMinutes = value % 60;

        if (hours > 0) {

            return `${hours}h ${remainingMinutes}m`;

        }

        return `${remainingMinutes}m`;

    };


    // =======================================
    // Status Class
    // =======================================

    const getStatusClass = (status) => {

        if (!status) {
            return "status-default";
        }

        return `status-${String(status)
            .toLowerCase()
            .replace(/\s+/g, "-")}`;

    };


    // =======================================
    // Render
    // =======================================

    return (

        <div className="pomodoro-history">

            <div className="pomodoro-history-header">

                <div>

                    <span className="pomodoro-history-label">
                        PRODUCTIVITY
                    </span>

                    <h2>
                        Pomodoro History
                    </h2>

                    <p>
                        Review your previous focus sessions.
                    </p>

                </div>

            </div>


            {/* Loading */}

            {loading && (

                <div className="pomodoro-history-loading">

                    Loading Pomodoro sessions...

                </div>

            )}


            {/* Empty State */}

            {!loading && sessions.length === 0 && (

                <div className="pomodoro-history-empty">

                    <h3>
                        No Pomodoro sessions yet
                    </h3>

                    <p>
                        Complete your first focus session
                        and it will appear here.
                    </p>

                </div>

            )}


            {/* History */}

            {!loading && sessions.length > 0 && (

                <div className="pomodoro-history-list">

                    {sessions.map((session) => (

                        <div
                            key={session.session_id}
                            className="pomodoro-history-card"
                        >

                            {/* Top */}

                            <div className="pomodoro-history-card-top">

                                <div>

                                    <h3>
                                        {session.subject_name ||
                                            "Focus Session"}
                                    </h3>

                                    {session.task_title && (

                                        <p className="pomodoro-task">
                                            Task: {session.task_title}
                                        </p>

                                    )}

                                </div>


                                <span
                                    className={`pomodoro-status ${getStatusClass(
                                        session.session_status
                                    )}`}
                                >
                                    {session.session_status}
                                </span>

                            </div>


                            {/* Details */}

                            <div className="pomodoro-history-details">

                                <div>

                                    <span>
                                        Date
                                    </span>

                                    <strong>
                                        {formatDate(
                                            session.started_at
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Time
                                    </span>

                                    <strong>

                                        {formatTime(
                                            session.started_at
                                        )}

                                        {" - "}

                                        {formatTime(
                                            session.ended_at
                                        )}

                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Focus
                                    </span>

                                    <strong>
                                        {formatDuration(
                                            session.duration_minutes
                                        )}
                                    </strong>

                                </div>


                                <div>

                                    <span>
                                        Break
                                    </span>

                                    <strong>
                                        {session.break_minutes || 0}m
                                    </strong>

                                </div>

                            </div>


                            {/* Delete */}

                            <div className="pomodoro-history-actions">

                                <button
                                    type="button"
                                    className="pomodoro-delete-btn"
                                    onClick={() =>
                                        handleDelete(
                                            session.session_id
                                        )
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}


export default PomodoroHistory;
