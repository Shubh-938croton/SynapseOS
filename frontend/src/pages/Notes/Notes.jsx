import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import NoteCard from "../../components/NotesCard/NoteCard";
import AddNoteModal from "../../components/AddNoteModal/AddNoteModal";


import {
    getAllNotes,
    updateNote,
    deleteNote
} from "../../services/noteService";

import "./Notes.css";

function Notes() {

    const [notes, setNotes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);

    // =========================
    // FETCH NOTES
    // =========================

    const fetchNotes = async () => {

        try {

            setLoading(true);

            const response = await getAllNotes();

            /*
                Your backend returns:

                {
                    count: ...,
                    notes: [...]
                }
            */

            setNotes(response.notes || []);

        } catch (error) {

            console.error("Error fetching notes:", error);

            alert(
                error.response?.data?.message ||
                "Failed to fetch notes"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchNotes();

    }, []);


    // =========================
    // EDIT NOTE
    // =========================

    const handleEdit = (note) => {

        console.log("Edit note:", note);

        /*
            We will connect this to
            Add/Edit Note Modal next.
        */

    };


    // =========================
    // DELETE NOTE
    // =========================

    const handleDelete = async (note) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${note.title}"?`
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteNote(note.note_id);

            alert("Note deleted successfully");

            await fetchNotes();

        } catch (error) {

            console.error("Delete note error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to delete note"
            );

        }

    };


    // =========================
    // PIN / UNPIN NOTE
    // =========================

    const handleTogglePin = async (note) => {

        try {

            await updateNote(
                note.note_id,
                {
                    subject_id: note.subject_id,
                    title: note.title,
                    content: note.content,
                    is_pinned: !note.is_pinned
                }
            );

            await fetchNotes();

        } catch (error) {

            console.error("Toggle pin error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update note"
            );

        }

    };


    // =========================
    // RENDER
    // =========================

    return (

    <DashboardLayout>

        <div className="notes-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="notes-header">

                <div>

                    <h1>
                        My Notes
                    </h1>

                    <p>
                        Organize your ideas, knowledge and study notes.
                    </p>

                </div>


                <button
                    className="add-note-btn"
                    onClick={() => setShowAddNoteModal(true)}
                >
                    + Add Note
                </button>

            </div>


            {/* =========================
                SEARCH / TOOLBAR
            ========================= */}

            <div className="notes-toolbar">

                <input
                    type="text"
                    placeholder="🔍 Search notes..."
                    className="notes-search"
                />

                <select className="notes-filter">

                    <option value="all">
                        All Notes
                    </option>

                    <option value="pinned">
                        Pinned
                    </option>

                </select>

            </div>


            {/* =========================
                LOADING
            ========================= */}

            {loading && (

                <div className="notes-loading">

                    <p>
                        Loading notes...
                    </p>

                </div>

            )}


            {/* =========================
                EMPTY STATE
            ========================= */}

            {!loading && notes.length === 0 && (

                <div className="empty-notes">

                    <div className="empty-notes-icon">
                        📝
                    </div>

                    <h2>
                        No notes yet
                    </h2>

                    <p>
                        Create your first note and start
                        organizing your knowledge.
                    </p>

                    <button
                        className="add-note-btn"
                        onClick={() => setShowAddNoteModal(true)}
                    >
                        + Create Note
                    </button>

                </div>

            )}


            {/* =========================
                NOTES LIST
            ========================= */}

            {!loading && notes.length > 0 && (

                <div className="notes-list">

                    {notes.map((note) => (

                        <NoteCard
                            key={note.note_id}
                            note={note}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTogglePin={handleTogglePin}
                        />

                    ))}

                </div>

            )}

        </div>


        {/* =========================
            ADD NOTE MODAL
        ========================= */}

        <AddNoteModal
            isOpen={showAddNoteModal}
            onClose={() => setShowAddNoteModal(false)}
            onNoteCreated={fetchNotes}
        />

    </DashboardLayout>

);

}

export default Notes;