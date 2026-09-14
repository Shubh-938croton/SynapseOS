import { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
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

        }
        else {

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

                alert("Task updated successfully!");

            }
            else {

                await createTask(formData);

                alert("Task created successfully!");

            }

            if (onTaskCreated) {
                onTaskCreated();
            }

            onClose();

        }
        catch (error) {

            console.log("=========== ERROR ===========");
            console.log(error);
            console.log(error.response);
            console.log(error.response?.data);
            console.log("=============================");

            alert("Operation failed");

        }

    };

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>

                        {taskToEdit
                            ? "Edit Task"
                            : "Create New Task"}

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

                    {/* Subject */}

                    <div className="form-group">

                        <div className="form-group-label-row">
                            <label>Subject <span className="required-star">*</span></label>
                            <button
                                type="button"
                                className="add-subject-inline-btn"
                                onClick={() => setIsSubjectModalOpen(true)}
                            >
                                <FaPlus /> New Subject
                            </button>
                        </div>

                        <select
                            name="subject_id"
                            value={formData.subject_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                {subjects.length === 0 ? "No subjects available" : "Select Subject"}
                            </option>

                            {

                                subjects.map(subject => (

                                    <option
                                        key={subject.subject_id}
                                        value={subject.subject_id}
                                    >

                                        {subject.subject_name}

                                    </option>

                                ))

                            }

                        </select>

                        {subjects.length === 0 && (
                            <div className="subject-empty-hint">
                                No subjects found. <button type="button" onClick={() => setIsSubjectModalOpen(true)}>Create one</button> to assign to this task.
                            </div>
                        )}

                    </div>

                    {/* Title */}

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

                    {/* Description */}

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

                    {/* Priority + Due Date */}

                    <div className="form-row">

                        <div className="form-group">

                            <label>Priority</label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >

                                <option value="High">
                                    🔴 High
                                </option>

                                <option value="Medium">
                                    🟡 Medium
                                </option>

                                <option value="Low">
                                    🟢 Low
                                </option>

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

                            {

                                taskToEdit
                                    ? "Update Task"
                                    : "Create Task"

                            }

                        </button>

                    </div>

                </form>

            </div>

            <SubjectModal
                isOpen={isSubjectModalOpen}
                onClose={() => setIsSubjectModalOpen(false)}
                onSubjectCreated={(newSub) => {
                    fetchSubjects(newSub.subject_id);
                }}
            />

        </div>

    );

}

export default AddTaskModal;