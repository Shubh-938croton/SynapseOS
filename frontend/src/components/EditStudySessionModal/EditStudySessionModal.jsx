import { useEffect, useState } from "react";

import {
    FaTimes,
    FaSave
} from "react-icons/fa";

import {
    updateStudySession
} from "../../services/studySessionService";

import {
    getAllSubjects
} from "../../services/subjectService";

import "./EditStudySessionModal.css";


function EditStudySessionModal({
    isOpen,
    session,
    onClose,
    onSessionUpdated
}) {

    const [subjectId, setSubjectId] =
        useState("");

    const [topic, setTopic] =
        useState("");

    const [sessionNotes, setSessionNotes] =
        useState("");

    const [startTime, setStartTime] =
        useState("");

    const [endTime, setEndTime] =
        useState("");

    const [subjects, setSubjects] =
        useState([]);

    const [loading, setLoading] =
        useState(false);


    // =========================
    // LOAD SUBJECTS
    // =========================

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const loadSubjects = async () => {

            try {

                const data =
                    await getAllSubjects();

                setSubjects(data || []);

            } catch (error) {

                console.error(
                    "Failed to load subjects:",
                    error
                );

                alert(
                    "Failed to load subjects."
                );

            }

        };

        loadSubjects();

    }, [isOpen]);


    // =========================
    // LOAD SESSION DATA
    // =========================

    useEffect(() => {

        if (!session || !isOpen) {
            return;
        }


        setSubjectId(
            session.subject_id
                ? String(session.subject_id)
                : ""
        );


        setTopic(
            session.topic || ""
        );


        setSessionNotes(
            session.session_notes || ""
        );


        setStartTime(
            formatForInput(
                session.start_time
            )
        );


        setEndTime(
            formatForInput(
                session.end_time
            )
        );


    }, [session, isOpen]);


    // =========================
    // FORMAT FOR INPUT
    // =========================

    const formatForInput = (value) => {

        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                date.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                date.getMinutes()
            ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;

    };


    // =========================
    // FORMAT FOR MYSQL
    // =========================

    const formatForMySQL = (value) => {

        if (!value) {
            return null;
        }

        return value.replace("T", " ") + ":00";

    };


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
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        if (!session) {
            return;
        }


        if (!subjectId) {

            alert(
                "Please select a subject."
            );

            return;

        }


        if (!topic.trim()) {

            alert(
                "Please enter a topic."
            );

            return;

        }


        if (!startTime || !endTime) {

            alert(
                "Please enter both start and end time."
            );

            return;

        }


        const start =
            new Date(startTime);

        const end =
            new Date(endTime);


        if (end <= start) {

            alert(
                "End time must be after start time."
            );

            return;

        }


        try {

            setLoading(true);


            const durationMinutes =
                Math.floor(
                    (end - start) /
                    (1000 * 60)
                );


            const sessionData = {

                subject_id:
                    Number(subjectId),

                topic:
                    topic.trim(),

                start_time:
                    formatForMySQL(
                        startTime
                    ),

                end_time:
                    formatForMySQL(
                        endTime
                    ),

                duration_minutes:
                    durationMinutes,

                session_notes:
                    sessionNotes.trim() ||
                    null

            };


            console.log(
                "Updating study session:",
                session.session_id,
                sessionData
            );


            await updateStudySession(
                session.session_id,
                sessionData
            );


            if (onSessionUpdated) {

                await onSessionUpdated();

            }


            onClose();


        } catch (error) {

            console.error(
                "Update study session error:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to update study session."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // DON'T RENDER
    // =========================

    if (!isOpen || !session) {

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

                {/* HEADER */}

                <div className="study-session-modal-header">

                    <div>

                        <h2>
                            Edit Study Session
                        </h2>

                        <p>
                            Update your study session.
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


                {/* FORM */}

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
                            disabled={loading}
                        >

                            <option value="">
                                Select Subject
                            </option>

                            {subjects.map(
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
                            )}

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
                                ? "Updating..."
                                : "Update Session"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default EditStudySessionModal;