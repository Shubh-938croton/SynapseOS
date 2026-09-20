import "./TaskCard.css";
import {
    FiCalendar,
    FiEdit2,
    FiTrash2,
    FiCheckCircle,
    FiClock
} from "react-icons/fi";
import { deleteTask, updateTask } from "../../services/taskService";

function TaskCard({ task, onEdit, onTaskChanged }) {
    const formattedDate = task.due_date
        ? new Date(task.due_date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "No due date";

    const priority = task.priority?.toLowerCase() || "medium";
    const status = task.status?.toLowerCase() || "pending";
    const isCompleted = status === "completed";

    // =========================
    // DELETE TASK
    // =========================
    const handleDelete = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmDelete) return;

        try {
            await deleteTask(task.task_id);
            if (onTaskChanged) {
                onTaskChanged();
            }
        } catch (error) {
            console.error("Delete task error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        }
    };

    // =========================
    // COMPLETE TASK
    // =========================
    const handleToggleComplete = async () => {
        try {
            const nextStatus = isCompleted ? "Pending" : "Completed";
            await updateTask(task.task_id, {
                status: nextStatus
            });

            if (onTaskChanged) {
                onTaskChanged();
            }
        } catch (error) {
            console.error("Toggle complete task error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to update task status"
            );
        }
    };

    return (
        <div className={`task-card ${isCompleted ? "is-completed" : ""}`}>
            {/* CHECKBOX / COMPLETION BUTTON */}
            <button
                type="button"
                className={`task-checkbox ${isCompleted ? "checked" : ""}`}
                onClick={handleToggleComplete}
                aria-label={isCompleted ? "Mark as pending" : "Mark as completed"}
            >
                <FiCheckCircle />
            </button>

            {/* MAIN CONTENT */}
            <div className="task-content">
                <div className="task-main-row">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`priority-tag ${priority}`}>
                        {task.priority || "Medium"}
                    </span>
                </div>

                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}

                <div className="task-meta">
                    <div className="meta-item due-date">
                        <FiCalendar />
                        <span>{formattedDate}</span>
                    </div>

                    <div className={`meta-item status-pill ${status}`}>
                        <FiClock />
                        <span>{task.status || "Pending"}</span>
                    </div>
                </div>
            </div>

            {/* ACTIONS */}
            <div className="task-actions">
                <button
                    type="button"
                    className="task-action-btn edit-btn"
                    onClick={() => onEdit(task)}
                    title="Edit Task"
                >
                    <FiEdit2 />
                </button>
                <button
                    type="button"
                    className="task-action-btn delete-btn"
                    onClick={handleDelete}
                    title="Delete Task"
                >
                    <FiTrash2 />
                </button>
            </div>
        </div>
    );
}

export default TaskCard;