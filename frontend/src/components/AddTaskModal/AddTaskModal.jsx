import { useState, useEffect } from "react";
import { FiX, FiPlus } from "react-icons/fi";
import "./AddTaskModal.css";
import {
    createTask,
    updateTask
} from "../../services/taskService";
import {
    getAllSubjects
} from "../../services/subjectService";
import SubjectModal from "../SubjectModal/SubjectModal";

function AddTaskModal({
    isOpen,
    onClose,
    onTaskCreated,
    taskToEdit
}) {
    const [subjects, setSubjects] = useState([]);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        subject_id: "",
        title: "",
        description: "",
        priority: "Medium",
        status: "Pending",
        due_date: ""
    });

    // -----------------------------
    // Fetch Subjects
    // -----------------------------
    const fetchSubjects = async (selectedId = null) => {
        try {
            const response = await getAllSubjects();
            const subjectList = response?.subjects ? response.subjects : (Array.isArray(response) ? response : []);
            setSubjects(subjectList);
            if (selectedId) {
                setFormData(prev => ({ ...prev, subject_id: selectedId }));
            }
        } catch (error) {
            console.error("Failed to fetch subjects", error);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchSubjects();
        }
    }, [isOpen]);

    // -----------------------------
    // Prefill while editing
    // -----------------------------
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

    // -----------------------------
    // Handle Change
    // -----------------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // -----------------------------
    // Handle Submit
    // -----------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (taskToEdit) {
                await updateTask(
                    taskToEdit.task_id,
                    formData
                );
            } else {
                await createTask(formData);
            }

            if (onTaskCreated) {
                onTaskCreated();
            }

            onClose();
        } catch (error) {
            console.error("Task modal error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to save task. Please check your inputs and try again."
            );
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{taskToEdit ? "Edit Task" : "New Task"}</h2>
                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="task-form">
                    {/* Subject */}
                    <div className="form-group">
                        <div className="form-group-label-row">
                            <label>Subject</label>
                            <button
                                type="button"
                                className="add-subject-inline-btn"
                                onClick={() => setIsSubjectModalOpen(true)}
                            >
                                <FiPlus />
                                <span>New Subject</span>
                            </button>
                        </div>

                        <select
                            name="subject_id"
                            value={formData.subject_id}
                            onChange={handleChange}
                        >
                            <option value="">
                                {subjects.length === 0 ? "No subjects created" : "Select a subject (optional)"}
                            </option>
                            {subjects.map(subject => (
                                <option
                                    key={subject.subject_id}
                                    value={subject.subject_id}
                                >
                                    {subject.subject_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div className="form-group">
                        <label>Task Title <span className="required-star">*</span></label>
                        <input
                            type="text"
                            name="title"
                            placeholder="e.g. Complete Chapter 4 exercises"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description */}
                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            placeholder="Optional notes or breakdown..."
                            rows="3"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Priority + Due Date */}
                    <div className="form-row">
                        <div className="form-group">
                            <label>Priority</label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="High">High</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
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

                    {/* Buttons */}
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
                            {taskToEdit ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>

            <SubjectModal
                isOpen={isSubjectModalOpen}
                onClose={() => setIsSubjectModalOpen(false)}
                onSubjectCreated={(newSub) => {
                    fetchSubjects(newSub?.subject_id);
                }}
            />
        </div>
    );
}

export default AddTaskModal;