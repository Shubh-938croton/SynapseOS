import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import AddGoalModal from "../../components/AddGoalModal/AddGoalModal";
import EditGoalModal from "../../components/EditGoalModal/EditGoalModal";

import {
    getAllGoals,
    deleteGoal
} from "../../services/goalService";

import "./Goals.css";


function Goals() {

    // =========================
    // STATE
    // =========================

    const [goals, setGoals] = useState([]);

    const [loading, setLoading] = useState(true);

    const [showAddGoalModal, setShowAddGoalModal] =
        useState(false);

    const [goalToEdit, setGoalToEdit] =
        useState(null);


    // =========================
    // FETCH GOALS
    // =========================

    const fetchGoals = async () => {

        try {

            setLoading(true);

            const data = await getAllGoals();

            setGoals(data || []);

        } catch (error) {

            console.error(
                "Failed to fetch goals:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // LOAD GOALS
    // =========================

    useEffect(() => {

        fetchGoals();

    }, []);


    // =========================
    // DELETE GOAL
    // =========================

    const handleDeleteGoal = async (goalId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this goal?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteGoal(goalId);

            await fetchGoals();

        } catch (error) {

            console.error(
                "Failed to delete goal:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete goal."
            );

        }

    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "No target date";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "No target date";
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
    // STATUS CLASS
    // =========================

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


    // =========================
    // RENDER
    // =========================

    return (

        <DashboardLayout>

            {/* =========================
                ADD GOAL MODAL
            ========================= */}

            <AddGoalModal

                isOpen={
                    showAddGoalModal
                }

                onClose={() =>
                    setShowAddGoalModal(false)
                }

                onGoalCreated={
                    fetchGoals
                }

            />


            {/* =========================
                EDIT GOAL MODAL
            ========================= */}

            <EditGoalModal

                goal={
                    goalToEdit
                }

                onClose={() =>
                    setGoalToEdit(null)
                }

                onUpdated={
                    fetchGoals
                }

            />


            {/* =========================
                GOALS PAGE
            ========================= */}

            <div className="goals-page">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="goals-header">

                    <div>

                        <h1>
                            My Goals
                        </h1>

                        <p>
                            Set goals, track your progress,
                            and stay focused.
                        </p>

                    </div>


                    {/* ONLY CREATE BUTTON */}

                    <button

                        type="button"

                        className="add-goal-btn"

                        onClick={() =>
                            setShowAddGoalModal(true)
                        }

                    >

                        + Add Goal

                    </button>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="goals-loading">

                        Loading goals...

                    </div>

                )}


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {!loading &&
                    goals.length === 0 && (

                        <div className="goals-empty">

                            <h2>
                                No goals yet
                            </h2>

                            <p>
                                Create your first goal
                                and start tracking
                                your progress.
                            </p>

                        </div>

                    )}


                {/* =========================
                    GOALS LIST
                ========================= */}

                {!loading &&
                    goals.length > 0 && (

                        <div className="goals-grid">

                            {goals.map((goal) => (

                                <div
                                    key={goal.goal_id}
                                    className="goal-card"
                                >


                                    {/* =========================
                                        GOAL HEADER
                                    ========================= */}

                                    <div className="goal-card-header">

                                        <div>

                                            <h2>
                                                {goal.title}
                                            </h2>

                                            <span
                                                className={`goal-status ${getStatusClass(
                                                    goal.status
                                                )}`}
                                            >

                                                {goal.status}

                                            </span>

                                        </div>

                                    </div>


                                    {/* =========================
                                        DESCRIPTION
                                    ========================= */}

                                    {goal.description && (

                                        <p className="goal-description">

                                            {goal.description}

                                        </p>

                                    )}


                                    {/* =========================
                                        PROGRESS
                                    ========================= */}

                                    <div className="goal-progress-section">

                                        <div className="goal-progress-header">

                                            <span>
                                                Progress
                                            </span>

                                            <strong>
                                                {goal.progress_percentage || 0}%
                                            </strong>

                                        </div>


                                        <div className="goal-progress-bar">

                                            <div
                                                className="goal-progress-fill"
                                                style={{
                                                    width: `${Math.min(
                                                        Math.max(
                                                            Number(
                                                                goal.progress_percentage
                                                            ) || 0,
                                                            0
                                                        ),
                                                        100
                                                    )}%`
                                                }}
                                            />

                                        </div>

                                    </div>


                                    {/* =========================
                                        TARGET DATE
                                    ========================= */}

                                    <div className="goal-target-date">

                                        <span>
                                            Target Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                goal.target_date
                                            )}
                                        </strong>

                                    </div>


                                    {/* =========================
                                        ACTIONS
                                    ========================= */}

                                    <div className="goal-card-actions">

                                        <button

                                            type="button"

                                            className="edit-goal-btn"

                                            onClick={() =>
                                                setGoalToEdit(goal)
                                            }

                                        >

                                            Edit

                                        </button>


                                        <button

                                            type="button"

                                            className="delete-goal-btn"

                                            onClick={() =>
                                                handleDeleteGoal(
                                                    goal.goal_id
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


export default Goals;