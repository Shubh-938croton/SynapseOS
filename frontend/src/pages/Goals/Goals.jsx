import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import AddGoalModal
    from "../../components/AddGoalModal/AddGoalModal";

import EditGoalModal
    from "../../components/EditGoalModal/EditGoalModal";

import {
    getAllGoals,
    deleteGoal
} from "../../services/goalService";

import "./Goals.css";


function Goals() {

    // =========================
    // GOALS
    // =========================

    const [goals, setGoals] = useState([]);

    const [loading, setLoading] = useState(true);


    // =========================
    // ADD GOAL MODAL
    // =========================

    const [showAddGoalModal, setShowAddGoalModal] =
        useState(false);


    // =========================
    // EDIT GOAL
    // =========================

    const [goalToEdit, setGoalToEdit] =
        useState(null);


    // =========================
    // FETCH GOALS
    // =========================

    const fetchGoals = async () => {

        try {

            setLoading(true);

            const response = await getAllGoals();

            setGoals(response || []);

        } catch (error) {

            console.error(
                "Error fetching goals:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to fetch goals."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchGoals();

    }, []);


    // =========================
    // DELETE GOAL
    // =========================

    const handleDeleteGoal = async (goal) => {

        const confirmed = window.confirm(
            `Are you sure you want to delete "${goal.title}"?`
        );

        if (!confirmed) {
            return;
        }


        try {

            await deleteGoal(goal.goal_id);

            await fetchGoals();

        } catch (error) {

            console.error(
                "Delete goal error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete goal."
            );

        }

    };


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (status) => {

        switch (status) {

            case "Completed":
                return "completed";

            case "In Progress":
                return "in-progress";

            case "Not Started":
                return "not-started";

            default:
                return "";

        }

    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        if (!date) {
            return "No target date";
        }

        const dateString =
            String(date).substring(0, 10);

        const [year, month, day] =
            dateString.split("-");

        if (!year || !month || !day) {
            return "No target date";
        }

        return `${day}/${month}/${year}`;

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


                            <button

                                type="button"

                                className="add-goal-btn"

                                onClick={() =>
                                    setShowAddGoalModal(true)
                                }

                            >
                                + Create Goal

                            </button>

                        </div>

                    )}


                {/* =========================
                    GOALS GRID
                ========================= */}

                {!loading &&
                    goals.length > 0 && (

                        <div className="goals-grid">

                            {goals.map((goal) => (

                                <div
                                    key={
                                        goal.goal_id
                                    }
                                    className="goal-card"
                                >


                                    {/* =========================
                                        CARD HEADER
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

                                            {
                                                goal.description
                                            }

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
                                                {
                                                    goal.progress_percentage ?? 0
                                                }%
                                            </strong>

                                        </div>


                                        <div className="goal-progress-bar">

                                            <div

                                                className="goal-progress-fill"

                                                style={{
                                                    width: `${Math.min(
                                                        Math.max(
                                                            Number(
                                                                goal.progress_percentage ?? 0
                                                            ),
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
                                            {
                                                formatDate(
                                                    goal.target_date
                                                )
                                            }
                                        </strong>

                                    </div>


                                    {/* =========================
                                        ACTIONS
                                    ========================= */}

                                    <div className="goal-actions">


                                        <button

                                            type="button"

                                            className="goal-edit-btn"

                                            onClick={() =>
                                                setGoalToEdit(
                                                    goal
                                                )
                                            }

                                        >
                                            Edit

                                        </button>


                                        <button

                                            type="button"

                                            className="goal-delete-btn"

                                            onClick={() =>
                                                handleDeleteGoal(
                                                    goal
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