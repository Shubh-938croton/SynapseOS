import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
    FiCompass,
    FiBookOpen,
    FiPlus,
    FiCheckCircle,
    FiCircle,
    FiClock,
    FiChevronDown,
    FiChevronRight,
    FiTrash2,
    FiEdit2,
    FiUploadCloud,
    FiCheckSquare,
    FiAward,
    FiAlertCircle,
    FiLayers,
    FiArrowRight,
    FiCheck
} from "react-icons/fi";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import { getAllSubjects } from "../../services/subjectService";
import {
    getSubjectSyllabus,
    createUnit,
    updateUnit,
    deleteUnit,
    createTopic,
    updateTopic,
    updateTopicStatus,
    deleteTopic,
    parseRawSyllabus,
    bulkImportSyllabus
} from "../../services/syllabusService";
import { createTask } from "../../services/taskService";
import "./Syllabus.css";

function Syllabus() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    // Subject states
    const [subjects, setSubjects] = useState([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [loadingSubjects, setLoadingSubjects] = useState(true);

    // Syllabus states
    const [syllabusData, setSyllabusData] = useState(null);
    const [loadingSyllabus, setLoadingSyllabus] = useState(false);
    const [collapsedUnits, setCollapsedUnits] = useState({});

    // Modals
    const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
    const [unitToEdit, setUnitToEdit] = useState(null);
    const [unitTitle, setUnitTitle] = useState("");
    const [unitDescription, setUnitDescription] = useState("");

    const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
    const [topicToEdit, setTopicToEdit] = useState(null);
    const [targetUnitId, setTargetUnitId] = useState(null);
    const [topicTitle, setTopicTitle] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [topicMinutes, setTopicMinutes] = useState(45);
    const [topicDifficulty, setTopicDifficulty] = useState("medium");

    // Smart Importer Modal
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [rawText, setRawText] = useState("");
    const [parsedModules, setParsedModules] = useState([]);
    const [isParsing, setIsParsing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    // Notification toast / inline message
    const [toastMessage, setToastMessage] = useState(null);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    // Load all subjects on mount
    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setLoadingSubjects(true);
                const data = await getAllSubjects();
                const list = data || [];
                setSubjects(list);

                const querySubId = searchParams.get("subject_id");
                if (querySubId && list.some((s) => s.subject_id === Number(querySubId))) {
                    setSelectedSubjectId(Number(querySubId));
                } else if (list.length > 0) {
                    setSelectedSubjectId(list[0].subject_id);
                }
            } catch (err) {
                console.error("Failed to load subjects:", err);
            } finally {
                setLoadingSubjects(false);
            }
        };

        fetchSubjects();
    }, [searchParams]);

    // Load syllabus when active subject changes
    const fetchSyllabus = async (subjectId) => {
        if (!subjectId) return;
        try {
            setLoadingSyllabus(true);
            const data = await getSubjectSyllabus(subjectId);
            setSyllabusData(data);
        } catch (err) {
            console.error("Failed to fetch syllabus:", err);
            setSyllabusData(null);
        } finally {
            setLoadingSyllabus(false);
        }
    };

    useEffect(() => {
        if (selectedSubjectId) {
            fetchSyllabus(selectedSubjectId);
        }
    }, [selectedSubjectId]);

    const activeSubject = useMemo(() => {
        return subjects.find((s) => s.subject_id === selectedSubjectId) || null;
    }, [subjects, selectedSubjectId]);

    const handleSelectSubject = (id) => {
        setSelectedSubjectId(id);
        setSearchParams({ subject_id: id });
    };

    // Toggle unit accordion
    const toggleUnitCollapse = (unitId) => {
        setCollapsedUnits((prev) => ({
            ...prev,
            [unitId]: !prev[unitId]
        }));
    };

    // Cycle Topic Status: not_started -> in_progress -> completed -> not_started
    const handleCycleStatus = async (topic) => {
        let nextStatus = "in_progress";
        if (topic.status === "in_progress") nextStatus = "completed";
        else if (topic.status === "completed") nextStatus = "not_started";

        try {
            await updateTopicStatus(topic.topic_id, nextStatus);
            fetchSyllabus(selectedSubjectId);
            if (nextStatus === "completed") {
                showToast(`🎉 Conquered "${topic.title}"! Excellent progress.`);
            }
        } catch (err) {
            console.error("Failed to update topic status:", err);
            showToast("Failed to update status. Please try again.");
        }
    };

    // Convert topic to daily task
    const handleConvertToTask = async (topic) => {
        try {
            await createTask({
                subject_id: selectedSubjectId,
                title: `Study: ${topic.title}`,
                description: `Syllabus Milestone for ${activeSubject?.subject_name || "coursework"} (${topic.estimated_minutes || 45} mins target).`,
                priority: topic.difficulty === "hard" ? "High" : topic.difficulty === "easy" ? "Low" : "Medium",
                due_date: new Date().toISOString().split("T")[0]
            });
            showToast(`✅ Created Task: "Study: ${topic.title}" in your Tasks list!`);
        } catch (err) {
            console.error("Failed to create task from topic:", err);
            showToast("Could not create task. Check if task service is online.");
        }
    };

    // ==========================================
    // UNIT CRUD HANDLERS
    // ==========================================
    const openAddUnitModal = () => {
        setUnitToEdit(null);
        setUnitTitle("");
        setUnitDescription("");
        setIsUnitModalOpen(true);
    };

    const openEditUnitModal = (unit) => {
        setUnitToEdit(unit);
        setUnitTitle(unit.title);
        setUnitDescription(unit.description || "");
        setIsUnitModalOpen(true);
    };

    const handleSaveUnit = async (e) => {
        e.preventDefault();
        if (!unitTitle.trim()) return;

        try {
            if (unitToEdit) {
                await updateUnit(unitToEdit.unit_id, {
                    title: unitTitle.trim(),
                    description: unitDescription.trim(),
                    order_index: unitToEdit.order_index
                });
                showToast("Unit updated successfully!");
            } else {
                await createUnit({
                    subject_id: selectedSubjectId,
                    title: unitTitle.trim(),
                    description: unitDescription.trim(),
                    order_index: syllabusData?.units?.length || 0
                });
                showToast("New unit added to your curriculum!");
            }
            setIsUnitModalOpen(false);
            fetchSyllabus(selectedSubjectId);
        } catch (err) {
            console.error("Error saving unit:", err);
            showToast("Failed to save unit.");
        }
    };

    const handleDeleteUnit = async (unitId, title) => {
        if (!window.confirm(`Delete "${title}" and all its topics?`)) return;
        try {
            await deleteUnit(unitId);
            fetchSyllabus(selectedSubjectId);
            showToast("Unit removed.");
        } catch (err) {
            console.error("Error deleting unit:", err);
            showToast("Failed to delete unit.");
        }
    };

    // ==========================================
    // TOPIC CRUD HANDLERS
    // ==========================================
    const openAddTopicModal = (unitId) => {
        setTopicToEdit(null);
        setTargetUnitId(unitId);
        setTopicTitle("");
        setTopicDescription("");
        setTopicMinutes(45);
        setTopicDifficulty("medium");
        setIsTopicModalOpen(true);
    };

    const openEditTopicModal = (topic) => {
        setTopicToEdit(topic);
        setTargetUnitId(topic.unit_id);
        setTopicTitle(topic.title);
        setTopicDescription(topic.description || "");
        setTopicMinutes(topic.estimated_minutes || 45);
        setTopicDifficulty(topic.difficulty || "medium");
        setIsTopicModalOpen(true);
    };

    const handleSaveTopic = async (e) => {
        e.preventDefault();
        if (!topicTitle.trim()) return;

        try {
            if (topicToEdit) {
                await updateTopic(topicToEdit.topic_id, {
                    title: topicTitle.trim(),
                    description: topicDescription.trim(),
                    estimated_minutes: Number(topicMinutes) || 45,
                    difficulty: topicDifficulty
                });
                showToast("Topic updated!");
            } else {
                await createTopic({
                    unit_id: targetUnitId,
                    subject_id: selectedSubjectId,
                    title: topicTitle.trim(),
                    description: topicDescription.trim(),
                    estimated_minutes: Number(topicMinutes) || 45,
                    difficulty: topicDifficulty
                });
                showToast("Milestone topic added!");
            }
            setIsTopicModalOpen(false);
            fetchSyllabus(selectedSubjectId);
        } catch (err) {
            console.error("Error saving topic:", err);
            showToast("Failed to save topic.");
        }
    };

    const handleDeleteTopic = async (topicId, title) => {
        if (!window.confirm(`Remove topic "${title}"?`)) return;
        try {
            await deleteTopic(topicId);
            fetchSyllabus(selectedSubjectId);
            showToast("Topic removed.");
        } catch (err) {
            console.error("Error deleting topic:", err);
            showToast("Failed to delete topic.");
        }
    };

    // ==========================================
    // SMART SYLLABUS PARSE & IMPORT
    // ==========================================
    const handleParseText = async () => {
        if (!rawText.trim()) return;
        try {
            setIsParsing(true);
            const res = await parseRawSyllabus(rawText);
            setParsedModules(res.modules || []);
        } catch (err) {
            console.error("Error parsing syllabus:", err);
            showToast("Could not parse syllabus text.");
        } finally {
            setIsParsing(false);
        }
    };

    const handleConfirmImport = async () => {
        if (!parsedModules || parsedModules.length === 0) return;
        try {
            setIsImporting(true);
            await bulkImportSyllabus(selectedSubjectId, parsedModules);
            setIsImportModalOpen(false);
            setRawText("");
            setParsedModules([]);
            fetchSyllabus(selectedSubjectId);
            showToast("🎉 Syllabus imported into clean, bite-sized units!");
        } catch (err) {
            console.error("Error importing parsed syllabus:", err);
            showToast("Import failed. Please try again.");
        } finally {
            setIsImporting(false);
        }
    };

    // Friendly Motivation generator
    const getMotivation = (progress) => {
        if (progress === 0) return "Every mastery starts with step one. Pick any topic below to dive in! 🌱";
        if (progress < 30) return "Great start! You're establishing solid, steady momentum 💫";
        if (progress < 70) return "You're over halfway through this course! Look how much ground you've conquered 🚀";
        if (progress < 100) return "The finish line is right ahead! Keep the calm focus going 💪";
        return "Incredible work! You have conquered the entire syllabus for this course 🎉";
    };

    const summary = syllabusData?.summary || {
        total_units: 0,
        total_topics: 0,
        completed_topics: 0,
        in_progress_topics: 0,
        not_started_topics: 0,
        progress_percentage: 0,
        total_estimated_minutes: 0,
        remaining_estimated_minutes: 0
    };

    return (
        <DashboardLayout>
            <div className="syllabus-page">
                {/* INLINE TOAST ALERT */}
                {toastMessage && (
                    <div className="syllabus-toast-banner">
                        <span>{toastMessage}</span>
                    </div>
                )}

                {/* PAGE HEADER */}
                <div className="syllabus-header">
                    <div>
                        <span className="syllabus-pill-label">
                            <FiCompass />
                            GENTLE CURRICULUM MASTERY
                        </span>
                        <h1>Syllabus &amp; Roadmaps</h1>
                        <p>
                            Break threatening course outlines into bite-sized, manageable milestones. Learn without cognitive overwhelm.
                        </p>
                    </div>

                    {selectedSubjectId && (
                        <div className="syllabus-header-actions">
                            <button
                                type="button"
                                className="syllabus-secondary-btn"
                                onClick={() => setIsImportModalOpen(true)}
                                title="Paste course outline to auto-format"
                            >
                                <FiUploadCloud />
                                <span>Paste Syllabus</span>
                            </button>

                            <button
                                type="button"
                                className="syllabus-primary-btn"
                                onClick={openAddUnitModal}
                            >
                                <FiPlus />
                                <span>Add Unit</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* SUBJECT SELECTOR TABS */}
                {loadingSubjects ? (
                    <div className="syllabus-loading-subjects">
                        <div className="syllabus-spinner-sm" />
                        <span>Loading your enrolled subjects...</span>
                    </div>
                ) : subjects.length === 0 ? (
                    <div className="syllabus-zero-subjects-card">
                        <FiFolder className="zero-icon" />
                        <h3>No subjects created yet</h3>
                        <p>Create a subject first to organize notes, tasks, and syllabus roadmaps.</p>
                        <button
                            type="button"
                            className="syllabus-primary-btn"
                            onClick={() => navigate("/subjects")}
                        >
                            <FiPlus />
                            <span>Create Your First Subject</span>
                        </button>
                    </div>
                ) : (
                    <div className="syllabus-subject-tabs">
                        {subjects.map((sub) => {
                            const isSelected = sub.subject_id === selectedSubjectId;
                            const color = sub.color || "#3b82f6";
                            return (
                                <button
                                    key={sub.subject_id}
                                    type="button"
                                    className={`syllabus-subject-pill ${isSelected ? "active" : ""}`}
                                    onClick={() => handleSelectSubject(sub.subject_id)}
                                    style={
                                        isSelected
                                            ? { borderColor: color, background: `${color}18`, color: "#fff" }
                                            : {}
                                    }
                                >
                                    <span
                                        className="subject-pill-dot"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="subject-pill-name">{sub.subject_name}</span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ACTIVE SUBJECT VIEW */}
                {selectedSubjectId && !loadingSubjects && (
                    <div className="syllabus-body">
                        {/* ENCOURAGING PROGRESS BANNER */}
                        <div className="syllabus-momentum-banner">
                            <div className="momentum-left">
                                <div className="momentum-badge">
                                    <FiAward />
                                    <span>Curriculum Progress</span>
                                </div>
                                <h2 className="momentum-quote">
                                    {getMotivation(summary.progress_percentage)}
                                </h2>

                                <div className="momentum-bar-wrapper">
                                    <div className="momentum-bar-bg">
                                        <div
                                            className="momentum-bar-fill"
                                            style={{
                                                width: `${summary.progress_percentage}%`,
                                                backgroundColor: activeSubject?.color || "#3b82f6"
                                            }}
                                        />
                                    </div>
                                    <span className="momentum-percentage">
                                        {summary.progress_percentage}%
                                    </span>
                                </div>
                            </div>

                            <div className="momentum-stats-row">
                                <div className="momentum-stat-box">
                                    <span className="stat-label">Conquered</span>
                                    <strong className="stat-value text-green">
                                        {summary.completed_topics} / {summary.total_topics}
                                    </strong>
                                </div>
                                <div className="momentum-stat-box">
                                    <span className="stat-label">Exploring</span>
                                    <strong className="stat-value text-amber">
                                        {summary.in_progress_topics}
                                    </strong>
                                </div>
                                <div className="momentum-stat-box">
                                    <span className="stat-label">Remaining Time</span>
                                    <strong className="stat-value">
                                        ~{Math.round(summary.remaining_estimated_minutes / 60 * 10) / 10} hrs
                                    </strong>
                                </div>
                            </div>
                        </div>

                        {/* SYLLABUS CONTENT (UNITS ACCORDION) */}
                        {loadingSyllabus ? (
                            <div className="syllabus-loading-state">
                                <div className="syllabus-spinner-lg" />
                                <p>Assembling your bite-sized curriculum roadmap...</p>
                            </div>
                        ) : syllabusData?.units?.length === 0 ? (
                            <div className="syllabus-empty-units-card">
                                <FiLayers className="empty-units-icon" />
                                <h3>No syllabus outline yet for {activeSubject?.subject_name}</h3>
                                <p>
                                    Don't let college course guides intimidate you. Paste your syllabus or add Unit 1 to get a peaceful, step-by-step roadmap.
                                </p>
                                <div className="empty-units-actions">
                                    <button
                                        type="button"
                                        className="syllabus-secondary-btn"
                                        onClick={() => setIsImportModalOpen(true)}
                                    >
                                        <FiUploadCloud />
                                        <span>Paste Course Outline (Auto-Format)</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="syllabus-primary-btn"
                                        onClick={openAddUnitModal}
                                    >
                                        <FiPlus />
                                        <span>Add Unit Manually</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="syllabus-units-list">
                                {syllabusData?.units?.map((unit, uIdx) => {
                                    const isCollapsed = collapsedUnits[unit.unit_id];
                                    const unitProgress = unit.stats?.progress_percentage || 0;
                                    const isComplete = unit.stats?.total_topics > 0 && unit.stats?.completed_topics === unit.stats?.total_topics;

                                    return (
                                        <div
                                            key={unit.unit_id}
                                            className={`syllabus-unit-card ${isComplete ? "unit-mastered" : ""}`}
                                        >
                                            {/* UNIT HEADER */}
                                            <div
                                                className="unit-card-header"
                                                onClick={() => toggleUnitCollapse(unit.unit_id)}
                                            >
                                                <div className="unit-header-left">
                                                    <button
                                                        type="button"
                                                        className="unit-toggle-icon"
                                                        aria-label="Toggle Unit"
                                                    >
                                                        {isCollapsed ? <FiChevronRight /> : <FiChevronDown />}
                                                    </button>

                                                    <div>
                                                        <div className="unit-number-row">
                                                            <span className="unit-number-badge">
                                                                Module {uIdx + 1}
                                                            </span>
                                                            <span className="unit-topics-count">
                                                                {unit.stats?.completed_topics} / {unit.stats?.total_topics} conquered
                                                            </span>
                                                        </div>
                                                        <h3 className="unit-title">{unit.title}</h3>
                                                        {unit.description && (
                                                            <p className="unit-description">{unit.description}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div
                                                    className="unit-header-right"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="unit-progress-pill">
                                                        <span
                                                            className="unit-progress-bar"
                                                            style={{
                                                                width: `${unitProgress}%`,
                                                                backgroundColor: activeSubject?.color || "#10b981"
                                                            }}
                                                        />
                                                        <span className="unit-progress-text">
                                                            {unitProgress}%
                                                        </span>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="unit-action-btn"
                                                        onClick={() => openAddTopicModal(unit.unit_id)}
                                                        title="Add Topic to this Unit"
                                                    >
                                                        <FiPlus />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="unit-action-btn"
                                                        onClick={() => openEditUnitModal(unit)}
                                                        title="Edit Unit"
                                                    >
                                                        <FiEdit2 />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="unit-action-btn delete-btn"
                                                        onClick={() => handleDeleteUnit(unit.unit_id, unit.title)}
                                                        title="Delete Unit"
                                                    >
                                                        <FiTrash2 />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* UNIT TOPICS ACCORDION BODY */}
                                            {!isCollapsed && (
                                                <div className="unit-topics-body">
                                                    {unit.topics?.length === 0 ? (
                                                        <div className="empty-topics-hint">
                                                            <span>No topics added yet. Add your first manageable checkpoint!</span>
                                                            <button
                                                                type="button"
                                                                className="add-first-topic-btn"
                                                                onClick={() => openAddTopicModal(unit.unit_id)}
                                                            >
                                                                <FiPlus />
                                                                <span>Add Topic</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="topics-checklist">
                                                            {unit.topics?.map((topic) => {
                                                                const isDone = topic.status === "completed";
                                                                const isDoing = topic.status === "in_progress";

                                                                return (
                                                                    <div
                                                                        key={topic.topic_id}
                                                                        className={`topic-item-row ${isDone ? "topic-conquered" : isDoing ? "topic-exploring" : ""}`}
                                                                    >
                                                                        {/* STATUS TOGGLE BUTTON */}
                                                                        <button
                                                                            type="button"
                                                                            className={`topic-status-chip ${topic.status}`}
                                                                            onClick={() => handleCycleStatus(topic)}
                                                                            title="Click to advance status (Up Next -> Exploring -> Conquered)"
                                                                        >
                                                                            {isDone ? (
                                                                                <>
                                                                                    <FiCheckCircle className="chip-icon conquered" />
                                                                                    <span>Conquered</span>
                                                                                </>
                                                                            ) : isDoing ? (
                                                                                <>
                                                                                    <div className="chip-pulse" />
                                                                                    <span>Exploring</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <FiCircle className="chip-icon up-next" />
                                                                                    <span>Up Next</span>
                                                                                </>
                                                                            )}
                                                                        </button>

                                                                        {/* TOPIC INFO */}
                                                                        <div className="topic-text-col">
                                                                            <span className={`topic-title ${isDone ? "title-done" : ""}`}>
                                                                                {topic.title}
                                                                            </span>
                                                                            {topic.description && (
                                                                                <p className="topic-desc">{topic.description}</p>
                                                                            )}
                                                                        </div>

                                                                        {/* TOPIC BADGES */}
                                                                        <div className="topic-meta-row">
                                                                            <span className="topic-time-badge">
                                                                                <FiClock />
                                                                                {topic.estimated_minutes || 45}m
                                                                            </span>

                                                                            <span className={`topic-diff-badge ${topic.difficulty}`}>
                                                                                {topic.difficulty === "easy"
                                                                                    ? "🌱 Quick Win"
                                                                                    : topic.difficulty === "hard"
                                                                                    ? "⚡ Deep Dive"
                                                                                    : "🔷 Core Topic"}
                                                                            </span>
                                                                        </div>

                                                                        {/* TOPIC ACTIONS */}
                                                                        <div className="topic-actions-row">
                                                                            <button
                                                                                type="button"
                                                                                className="topic-task-btn"
                                                                                onClick={() => handleConvertToTask(topic)}
                                                                                title="Convert to Daily Task"
                                                                            >
                                                                                <FiCheckSquare />
                                                                                <span>+ Task</span>
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                className="topic-icon-btn"
                                                                                onClick={() => openEditTopicModal(topic)}
                                                                                title="Edit Topic"
                                                                            >
                                                                                <FiEdit2 />
                                                                            </button>

                                                                            <button
                                                                                type="button"
                                                                                className="topic-icon-btn delete-btn"
                                                                                onClick={() => handleDeleteTopic(topic.topic_id, topic.title)}
                                                                                title="Delete Topic"
                                                                            >
                                                                                <FiTrash2 />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ==========================================
                    MODAL: ADD / EDIT UNIT
                ========================================== */}
                {isUnitModalOpen && (
                    <div className="syllabus-modal-backdrop" onClick={() => setIsUnitModalOpen(false)}>
                        <div className="syllabus-modal-card" onClick={(e) => e.stopPropagation()}>
                            <h3>{unitToEdit ? "Edit Curriculum Unit" : "Add New Unit / Module"}</h3>
                            <p className="modal-subtext">
                                Group topics into high-level chapters (e.g. "Unit 1: Foundations", "Module 2: Concurrency").
                            </p>

                            <form onSubmit={handleSaveUnit}>
                                <div className="form-group">
                                    <label>Unit Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Unit 1: Graph Theory & Shortest Path"
                                        value={unitTitle}
                                        onChange={(e) => setUnitTitle(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description (Optional)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Brief notes on what this unit covers..."
                                        value={unitDescription}
                                        onChange={(e) => setUnitDescription(e.target.value)}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="syllabus-secondary-btn"
                                        onClick={() => setIsUnitModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="syllabus-primary-btn">
                                        {unitToEdit ? "Save Changes" : "Create Unit"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ==========================================
                    MODAL: ADD / EDIT TOPIC
                ========================================== */}
                {isTopicModalOpen && (
                    <div className="syllabus-modal-backdrop" onClick={() => setIsTopicModalOpen(false)}>
                        <div className="syllabus-modal-card" onClick={(e) => e.stopPropagation()}>
                            <h3>{topicToEdit ? "Edit Topic Checkpoint" : "Add Bite-Sized Topic"}</h3>
                            <p className="modal-subtext">
                                Break large lessons into small, achievable milestones (~30 to 60 mins each).
                            </p>

                            <form onSubmit={handleSaveTopic}>
                                <div className="form-group">
                                    <label>Topic Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Dijkstra's Algorithm & Priority Queues"
                                        value={topicTitle}
                                        onChange={(e) => setTopicTitle(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Estimated Focus Time</label>
                                        <select
                                            value={topicMinutes}
                                            onChange={(e) => setTopicMinutes(Number(e.target.value))}
                                        >
                                            <option value={25}>25 min (Single Pomodoro)</option>
                                            <option value={45}>45 min (Standard Session)</option>
                                            <option value={60}>60 min (1 Hour Deep Work)</option>
                                            <option value={90}>90 min (Intensive Block)</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Confidence / Depth</label>
                                        <select
                                            value={topicDifficulty}
                                            onChange={(e) => setTopicDifficulty(e.target.value)}
                                        >
                                            <option value="easy">🌱 Quick Win (Foundational)</option>
                                            <option value="medium">🔷 Core Topic (Important)</option>
                                            <option value="hard">⚡ Deep Dive (Advanced)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Notes / Key Takeaways (Optional)</label>
                                    <textarea
                                        rows={2}
                                        placeholder="Formulas, references, or key page numbers..."
                                        value={topicDescription}
                                        onChange={(e) => setTopicDescription(e.target.value)}
                                    />
                                </div>

                                <div className="modal-actions">
                                    <button
                                        type="button"
                                        className="syllabus-secondary-btn"
                                        onClick={() => setIsTopicModalOpen(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button type="submit" className="syllabus-primary-btn">
                                        {topicToEdit ? "Save Topic" : "Add Checkpoint"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ==========================================
                    MODAL: SMART TEXT IMPORTER
                ========================================== */}
                {isImportModalOpen && (
                    <div className="syllabus-modal-backdrop" onClick={() => setIsImportModalOpen(false)}>
                        <div className="syllabus-modal-card import-modal-wide" onClick={(e) => e.stopPropagation()}>
                            <h3>Paste &amp; Auto-Format Course Outline</h3>
                            <p className="modal-subtext">
                                Paste raw syllabus text, lecture schedules, or chapter tables. We will parse it into non-threatening Units &amp; bite-sized Topics!
                            </p>

                            <div className="import-split-view">
                                <div className="import-input-col">
                                    <label>Raw Syllabus Text</label>
                                    <textarea
                                        rows={10}
                                        placeholder={`Unit 1: Data Structures\n- Arrays and Strings\n- Linked Lists\n- Stacks & Queues\n\nUnit 2: Trees and Graphs\n- Binary Search Trees\n- Graph Traversals (BFS/DFS)`}
                                        value={rawText}
                                        onChange={(e) => setRawText(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="syllabus-secondary-btn parse-btn"
                                        onClick={handleParseText}
                                        disabled={isParsing || !rawText.trim()}
                                    >
                                        {isParsing ? "Analyzing Structure..." : "Preview Parsed Roadmap"}
                                    </button>
                                </div>

                                <div className="import-preview-col">
                                    <label>Roadmap Preview ({parsedModules.length} Modules Detected)</label>
                                    {parsedModules.length === 0 ? (
                                        <div className="preview-empty">
                                            <span>Click "Preview Parsed Roadmap" to view the structured breakdown before saving.</span>
                                        </div>
                                    ) : (
                                        <div className="preview-list">
                                            {parsedModules.map((m, idx) => (
                                                <div key={idx} className="preview-module-card">
                                                    <strong>{m.title}</strong>
                                                    <ul>
                                                        {m.topics?.map((t, tIdx) => (
                                                            <li key={tIdx}>
                                                                <span>{typeof t === "string" ? t : t.title}</span>
                                                                <small>~45m</small>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="syllabus-secondary-btn"
                                    onClick={() => {
                                        setIsImportModalOpen(false);
                                        setParsedModules([]);
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="syllabus-primary-btn"
                                    onClick={handleConfirmImport}
                                    disabled={parsedModules.length === 0 || isImporting}
                                >
                                    {isImporting ? "Importing..." : "Confirm & Populate Syllabus"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

export default Syllabus;
