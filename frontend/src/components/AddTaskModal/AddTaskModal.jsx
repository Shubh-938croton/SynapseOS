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

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <input
    type="text"
    name="title"
    placeholder="Task Title"
    value={formData.title}
    onChange={handleChange}
/>

                    <textarea
    name="description"
    placeholder="Description"
    value={formData.description}
    onChange={handleChange}
/>

                    <select
    name="priority"
    value={formData.priority}
    onChange={handleChange}
>

                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>

                    </select>

                    <input
    type="date"
    name="due_date"
    value={formData.due_date}
    onChange={handleChange}
/>

                    <button type="submit">

                        Create Task

                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddTaskModal;