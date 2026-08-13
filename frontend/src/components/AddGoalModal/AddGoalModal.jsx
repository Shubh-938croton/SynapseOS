import { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

import { createGoal } from "../../services/goalService";

import "./AddGoalModal.css";


function AddGoalModal({
    isOpen,
    onClose,
    onGoalCreated
}) {

    // =========================
    // FORM STATE
    // =========================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");

    const [progressPercentage, setProgressPercentage] =
        useState(0);

    const [status, setStatus] =
        useState("Not Started");

    const [loading, setLoading] =
        useState(false);


    // =========================
    // RESET FORM
    // =========================

    useEffect(() => {

        if (isOpen) {

            setTitle("");
            setDescription("");
            setTargetDate("");

            setProgressPercentage(0);

            setStatus("Not Started");

            setLoading(false);

        }

    }, [isOpen]);


    // =========================
    // DON'T RENDER
    // =========================

    if (!isOpen) {
        return null;
    }


    // =========================
    // HANDLE SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =========================
        // VALIDATION
        // =========================

        if (!title.trim()) {

            alert(
                "Please enter a goal title."
            );

            return;

        }


        const progress =
            Number(progressPercentage);


        if (
            Number.isNaN(progress) ||
            progress < 0 ||
            progress > 100
        ) {

            alert(
                "Progress must be between 0 and 100."
            );

            return;

        }


        // =========================
        // AUTO STATUS
        // =========================

        let finalStatus = status;


        if (progress === 100) {

            finalStatus = "Completed";

        } else if (progress > 0) {

            finalStatus = "In Progress";

        } else {

            finalStatus = "Not Started";

        }


        try {

            setLoading(true);


            // =========================
            // GOAL DATA
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
                    finalStatus

            };


            console.log(
                "Creating goal:",
                goalData
            );


            // =========================
            // CREATE GOAL
            // =========================

            await createGoal(
                goalData
            );


            console.log(
                "Goal created successfully"
            );


            // =========================
            // REFRESH GOALS
            // =========================

            if (onGoalCreated) {

                await onGoalCreated();

            }


            // =========================
            // CLOSE MODAL
            // =========================

            onClose();


        } catch (error) {

            console.error(
                "Create goal error:",
                error
            );


            alert(

                error.response?.data?.message ||

                error.response?.data?.error ||

                "Failed to create goal."

            );

        } finally {

            setLoading(false);

        }

    };


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
    // RENDER
    // =========================

    return (

        <div
            className="goal-modal-overlay"
            onClick={handleClose}
        >

            <div
                className="goal-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =========================
                    HEADER
                ========================= */}

                <div className="goal-modal-header">

                    <div>

                        <h2>
                            Create New Goal
                        </h2>

                        <p>
                            Set a goal and start
                            tracking your progress.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="goal-modal-close"
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
                    className="goal-modal-form"
                    onSubmit={handleSubmit}
                >

                    {/* =========================
                        TITLE
                    ========================= */}

                    <div className="goal-form-group">

                        <label>
                            Goal Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter goal title"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            autoFocus
                        />

                    </div>


                    {/* =========================
                        DESCRIPTION
                    ========================= */}

                    <div className="goal-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            placeholder="Describe your goal..."
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            rows="4"
                        />

                    </div>


                    {/* =========================
                        TARGET DATE
                    ========================= */}

                    <div className="goal-form-group">

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


                    {/* =========================
                        PROGRESS
                    ========================= */}

                    <div className="goal-form-group">

                        <label>
                            Progress (%)
                        </label>

                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={progressPercentage}
                            onChange={(e) =>
                                setProgressPercentage(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        STATUS
                    ========================= */}

                    <div className="goal-form-group">

    <label>Status</label>

    <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
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


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <div className="goal-modal-actions">

                        <button
                            type="button"
                            className="goal-cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="goal-save-btn"
                            disabled={loading}
                        >

                            <FaSave />

                            {loading
                                ? "Creating..."
                                : "Create Goal"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default AddGoalModal;