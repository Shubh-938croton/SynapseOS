import { useEffect, useState } from "react";
import {
    FiClock,
    FiCheckCircle,
    FiFileText,
    FiTarget,
    FiActivity,
    FiAward,
    FiCalendar
} from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getAnalytics } from "../../services/analyticsService";
import "./Stats.css";

function Stats() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // =======================================
    // FETCH ANALYTICS
    // =======================================

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await getAnalytics();

                console.log("Analytics API Response:", response);

                setAnalytics(response);
            } catch (err) {
                console.error("Analytics Error:", err);

                setError(
                    err.message || "Failed to load analytics"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    // =======================================
    // LOADING
    // =======================================

    if (loading) {
        return (
            <DashboardLayout>
                <div className="stats-state">
                    <div className="stats-spinner"></div>
                    <p>Loading analytics...</p>
                </div>
            </DashboardLayout>
        );
    }

    // =======================================
    // ERROR
    // =======================================

    if (error) {
        return (
            <DashboardLayout>
                <div className="stats-state stats-error-state">
                    <div className="stats-error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load analytics
                    </h2>

                    <p>{error}</p>
                </div>
            </DashboardLayout>
        );
    }

    // =======================================
    // BACKEND DATA
    // =======================================

    const overview = analytics?.overview || {};

    const studyDailyTrend =
        analytics?.study?.dailyTrend || [];

    const studyBySubject =
        analytics?.study?.bySubject || [];

    const taskCompletionTrend =
        analytics?.tasks?.completionTrend || [];

    const pomodoroDailyTrend =
        analytics?.pomodoro?.dailyTrend || [];

    const notesBySubject =
        analytics?.notes?.bySubject || [];

    const contestsByPlatform =
        analytics?.contests?.byPlatform || [];

    // =======================================
    // OVERVIEW VALUES
    // =======================================

    const totalStudyMinutes =
        Number(overview.totalStudyMinutes) || 0;

    const tasksCompleted =
        Number(overview.completedTasks) || 0;

    const totalTasks =
        Number(overview.totalTasks) || 0;

    const pendingTasks =
        Number(overview.pendingTasks) || 0;

    const notesCreated =
        Number(overview.totalNotes) || 0;

    const pomodoroSessions =
        Number(overview.totalPomodoroSessions) || 0;

    const goalProgress =
        Number(overview.averageProgress) || 0;

    // =======================================
    // STUDY TIME
    // =======================================

    const studyHours =
        Math.floor(totalStudyMinutes / 60);

    const remainingMinutes =
        totalStudyMinutes % 60;

    // =======================================
    // TOTAL SUBJECT STUDY TIME
    // =======================================

    const totalSubjectMinutes =
        studyBySubject.reduce(
            (total, item) =>
                total +
                (Number(item.study_minutes) || 0),
            0
        );

    // =======================================
    // TASK PROGRESS
    // =======================================

    const taskProgress =
        totalTasks > 0
            ? Math.min(
                (tasksCompleted / totalTasks) * 100,
                100
            )
            : 0;

    // =======================================
    // GOAL PROGRESS
    // =======================================

    const safeGoalProgress =
        Math.min(
            Math.max(goalProgress, 0),
            100
        );

    // =======================================
    // HELPER FUNCTIONS
    // =======================================

    const formatDate = (date) => {
        if (!date) return "";

        const parsedDate = new Date(date);

        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short"
            }
        );
    };

    const formatMinutes = (minutes) => {
        const value =
            Number(minutes) || 0;

        if (value < 60) {
            return `${value} min`;
        }

        const hours =
            Math.floor(value / 60);

        const mins =
            value % 60;

        return mins > 0
            ? `${hours}h ${mins}m`
            : `${hours}h`;
    };

    // =======================================
    // MAXIMUM VALUES FOR OTHER CHARTS
    // =======================================

    const maxCompletedTasks =
        Math.max(
            ...taskCompletionTrend.map(
                item =>
                    Number(
                        item.completed_count
                    ) || 0
            ),
            1
        );

    const maxPomodoroSessions =
        Math.max(
            ...pomodoroDailyTrend.map(
                item =>
                    Number(
                        item.session_count
                    ) || 0
            ),
            1
        );

    const maxNotes =
        Math.max(
            ...notesBySubject.map(
                item =>
                    Number(
                        item.note_count
                    ) || 0
            ),
            1
        );

    const maxContests =
        Math.max(
            ...contestsByPlatform.map(
                item =>
                    Number(
                        item.contest_count
                    ) || 0
            ),
            1
        );

    // =======================================
    // PAGE
    // =======================================

    return (
        <DashboardLayout>

            <div className="stats-page">

                {/* =================================
                    HEADER
                ================================= */}

                <div className="stats-header">

                    <div>

                        <span className="stats-eyebrow">
                            PRODUCTIVITY
                        </span>

                        <h1>
                            Analytics
                        </h1>

                        <p>
                            Track your study activity,
                            tasks and overall progress.
                        </p>

                    </div>

                </div>


                {/* =================================
                    OVERVIEW
                ================================= */}

                <section className="stats-section">

                    <h2 className="stats-section-title">
                        Overview
                    </h2>

                    <div className="stats-cards">

                        {/* STUDY TIME */}
                        <div className="stats-card">
                            <div className="stats-card-icon study-icon">
                                <FiClock />
                            </div>
                            <div className="stats-card-content">
                                <span>Study Time</span>
                                <strong>
                                    {studyHours}h {remainingMinutes}m
                                </strong>
                            </div>
                        </div>

                        {/* TASKS */}
                        <div className="stats-card">
                            <div className="stats-card-icon task-icon">
                                <FiCheckCircle />
                            </div>
                            <div className="stats-card-content">
                                <span>Tasks Completed</span>
                                <strong>
                                    {tasksCompleted}
                                </strong>
                            </div>
                        </div>

                        {/* NOTES */}
                        <div className="stats-card">
                            <div className="stats-card-icon note-icon">
                                <FiFileText />
                            </div>
                            <div className="stats-card-content">
                                <span>Notes Created</span>
                                <strong>
                                    {notesCreated}
                                </strong>
                            </div>
                        </div>

                        {/* POMODORO */}
                        <div className="stats-card">
                            <div className="stats-card-icon pomodoro-icon">
                                <FiTarget />
                            </div>
                            <div className="stats-card-content">
                                <span>Pomodoro Focus</span>
                                <strong>
                                    {pomodoroSessions}
                                </strong>
                            </div>
                        </div>

                    </div>

                </section>


                {/* =================================
                    PROGRESS
                ================================= */}

                <section className="stats-section">

                    <h2 className="stats-section-title">
                        Progress
                    </h2>

                    <div className="stats-progress-grid">

                        {/* GOAL PROGRESS */}

                        <div className="stats-panel">

                            <div className="stats-panel-header">

                                <div>

                                    <h3>
                                        Goal Progress
                                    </h3>

                                    <p>
                                        Overall progress toward your goals
                                    </p>

                                </div>

                                <strong className="progress-value">
                                    {safeGoalProgress}%
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width:
                                            `${safeGoalProgress}%`
                                    }}
                                />

                            </div>

                        </div>


                        {/* TASK PROGRESS */}

                        <div className="stats-panel">

                            <div className="stats-panel-header">

                                <div>

                                    <h3>
                                        Task Progress
                                    </h3>

                                    <p>
                                        Completed vs total tasks
                                    </p>

                                </div>

                                <strong className="progress-value">
                                    {Math.round(
                                        taskProgress
                                    )}%
                                </strong>

                            </div>

                            <div className="progress-track">

                                <div
                                    className="progress-fill"
                                    style={{
                                        width:
                                            `${taskProgress}%`
                                    }}
                                />

                            </div>

                            <div className="task-summary">

                                <span>
                                    Completed:{" "}
                                    <strong>
                                        {tasksCompleted}
                                    </strong>
                                </span>

                                <span>
                                    Pending:{" "}
                                    <strong>
                                        {pendingTasks}
                                    </strong>
                                </span>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================
                    ACTIVITY
                ================================= */}

                <section className="stats-section">

                    <h2 className="stats-section-title">
                        Activity
                    </h2>

                    <div className="analytics-grid">


                        {/* =================================
                            DAILY STUDY TIME
                        ================================= */}

                        <div className="analytics-panel">

                            <div className="analytics-panel-header">

                                <div>

                                    <h3>
                                        Daily Study Time
                                    </h3>

                                    <p>
                                        Study time recorded each day
                                    </p>

                                </div>

                                <span className="analytics-unit">
                                    Hours
                                </span>

                            </div>


                            {studyDailyTrend.length === 0 ? (

                                <div className="chart-empty">
                                    No study data available yet.
                                </div>

                            ) : (

                                <div className="study-chart-container">

                                    {/* 24 HOUR SCALE */}

                                    <div className="study-chart-scale">

                                        <span>24h</span>
                                        <span>18h</span>
                                        <span>12h</span>
                                        <span>6h</span>
                                        <span>0h</span>

                                    </div>


                                    {/* CHART */}

                                    <div className="study-chart">

                                        {studyDailyTrend.map(
                                            (item, index) => {

                                                const minutes =
                                                    Number(
                                                        item.study_minutes
                                                    ) || 0;

                                                /*
                                                 * 1440 minutes = 24 hours
                                                 */

                                                const height =
                                                    Math.min(
                                                        (
                                                            minutes /
                                                            1440
                                                        ) * 100,
                                                        100
                                                    );

                                                return (

                                                    <div
                                                        className="study-chart-column"
                                                        key={
                                                            `${item.study_date}-${index}`
                                                        }
                                                    >

                                                        <div className="chart-value">

                                                            {formatMinutes(
                                                                minutes
                                                            )}

                                                        </div>


                                                        <div className="study-bar-wrapper">

                                                            <div
                                                                className="study-bar"
                                                                style={{
                                                                    height:
                                                                        `${Math.max(
                                                                            height,
                                                                            minutes > 0
                                                                                ? 3
                                                                                : 0
                                                                        )}%`
                                                                }}
                                                            />

                                                        </div>


                                                        <span className="chart-label">

                                                            {formatDate(
                                                                item.study_date
                                                            )}

                                                        </span>

                                                    </div>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================
                            STUDY TIME BY SUBJECT
                        ================================= */}

                        <div className="analytics-panel">

                            <div className="analytics-panel-header">

                                <div>

                                    <h3>
                                        Study Time by Subject
                                    </h3>

                                    <p>
                                        How your total study time is distributed
                                    </p>

                                </div>

                                <span className="analytics-unit">
                                    {formatMinutes(
                                        totalSubjectMinutes
                                    )}
                                </span>

                            </div>


                            {studyBySubject.length === 0 ? (

                                <div className="chart-empty">
                                    No subject study data available.
                                </div>

                            ) : (

                                <div className="subject-study-chart">

                                    {studyBySubject.map(
                                        (item, index) => {

                                            const minutes =
                                                Number(
                                                    item.study_minutes
                                                ) || 0;

                                            const percentage =
                                                totalSubjectMinutes > 0
                                                    ? (
                                                        minutes /
                                                        totalSubjectMinutes
                                                    ) * 100
                                                    : 0;

                                            return (

                                                <div
                                                    className="subject-study-row"
                                                    key={
                                                        `${item.subject_name}-${index}`
                                                    }
                                                >

                                                    <div className="subject-study-info">

                                                        <span className="subject-study-name">

                                                            {item.subject_name ||
                                                                "Unknown"}

                                                        </span>

                                                        <div className="subject-study-values">

                                                            <strong>
                                                                {formatMinutes(
                                                                    minutes
                                                                )}
                                                            </strong>

                                                            <span>
                                                                {percentage.toFixed(
                                                                    1
                                                                )}%
                                                            </span>

                                                        </div>

                                                    </div>


                                                    <div className="subject-study-track">

                                                        <div
                                                            className="subject-study-fill"
                                                            style={{
                                                                width:
                                                                    `${Math.max(
                                                                        percentage,
                                                                        minutes > 0
                                                                            ? 2
                                                                            : 0
                                                                    )}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* =================================
                            TASK COMPLETION
                        ================================= */}

                        <div className="analytics-panel">

                            <div className="analytics-panel-header">

                                <div>

                                    <h3>
                                        Task Completion
                                    </h3>

                                    <p>
                                        Tasks completed over time
                                    </p>

                                </div>

                            </div>


                            {taskCompletionTrend.length === 0 ? (

                                <div className="chart-empty">
                                    No completed tasks recorded yet.
                                </div>

                            ) : (

                                <div className="mini-chart">

                                    {taskCompletionTrend.map(
                                        (item, index) => {

                                            const count =
                                                Number(
                                                    item.completed_count
                                                ) || 0;

                                            const height =
                                                (
                                                    count /
                                                    maxCompletedTasks
                                                ) * 100;

                                            return (

                                                <div
                                                    className="mini-chart-column"
                                                    key={
                                                        `${item.completion_date}-${index}`
                                                    }
                                                >

                                                    <span>
                                                        {count}
                                                    </span>

                                                    <div className="mini-bar-track">

                                                        <div
                                                            className="mini-bar"
                                                            style={{
                                                                height:
                                                                    `${Math.max(
                                                                        height,
                                                                        4
                                                                    )}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <small>
                                                        {formatDate(
                                                            item.completion_date
                                                        )}
                                                    </small>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* =================================
                            POMODORO
                        ================================= */}

                        <div className="analytics-panel">

                            <div className="analytics-panel-header">

                                <div>

                                    <h3>
                                        Pomodoro Activity
                                    </h3>

                                    <p>
                                        Daily completed Pomodoro sessions
                                    </p>

                                </div>

                            </div>


                            {pomodoroDailyTrend.length === 0 ? (

                                <div className="chart-empty">
                                    No Pomodoro data available yet.
                                </div>

                            ) : (

                                <div className="mini-chart">

                                    {pomodoroDailyTrend.map(
                                        (item, index) => {

                                            const sessions =
                                                Number(
                                                    item.session_count
                                                ) || 0;

                                            const height =
                                                (
                                                    sessions /
                                                    maxPomodoroSessions
                                                ) * 100;

                                            return (

                                                <div
                                                    className="mini-chart-column"
                                                    key={
                                                        `${item.session_date}-${index}`
                                                    }
                                                >

                                                    <span>
                                                        {sessions}
                                                    </span>

                                                    <div className="mini-bar-track">

                                                        <div
                                                            className="pomodoro-bar"
                                                            style={{
                                                                height:
                                                                    `${Math.max(
                                                                        height,
                                                                        4
                                                                    )}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <small>
                                                        {formatDate(
                                                            item.session_date
                                                        )}
                                                    </small>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* =================================
                            NOTES BY SUBJECT
                        ================================= */}

                        <div className="analytics-panel">

                            <div className="analytics-panel-header">

                                <div>

                                    <h3>
                                        Notes by Subject
                                    </h3>

                                    <p>
                                        Notes created for each subject
                                    </p>

                                </div>

                            </div>


                            {notesBySubject.length === 0 ? (

                                <div className="chart-empty">
                                    No notes available yet.
                                </div>

                            ) : (

                                <div className="horizontal-chart">

                                    {notesBySubject.map(
                                        (item, index) => {

                                            const count =
                                                Number(
                                                    item.note_count
                                                ) || 0;

                                            const width =
                                                (
                                                    count /
                                                    maxNotes
                                                ) * 100;

                                            return (

                                                <div
                                                    className="horizontal-chart-row"
                                                    key={
                                                        `${item.subject_name}-${index}`
                                                    }
                                                >

                                                    <div className="horizontal-chart-info">

                                                        <span>
                                                            {item.subject_name ||
                                                                "Unknown"}
                                                        </span>

                                                        <strong>
                                                            {count}
                                                        </strong>

                                                    </div>

                                                    <div className="horizontal-track">

                                                        <div
                                                            className="notes-fill"
                                                            style={{
                                                                width:
                                                                    `${Math.max(
                                                                        width,
                                                                        3
                                                                    )}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>


                        {/* =================================
                            CONTESTS
                        ================================= */}

                        <div className="analytics-panel">

                            <div className="analytics-panel-header">

                                <div>

                                    <h3>
                                        Contest Participation
                                    </h3>

                                    <p>
                                        Contests by coding platform
                                    </p>

                                </div>

                            </div>


                            {contestsByPlatform.length === 0 ? (

                                <div className="chart-empty">
                                    No contest data available yet.
                                </div>

                            ) : (

                                <div className="horizontal-chart">

                                    {contestsByPlatform.map(
                                        (item, index) => {

                                            const count =
                                                Number(
                                                    item.contest_count
                                                ) || 0;

                                            const width =
                                                (
                                                    count /
                                                    maxContests
                                                ) * 100;

                                            return (

                                                <div
                                                    className="horizontal-chart-row"
                                                    key={
                                                        `${item.platform}-${index}`
                                                    }
                                                >

                                                    <div className="horizontal-chart-info">

                                                        <span>
                                                            {item.platform ||
                                                                "Other"}
                                                        </span>

                                                        <strong>
                                                            {count}
                                                        </strong>

                                                    </div>

                                                    <div className="horizontal-track">

                                                        <div
                                                            className="contest-fill"
                                                            style={{
                                                                width:
                                                                    `${Math.max(
                                                                        width,
                                                                        3
                                                                    )}%`
                                                            }}
                                                        />

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}

export default Stats;