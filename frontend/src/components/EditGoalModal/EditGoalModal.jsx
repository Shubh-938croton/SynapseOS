import { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

import { updateGoal } from "../../services/goalService";

import "./EditGoalModal.css";

function EditGoalModal({
    goal,
    onClose,
    onUpdated
}) {

    // =========================
    // FORM STATE
    // =========================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [status, setStatus] = useState("Not Started");

    const [loading, setLoading] = useState(false);


    // =========================
    // LOAD GOAL DATA
    // =========================

    useEffect(() => {

        if (!goal) {
            return;
        }

        console.log("Editing goal:", goal);

        setTitle(goal.title || "");

        setDescription(
            goal.description || ""
        );

        // Keep only YYYY-MM-DD
        setTargetDate(
            goal.target_date
                ? String(goal.target_date).substring(0, 10)
                : ""
        );

        setProgressPercentage(
            goal.progress_percentage ?? 0
        );

        setStatus(
            goal.status || "Not Started"
        );

    }, [goal]);


    // =========================
    // HANDLE CLOSE
    // =========================

    const handleClose = () => {

        if (loading) {
            return;
        }

        onClose();

    };


    // =========================
    // HANDLE SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =========================
        // CHECK GOAL
        // =========================

        if (!goal) {

            alert("No goal selected.");

            return;

        }


        // =========================
        // VALIDATION
        // =========================

        if (!title.trim()) {

            alert("Please enter a goal title.");

            return;

        }


        const progress = Number(
            progressPercentage
        );


        if (
            progress < 0 ||
            progress > 100
        ) {

            alert(
                "Progress percentage must be between 0 and 100."
            );

            return;

        }


        try {

            setLoading(true);


            // =========================
            // UPDATED GOAL DATA
            // =========================

            const goalData = {

                title:
                    title.trim(),

                description:
                    description.trim() || null,

                target_date:
                    targetDate || null,

                progress_percentage:
                    progress,

                status:
                    status

            };


            console.log(
                "Updating goal:",
                goal.goal_id,
                goalData
            );


            // =========================
            // UPDATE GOAL
            // =========================

            await updateGoal(
                goal.goal_id,
                goalData
            );


            console.log(
                "Goal updated successfully"
            );


            // =========================
            // REFRESH GOALS
            // =========================

            if (onUpdated) {

                await onUpdated();

            }


            // =========================
            // CLOSE MODAL
            // =========================

            onClose();


        } catch (error) {

            console.error(
                "Update goal error:",
                error
            );


            alert(

                error.response?.data?.message ||

                error.response?.data?.error ||

                "Failed to update goal."

            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DON'T RENDER
    // =========================

    if (!goal) {

        return null;

    }


    // =========================
    // RENDER
    // =========================

    return (

        <div
            className="edit-goal-overlay"
            onClick={handleClose}
        >

            <div
                className="edit-goal-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =========================
                    HEADER
                ========================= */}

                <div className="edit-goal-header">

                    <div>

                        <h2>
                            Edit Goal
                        </h2>

                        <p>
                            Update your goal and
                            track your progress.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="edit-goal-close"
                        onClick={handleClose}
                        disabled={loading}
                        title="Close"
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                <form
                    className="edit-goal-form"
                    onSubmit={handleSubmit}
                >

                    {/* TITLE */}

                    <div className="edit-goal-form-group">

                        <label>
                            Goal Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            placeholder="Enter goal title"
                            disabled={loading}
                            autoFocus
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="edit-goal-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            placeholder="Describe your goal..."
                            rows="4"
                            disabled={loading}
                        />

                    </div>


                    {/* TARGET DATE */}

                    <div className="edit-goal-form-group">

                        <label>
                            Target Date
                        </label>

                        <input
                            type="date"
                            value={targetDate}
                            onChange={(e) =>
                                setTargetDate(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* PROGRESS */}

                    <div className="edit-goal-form-group">

                        <label>
                            Progress
                        </label>

                        <div className="progress-input-row">

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progressPercentage}
                                onChange={(e) =>
                                    setProgressPercentage(
                                        Number(e.target.value)
                                    )
                                }
                                disabled={loading}
                            />

                            <span>
                                {progressPercentage}%
                            </span>

                        </div>

                    </div>


                    {/* STATUS */}

                    <div className="edit-goal-form-group">

                        <label>
                            Status
                        </label>

                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        >

                            <option value="Not Started">
                                Not Started
                            </option>

                            <option value="In Progress">
                                In Progress
                            </option>

                            <option value="Completed">
                                Completed
                            </option>

                        </select>

                    </div>


                    {/* ACTIONS */}

                    <div className="edit-goal-actions">

                        <button
                            type="button"
                            className="edit-goal-cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="edit-goal-save-btn"
                            disabled={loading}
                        >

                            <FaSave />

                            {loading
                                ? "Saving..."
                                : "Save Changes"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default EditGoalModal;