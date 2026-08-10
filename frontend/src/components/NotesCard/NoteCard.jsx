import "./NoteCard.css";

import {
    FaEdit,
    FaTrash,
    FaThumbtack,
    FaClock
} from "react-icons/fa";

function NoteCard({
    note,
    onEdit,
    onDelete,
    onTogglePin
}) {

    return (

        <div className={`note-card ${note.is_pinned ? "pinned" : ""}`}>

            {/* HEADER */}

            <div className="note-card-header">

                <div className="note-title-section">

                    <h2>
                        {note.title}
                    </h2>

                    <span className="note-subject">
                        {note.subject_name}
                    </span>

                </div>


                {/* PIN */}

                <button
                    type="button"
                    className={`pin-btn ${
                        note.is_pinned ? "active" : ""
                    }`}
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
                    {note.content}
                </p>

            </div>


            {/* FOOTER */}

            <div className="note-card-footer">

                <span className="note-date">

                    <FaClock />

                    {new Date(
                        note.updated_at || note.created_at
                    ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                    })}

                </span>


                <div className="note-actions">

                    <button
                        type="button"
                        className="note-action edit-note-btn"
                        onClick={() => onEdit(note)}
                    >

                        <FaEdit />

                        Edit

                    </button>


                    <button
                        type="button"
                        className="note-action delete-note-btn"
                        onClick={() => onDelete(note)}
                    >

                        <FaTrash />

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

}

export default NoteCard;