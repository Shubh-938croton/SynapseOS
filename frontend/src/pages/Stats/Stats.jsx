import { useEffect, useState } from "react";
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

                console.log(
                    "Analytics API Response:",
                    response
                );

                setAnalytics(response);

            } catch (err) {

                console.error(
                    "Analytics Error:",
                    err
                );

                setError(
                    err.message ||
                    "Failed to load analytics"
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

                    <p>
                        Loading analytics...
                    </p>

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

                    <p>
                        {error}
                    </p>

                </div>

            </DashboardLayout>

        );

    }


    // =======================================
    // OVERVIEW DATA
    // =======================================

    /*
        Backend response:

        {
            overview: {
                totalTasks,
                completedTasks,
                pendingTasks,
                totalStudyMinutes,
                totalPomodoroSessions,
                totalNotes,
                averageProgress,
                ...
            },

            tasks: {...},
            study: {...},
            progress: {...},
            pomodoro: {...},
            goals: {...},
            contests: {...},
            notes: {...},
            calendar: {...}
        }
    */

    const overview = analytics?.overview || {};


    // =======================================
    // VALUES
    // =======================================

    const totalStudyMinutes =
        Number(
            overview.totalStudyMinutes
        ) || 0;


    const tasksCompleted =
        Number(
            overview.completedTasks
        ) || 0;


    const totalTasks =
        Number(
            overview.totalTasks
        ) || 0;


    const pendingTasks =
        Number(
            overview.pendingTasks
        ) || 0;


    const notesCreated =
        Number(
            overview.totalNotes
        ) || 0;


    const pomodoroSessions =
        Number(
            overview.totalPomodoroSessions
        ) || 0;


    const goalProgress =
        Number(
            overview.averageProgress
        ) || 0;


    // =======================================
    // STUDY TIME
    // =======================================

    const studyHours =
        Math.floor(
            totalStudyMinutes / 60
        );


    const remainingMinutes =
        totalStudyMinutes % 60;


    // =======================================
    // TASK PROGRESS
    // =======================================

    const taskProgress =
        totalTasks > 0
            ? Math.min(
                (
                    tasksCompleted /
                    totalTasks
                ) * 100,
                100
            )
            : 0;


    // =======================================
    // SAFE GOAL PROGRESS
    // =======================================

    const safeGoalProgress =
        Math.min(
            Math.max(
                goalProgress,
                0
            ),
            100
        );


    // =======================================
    // PAGE
    // =======================================

    return (

        <DashboardLayout>

            <div className="stats-page">


                {/* =================================
                    PAGE HEADER
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


                        {/* =========================
                            STUDY TIME
                        ========================= */}

                        <div className="stats-card">

                            <div className="stats-card-icon study-icon">
                                ⏱
                            </div>


                            <div className="stats-card-content">

                                <span>
                                    Study Time
                                </span>

                                <strong>
                                    {studyHours}h{" "}
                                    {remainingMinutes}m
                                </strong>

                            </div>

                        </div>


                        {/* =========================
                            TASKS COMPLETED
                        ========================= */}

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


                        {/* =========================
                            NOTES
                        ========================= */}

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


                        {/* =========================
                            POMODORO
                        ========================= */}

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


                {/* =================================
                    PROGRESS
                ================================= */}

                <section className="stats-section">

                    <h2 className="stats-section-title">
                        Progress
                    </h2>


                    <div className="stats-progress-grid">


                        {/* =========================
                            GOAL PROGRESS
                        ========================= */}

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


                        {/* =========================
                            TASK PROGRESS
                        ========================= */}

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
                                    className="progress-fill task-progress"
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


                    <div className="stats-activity-panel">

                        <div className="activity-empty">

                            <div className="activity-icon">
                                📊
                            </div>


                            <h3>
                                Detailed activity coming next
                            </h3>


                            <p>
                                Your study sessions,
                                subjects and daily activity
                                will appear here.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>

    );

}


export default Stats;