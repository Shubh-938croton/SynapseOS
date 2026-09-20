import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";

import { updateGoal } from "../../services/goalService";

import "./EditGoalModal.css";

function EditGoalModal({
    goal,
    onClose,
    onUpdated
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [status, setStatus] = useState("Not Started");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!goal) return;

        setTitle(goal.title || "");
        setDescription(goal.description || "");
        setTargetDate(
            goal.target_date
                ? String(goal.target_date).substring(0, 10)
                : ""
        );
        setProgressPercentage(goal.progress_percentage ?? 0);
        setStatus(goal.status || "Not Started");
    }, [goal]);

    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!goal) return;

        if (!title.trim()) {
            alert("Please enter a goal title.");
            return;
        }

        const progress = Number(progressPercentage);

        if (progress < 0 || progress > 100) {
            alert("Progress percentage must be between 0 and 100.");
            return;
        }

        try {
            setLoading(true);

            const goalData = {
                title: title.trim(),
                description: description.trim() || null,
                target_date: targetDate || null,
                progress_percentage: progress,
                status: status
            };

            await updateGoal(goal.goal_id, goalData);

            if (onUpdated) {
                await onUpdated();
            }

            onClose();
        } catch (error) {
            console.error("Update goal error:", error);
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update goal."
            );
        } finally {
            setLoading(false);
        }
    };

    if (!goal) return null;

    return (
        <div className="edit-goal-overlay" onClick={handleClose}>
            <div className="edit-goal-modal" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="edit-goal-header">
                    <div>
                        <h2>Edit Goal</h2>
                        <p>Update objectives and track completion status.</p>
                    </div>

                    <button
                        type="button"
                        className="edit-goal-close"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                </div>

                {/* FORM */}
                <form className="edit-goal-form" onSubmit={handleSubmit}>
                    <div className="edit-goal-form-group">
                        <label>Goal Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter goal title"
                            disabled={loading}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="edit-goal-form-group">
                        <label>Description <span className="optional-tag">(Optional)</span></label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your goal..."
                            rows="3"
                            disabled={loading}
                        />
                    </div>

                    <div className="edit-goal-form-row">
                        <div className="edit-goal-form-group">
                            <label>Target Date</label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="edit-goal-form-group">
                            <label>Status</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                disabled={loading}
                            >
                                <option value="Not Started">Not Started</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div className="edit-goal-form-group">
                        <div className="edit-goal-slider-header">
                            <label>Progress</label>
                            <span className="edit-slider-value">{progressPercentage}%</span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progressPercentage}
                            onChange={(e) => setProgressPercentage(Number(e.target.value))}
                            disabled={loading}
                        />
                    </div>

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
                            <FiCheck />
                            <span>{loading ? "Saving..." : "Save Changes"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditGoalModal;