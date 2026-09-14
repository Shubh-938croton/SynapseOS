import { useEffect, useState } from "react";
import { FaTimes, FaSave, FaPlus } from "react-icons/fa";

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
    const [subjectsLoading, setSubjectsLoading] =
        useState(false);


    // =====================================================
    // LOAD SUBJECTS + SET FORM DATA
    // =====================================================

    const loadSubjectsList = async (selectedId = null) => {
        try {
            setSubjectsLoading(true);
            const subjectList = await getAllSubjects();
            setSubjects(subjectList || []);
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

        if (!isOpen) {
            return;
        }

        const loadModalData = async () => {

            try {

                setSubjectsLoading(true);

                // =========================
                // FETCH SUBJECTS
                // =========================

                const subjectList =
                    await getAllSubjects();

                setSubjects(subjectList || []);


                // =========================
                // EDIT MODE
                // =========================

                if (noteToEdit) {

                    setTitle(
                        noteToEdit.title || ""
                    );

                    setSubjectId(
                        noteToEdit.subject_id
                            ? String(noteToEdit.subject_id)
                            : ""
                    );

                    setContent(
                        noteToEdit.content || ""
                    );

                    setIsPinned(
                        Boolean(noteToEdit.is_pinned)
                    );

                }


                // =========================
                // CREATE MODE
                // =========================

                else {

                    setTitle("");
                    setSubjectId("");
                    setContent("");
                    setIsPinned(false);

                }

            } catch (error) {

                console.error(
                    "Error loading note modal:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to load subjects"
                );

            } finally {

                setSubjectsLoading(false);

            }

        };


        loadModalData();

    }, [isOpen, noteToEdit]);


    // =====================================================
    // DON'T RENDER WHEN CLOSED
    // =====================================================

    if (!isOpen) {
        return null;
    }


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =========================
        // VALIDATION
        // =========================

        if (!title.trim()) {

            alert(
                "Please enter a note title."
            );

            return;

        }


        if (!subjectId) {

            alert(
                "Please select a subject."
            );

            return;

        }


        if (!content.trim()) {

            alert(
                "Please enter some note content."
            );

            return;

        }


        try {

            setLoading(true);


            // =================================================
            // EDIT NOTE
            // =================================================

            if (noteToEdit) {

                await updateNote(
                    noteToEdit.note_id,
                    {
                        subject_id:
                            Number(subjectId),

                        title:
                            title.trim(),

                        content:
                            content.trim(),

                        is_pinned:
                            isPinned
                    }
                );


                alert(
                    "Note updated successfully"
                );

            }


            // =================================================
            // CREATE NOTE
            // =================================================

            else {

                await createNote({

                    subject_id:
                        Number(subjectId),

                    title:
                        title.trim(),

                    content:
                        content.trim()

                });


                alert(
                    "Note created successfully"
                );

            }


            // =================================================
            // REFRESH NOTES PAGE
            // =================================================

            if (onNoteCreated) {

                await onNoteCreated();

            }


            // =================================================
            // CLOSE MODAL
            // =================================================

            onClose();


        } catch (error) {

            console.error(
                "Save note error:",
                error
            );

            alert(
                error.response?.data?.message ||
                (
                    noteToEdit
                        ? "Failed to update note"
                        : "Failed to create note"
                )
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div
            className="note-modal-overlay"
            onClick={onClose}
        >

            <div
                className="note-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >


                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="note-modal-header">

                    <div>

                        <h2>

                            {noteToEdit
                                ? "Edit Note"
                                : "Create New Note"
                            }

                        </h2>

                        <p>

                            {noteToEdit
                                ? "Update your note details."
                                : "Save your ideas and study notes."
                            }

                        </p>

                    </div>


                    <button
                        type="button"
                        className="note-modal-close"
                        onClick={onClose}
                        disabled={loading}
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="note-modal-form"
                    onSubmit={handleSubmit}
                >


                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <div className="note-form-group">

                        <label>
                            Note Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter note title"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            autoFocus
                        />

                    </div>


                    {/* =================================================
                        SUBJECT
                    ================================================= */}

                    <div className="note-form-group">

                        <div className="form-group-label-row">
                            <label>
                                Subject <span className="required-star">*</span>
                            </label>
                            <button
                                type="button"
                                className="add-subject-inline-btn"
                                onClick={() => setIsSubjectModalOpen(true)}
                            >
                                <FaPlus /> New Subject
                            </button>
                        </div>

                        <select
                            value={subjectId}
                            onChange={(e) =>
                                setSubjectId(
                                    e.target.value
                                )
                            }
                            disabled={
                                loading ||
                                subjectsLoading
                            }
                        >

                            <option value="">

                                {subjectsLoading
                                    ? "Loading subjects..."
                                    : (subjects.length === 0 ? "No subjects available" : "Select a subject")
                                }

                            </option>


                            {!subjectsLoading &&
                                subjects.map(
                                    (subject) => (

                                        <option
                                            key={
                                                subject.subject_id
                                            }
                                            value={
                                                subject.subject_id
                                            }
                                        >

                                            {
                                                subject.subject_name
                                            }

                                        </option>

                                    )
                                )
                            }

                        </select>


                        {/* NO SUBJECTS */}

                        {!subjectsLoading &&
                            subjects.length === 0 && (

                                <div className="subject-empty-hint">
                                    No subjects found. <button type="button" onClick={() => setIsSubjectModalOpen(true)}>Create one</button> to assign to this note.
                                </div>

                            )
                        }

                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="note-form-group">

                        <label>
                            Content
                        </label>

                        <textarea
                            placeholder="Write your note here..."
                            value={content}
                            onChange={(e) =>
                                setContent(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                            rows="8"
                        />

                    </div>


                    {/* =================================================
                        PIN
                    ================================================= */}

                    {noteToEdit && (

                        <div className="note-pin-option">

                            <label>

                                <input
                                    type="checkbox"
                                    checked={isPinned}
                                    onChange={(e) =>
                                        setIsPinned(
                                            e.target.checked
                                        )
                                    }
                                    disabled={loading}
                                />

                                Pin this note

                            </label>

                        </div>

                    )}


                    {/* =================================================
                        ACTIONS
                    ================================================= */}

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
                            disabled={
                                loading ||
                                subjectsLoading ||
                                subjects.length === 0
                            }
                        >

                            <FaSave />

                            {loading
                                ? (
                                    noteToEdit
                                        ? "Updating..."
                                        : "Creating..."
                                )
                                : (
                                    noteToEdit
                                        ? "Update Note"
                                        : "Create Note"
                                )
                            }

                        </button>

                    </div>

                </form>

            </div>

            <SubjectModal
                isOpen={isSubjectModalOpen}
                onClose={() => setIsSubjectModalOpen(false)}
                onSubjectCreated={(newSub) => {
                    loadSubjectsList(newSub.subject_id);
                }}
            />

        </div>

    );

}


export default AddNoteModal;