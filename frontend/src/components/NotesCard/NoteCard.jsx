import "./NoteCard.css";

import {
    FaEdit,
    FaTrash,
    FaThumbtack,
    FaRegClock
} from "react-icons/fa";

function NoteCard({
    note,
    onEdit,
    onDelete,
    onTogglePin
}) {

    const formattedDate = note.created_at
        ? new Date(note.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        : "Unknown date";

    return (

        <div className={`note-card ${note.is_pinned ? "pinned" : ""}`}>

            {/* PIN INDICATOR */}

            {Boolean(note.is_pinned) && (
                <div className="pinned-badge">
                    <FaThumbtack />
                    <span>Pinned</span>
                </div>
            )}


            {/* HEADER */}

            <div className="note-card-header">

                <div className="note-title-section">

                    <h2>
                        {note.title}
                    </h2>

                    {note.subject_name && (
                        <span className="note-subject">
                            {note.subject_name}
                        </span>
                    )}

                </div>


                <button
                    type="button"
                    className={`pin-btn ${note.is_pinned ? "active" : ""}`}
                    onClick={() => onTogglePin(note)}
                    title={
                        note.is_pinned
                            ? "Unpin note"
                            : "Pin note"
                    }
                >

                    <FaThumbtack />

                </button>

            </div>


            {/* CONTENT */}

            <div className="note-content">

                <p>
                    {note.content || "No content available."}
                </p>

            </div>


            {/* FOOTER */}

            <div className="note-card-footer">

                <div className="note-date">

                    <FaRegClock />

                    <span>
                        {formattedDate}
                    </span>

                </div>


                <div className="note-actions">

                    {/* EDIT */}

                    <button
                        type="button"
                        className="note-action edit-note-btn"
                        onClick={() => onEdit(note)}
                    >

                        <FaEdit />

                        <span>
                            Edit
                        </span>

                    </button>


                    {/* DELETE */}

                    <button
                        type="button"
                        className="note-action delete-note-btn"
                        onClick={() => onDelete(note)}
                    >

                        <FaTrash />

                        <span>
                            Delete
                        </span>

                    </button>

                </div>

            </div>

        </div>

    );
}

export default NoteCard;