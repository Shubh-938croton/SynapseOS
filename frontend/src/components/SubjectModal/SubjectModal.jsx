import { useEffect, useState } from "react";
import { FiX, FiCheck, FiFolderPlus, FiEdit2 } from "react-icons/fi";

import {
    createSubject,
    updateSubject
} from "../../services/subjectService";

import "./SubjectModal.css";

const PRESET_COLORS = [
    { label: "Electric Blue", value: "#3b82f6" },
    { label: "Royal Purple", value: "#8b5cf6" },
    { label: "Emerald Green", value: "#10b981" },
    { label: "Amber Gold", value: "#f59e0b" },
    { label: "Crimson Red", value: "#ef4444" },
    { label: "Cyan Blue", value: "#06b6d4" },
    { label: "Vibrant Pink", value: "#ec4899" },
    { label: "Indigo Slate", value: "#6366f1" }
];

function SubjectModal({
    isOpen,
    onClose,
    onSubjectCreated,
    onSubjectUpdated,
    subjectToEdit = null
}) {
    const [subjectName, setSubjectName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#3b82f6");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Prefill form when editing or opening
    useEffect(() => {
        if (isOpen) {
            if (subjectToEdit) {
                setSubjectName(subjectToEdit.subject_name || "");
                setDescription(subjectToEdit.description || "");
                setColor(subjectToEdit.color || "#3b82f6");
            } else {
                setSubjectName("");
                setDescription("");
                setColor("#3b82f6");
            }
            setError("");
            setLoading(false);
        }
    }, [isOpen, subjectToEdit]);

    if (!isOpen) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!subjectName.trim()) {
            setError("Subject name is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const payload = {
                subject_name: subjectName.trim(),
                description: description.trim() || null,
                color: color || "#3b82f6"
            };

            if (subjectToEdit) {
                await updateSubject(subjectToEdit.subject_id, payload);
                if (onSubjectUpdated) {
                    onSubjectUpdated({
                        ...subjectToEdit,
                        ...payload
                    });
                }
            } else {
                const response = await createSubject(payload);
                const createdSubject = response.subject || {
                    subject_id: response.subjectId,
                    ...payload
                };
                if (onSubjectCreated) {
                    onSubjectCreated(createdSubject);
                }
            }

            onClose();
        } catch (err) {
            console.error("Subject save error:", err);
            setError(
                err.response?.data?.message ||
                err.message ||
                "Failed to save subject"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="subject-modal-overlay" onClick={onClose}>
            <div
                className="subject-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="subject-modal-header">
                    <div className="subject-modal-title-group">
                        <div
                            className="subject-modal-icon"
                            style={{ backgroundColor: `${color}20`, color: color }}
                        >
                            {subjectToEdit ? <FiEdit2 /> : <FiFolderPlus />}
                        </div>
                        <div>
                            <h2>{subjectToEdit ? "Edit Subject" : "Create New Subject"}</h2>
                            <p>
                                {subjectToEdit
                                    ? "Update subject details, description, and accent color."
                                    : "Add a subject to organize tasks, notes, and study sessions."}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="subject-modal-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close modal"
                    >
                        <FiX />
                    </button>
                </div>

                {/* ERROR */}
                {error && <div className="subject-modal-error">{error}</div>}

                {/* FORM */}
                <form className="subject-modal-form" onSubmit={handleSubmit}>
                    {/* SUBJECT NAME */}
                    <div className="subject-form-group">
                        <label htmlFor="subject-name-input">
                            Subject Name <span className="required-star">*</span>
                        </label>
                        <input
                            id="subject-name-input"
                            type="text"
                            value={subjectName}
                            onChange={(e) => {
                                setSubjectName(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="e.g. Data Structures & Algorithms, Machine Learning..."
                            disabled={loading}
                            maxLength={100}
                            autoFocus
                            required
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div className="subject-form-group">
                        <label htmlFor="subject-description-input">
                            Description <span className="optional-tag">(Optional)</span>
                        </label>
                        <textarea
                            id="subject-description-input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description of this course or topic..."
                            disabled={loading}
                            rows={3}
                        />
                    </div>

                    {/* COLOR PALETTE */}
                    <div className="subject-form-group">
                        <label>Accent Color</label>
                        <div className="subject-color-picker">
                            {PRESET_COLORS.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    className={`subject-color-swatch ${
                                        color === preset.value ? "active" : ""
                                    }`}
                                    style={{ backgroundColor: preset.value }}
                                    onClick={() => setColor(preset.value)}
                                    title={preset.label}
                                    disabled={loading}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="subject-modal-actions">
                        <button
                            type="button"
                            className="subject-cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="subject-submit-btn"
                            disabled={loading || !subjectName.trim()}
                        >
                            <FiCheck />
                            <span>{loading ? "Saving..." : subjectToEdit ? "Update Subject" : "Create Subject"}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default SubjectModal;
