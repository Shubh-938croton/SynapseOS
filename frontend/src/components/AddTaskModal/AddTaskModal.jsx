import { useState, useEffect } from "react";
import "./AddTaskModal.css";
import { createTask, updateTask } from "../../services/taskService";

function AddTaskModal({
    isOpen,
    onClose,
    onTaskCreated,
    taskToEdit
}) {

    const [formData, setFormData] = useState({
        subject_id: "",
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: ""
    });

    // Prefill form when editing
    useEffect(() => {

        if (taskToEdit) {

            setFormData({
                subject_id: taskToEdit.subject_id || "",
                title: taskToEdit.title || "",
                description: taskToEdit.description || "",
                priority: taskToEdit.priority || "Medium",
                status: taskToEdit.status || "Pending",
                due_date: taskToEdit.due_date
                    ? taskToEdit.due_date.substring(0, 10)
                    : ""
            });

        } else {

            setFormData({
                subject_id: "",
                title: "",
                description: "",
                priority: "Medium",
                status: "Pending",
                due_date: ""
            });

        }

    }, [taskToEdit]);

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (taskToEdit) {

                await updateTask(taskToEdit.task_id, formData);

                alert("Task updated successfully!");

            } else {

                await createTask(formData);

                alert("Task created successfully!");

            }

            if (onTaskCreated) {
                onTaskCreated();
            }

            onClose();

        } catch (error) {

        console.log("========== ERROR ==========");
        console.log(error);
        console.log(error.response);
        console.log(error.response?.data);
        console.log("===========================");

        alert("Operation failed");

    }

    };

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>
                        {taskToEdit ? "Edit Task" : "Create New Task"}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                    >
                        ✕
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="task-form"
                >

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
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
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

                            {taskToEdit ? "Update Task" : "Create Task"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddTaskModal;