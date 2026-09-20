import { useEffect, useState, useMemo } from "react";
import {
    FiClock,
    FiPlus,
    FiBookOpen,
    FiCalendar,
    FiEdit2,
    FiTrash2,
    FiSearch
} from "react-icons/fi";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import AddStudySessionModal from "../../components/AddStudySessionModal/AddStudySessionModal";
import EditStudySessionModal from "../../components/EditStudySessionModal/EditStudySessionModal";
import {
    getAllStudySessions,
    deleteStudySession
} from "../../services/studySessionService";
import "./StudySessions.css";


function StudySessions() {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [sessionToEdit, setSessionToEdit] = useState(null);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await getAllStudySessions();
            setSessions(data || []);
        } catch (error) {
            console.error("Failed to fetch study sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const filteredSessions = useMemo(() => {
        if (!searchTerm.trim()) return sessions;
        const q = searchTerm.toLowerCase();
        return sessions.filter(
            (s) =>
                (s.topic && s.topic.toLowerCase().includes(q)) ||
                (s.subject_name && s.subject_name.toLowerCase().includes(q)) ||
                (s.session_notes && s.session_notes.toLowerCase().includes(q))
        );
    }, [sessions, searchTerm]);

    const totalMinutes = useMemo(() => {
        return sessions.reduce((acc, s) => acc + (Number(s.duration_minutes) || 0), 0);
    }, [sessions]);

    const totalHoursFormatted = useMemo(() => {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        if (h > 0) return `${h}h ${m}m`;
        return `${m}m`;
    }, [totalMinutes]);

    const handleDelete = async (sessionId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this study session?"
        );
        if (!confirmed) return;

        try {
            await deleteStudySession(sessionId);
            await fetchSessions();
        } catch (error) {
            console.error("Delete study session error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to delete study session."
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "--";
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) return "--";
        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (time) => {
        if (!time) return "--";
        const parsedDate = new Date(time);
        if (Number.isNaN(parsedDate.getTime())) return "--";
        return parsedDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const formatDuration = (minutes) => {
        const value = Number(minutes) || 0;
        const hours = Math.floor(value / 60);
        const remainingMinutes = value % 60;
        if (hours > 0) return `${hours}h ${remainingMinutes}m`;
        return `${remainingMinutes}m`;
    };

    return (
        <DashboardLayout>
            <div className="study-sessions-page">
                {/* HEADER */}
                <div className="study-sessions-header">
                    <div>
                        <span className="study-sessions-label">FOCUS TRACKING</span>
                        <h1>Study Sessions</h1>
                        <p>
                            Log deliberate study blocks, monitor dedicated subjects, and build consistent habits.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-study-session-btn"
                        onClick={() => setShowAddModal(true)}
                    >
                        <FiPlus />
                        <span>Log Session</span>
                    </button>
                </div>

                {/* TOOLBAR */}
                <div className="study-sessions-toolbar">
                    <div className="study-sessions-search-box">
                        <FiSearch />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by topic, subject, or notes..."
                        />
                    </div>

                    <div className="study-sessions-stats-bar">
                        <div className="study-stat-item">
                            <span className="stat-label">Total Sessions</span>
                            <span className="stat-val">{sessions.length}</span>
                        </div>
                        <div className="study-stat-divider" />
                        <div className="study-stat-item">
                            <span className="stat-label">Total Time</span>
                            <span className="stat-val">{totalHoursFormatted}</span>
                        </div>
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="study-sessions-loading">
                        <div className="study-spinner" />
                        <p>Loading study sessions...</p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && sessions.length === 0 && (
                    <div className="study-sessions-empty">
                        <div className="study-empty-icon">
                            <FiBookOpen />
                        </div>
                        <h2>No study sessions logged yet</h2>
                        <p>
                            Record your deep work blocks to track learning momentum and analyze subject coverage.
                        </p>
                        <button
                            type="button"
                            className="add-study-session-btn"
                            onClick={() => setShowAddModal(true)}
                        >
                            <FiPlus />
                            <span>Log First Session</span>
                        </button>
                    </div>
                )}

                {/* NO RESULTS FILTERED */}
                {!loading && sessions.length > 0 && filteredSessions.length === 0 && (
                    <div className="study-sessions-no-results">
                        <p>No study sessions matching &quot;{searchTerm}&quot;</p>
                        <button type="button" onClick={() => setSearchTerm("")}>
                            Clear Filter
                        </button>
                    </div>
                )}

                {/* SESSION GRID */}
                {!loading && filteredSessions.length > 0 && (
                    <div className="study-sessions-grid">
                        {filteredSessions.map((session) => (
                            <div
                                key={session.session_id}
                                className="study-session-card"
                            >
                                <div className="study-session-card-header">
                                    <div className="session-card-title-row">
                                        <h3>
                                            {session.topic || session.title || "Study Session"}
                                        </h3>
                                        <div className="session-card-actions">
                                            <button
                                                type="button"
                                                className="session-action-btn edit"
                                                onClick={() => setSessionToEdit(session)}
                                                title="Edit session"
                                            >
                                                <FiEdit2 />
                                            </button>
                                            <button
                                                type="button"
                                                className="session-action-btn delete"
                                                onClick={() => handleDelete(session.session_id)}
                                                title="Delete session"
                                            >
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </div>

                                    {session.subject_name && (
                                        <div className="study-session-subject-badge">
                                            <span className="badge-dot" />
                                            <span>{session.subject_name}</span>
                                        </div>
                                    )}
                                </div>

                                {(session.session_notes || session.description) && (
                                    <p className="study-session-description">
                                        {session.session_notes || session.description}
                                    </p>
                                )}

                                <div className="study-session-info">
                                    <div className="session-info-cell">
                                        <span className="cell-label"><FiCalendar /> Date</span>
                                        <strong className="cell-value">
                                            {formatDate(session.start_time)}
                                        </strong>
                                    </div>

                                    <div className="session-info-cell">
                                        <span className="cell-label"><FiClock /> Time</span>
                                        <strong className="cell-value">
                                            {formatTime(session.start_time)} - {formatTime(session.end_time)}
                                        </strong>
                                    </div>
                                </div>

                                <div className="study-session-footer">
                                    <span className="footer-label">Duration</span>
                                    <span className="footer-duration">
                                        {formatDuration(session.duration_minutes)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* MODALS */}
                <AddStudySessionModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSessionCreated={fetchSessions}
                />

                <EditStudySessionModal
                    isOpen={sessionToEdit !== null}
                    session={sessionToEdit}
                    onClose={() => setSessionToEdit(null)}
                    onSessionUpdated={fetchSessions}
                />
            </div>
        </DashboardLayout>
    );
}

export default StudySessions;