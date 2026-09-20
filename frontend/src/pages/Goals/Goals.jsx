import { useEffect, useState, useMemo } from "react";
import {
    FiPlus,
    FiTarget,
    FiCheckCircle,
    FiClock,
    FiCalendar,
    FiEdit2,
    FiTrash2,
    FiPercent
} from "react-icons/fi";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal";
import EditGoalModal from "../../components/EditGoalModal/EditGoalModal";

import {
    getAllGoals,
    deleteGoal
} from "../../services/goalService";

import "./Goals.css";

function Goals() {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddGoalModal, setShowAddGoalModal] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState(null);

    const fetchGoals = async () => {
        try {
            setLoading(true);
            const data = await getAllGoals();
            setGoals(data || []);
        } catch (error) {
            console.error("Failed to fetch goals:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleDeleteGoal = async (goalId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this goal?"
        );

        if (!confirmed) return;

        try {
            await deleteGoal(goalId);
            await fetchGoals();
        } catch (error) {
            console.error("Failed to delete goal:", error);
            alert(
                error.response?.data?.message ||
                "Failed to delete goal."
            );
        }
    };

    const formatDate = (date) => {
        if (!date) return "No target date";
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            return "No target date";
        }
        return parsedDate.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const getStatusClass = (status) => {
        switch (status) {
            case "Completed":
                return "goal-status-completed";
            case "In Progress":
                return "goal-status-progress";
            case "Not Started":
            default:
                return "goal-status-not-started";
        }
    };

    const stats = useMemo(() => {
        const total = goals.length;
        const completed = goals.filter((g) => g.status === "Completed").length;
        const inProgress = goals.filter((g) => g.status === "In Progress").length;
        const avgProgress = total > 0
            ? Math.round(goals.reduce((acc, g) => acc + (Number(g.progress_percentage) || 0), 0) / total)
            : 0;
        return { total, completed, inProgress, avgProgress };
    }, [goals]);

    return (
        <DashboardLayout>
            <AddGoalModal
                isOpen={showAddGoalModal}
                onClose={() => setShowAddGoalModal(false)}
                onGoalCreated={fetchGoals}
            />

            <EditGoalModal
                goal={goalToEdit}
                onClose={() => setGoalToEdit(null)}
                onUpdated={fetchGoals}
            />

            <div className="goals-page">
                {/* HEADER */}
                <div className="goals-header">
                    <div>
                        <span className="goals-label">OBJECTIVES</span>
                        <h1>Goals & Milestones</h1>
                        <p>
                            Track long-term academic targets and measure continuous progress.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-goal-btn"
                        onClick={() => setShowAddGoalModal(true)}
                    >
                        <FiPlus />
                        <span>Add Goal</span>
                    </button>
                </div>

                {/* METRICS ROW */}
                {!loading && goals.length > 0 && (
                    <div className="goals-metrics-bar">
                        <div className="goals-metric-item">
                            <span className="metric-label">Total Goals</span>
                            <span className="metric-value">{stats.total}</span>
                        </div>
                        <div className="goals-metric-item">
                            <span className="metric-label">In Progress</span>
                            <span className="metric-value in-progress">{stats.inProgress}</span>
                        </div>
                        <div className="goals-metric-item">
                            <span className="metric-label">Completed</span>
                            <span className="metric-value completed">{stats.completed}</span>
                        </div>
                        <div className="goals-metric-item">
                            <span className="metric-label">Avg Completion</span>
                            <span className="metric-value avg">{stats.avgProgress}%</span>
                        </div>
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="goals-loading">
                        <div className="goals-spinner" />
                        <p>Loading your goals...</p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && goals.length === 0 && (
                    <div className="goals-empty">
                        <div className="goals-empty-icon">
                            <FiTarget />
                        </div>
                        <h2>No goals defined yet</h2>
                        <p>
                            Break down your academic syllabus or personal targets into trackable milestones.
                        </p>
                        <button
                            type="button"
                            className="goals-empty-btn"
                            onClick={() => setShowAddGoalModal(true)}
                        >
                            <FiPlus />
                            <span>Create Your First Goal</span>
                        </button>
                    </div>
                )}

                {/* GOALS GRID */}
                {!loading && goals.length > 0 && (
                    <div className="goals-grid">
                        {goals.map((goal) => {
                            const progress = Math.min(
                                Math.max(Number(goal.progress_percentage) || 0, 0),
                                100
                            );

                            return (
                                <div key={goal.goal_id} className="goal-card">
                                    <div className="goal-card-header">
                                        <h2>{goal.title}</h2>
                                        <span className={`goal-status ${getStatusClass(goal.status)}`}>
                                            {goal.status}
                                        </span>
                                    </div>

                                    {goal.description && (
                                        <p className="goal-description">
                                            {goal.description}
                                        </p>
                                    )}

                                    {/* PROGRESS SECTION */}
                                    <div className="goal-progress-section">
                                        <div className="goal-progress-header">
                                            <span>Progress</span>
                                            <strong>{progress}%</strong>
                                        </div>
                                        <div className="goal-progress-bar">
                                            <div
                                                className="goal-progress-fill"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* TARGET DATE */}
                                    <div className="goal-target-date">
                                        <div className="goal-meta-item">
                                            <FiCalendar />
                                            <span>Target Date</span>
                                        </div>
                                        <strong>{formatDate(goal.target_date)}</strong>
                                    </div>

                                    {/* ACTIONS */}
                                    <div className="goal-card-actions">
                                        <button
                                            type="button"
                                            className="edit-goal-btn"
                                            onClick={() => setGoalToEdit(goal)}
                                        >
                                            <FiEdit2 />
                                            <span>Edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            className="delete-goal-btn"
                                            onClick={() => handleDeleteGoal(goal.goal_id)}
                                        >
                                            <FiTrash2 />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Goals;