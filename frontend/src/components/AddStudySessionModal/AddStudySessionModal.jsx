import { useEffect, useState } from "react";
import { FiX, FiCheck, FiPlus } from "react-icons/fi";

import { createStudySession } from "../../services/studySessionService";
import { getAllSubjects } from "../../services/subjectService";
import SubjectModal from "../SubjectModal/SubjectModal";

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
    const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

    const [loading, setLoading] = useState(false);
    const [subjectsLoading, setSubjectsLoading] = useState(false);


    // =======================================
    // LOAD SUBJECTS
    // =======================================

    const loadSubjects = async (selectedId = null) => {
        try {
            setSubjectsLoading(true);
            const data = await getAllSubjects();
            setSubjects(data || []);
            if (selectedId) {
                setSubjectId(String(selectedId));
            }
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

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        loadSubjects();
    }, [isOpen]);


    // =======================================
    // RESET FORM
    // =======================================

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


    // =======================================
    // CLOSE
    // =======================================

    const handleClose = () => {

        if (loading) {
            return;
        }

        onClose();

    };


    // =======================================
    // FORMAT DATETIME FOR MYSQL
    // =======================================

    const formatForMySQL = (dateTime) => {

        if (!dateTime) {
            return null;
        }

        // datetime-local:
        // 2026-08-15T09:02
        //
        // MySQL:
        // 2026-08-15 09:02:00

        return dateTime.replace("T", " ") + ":00";

    };


    // =======================================
    // SUBMIT
    // =======================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        // =======================================
        // SUBJECT VALIDATION
        // =======================================

        if (!subjectId) {

            alert("Please select a subject.");

            return;

        }


        // =======================================
        // TOPIC VALIDATION
        // =======================================

        if (!topic.trim()) {

            alert("Please enter a topic.");

            return;

        }


        // =======================================
        // TIME VALIDATION
        // =======================================

        if (!startTime || !endTime) {

            alert(
                "Please enter both start and end time."
            );

            return;

        }


        // =======================================
        // DIRECT DATETIME COMPARISON
        // =======================================

        const start = new Date(startTime);
        const end = new Date(endTime);


        if (Number.isNaN(start.getTime()) ||
            Number.isNaN(end.getTime())) {

            alert("Invalid date or time.");

            return;

        }


        // =======================================
        // END MUST BE AFTER START
        // =======================================

        if (end <= start) {

            alert(
                "End time must be after start time."
            );

            return;

        }


        // =======================================
        // MAXIMUM 24 HOURS
        // =======================================

        const durationMinutes =
            Math.floor(
                (end.getTime() - start.getTime())
                / (1000 * 60)
            );


        if (durationMinutes > 1440) {

            alert(
                "A study session cannot be longer than 24 hours."
            );

            return;

        }


        if (durationMinutes <= 0) {

            alert(
                "Study session duration must be greater than 0 minutes."
            );

            return;

        }


        // =======================================
        // CREATE SESSION
        // =======================================

        try {

            setLoading(true);


            const sessionData = {

                subject_id:
                    Number(subjectId),

                topic:
                    topic.trim(),

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


            // =======================================
            // REFRESH PARENT LIST
            // =======================================

            if (onSessionCreated) {

                await onSessionCreated();

            }


            // =======================================
            // CLOSE MODAL
            // =======================================

            onClose();


        } catch (error) {

            console.error(
                "Create study session error:",
                error
            );

            alert(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Failed to create study session."
            );

        } finally {

            setLoading(false);

        }

    };


    // =======================================
    // DON'T RENDER
    // =======================================

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

                {/* =================================
                    HEADER
                ================================= */}

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
                        <FiX />
                    </button>
                </div>

                {/* =================================
                    FORM
                ================================= */}
                <form
                    className="study-session-modal-form"
                    onSubmit={handleSubmit}
                >
                    {/* SUBJECT */}
                    <div className="study-session-form-group">
                        <div className="form-group-label-row">
                            <label>
                                Subject <span className="required-star">*</span>
                            </label>
                            <button
                                type="button"
                                className="add-subject-inline-btn"
                                onClick={() => setIsSubjectModalOpen(true)}
                            >
                                <FiPlus /> New Subject
                            </button>
                        </div>

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
                                {subjectsLoading
                                    ? "Loading subjects..."
                                    : (subjects.length === 0 ? "No subjects available" : "Select Subject")
                                }
                            </option>

                            {!subjectsLoading && subjects.map((subject) => (

                                <option
                                    key={subject.subject_id}
                                    value={subject.subject_id}
                                >

                                    {subject.subject_name}

                                </option>

                            ))}

                        </select>

                        {!subjectsLoading && subjects.length === 0 && (
                            <div className="subject-empty-hint">
                                No subjects found. <button type="button" onClick={() => setIsSubjectModalOpen(true)}>Create one</button> to assign to this session.
                            </div>
                        )}

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


                    {/* =================================
                        ACTIONS
                    ================================= */}

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
                            <FiCheck />
                            {loading
                                ? "Creating..."
                                : "Create Session"
                            }
                        </button>

                    </div>

                </form>

            </div>

            <SubjectModal
                isOpen={isSubjectModalOpen}
                onClose={() => setIsSubjectModalOpen(false)}
                onSubjectCreated={(newSub) => {
                    loadSubjects(newSub.subject_id);
                }}
            />

        </div>

    );

}


export default AddStudySessionModal;