import { useEffect, useMemo, useState } from "react";
import {
    FaFolder,
    FaPlus,
    FaSearch,
    FaEdit,
    FaTrash,
    FaFolderOpen,
    FaCalendarAlt
} from "react-icons/fa";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import SubjectModal from "../../components/SubjectModal/SubjectModal";

import {
    getAllSubjects,
    deleteSubject
} from "../../services/subjectService";

import "./Subjects.css";

function Subjects() {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [subjectToEdit, setSubjectToEdit] = useState(null);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    // =======================================
    // FETCH SUBJECTS
    // =======================================
    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await getAllSubjects();
            setSubjects(data || []);
        } catch (error) {
            console.error("Failed to fetch subjects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    // =======================================
    // FILTER SUBJECTS
    // =======================================
    const filteredSubjects = useMemo(() => {
        if (!searchTerm.trim()) return subjects;
        const q = searchTerm.toLowerCase();
        return subjects.filter(
            (s) =>
                s.subject_name?.toLowerCase().includes(q) ||
                s.description?.toLowerCase().includes(q)
        );
    }, [subjects, searchTerm]);

    // =======================================
    // CREATE / EDIT HANDLERS
    // =======================================
    const handleOpenCreate = () => {
        setSubjectToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (subject) => {
        setSubjectToEdit(subject);
        setIsModalOpen(true);
    };

    const handleSubjectSaved = () => {
        fetchSubjects();
    };

    // =======================================
    // DELETE HANDLER
    // =======================================
    const handleDelete = async (subjectId, subjectName) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${subjectName}"? Any tasks, notes, or sessions linked to this subject will also be removed.`
        );
        if (!confirmed) return;

        try {
            setActionLoadingId(subjectId);
            await deleteSubject(subjectId);
            setSubjects((prev) => prev.filter((s) => s.subject_id !== subjectId));
        } catch (error) {
            console.error("Delete subject error:", error);
            alert(
                error.response?.data?.message ||
                "Failed to delete subject. Please try again."
            );
        } finally {
            setActionLoadingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "--";
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "--";
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <DashboardLayout>
            <div className="subjects-page">
                {/* PAGE HEADER */}
                <div className="subjects-header">
                    <div>
                        <span className="subjects-label">ACADEMIC MANAGEMENT</span>
                        <h1>Subjects & Courses</h1>
                        <p>
                            Organize your coursework, curriculum modules, and focus topics across SynapseOS.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="subjects-add-btn"
                        onClick={handleOpenCreate}
                    >
                        <FaPlus />
                        <span>New Subject</span>
                    </button>
                </div>

                {/* SEARCH & FILTERS BAR */}
                <div className="subjects-toolbar">
                    <div className="subjects-search-box">
                        <FaSearch />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search subjects by name or description..."
                        />
                    </div>

                    <div className="subjects-stats-pill">
                        Total Subjects: <strong>{subjects.length}</strong>
                    </div>
                </div>

                {/* LOADING STATE */}
                {loading && (
                    <div className="subjects-loading">
                        <div className="subjects-spinner" />
                        <p>Loading your subjects...</p>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && subjects.length === 0 && (
                    <div className="subjects-empty-state">
                        <div className="subjects-empty-icon">
                            <FaFolderOpen />
                        </div>
                        <h2>No subjects created yet</h2>
                        <p>
                            Subjects help you categorize notes, tasks, study sessions, and track learning progress.
                            Create your first subject to get started.
                        </p>
                        <button
                            type="button"
                            className="subjects-empty-btn"
                            onClick={handleOpenCreate}
                        >
                            <FaPlus />
                            <span>Create Your First Subject</span>
                        </button>
                    </div>
                )}

                {/* NO SEARCH RESULTS */}
                {!loading && subjects.length > 0 && filteredSubjects.length === 0 && (
                    <div className="subjects-no-results">
                        <p>No subjects found matching &quot;{searchTerm}&quot;</p>
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* SUBJECTS GRID */}
                {!loading && filteredSubjects.length > 0 && (
                    <div className="subjects-grid">
                        {filteredSubjects.map((subject) => {
                            const accentColor = subject.color || "#3b82f6";
                            return (
                                <div
                                    key={subject.subject_id}
                                    className="subject-card"
                                    style={{
                                        "--subject-accent": accentColor
                                    }}
                                >
                                    <div className="subject-card-top">
                                        <div
                                            className="subject-card-icon"
                                            style={{
                                                backgroundColor: `${accentColor}18`,
                                                color: accentColor,
                                                borderColor: `${accentColor}40`
                                            }}
                                        >
                                            <FaFolder />
                                        </div>

                                        <div className="subject-card-actions">
                                            <button
                                                type="button"
                                                className="subject-action-btn edit-btn"
                                                onClick={() => handleOpenEdit(subject)}
                                                title="Edit subject"
                                                disabled={actionLoadingId === subject.subject_id}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                type="button"
                                                className="subject-action-btn delete-btn"
                                                onClick={() =>
                                                    handleDelete(
                                                        subject.subject_id,
                                                        subject.subject_name
                                                    )
                                                }
                                                title="Delete subject"
                                                disabled={actionLoadingId === subject.subject_id}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="subject-card-content">
                                        <h3 className="subject-name">
                                            {subject.subject_name}
                                        </h3>

                                        <p className="subject-description">
                                            {subject.description || "No description provided."}
                                        </p>
                                    </div>

                                    <div className="subject-card-footer">
                                        <div className="subject-color-tag">
                                            <span
                                                className="color-dot"
                                                style={{ backgroundColor: accentColor }}
                                            />
                                            <span className="color-label">Subject</span>
                                        </div>

                                        <div className="subject-date">
                                            <FaCalendarAlt />
                                            <span>{formatDate(subject.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* CREATE / EDIT MODAL */}
                <SubjectModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubjectCreated={handleSubjectSaved}
                    onSubjectUpdated={handleSubjectSaved}
                    subjectToEdit={subjectToEdit}
                />
            </div>
        </DashboardLayout>
    );
}

export default Subjects;
