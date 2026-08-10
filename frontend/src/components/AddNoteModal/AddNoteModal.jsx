import { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

import {
    createNote,
    updateNote
} from "../../services/noteService";

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

    const [loading, setLoading] = useState(false);

    // Reset form whenever modal opens
    useEffect(() => {

    if (!isOpen) {
        return;
    }

    if (noteToEdit) {

        setTitle(noteToEdit.title || "");
        setSubjectId(
            noteToEdit.subject_id
                ? String(noteToEdit.subject_id)
                : ""
        );
        setContent(noteToEdit.content || "");

    } else {

        setTitle("");
        setSubjectId("");
        setContent("");

    }

}, [isOpen, noteToEdit]);


    // Don't render anything when closed
    if (!isOpen) {
        return null;
    }


    const handleSubmit = async (e) => {

    e.preventDefault();

    if (!title.trim()) {
        alert("Please enter a note title.");
        return;
    }

    if (!subjectId) {
        alert("Please select a subject.");
        return;
    }

    if (!content.trim()) {
        alert("Please enter some note content.");
        return;
    }

    try {

        setLoading(true);

        const noteData = {
            subject_id: Number(subjectId),
            title: title.trim(),
            content: content.trim()
        };


        if (noteToEdit) {

            // =========================
            // UPDATE NOTE
            // =========================

            await updateNote(
                noteToEdit.note_id,
                {
                    ...noteData,
                    is_pinned: noteToEdit.is_pinned || false
                }
            );

            alert("Note updated successfully");

        } else {

            // =========================
            // CREATE NOTE
            // =========================

            await createNote(noteData);

            alert("Note created successfully");

        }


        // Refresh Notes page
        if (onNoteCreated) {
            await onNoteCreated();
        }


        // Close modal
        onClose();

    } catch (error) {

        console.error(
            noteToEdit
                ? "Update note error:"
                : "Create note error:",
            error
        );

        alert(
            error.response?.data?.message ||
            noteToEdit
                ? "Failed to update note"
                : "Failed to create note"
        );

    } finally {

        setLoading(false);

    }

};


    return (

        <div
            className="note-modal-overlay"
            onClick={onClose}
        >

            <div
                className="note-modal"
                onClick={(e) => e.stopPropagation()}
            >

                {/* HEADER */}

                <div className="note-modal-header">

                    <div>

                        <h2>
    {noteToEdit ? "Edit Note" : "Create New Note"}
</h2>

<p>
    {noteToEdit
        ? "Update your note and save your changes."
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


                {/* FORM */}

                <form
                    className="note-modal-form"
                    onSubmit={handleSubmit}
                >

                    {/* TITLE */}

                    <div className="note-form-group">

                        <label>
                            Note Title
                        </label>

                        <input
                            type="text"
                            placeholder="Enter note title"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            disabled={loading}
                            autoFocus
                        />

                    </div>


                    {/* SUBJECT */}

                    <div className="note-form-group">

                        <label>
                            Subject
                        </label>

                        <select
                            value={subjectId}
                            onChange={(e) =>
                                setSubjectId(e.target.value)
                            }
                            disabled={loading}
                        >

                            <option value="">
                                Select a subject
                            </option>

                            {/* 
                                Temporary option.

                                We will replace this with
                                dynamic subjects from the
                                database next.
                            */}

                            <option value="7">
                                Operating System
                            </option>

                        </select>

                    </div>


                    {/* CONTENT */}

                    <div className="note-form-group">

                        <label>
                            Content
                        </label>

                        <textarea
                            placeholder="Write your note here..."
                            value={content}
                            onChange={(e) =>
                                setContent(e.target.value)
                            }
                            disabled={loading}
                            rows="8"
                        />

                    </div>


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

                            <FaSave />

                            {loading
    ? (noteToEdit ? "Updating..." : "Creating...")
    : (noteToEdit ? "Update Note" : "Create Note")
}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AddNoteModal;