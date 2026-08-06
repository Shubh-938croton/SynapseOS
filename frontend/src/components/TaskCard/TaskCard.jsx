import "./TaskCard.css";

import {
    FaCalendarAlt,
    FaEdit,
    FaTrash,
    FaCheckCircle
} from "react-icons/fa";

function TaskCard({ task, onEdit }) {

    return (

        <div className="task-card">

            <div className="task-header">

                <div>

                    <h2>{task.title}</h2>

                    <p>{task.description}</p>

                </div>

                <span
                    className={`priority ${task.priority.toLowerCase()}`}
                >
                    {task.priority}
                </span>

            </div>

            <div className="task-meta">

                <div>

                    <FaCalendarAlt />

                    <span>
                        {new Date(task.due_date).toLocaleDateString()}
                    </span>

                </div>

                <span
                    className={`status ${task.status.toLowerCase()}`}
                >
                    {task.status}
                </span>

            </div>

            <div className="task-actions">

                <button
                    className="edit-btn"
                    onClick={() => onEdit(task)}
                >

                    <FaEdit />

                    Edit

                </button>

                <button className="delete-btn">

                    <FaTrash />

                    Delete

                </button>

                <button
                    className="complete-btn"
                    disabled={task.status === "Completed"}
                >

                    <FaCheckCircle />

                    Complete

                </button>

            </div>

        </div>

    );

}

export default TaskCard;