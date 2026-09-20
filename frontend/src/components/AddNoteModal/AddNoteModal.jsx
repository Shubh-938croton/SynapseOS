import { useEffect, useState } from "react";
import { FiX, FiSave, FiPlus } from "react-icons/fi";
import {
    createNote,
    updateNote
} from "../../services/noteService";
import { getAllSubjects } from "../../services/subjectService";
import SubjectModal from "../SubjectModal/SubjectModal";
import "./AddNoteModal.css";

function AddNoteModal({
    isOpen,
    onClose,
    onNoteCreated,
    noteToEdit
}) {
    const [title, setTitle] = useState("");
    const [subjectId, setSubjectId] = useState("");
    const [content, setContent] = useState("");
    const [isPinned, setIsPinned] = useState(false);

    const [subjects, setSubjects] = useState([]);
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [subjectsLoading, setSubjectsLoading] = useState(false);

    const loadSubjectsList = async (selectedId = null) => {
        try {
            setSubjectsLoading(true);
            const response = await getAllSubjects();
            const subjectList = response?.subjects ? response.subjects : (Array.isArray(response) ? response : []);
            setSubjects(subjectList);
            if (selectedId) {
                setSubjectId(selectedId);
            }
        } catch (error) {
            console.error("Failed to load subjects", error);
        } finally {
            setSubjectsLoading(false);
        }
    };

    useEffect(() => {
        if (!isOpen) return;

        const loadModalData = async () => {
            try {
                setSubjectsLoading(true);
                const response = await getAllSubjects();
                const subjectList = response?.subjects ? response.subjects : (Array.isArray(response) ? response : []);
                setSubjects(subjectList);

                if (noteToEdit) {
                    setTitle(noteToEdit.title || "");
                    setSubjectId(noteToEdit.subject_id ? String(noteToEdit.subject_id) : "");
                    setContent(noteToEdit.content || "");
                    setIsPinned(Boolean(noteToEdit.is_pinned));
                } else {
                    setTitle("");
                    setSubjectId("");
                    setContent("");
                    setIsPinned(false);
                }
            } catch (error) {
                console.error("Error loading note modal:", error);
            } finally {
                setSubjectsLoading(false);
            }
        };

        loadModalData();
    }, [isOpen, noteToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a note title.");
            return;
        }

        if (!content.trim()) {
            alert("Please enter some note content.");
            return;
        }

        try {
            setLoading(true);

            if (noteToEdit) {
                await updateNote(noteToEdit.note_id, {
                    subject_id: subjectId ? Number(subjectId) : null,
                    title: title.trim(),
                    content: content.trim(),
                    is_pinned: isPinned
                });
            } else {
                await createNote({
                    subject_id: subjectId ? Number(subjectId) : null,
                    title: title.trim(),
                    content: content.trim()
                });
            }

            if (onNoteCreated) {
                await onNoteCreated();
            }

            onClose();
        } catch (error) {
            console.error("Save note error:", error);
            alert(
                error.response?.data?.message ||
                (noteToEdit ? "Failed to update note" : "Failed to create note")
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="note-modal-overlay" onClick={onClose}>
            <div className="note-modal" onClick={(e) => e.stopPropagation()}>
                {/* HEADER */}
                <div className="note-modal-header">
                    <div>
                        <h2>{noteToEdit ? "Edit Note" : "New Note"}</h2>
                        <p>{noteToEdit ? "Update your note details." : "Capture key insights, formulas, and references."}</p>
                    </div>

                    <button
                        type="button"
                        className="note-modal-close"
                        onClick={onClose}
                        disabled={loading}
                        aria-label="Close dialog"
                    >
                        <FiX />
                    </button>
                </div>

                {/* FORM */}
                <form className="note-modal-form" onSubmit={handleSubmit}>
                    {/* TITLE */}
                    <div className="note-form-group">
                        <label>Note Title <span className="required-star">*</span></label>
                        <input
                            type="text"
                            placeholder="e.g. Graph Algorithms Overview"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={loading}
                            autoFocus
                            required
                        />
                    </div>

                    {/* SUBJECT */}
                    <div className="note-form-group">
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
                            value={subjectId}
                            onChange={(e) => setSubjectId(e.target.value)}
                            disabled={loading || subjectsLoading}
                        >
                            <option value="">
                                {subjectsLoading
                                    ? "Loading subjects..."
                                    : (subjects.length === 0 ? "No subjects created" : "Select a subject (optional)")}
                            </option>
                            {!subjectsLoading &&
                                subjects.map((subject) => (
                                    <option
                                        key={subject.subject_id}
                                        value={subject.subject_id}
                                    >
                                        {subject.subject_name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* CONTENT */}
                    <div className="note-form-group">
                        <label>Content <span className="required-star">*</span></label>
                        <textarea
                            placeholder="Write your study notes, definitions, code snippets, or formulas..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={loading}
                            rows="6"
                            required
                        />
                    </div>

                    {/* PIN */}
                    {noteToEdit && (
                        <div className="note-pin-option">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) => setIsPinned(e.target.checked)}
                                    disabled={loading}
                                />
                                <span>Pin this note to top</span>
                            </label>
                        </div>
                    )}

                    {/* ACTIONS */}
                    <div className="note-modal-actions">
                        <button
                            type="button"
                            className="note-cancel-btn"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="note-save-btn"
                            disabled={loading}
                        >
                            {loading
                                ? (noteToEdit ? "Updating..." : "Creating...")
                                : (noteToEdit ? "Save Changes" : "Create Note")}
                        </button>
                    </div>
                </form>
            </div>

            <SubjectModal
                isOpen={isSubjectModalOpen}
                onClose={() => setIsSubjectModalOpen(false)}
                onSubjectCreated={(newSub) => {
                    loadSubjectsList(newSub?.subject_id);
                }}
            />
        </div>
    );
}

export default AddNoteModal;