import { useEffect, useState } from "react";
import { FaTimes, FaSave } from "react-icons/fa";

import { createStudySession } from "../../services/studySessionService";
import { getAllSubjects } from "../../services/subjectService";

import "./AddStudySessionModal.css";


function AddStudySessionModal({
    isOpen,
    onClose,
    onSessionCreated
}) {

    const [subjectId, setSubjectId] = useState("");
    const [topic, setTopic] = useState("");
    const [sessionNotes, setSessionNotes] = useState("");

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(false);
    const [subjectsLoading, setSubjectsLoading] = useState(false);


    // =========================
    // LOAD SUBJECTS
    // =========================

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const loadSubjects = async () => {

            try {

                setSubjectsLoading(true);

                const data = await getAllSubjects();

                setSubjects(data || []);

            } catch (error) {

                console.error(
                    "Failed to load subjects:",
                    error
                );

                alert("Failed to load subjects.");

            } finally {

                setSubjectsLoading(false);

            }

        };

        loadSubjects();

    }, [isOpen]);


    // =========================
    // RESET FORM
    // =========================

    useEffect(() => {

        if (isOpen) {

            setSubjectId("");
            setTopic("");
            setSessionNotes("");
            setStartTime("");
            setEndTime("");
            setLoading(false);

        }

    }, [isOpen]);


    // =========================
    // CLOSE
    // =========================

    const handleClose = () => {

        if (loading) {
            return;
        }

        onClose();

    };


    // =========================
    // FORMAT DATETIME
    // =========================

    const formatForMySQL = (dateTime) => {

        if (!dateTime) {
            return null;
        }

        return dateTime.replace("T", " ") + ":00";

    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // Subject validation

        if (!subjectId) {

            alert("Please select a subject.");

            return;

        }


        // Topic validation

        if (!topic.trim()) {

            alert("Please enter a topic.");

            return;

        }


        // Time validation

        if (!startTime || !endTime) {

            alert(
                "Please enter both start and end time."
            );

            return;

        }


        // Date comparison

        const start = new Date(startTime);
        const end = new Date(endTime);


        if (end <= start) {

            alert(
                "End time must be after start time."
            );

            return;

        }


        try {

            setLoading(true);


            const sessionData = {

                subject_id: Number(subjectId),

                topic: topic.trim(),

                start_time:
                    formatForMySQL(startTime),

                end_time:
                    formatForMySQL(endTime),

                session_notes:
                    sessionNotes.trim() || null

            };


            console.log(
                "Creating study session:",
                sessionData
            );


            await createStudySession(
                sessionData
            );


            if (onSessionCreated) {

                await onSessionCreated();

            }


            onClose();


        } catch (error) {

            console.error(
                "Create study session error:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to create study session."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DON'T RENDER
    // =========================

    if (!isOpen) {

        return null;

    }


    return (

        <div
            className="study-session-modal-overlay"
            onClick={handleClose}
        >

            <div
                className="study-session-modal"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* =========================
                    HEADER
                ========================= */}

                <div className="study-session-modal-header">

                    <div>

                        <h2>
                            Add Study Session
                        </h2>

                        <p>
                            Record a new study session.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="study-session-modal-close"
                        onClick={handleClose}
                        disabled={loading}
                    >

                        <FaTimes />

                    </button>

                </div>


                {/* =========================
                    FORM
                ========================= */}

                <form
                    className="study-session-modal-form"
                    onSubmit={handleSubmit}
                >

                    {/* SUBJECT */}

                    <div className="study-session-form-group">

                        <label>
                            Subject
                        </label>

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
                                Select Subject
                            </option>

                            {subjects.map((subject) => (

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

                            ))}

                        </select>

                    </div>


                    {/* TOPIC */}

                    <div className="study-session-form-group">

                        <label>
                            Topic
                        </label>

                        <input
                            type="text"
                            value={topic}
                            onChange={(e) =>
                                setTopic(
                                    e.target.value
                                )
                            }
                            placeholder="e.g. DSA Practice"
                            disabled={loading}
                        />

                    </div>


                    {/* NOTES */}

                    <div className="study-session-form-group">

                        <label>
                            Session Notes
                        </label>

                        <textarea
                            value={sessionNotes}
                            onChange={(e) =>
                                setSessionNotes(
                                    e.target.value
                                )
                            }
                            placeholder="What did you study?"
                            rows="4"
                            disabled={loading}
                        />

                    </div>


                    {/* TIME */}

                    <div className="study-session-time-grid">

                        <div className="study-session-form-group">

                            <label>
                                Start Time
                            </label>

                            <input
                                type="datetime-local"
                                value={startTime}
                                onChange={(e) =>
                                    setStartTime(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>


                        <div className="study-session-form-group">

                            <label>
                                End Time
                            </label>

                            <input
                                type="datetime-local"
                                value={endTime}
                                onChange={(e) =>
                                    setEndTime(
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                            />

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div className="study-session-modal-actions">

                        <button
                            type="button"
                            className="study-session-cancel-btn"
                            onClick={handleClose}
                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="study-session-save-btn"
                            disabled={loading}
                        >

                            <FaSave />

                            {loading
                                ? "Creating..."
                                : "Create Session"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default AddStudySessionModal;