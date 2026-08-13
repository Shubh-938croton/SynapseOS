import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import AddStudySessionModal
    from "../../components/AddStudySessionModal/AddStudySessionModal";

import EditStudySessionModal
    from "../../components/EditStudySessionModal/EditStudySessionModal";

import {
    getAllStudySessions,
    deleteStudySession
} from "../../services/studySessionService";

import "./StudySessions.css";


function StudySessions() {

    // =========================
    // STATE
    // =========================

    const [sessions, setSessions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] =
        useState(false);

    const [sessionToEdit, setSessionToEdit] =
        useState(null);


    // =========================
    // FETCH SESSIONS
    // =========================

    const fetchSessions = async () => {

        try {

            setLoading(true);

            const data =
                await getAllStudySessions();

            setSessions(data || []);

        } catch (error) {

            console.error(
                "Failed to fetch study sessions:",
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

        fetchSessions();

    }, []);


    // =========================
    // DELETE SESSION
    // =========================

    const handleDelete = async (sessionId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this study session?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteStudySession(sessionId);

            await fetchSessions();

        } catch (error) {

            console.error(
                "Delete study session error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete study session."
            );

        }

    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "No date";
        }

        const parsedDate =
            new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return "No date";
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


    // =========================
    // FORMAT TIME
    // =========================

    const formatTime = (time) => {

        if (!time) {
            return "--";
        }

        const value =
            String(time).substring(0, 5);

        const [hours, minutes] =
            value.split(":");

        const date =
            new Date();

        date.setHours(
            Number(hours),
            Number(minutes)
        );

        return date.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    };


    // =========================
    // FORMAT DURATION
    // =========================

    const formatDuration = (minutes) => {

        const value =
            Number(minutes) || 0;

        const hours =
            Math.floor(value / 60);

        const remainingMinutes =
            value % 60;

        if (hours > 0) {

            return `${hours}h ${remainingMinutes}m`;

        }

        return `${remainingMinutes}m`;

    };


    // =========================
    // RENDER
    // =========================

    return (

        <DashboardLayout>


            {/* =========================
                ADD MODAL
            ========================= */}

            <AddStudySessionModal

                isOpen={
                    showAddModal
                }

                onClose={() =>
                    setShowAddModal(false)
                }

                onSessionCreated={
                    fetchSessions
                }

            />


            {/* =========================
                EDIT MODAL
            ========================= */}

            <EditStudySessionModal

                session={
                    sessionToEdit
                }

                onClose={() =>
                    setSessionToEdit(null)
                }

                onUpdated={
                    fetchSessions
                }

            />


            {/* =========================
                PAGE
            ========================= */}

            <div className="study-sessions-page">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="study-sessions-header">

                    <div>

                        <h1>
                            Study Sessions
                        </h1>

                        <p>
                            Track your study time
                            and stay consistent.
                        </p>

                    </div>


                    <button

                        type="button"

                        className="add-study-session-btn"

                        onClick={() =>
                            setShowAddModal(true)
                        }

                    >

                        + Add Study Session

                    </button>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="study-sessions-loading">

                        Loading study sessions...

                    </div>

                )}


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {!loading &&
                    sessions.length === 0 && (

                        <div className="study-sessions-empty">

                            <h2>
                                No study sessions yet
                            </h2>

                            <p>
                                Start your first study
                                session and track your
                                learning progress.
                            </p>

                        </div>

                    )}


                {/* =========================
                    SESSION GRID
                ========================= */}

                {!loading &&
                    sessions.length > 0 && (

                        <div className="study-sessions-grid">

                            {sessions.map((session) => (

                                <div
                                    key={
                                        session.session_id
                                    }
                                    className="study-session-card"
                                >


                                    {/* =========================
                                        CARD HEADER
                                    ========================= */}

                                    <div className="study-session-card-header">

                                        <div>

                                            <h2>

                                                {session.title ||
                                                    "Study Session"}

                                            </h2>

                                            {session.subject_name && (

                                                <span className="study-session-subject">

                                                    {session.subject_name}

                                                </span>

                                            )}

                                        </div>

                                    </div>


                                    {/* =========================
                                        DESCRIPTION
                                    ========================= */}

                                    {session.description && (

                                        <p className="study-session-description">

                                            {session.description}

                                        </p>

                                    )}


                                    {/* =========================
                                        DATE
                                    ========================= */}

                                    <div className="study-session-info">

                                        <div>

                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    session.start_time
                                                )}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Time
                                            </span>

                                            <strong>

                                                {formatTime(
                                                    session.start_time
                                                )}

                                                {" - "}

                                                {formatTime(
                                                    session.end_time
                                                )}

                                            </strong>

                                        </div>

                                    </div>


                                    {/* =========================
                                        DURATION
                                    ========================= */}

                                    <div className="study-session-duration">

                                        <span>
                                            Duration
                                        </span>

                                        <strong>

                                            {formatDuration(
                                                session.duration_minutes
                                            )}

                                        </strong>

                                    </div>


                                    {/* =========================
                                        ACTIONS
                                    ========================= */}

                                    <div className="study-session-actions">

                                        <button

                                            type="button"

                                            className="edit-study-session-btn"

                                            onClick={() =>
                                                setSessionToEdit(
                                                    session
                                                )
                                            }

                                        >

                                            Edit

                                        </button>


                                        <button

                                            type="button"

                                            className="delete-study-session-btn"

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

        </DashboardLayout>

    );

}


export default StudySessions;