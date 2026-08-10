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

    const [showAddNoteModal, setShowAddNoteModal] =
        useState(false);

    const [noteToEdit, setNoteToEdit] =
        useState(null);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [filter, setFilter] =
        useState("all");


    // =========================
    // FETCH NOTES
    // =========================

    const fetchNotes = async () => {

        try {

            setLoading(true);

            const response = await getAllNotes();

            /*
                Backend returns:

                {
                    count: ...,
                    notes: [...]
                }
            */

            setNotes(response.notes || []);

        } catch (error) {

            console.error(
                "Error fetching notes:",
                error
            );

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

        setNoteToEdit(note);

        setShowAddNoteModal(true);

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

            console.error(
                "Delete note error:",
                error
            );

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
                    is_pinned: !Boolean(note.is_pinned)
                }
            );

            await fetchNotes();

        } catch (error) {

            console.error(
                "Toggle pin error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to update note"
            );

        }

    };


    // =========================
    // SEARCH + FILTER
    // =========================

    const filteredNotes = notes.filter((note) => {

        const query = searchQuery
            .trim()
            .toLowerCase();


        // Search title
        const matchesTitle =
            note.title
                ?.toLowerCase()
                .includes(query);


        // Search content
        const matchesContent =
            note.content
                ?.toLowerCase()
                .includes(query);


        // Search subject
        const matchesSubject =
            note.subject_name
                ?.toLowerCase()
                .includes(query);


        const matchesSearch =
            !query ||
            matchesTitle ||
            matchesContent ||
            matchesSubject;


        // Filter
        const matchesFilter =
            filter === "all" ||
            (
                filter === "pinned" &&
                Boolean(note.is_pinned)
            );


        return (
            matchesSearch &&
            matchesFilter
        );

    });


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
                            Organize your ideas,
                            knowledge and study notes.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="add-note-btn"
                        onClick={() => {

                            setNoteToEdit(null);

                            setShowAddNoteModal(true);

                        }}
                    >

                        + Add Note

                    </button>

                </div>


                {/* =========================
                    SEARCH / TOOLBAR
                ========================= */}

                <div className="notes-toolbar">


                    {/* SEARCH */}

                    <input
                        type="text"
                        placeholder="🔍 Search notes..."
                        className="notes-search"
                        value={searchQuery}
                        onChange={(e) =>
                            setSearchQuery(
                                e.target.value
                            )
                        }
                    />


                    {/* FILTER */}

                    <select
                        className="notes-filter"
                        value={filter}
                        onChange={(e) =>
                            setFilter(
                                e.target.value
                            )
                        }
                    >

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
                    NO NOTES
                ========================= */}

                {!loading &&
                    notes.length === 0 && (

                        <div className="empty-notes">

                            <div className="empty-notes-icon">
                                📝
                            </div>

                            <h2>
                                No notes yet
                            </h2>

                            <p>
                                Create your first note
                                and start organizing
                                your knowledge.
                            </p>


                            <button
                                type="button"
                                className="add-note-btn"
                                onClick={() => {

                                    setNoteToEdit(null);

                                    setShowAddNoteModal(true);

                                }}
                            >

                                + Create Note

                            </button>

                        </div>

                    )}


                {/* =========================
                    NO SEARCH RESULTS
                ========================= */}

                {!loading &&
                    notes.length > 0 &&
                    filteredNotes.length === 0 && (

                        <div className="no-results">

                            <h2>
                                No matching notes
                            </h2>

                            <p>
                                Try a different search
                                or filter.
                            </p>

                        </div>

                    )}


                {/* =========================
                    NOTES LIST
                ========================= */}

                {!loading &&
                    filteredNotes.length > 0 && (

                        <div className="notes-list">

                            {filteredNotes.map(
                                (note) => (

                                    <NoteCard
                                        key={note.note_id}
                                        note={note}

                                        onEdit={
                                            handleEdit
                                        }

                                        onDelete={
                                            handleDelete
                                        }

                                        onTogglePin={
                                            handleTogglePin
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}


                {/* =========================
                    ADD / EDIT NOTE MODAL
                ========================= */}

                <AddNoteModal
                    isOpen={
                        showAddNoteModal
                    }

                    onClose={() => {

                        setShowAddNoteModal(
                            false
                        );

                        setNoteToEdit(null);

                    }}

                    onNoteCreated={
                        fetchNotes
                    }

                    noteToEdit={
                        noteToEdit
                    }
                />


            </div>

        </DashboardLayout>

    );

}

export default Notes;