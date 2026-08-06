import { useState } from "react";
import "./AddTaskModal.css";
import { createTask } from "../../services/taskService";

function AddTaskModal({ isOpen, onClose, onTaskCreated }) {

    const [formData, setFormData] = useState({
        subject_id: "",
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await createTask(formData);

            alert("Task created successfully!");

            if (onTaskCreated) {
                onTaskCreated();
            }

            onClose();

        } catch (error) {

            console.error(error);
            alert("Failed to create task");

        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>Create New Task</h2>

                    <button
    type="button"
    onClick={onClose}
>
    ✕
</button>

                </div>

                <form onSubmit={handleSubmit} className="task-form">

                    <div className="form-group">

                        <label>Task Title</label>

                        <input
                            type="text"
                            name="title"
                            placeholder="Enter task title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Description</label>

                        <textarea
                            name="description"
                            placeholder="Describe your task..."
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                        />

                    </div>

                    <div className="form-row">

                        <div className="form-group">

                            <label>Priority</label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="High">🔴 High</option>
                                <option value="Medium">🟡 Medium</option>
                                <option value="Low">🟢 Low</option>
                            </select>

                        </div>

                        <div className="form-group">

                            <label>Due Date</label>

                            <input
                                type="date"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                            />

                        </div>

                    </div>

                    <div className="modal-buttons">

                        <button
                            type="button"
                            className="cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="create-btn"
                        >
                            Create Task
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default AddTaskModal;