import "./NoteCard.css";
import {
    FiEdit2,
    FiTrash2,
    FiBookmark,
    FiClock
} from "react-icons/fi";

function NoteCard({
    note,
    onEdit,
    onDelete,
    onTogglePin
}) {
    const formattedDate = new Date(
        note.updated_at || note.created_at
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (
        <div className={`note-card ${note.is_pinned ? "pinned" : ""}`}>
            {/* HEADER */}
            <div className="note-card-header">
                <div className="note-title-section">
                    <h3 className="note-title">{note.title}</h3>
                    {note.subject_name && (
                        <span className="note-subject-tag">
                            {note.subject_name}
                        </span>
                    )}
                </div>

                {/* PIN */}
                <button
                    type="button"
                    className={`pin-btn ${note.is_pinned ? "active" : ""}`}
                    onClick={() => onTogglePin(note)}
                    title={note.is_pinned ? "Unpin note" : "Pin note"}
                    aria-label={note.is_pinned ? "Unpin note" : "Pin note"}
                >
                    <FiBookmark />
                </button>
            </div>

            {/* CONTENT */}
            <div className="note-content">
                <p>{note.content}</p>
            </div>

            {/* FOOTER */}
            <div className="note-card-footer">
                <span className="note-date">
                    <FiClock />
                    <span>{formattedDate}</span>
                </span>

                <div className="note-actions">
                    <button
                        type="button"
                        className="note-action-btn edit-btn"
                        onClick={() => onEdit(note)}
                        title="Edit note"
                    >
                        <FiEdit2 />
                    </button>

                    <button
                        type="button"
                        className="note-action-btn delete-btn"
                        onClick={() => onDelete(note)}
                        title="Delete note"
                    >
                        <FiTrash2 />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NoteCard;