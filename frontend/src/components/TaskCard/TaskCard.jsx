import "./TaskCard.css";

import {
    FaCalendarAlt,
    FaEdit,
    FaTrash,
    FaCheckCircle,
    FaClock
} from "react-icons/fa";

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

    // =========================
    // DELETE TASK
    // =========================

    const handleDelete = async () => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${task.title}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteTask(task.task_id);

            alert("Task deleted successfully");

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

const handleComplete = async () => {

    try {

        await updateTask(task.task_id, {
            status: "Completed"
        });

        alert("Task completed successfully");

        if (onTaskChanged) {
            onTaskChanged();
        }

    } catch (error) {

        console.error("Complete task error:", error);

        alert(
            error.response?.data?.message ||
            "Failed to complete task"
        );

    }

};


    return (

        <div className="task-card">

            {/* =========================
                HEADER
            ========================= */}

            <div className="task-header">

                <div className="task-title-section">

                    <h2>
                        {task.title}
                    </h2>

                    <p>
                        {task.description || "No description provided."}
                    </p>

                </div>


                <span className={`priority ${priority}`}>

                    {task.priority}

                </span>

            </div>


            {/* =========================
                META
            ========================= */}

            <div className="task-meta">

                <div className="due-date">

                    <FaCalendarAlt />

                    <span>
                        {formattedDate}
                    </span>

                </div>


                <div className="task-status">

                    <FaClock />

                    <span className={`status ${status}`}>

                        {task.status}

                    </span>

                </div>

            </div>


            {/* =========================
                ACTIONS
            ========================= */}

            <div className="task-actions">

                {/* EDIT */}

                <button
                    type="button"
                    className="task-action edit-btn"
                    onClick={() => onEdit(task)}
                >

                    <FaEdit />

                    <span>
                        Edit
                    </span>

                </button>


                {/* DELETE */}

                <button
                    type="button"
                    className="task-action delete-btn"
                    onClick={handleDelete}
                >

                    <FaTrash />

                    <span>
                        Delete
                    </span>

                </button>


                {/* COMPLETE */}

                <button
    type="button"
    className="task-action complete-btn"
    disabled={task.status === "Completed"}
    onClick={handleComplete}
>
    <FaCheckCircle />

    <span>
        {task.status === "Completed"
            ? "Completed"
            : "Complete"
        }
    </span>
</button>

            </div>

        </div>

    );

}

export default TaskCard;