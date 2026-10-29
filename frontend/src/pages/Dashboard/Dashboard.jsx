import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import SummaryCard from "../../components/Summarycard/SummaryCard";
import { getDashboardSummary } from "../../services/dashboardService";
import { getDailyBrief, approveActionProposal } from "../../services/aiService";
import {
    FiBookOpen,
    FiCheckSquare,
    FiClock,
    FiActivity,
    FiPlay,
    FiPlusCircle,
    FiAward,
    FiCalendar,
    FiArrowRight,
    FiCpu,
    FiZap,
    FiCheck,
    FiX,
    FiAlertCircle,
    FiRefreshCw
} from "react-icons/fi";
import "./Dashboard.css";

function Dashboard() {
    const [summary, setSummary] = useState({
        totalSubjects: 0,
        totalTasks: 0,
        totalStudyHours: 0,
        totalPomodoroHours: 0
    });
    const [dailyBrief, setDailyBrief] = useState(null);
    const [briefLoading, setBriefLoading] = useState(true);
    const [briefError, setBriefError] = useState("");
    const [actionMessage, setActionMessage] = useState("");
    const [executingProposalId, setExecutingProposalId] = useState(null);
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const displayName = user.full_name?.split(" ")[0] || user.username || "Scholar";

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    const fetchBrief = async (forceRefresh = false) => {
        setBriefLoading(true);
        setBriefError("");
        try {
            const briefData = await getDailyBrief(null, forceRefresh);
            setDailyBrief(briefData);
        } catch (err) {
            console.warn("Daily brief unavailable:", err.message);
            setBriefError(err.message || "Daily brief unavailable");
        } finally {
            setBriefLoading(false);
        }
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
        fetchBrief();
    }, []);

    const handleApproveProposal = async (proposal) => {
        setExecutingProposalId(proposal.id);
        setActionMessage("");
        try {
            await approveActionProposal(proposal);
            setActionMessage(`Action applied: ${proposal.reason || "Task updated successfully."}`);
            // Remove the approved proposal from the local brief
            setDailyBrief(prev => {
                if (!prev) return prev;
                return {
                    ...prev,
                    actionProposals: (prev.actionProposals || []).filter(p => p.id !== proposal.id)
                };
            });
            setTimeout(() => setActionMessage(""), 4000);
        } catch (err) {
            setActionMessage(`Failed to apply proposal: ${err.message}`);
            setTimeout(() => setActionMessage(""), 5000);
        } finally {
            setExecutingProposalId(null);
        }
    };

    const handleDismissProposal = (proposalId) => {
        setDailyBrief(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                actionProposals: (prev.actionProposals || []).filter(p => p.id !== proposalId)
            };
        });
    };

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
                        <Link to="/ai" className="hero-action-btn primary">
                            <FiCpu />
                            <span>AI Assistant</span>
                        </Link>
                        <Link to="/pomodoro" className="hero-action-btn secondary">
                            <FiPlay />
                            <span>Focus Timer</span>
                        </Link>
                        <Link to="/tasks" className="hero-action-btn secondary">
                            <FiPlusCircle />
                            <span>Tasks</span>
                        </Link>
                    </div>
                </section>

                {/* ACTION NOTIFICATION BANNER */}
                {actionMessage && (
                    <div className="dashboard-action-toast">
                        <FiCheck />
                        <span>{actionMessage}</span>
                    </div>
                )}

                {/* PERSONALIZED DAILY BRIEF & ACTION CENTER */}
                <section className="daily-brief-card">
                    <div className="daily-brief-header">
                        <div className="daily-brief-header-title">
                            <div className="brief-tag"><FiZap /> Personalized Intelligence</div>
                            <h2>Daily Briefing &amp; Recommendations</h2>
                        </div>
                        <button
                            type="button"
                            className="brief-refresh-btn"
                            onClick={() => fetchBrief(true)}
                            disabled={briefLoading}
                            title="Regenerate daily brief"
                        >
                            <FiRefreshCw className={briefLoading ? "spin" : ""} />
                            <span>{briefLoading ? "Refreshing..." : "Refresh"}</span>
                        </button>
                    </div>

                    {briefLoading && !dailyBrief ? (
                        <div className="brief-loading-box">
                            <div className="spinner-sm"></div>
                            <span>Synthesizing your active milestones, streak, and focus metrics...</span>
                        </div>
                    ) : dailyBrief ? (
                        <div className="daily-brief-body">
                            {/* EXECUTIVE SUMMARY */}
                            <p className="brief-summary-text">{dailyBrief.executiveSummary}</p>

                            {/* DETERMINISTIC SIGNALS */}
                            {dailyBrief.deterministicSignals && dailyBrief.deterministicSignals.length > 0 && (
                                <div className="brief-signals-row">
                                    {dailyBrief.deterministicSignals.map((sig, sIdx) => (
                                        <div key={sIdx} className={`signal-chip ${sig.severity || "medium"}`} title={sig.evidence}>
                                            <span className="signal-dot"></span>
                                            <strong>{sig.label}</strong>: <span>{sig.description}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ACTION PROPOSALS */}
                            {dailyBrief.actionProposals && dailyBrief.actionProposals.length > 0 && (
                                <div className="brief-proposals-container">
                                    <div className="proposals-heading">
                                        <FiCheckSquare /> Action Proposals (Requires Confirmation)
                                    </div>
                                    <div className="proposals-list">
                                        {dailyBrief.actionProposals.map((prop, pIdx) => (
                                            <div key={prop.id || pIdx} className="proposal-item-card">
                                                <div className="proposal-item-info">
                                                    <div className="proposal-badge">{prop.action?.replace("_", " ")}</div>
                                                    <div className="proposal-details">
                                                        <h4>{prop.reason}</h4>
                                                        <div className="proposal-values">
                                                            {prop.currentValue && <span>From: <strong>{prop.currentValue}</strong></span>}
                                                            {prop.proposedValue && <span>To: <strong className="proposed-val">{typeof prop.proposedValue === "object" ? prop.proposedValue.title : prop.proposedValue}</strong></span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="proposal-item-actions">
                                                    <button
                                                        type="button"
                                                        className="proposal-btn approve"
                                                        onClick={() => handleApproveProposal(prop)}
                                                        disabled={executingProposalId === prop.id}
                                                    >
                                                        <FiCheck /> Approve
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="proposal-btn dismiss"
                                                        onClick={() => handleDismissProposal(prop.id)}
                                                    >
                                                        <FiX /> Dismiss
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : briefError ? (
                        <div className="brief-fallback-box">
                            <FiAlertCircle />
                            <span>AI Briefing is offline. Core study timers and task boards are fully active.</span>
                        </div>
                    ) : null}
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