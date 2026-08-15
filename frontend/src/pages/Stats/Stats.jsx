import { useEffect, useState } from "react";
import { getAnalytics } from "../../services/analyticsService";
import "./Stats.css";

function Stats() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const data = await getAnalytics();

                console.log("Analytics API Response:", data);

                setAnalytics(data);
            } catch (err) {
                console.error("Analytics Error:", err);
                setError(err.message || "Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="stats-page">
                <div className="stats-loading">
                    <div className="stats-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="stats-page">
                <div className="stats-error">
                    <div className="stats-error-icon">!</div>

                    <h2>Unable to load analytics</h2>

                    <p>{error}</p>
                </div>
            </div>
        );
    }

    /*
     * We keep the response available here so that we can
     * connect the exact backend fields to the UI.
     *
     * For now the component safely handles missing values.
     */
    const data = analytics || {};

    const totalStudyMinutes =
        data.totalStudyMinutes ??
        data.total_study_minutes ??
        0;

    const tasksCompleted =
        data.tasksCompleted ??
        data.tasks_completed ??
        0;

    const notesCreated =
        data.notesCreated ??
        data.notes_created ??
        0;

    const pomodoroSessions =
        data.pomodoroSessions ??
        data.pomodoro_sessions ??
        0;

    const goalProgress =
        data.goalProgress ??
        data.goal_progress ??
        0;

    const totalTasks =
        data.totalTasks ??
        data.total_tasks ??
        0;

    const pendingTasks =
        data.pendingTasks ??
        data.pending_tasks ??
        0;

    const studyHours = Math.floor(totalStudyMinutes / 60);
    const remainingMinutes = totalStudyMinutes % 60;

    return (
        <div className="stats-page">

            {/* =====================================
                HEADER
            ===================================== */}

            <div className="stats-header">

                <div>
                    <span className="stats-eyebrow">
                        PRODUCTIVITY
                    </span>

                    <h1>Analytics</h1>

                    <p>
                        Track your study activity, tasks and overall progress.
                    </p>
                </div>

            </div>


            {/* =====================================
                OVERVIEW CARDS
            ===================================== */}

            <section className="stats-section">

                <div className="stats-section-heading">
                    <h2>Overview</h2>
                </div>

                <div className="stats-cards">

                    <div className="stats-card">

                        <div className="stats-card-icon study-icon">
                            ⏱
                        </div>

                        <div className="stats-card-content">

                            <span>
                                Study Time
                            </span>

                            <strong>
                                {studyHours}h {remainingMinutes}m
                            </strong>

                        </div>

                    </div>


                    <div className="stats-card">

                        <div className="stats-card-icon task-icon">
                            ✓
                        </div>

                        <div className="stats-card-content">

                            <span>
                                Tasks Completed
                            </span>

                            <strong>
                                {tasksCompleted}
                            </strong>

                        </div>

                    </div>


                    <div className="stats-card">

                        <div className="stats-card-icon note-icon">
                            📝
                        </div>

                        <div className="stats-card-content">

                            <span>
                                Notes Created
                            </span>

                            <strong>
                                {notesCreated}
                            </strong>

                        </div>

                    </div>


                    <div className="stats-card">

                        <div className="stats-card-icon pomodoro-icon">
                            🍅
                        </div>

                        <div className="stats-card-content">

                            <span>
                                Pomodoro Sessions
                            </span>

                            <strong>
                                {pomodoroSessions}
                            </strong>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                PROGRESS
            ===================================== */}

            <section className="stats-section">

                <div className="stats-section-heading">
                    <h2>Progress</h2>
                </div>

                <div className="stats-progress-grid">

                    <div className="stats-panel">

                        <div className="stats-panel-header">

                            <div>
                                <h3>Goal Progress</h3>
                                <p>
                                    Overall progress toward your goals
                                </p>
                            </div>

                            <strong className="progress-value">
                                {goalProgress}%
                            </strong>

                        </div>

                        <div className="progress-track">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${Math.min(
                                        Math.max(goalProgress, 0),
                                        100
                                    )}%`
                                }}
                            />

                        </div>

                    </div>


                    <div className="stats-panel">

                        <div className="stats-panel-header">

                            <div>
                                <h3>Task Progress</h3>
                                <p>
                                    Completed vs total tasks
                                </p>
                            </div>

                            <strong className="progress-value">
                                {totalTasks > 0
                                    ? Math.round(
                                        (tasksCompleted / totalTasks) * 100
                                    )
                                    : 0}%
                            </strong>

                        </div>

                        <div className="progress-track">

                            <div
                                className="progress-fill task-progress"
                                style={{
                                    width: `${
                                        totalTasks > 0
                                            ? Math.min(
                                                (tasksCompleted / totalTasks) * 100,
                                                100
                                            )
                                            : 0
                                    }%`
                                }}
                            />

                        </div>

                        <div className="task-summary">

                            <span>
                                Completed: <strong>{tasksCompleted}</strong>
                            </span>

                            <span>
                                Pending: <strong>{pendingTasks}</strong>
                            </span>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================
                ACTIVITY
            ===================================== */}

            <section className="stats-section">

                <div className="stats-section-heading">
                    <h2>Activity</h2>
                </div>

                <div className="stats-activity-panel">

                    <div className="activity-empty">

                        <div className="activity-icon">
                            📊
                        </div>

                        <h3>Detailed activity coming next</h3>

                        <p>
                            Your study sessions, subjects and daily activity
                            will appear here.
                        </p>

                    </div>

                </div>

            </section>


        </div>
    );
}

export default Stats;