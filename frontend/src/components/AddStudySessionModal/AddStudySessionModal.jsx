import { useEffect, useState } from "react";

import { FaTimes, FaSave } from "react-icons/fa";

import {
    createStudySession
} from "../../services/studySessionService";

import {
    getAllSubjects
} from "../../services/subjectService";

import "./AddStudySessionModal.css";


function AddStudySessionModal({
    isOpen,
    onClose,
    onSessionCreated
}) {

    // =========================
    // FORM STATE
    // =========================

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

    const [loadingSubjects, setLoadingSubjects] =
        useState(false);

    const [loading, setLoading] =
        useState(false);


    // =========================
    // LOAD SUBJECTS
    // =========================

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        const fetchSubjects = async () => {

            try {

                setLoadingSubjects(true);

                const data =
                    await getAllSubjects();

                setSubjects(data || []);

            } catch (error) {

                console.error(
                    "Failed to fetch subjects:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Failed to load subjects."
                );

            } finally {

                setLoadingSubjects(false);

            }

        };

        fetchSubjects();

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
    // CLOSE MODAL
    // =========================

    const handleClose = () => {

        if (loading) {
            return;
        }

        onClose();

    };


    // =========================
    // CALCULATE DURATION
    // =========================

    const calculateDuration = () => {

        const start =
            new Date(startTime);

        const end =
            new Date(endTime);

        const difference =
            end.getTime() - start.getTime();

        return Math.floor(
            difference / (1000 * 60)
        );

    };


    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // -------------------------
        // SUBJECT VALIDATION
        // -------------------------

        if (!subjectId) {

            alert(
                "Please select a subject."
            );

            return;

        }


        // -------------------------
        // TOPIC VALIDATION
        // -------------------------

        if (!topic.trim()) {

            alert(
                "Please enter a topic."
            );

            return;

        }


        // -------------------------
        // TIME VALIDATION
        // -------------------------

        if (!startTime || !endTime) {

            alert(
                "Please enter both start and end time."
            );

            return;

        }


        if (endTime <= startTime) {

            alert(
                "End time must be after start time."
            );

            return;

        }


        // -------------------------
        // DURATION
        // -------------------------

        const durationMinutes =
            calculateDuration();


        if (durationMinutes <= 0) {

            alert(
                "Study session duration must be greater than 0 minutes."
            );

            return;

        }


        try {

            setLoading(true);


            // =========================
            // CONVERT DATETIME
            // =========================

            const formattedStartTime =
                startTime.replace("T", " ") + ":00";

            const formattedEndTime =
                endTime.replace("T", " ") + ":00";


            // =========================
            // SESSION DATA
            // =========================

            const sessionData = {

                subject_id:
                    Number(subjectId),

                topic:
                    topic.trim(),

                start_time:
                    formattedStartTime,

                end_time:
                    formattedEndTime,

                duration_minutes:
                    durationMinutes,

                session_notes:
                    sessionNotes.trim() || null

            };


            console.log(
                "Creating study session:",
                sessionData
            );


            // =========================
            // CREATE SESSION
            // =========================

            await createStudySession(
                sessionData
            );


            // =========================
            // REFRESH SESSIONS
            // =========================

            if (onSessionCreated) {

                await onSessionCreated();

            }


            // =========================
            // CLOSE MODAL
            // =========================

            onClose();

        } catch (error) {

            console.error(
                "Create study session error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
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


    // =========================
    // RENDER
    // =========================

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

                <div
                    className="study-session-modal-header"
                >

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

                    {/* =========================
                        SUBJECT
                    ========================= */}

                    <div
                        className="study-session-form-group"
                    >

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
                                loadingSubjects
                            }
                        >

                            <option value="">
                                Select a subject
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


                    {/* =========================
                        TOPIC
                    ========================= */}

                    <div
                        className="study-session-form-group"
                    >

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
                            placeholder="e.g. DSA - Heap"
                            disabled={loading}
                        />

                    </div>


                    {/* =========================
                        NOTES
                    ========================= */}

                    <div
                        className="study-session-form-group"
                    >

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


                    {/* =========================
                        TIME
                    ========================= */}

                    <div
                        className="study-session-time-grid"
                    >

                        {/* START */}

                        <div
                            className="study-session-form-group"
                        >

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


                        {/* END */}

                        <div
                            className="study-session-form-group"
                        >

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


                    {/* =========================
                        ACTIONS
                    ========================= */}

                    <div
                        className="study-session-modal-actions"
                    >

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
                            disabled={
                                loading ||
                                loadingSubjects
                            }
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