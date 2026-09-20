import { useEffect, useState } from "react";
import { FiX, FiCheck } from "react-icons/fi";

import { createGoal } from "../../services/goalService";

import "./AddGoalModal.css";

function AddGoalModal({
    isOpen,
    onClose,
    onGoalCreated
}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [targetDate, setTargetDate] = useState("");
    const [progressPercentage, setProgressPercentage] = useState(0);
    const [status, setStatus] = useState("Not Started");
    const [loading, setLoading] = useState(false);

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

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a goal title.");
            return;
        }

        const progress = Number(progressPercentage);

        if (
            Number.isNaN(progress) ||
            progress < 0 ||
            progress > 100
        ) {
            alert("Progress must be between 0 and 100.");
            return;
        }

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

            const goalData = {
                title: title.trim(),
                description: description.trim() || null,
                target_date: targetDate || null,
                progress_percentage: progress,
                status: finalStatus
            };

            await createGoal(goalData);

            if (onGoalCreated) {
                await onGoalCreated();
            }

            onClose();
        } catch (error) {
            console.error("Create goal error:", error);
            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create goal."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (loading) return;
        onClose();
    };

    return (
        <div className="goal-modal-overlay" onClick={handleClose}>
            <div className="goal-modal" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="goal-modal-header">
                    <div>
                        <h2>Create Goal</h2>
                        <p>Set a clear objective and define its target timeline.</p>
                    </div>

                    <button
                        type="button"
                        className="goal-modal-close"
                        onClick={handleClose}
                        disabled={loading}
                        aria-label="Close"
                    >
                        <FiX />
                    </button>
                </div>

                {/* FORM */}
                <form className="goal-modal-form" onSubmit={handleSubmit}>
                    <div className="goal-form-group">
                        <label>Goal Title <span className="required-star">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Master Dynamic Programming"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                            autoFocus
                            required
                        />
                    </div>

                    <div className="goal-form-group">
                        <label>Description <span className="optional-tag">(Optional)</span></label>
                        <textarea
                            placeholder="Key milestones or resources to finish..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={loading}
                            rows="3"
                        />
                    </div>

                    <div className="goal-form-row">
                        <div className="goal-form-group">
                            <label>Target Date</label>
                            <input
                                type="date"
                                value={targetDate}
                                onChange={(e) => setTargetDate(e.target.value)}
                                disabled={loading}
                            />
                        </div>

                        <div className="goal-form-group">
                            <label>Initial Status</label>
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

                    <div className="goal-form-group">
                        <div className="goal-progress-slider-header">
                            <label>Progress</label>
                            <span className="goal-slider-value">{progressPercentage}%</span>
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
                            <FiCheck />
                            <span>{loading ? "Creating..." : "Create Goal"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddGoalModal;