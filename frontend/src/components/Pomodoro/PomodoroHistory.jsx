import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiTrash2, FiActivity } from "react-icons/fi";
import {
    getAllPomodoroSessions,
    deletePomodoroSession
} from "../../services/pomodoroService";
import "./PomodoroHistory.css";

function PomodoroHistory({ refreshTrigger }) {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const data = await getAllPomodoroSessions();
            setSessions(data || []);
        } catch (error) {
            console.error("Failed to fetch Pomodoro sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, [refreshTrigger]);

    const handleDelete = async (sessionId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this focus session record?"
        );
        if (!confirmed) return;

        try {
            await deletePomodoroSession(sessionId);
            await fetchSessions();
        } catch (error) {
            console.error("Delete Pomodoro session error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to delete Pomodoro session."
            );
        }
    };

    const parseDateSafe = (date) => {
        if (!date) return null;
        let parsed = new Date(date);
        if (Number.isNaN(parsed.getTime()) && typeof date === "string") {
            parsed = new Date(date.replace(" ", "T"));
        }
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const formatDate = (date) => {
        const parsedDate = parseDateSafe(date);
        if (!parsedDate) return "--";
        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (date) => {
        const parsedDate = parseDateSafe(date);
        if (!parsedDate) return "--";
        return parsedDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit"
        });
    };

    const formatDuration = (minutes) => {
        const value = Number(minutes) || 0;
        const hours = Math.floor(value / 60);
        const remainingMinutes = value % 60;
        if (hours > 0) {
            return `${hours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    };

    const getStatusClass = (status) => {
        if (!status) return "status-default";
        return `status-${String(status).toLowerCase().replace(/\s+/g, "-")}`;
    };

    return (
        <div className="pomodoro-history">
            <div className="pomodoro-history-header">
                <div>
                    <h2>Session History</h2>
                    <p>Recent recorded focus sessions and intervals</p>
                </div>
            </div>

            {loading && (
                <div className="pomodoro-history-loading">
                    Loading focus records...
                </div>
            )}

            {!loading && sessions.length === 0 && (
                <div className="pomodoro-history-empty">
                    <div className="empty-history-icon">
                        <FiActivity />
                    </div>
                    <h3>No recorded sessions yet</h3>
                    <p>
                        Completed or logged focus intervals will automatically be recorded here.
                    </p>
                </div>
            )}

            {!loading && sessions.length > 0 && (
                <div className="pomodoro-history-list">
                    {sessions.map((session) => (
                        <div
                            key={session.session_id}
                            className="pomodoro-history-card"
                        >
                            <div className="pomodoro-history-card-top">
                                <div className="session-info">
                                    <h3 className="session-title">
                                        {session.subject_name || "Focus Session"}
                                    </h3>
                                    {session.task_title && (
                                        <span className="session-task-tag">
                                            Task: {session.task_title}
                                        </span>
                                    )}
                                </div>

                                <span
                                    className={`pomodoro-status-badge ${getStatusClass(
                                        session.session_status
                                    )}`}
                                >
                                    {session.session_status || "Completed"}
                                </span>
                            </div>

                            <div className="pomodoro-history-details">
                                <div className="detail-col">
                                    <span className="detail-label">Date</span>
                                    <strong className="detail-value">
                                        {formatDate(session.started_at)}
                                    </strong>
                                </div>

                                <div className="detail-col">
                                    <span className="detail-label">Time</span>
                                    <strong className="detail-value">
                                        {formatTime(session.started_at)} - {formatTime(session.ended_at)}
                                    </strong>
                                </div>

                                <div className="detail-col">
                                    <span className="detail-label">Focus</span>
                                    <strong className="detail-value">
                                        {formatDuration(session.duration_minutes)}
                                    </strong>
                                </div>

                                <div className="detail-col">
                                    <span className="detail-label">Break</span>
                                    <strong className="detail-value">
                                        {session.break_minutes || 0}m
                                    </strong>
                                </div>
                            </div>

                            <div className="pomodoro-history-actions">
                                <button
                                    type="button"
                                    className="pomodoro-delete-btn"
                                    onClick={() => handleDelete(session.session_id)}
                                    title="Delete record"
                                >
                                    <FiTrash2 />
                                    <span>Delete</span>
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
