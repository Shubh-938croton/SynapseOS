import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import NoteCard from "../../components/NotesCard/NoteCard";
import AddNoteModal from "../../components/AddNoteModal/AddNoteModal";
import {
    getAllNotes,
    updateNote,
    deleteNote
} from "../../services/noteService";
import { FiPlus, FiSearch, FiFileText, FiBookmark } from "react-icons/fi";
import "./Notes.css";

function Notes() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddNoteModal, setShowAddNoteModal] = useState(false);
    const [noteToEdit, setNoteToEdit] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState("all");

    // =========================
    // FETCH NOTES
    // =========================
    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await getAllNotes();
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
        if (!confirmDelete) return;

        try {
            await deleteNote(note.note_id);
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
                    is_pinned: !Boolean(note.is_pinned)
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
    // SEARCH + FILTER
    // =========================
    const filteredNotes = notes.filter((note) => {
        const query = searchQuery.trim().toLowerCase();

        const matchesTitle = note.title?.toLowerCase().includes(query);
        const matchesContent = note.content?.toLowerCase().includes(query);
        const matchesSubject = note.subject_name?.toLowerCase().includes(query);

        const matchesSearch = !query || matchesTitle || matchesContent || matchesSubject;
        const matchesFilter = filter === "all" || (filter === "pinned" && Boolean(note.is_pinned));

        return matchesSearch && matchesFilter;
    });

    return (
        <DashboardLayout>
            <div className="notes-page">
                {/* HEADER */}
                <div className="notes-header">
                    <div>
                        <h1>Notes</h1>
                        <p>Knowledge base, study notes, and references organized by subject.</p>
                    </div>

                    <button
                        type="button"
                        className="add-note-btn"
                        onClick={() => {
                            setNoteToEdit(null);
                            setShowAddNoteModal(true);
                        }}
                    >
                        <FiPlus />
                        <span>Add Note</span>
                    </button>
                </div>

                {/* SEARCH / TOOLBAR */}
                <div className="notes-toolbar">
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search notes by title, subject, or content..."
                            className="notes-search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filters-group">
                        <select
                            className="notes-filter"
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="all">All Notes</option>
                            <option value="pinned">Pinned Only</option>
                        </select>

                        {(searchQuery || filter !== "all") && (
                            <button
                                className="clear-filter-btn"
                                onClick={() => {
                                    setSearchQuery("");
                                    setFilter("all");
                                }}
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* RESULTS INFO */}
                {!loading && notes.length > 0 && (
                    <div className="notes-results-count">
                        Showing <strong>{filteredNotes.length}</strong> of <strong>{notes.length}</strong> notes
                    </div>
                )}

                {/* LOADING */}
                {loading && (
                    <div className="notes-loading">
                        <p>Loading your notes...</p>
                    </div>
                )}

                {/* EMPTY NOTES */}
                {!loading && notes.length === 0 && (
                    <div className="empty-notes">
                        <div className="empty-notes-icon">
                            <FiFileText />
                        </div>
                        <h2>No notes created yet</h2>
                        <p>
                            Capture lecture notes, formulas, insights, and study summaries linked to your subjects.
                        </p>
                        <button
                            type="button"
                            className="empty-add-btn"
                            onClick={() => {
                                setNoteToEdit(null);
                                setShowAddNoteModal(true);
                            }}
                        >
                            <FiPlus />
                            <span>Create First Note</span>
                        </button>
                    </div>
                )}

                {/* NO SEARCH RESULTS */}
                {!loading && notes.length > 0 && filteredNotes.length === 0 && (
                    <div className="no-results">
                        <div className="empty-notes-icon">
                            <FiSearch />
                        </div>
                        <h2>No matching notes</h2>
                        <p>Try searching for a different keyword or reset your filters.</p>
                        <button
                            type="button"
                            className="empty-add-btn"
                            onClick={() => {
                                setSearchQuery("");
                                setFilter("all");
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* NOTES GRID */}
                {!loading && filteredNotes.length > 0 && (
                    <div className="notes-list">
                        {filteredNotes.map((note) => (
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

            {/* ADD / EDIT NOTE MODAL */}
            <AddNoteModal
                isOpen={showAddNoteModal}
                onClose={() => {
                    setShowAddNoteModal(false);
                    setNoteToEdit(null);
                }}
                onNoteCreated={fetchNotes}
                noteToEdit={noteToEdit}
            />
        </DashboardLayout>
    );
}

export default Notes;