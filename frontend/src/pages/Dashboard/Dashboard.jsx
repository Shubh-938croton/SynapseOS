import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import SummaryCard from "../../components/Summarycard/SummaryCard";
import { getDashboardSummary } from "../../services/dashboardService";
import {
    FiBookOpen,
    FiCheckSquare,
    FiClock,
    FiActivity,
    FiPlay,
    FiPlusCircle,
    FiAward,
    FiCalendar,
    FiArrowRight
} from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
    const [summary, setSummary] = useState({
        totalSubjects: 0,
        totalTasks: 0,
        totalStudyHours: 0,
        totalPomodoroHours: 0
    });
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const displayName = user.full_name?.split(" ")[0] || user.username || "Scholar";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    useEffect(() => {
        async function fetchDashboard() {
            try {
                const response = await getDashboardSummary();
                if (response && response.summary) {
                    setSummary(response.summary);
                }
            } catch (error) {
                console.error("Dashboard Error:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboard();
    }, []);

    return (
        <DashboardLayout>
            <div className="dashboard-page">
                {/* HERO / WELCOME BANNER */}
                <section className="dashboard-hero">
                    <div className="dashboard-hero-content">
                        <div className="dashboard-eyebrow">Personal Command Center</div>
                        <h1 className="dashboard-title">
                            {getGreeting()}, {displayName}
                        </h1>
                        <p className="dashboard-subtitle">
                            Here is an overview of your active coursework, scheduled tasks, and focus time.
                        </p>
                    </div>

                    <div className="hero-quick-actions">
                        <Link to="/pomodoro" className="hero-action-btn primary">
                            <FiPlay />
                            <span>Start Focus Timer</span>
                        </Link>
                        <Link to="/tasks" className="hero-action-btn secondary">
                            <FiPlusCircle />
                            <span>Manage Tasks</span>
                        </Link>
                    </div>
                </section>

                {/* OVERVIEW METRICS */}
                <section className="dashboard-overview">
                    <div className="dashboard-section-header">
                        <div>
                            <h2 className="dashboard-section-title">Overview Metrics</h2>
                            <p className="dashboard-section-description">
                                Aggregated study statistics across your workspace
                            </p>
                        </div>
                    </div>

                    <div className="summary-grid">
                        <SummaryCard
                            title="Active Subjects"
                            value={loading ? "-" : summary.totalSubjects}
                            subtitle="Enrolled topics"
                            icon={<FiBookOpen />}
                        />
                        <SummaryCard
                            title="Pending Tasks"
                            value={loading ? "-" : summary.totalTasks}
                            subtitle="Assigned milestones"
                            icon={<FiCheckSquare />}
                        />
                        <SummaryCard
                            title="Study Hours"
                            value={loading ? "-" : `${summary.totalStudyHours}h`}
                            subtitle="Recorded sessions"
                            icon={<FiClock />}
                        />
                        <SummaryCard
                            title="Focus Hours"
                            value={loading ? "-" : `${summary.totalPomodoroHours}h`}
                            subtitle="Completed pomodoros"
                            icon={<FiActivity />}
                        />
                    </div>
                </section>

                {/* WORKSPACE NAVIGATION SHORTCUTS */}
                <section className="dashboard-shortcuts">
                    <div className="dashboard-section-header">
                        <div>
                            <h2 className="dashboard-section-title">Quick Jump</h2>
                            <p className="dashboard-section-description">
                                Direct access to your primary workspaces
                            </p>
                        </div>
                    </div>

                    <div className="shortcuts-grid">
                        <Link to="/tasks" className="shortcut-card">
                            <div className="shortcut-icon-wrapper">
                                <FiCheckSquare />
                            </div>
                            <div className="shortcut-info">
                                <h3>Task Board</h3>
                                <p>Organize, prioritize, and track your deliverables</p>
                            </div>
                            <FiArrowRight className="shortcut-arrow" />
                        </Link>

                        <Link to="/pomodoro" className="shortcut-card">
                            <div className="shortcut-icon-wrapper">
                                <FiPlay />
                            </div>
                            <div className="shortcut-info">
                                <h3>Pomodoro Focus</h3>
                                <p>Structured work intervals and custom session logs</p>
                            </div>
                            <FiArrowRight className="shortcut-arrow" />
                        </Link>

                        <Link to="/contests" className="shortcut-card">
                            <div className="shortcut-icon-wrapper">
                                <FiAward />
                            </div>
                            <div className="shortcut-info">
                                <h3>Coding Contests</h3>
                                <p>View upcoming platforms, schedules, and bookmarks</p>
                            </div>
                            <FiArrowRight className="shortcut-arrow" />
                        </Link>

                        <Link to="/calendar" className="shortcut-card">
                            <div className="shortcut-icon-wrapper">
                                <FiCalendar />
                            </div>
                            <div className="shortcut-info">
                                <h3>Academic Calendar</h3>
                                <p>Schedule exams, project deadlines, and contest sync</p>
                            </div>
                            <FiArrowRight className="shortcut-arrow" />
                        </Link>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

export default Dashboard;