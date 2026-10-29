import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import {
    getAIStatus,
    getDailyBrief,
    approveActionProposal,
    getPersonalizedInsights,
    getDailyPlan,
    getTaskBreakdown,
    getWeakAreas,
    getWeeklyReview,
    parseNaturalLanguageTask
} from "../../services/aiService";
import { createTask } from "../../services/taskService";
import { getAllSubjects } from "../../services/subjectService";
import {
    FiCpu,
    FiZap,
    FiCalendar,
    FiList,
    FiAlertCircle,
    FiTrendingUp,
    FiCheckCircle,
    FiPlus,
    FiClock,
    FiCheck,
    FiX,
    FiRefreshCw,
    FiLayers,
    FiSend,
    FiCheckSquare
} from "react-icons/fi";
import "./AIHub.css";

function AIHub() {
    const [activeTab, setActiveTab] = useState("daily-brief");
    const [aiStatus, setAiStatus] = useState({ enabled: true, provider: "gemini", model: "gemini-2.5-flash" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Data states for each tab
    const [dailyBriefData, setDailyBriefData] = useState(null);
    const [insightsData, setInsightsData] = useState(null);
    const [plannerData, setPlannerData] = useState(null);
    const [taskBreakdownData, setTaskBreakdownData] = useState(null);
    const [weakAreasData, setWeakAreasData] = useState(null);
    const [weeklyReviewData, setWeeklyReviewData] = useState(null);
    const [parsedTaskData, setParsedTaskData] = useState(null);

    // Form inputs
    const [breakdownTitle, setBreakdownTitle] = useState("");
    const [breakdownSubject, setBreakdownSubject] = useState("");
    const [naturalPrompt, setNaturalPrompt] = useState("");
    const [subjects, setSubjects] = useState([]);
    const [createdSubtaskIndices, setCreatedSubtaskIndices] = useState(new Set());
    const [executingProposalId, setExecutingProposalId] = useState(null);

    useEffect(() => {
        const fetchStatusAndSubjects = async () => {
            try {
                const [statusRes, subjectsRes] = await Promise.all([
                    getAIStatus().catch(() => ({ status: { enabled: true, provider: "gemini", model: "gemini-2.5-flash" } })),
                    getAllSubjects().catch(() => [])
                ]);
                if (statusRes?.status) setAiStatus(statusRes.status);
                setSubjects(subjectsRes || []);
            } catch (err) {
                console.warn("AI Hub initial load error:", err);
            }
        };
        fetchStatusAndSubjects();
        loadDailyBrief();
    }, []);

    const loadDailyBrief = async (forceRefresh = false) => {
        setLoading(true);
        setError("");
        try {
            const res = await getDailyBrief(null, forceRefresh);
            setDailyBriefData(res);
        } catch (err) {
            setError(err.message || "Failed to load daily brief");
        } finally {
            setLoading(false);
        }
    };

    const loadInsights = async (forceRefresh = false) => {
        setLoading(true);
        setError("");
        try {
            const res = await getPersonalizedInsights("7d", forceRefresh);
            setInsightsData(res);
        } catch (err) {
            setError(err.message || "Failed to load insights");
        } finally {
            setLoading(false);
        }
    };

    const loadPlanner = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getDailyPlan();
            setPlannerData(res);
        } catch (err) {
            setError(err.message || "Failed to generate daily plan");
        } finally {
            setLoading(false);
        }
    };

    const handleRunBreakdown = async (e) => {
        if (e) e.preventDefault();
        if (!breakdownTitle.trim()) return;
        setLoading(true);
        setError("");
        setCreatedSubtaskIndices(new Set());
        try {
            const res = await getTaskBreakdown(breakdownTitle.trim(), "", breakdownSubject || "General");
            setTaskBreakdownData(res);
        } catch (err) {
            setError(err.message || "Failed to break down task");
        } finally {
            setLoading(false);
        }
    };

    const loadWeakAreas = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getWeakAreas();
            setWeakAreasData(res);
        } catch (err) {
            setError(err.message || "Failed to analyze weak areas");
        } finally {
            setLoading(false);
        }
    };

    const loadWeeklyReview = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await getWeeklyReview();
            setWeeklyReviewData(res);
        } catch (err) {
            setError(err.message || "Failed to generate weekly review");
        } finally {
            setLoading(false);
        }
    };

    const handleParseTask = async (e) => {
        if (e) e.preventDefault();
        if (!naturalPrompt.trim()) return;
        setLoading(true);
        setError("");
        try {
            const res = await parseNaturalLanguageTask(naturalPrompt.trim());
            setParsedTaskData(res.proposal);
        } catch (err) {
            setError(err.message || "Failed to parse natural language task");
        } finally {
            setLoading(false);
        }
    };

    // User Approval for AI Action Proposal
    const handleApproveProposal = async (proposal) => {
        setExecutingProposalId(proposal.id);
        setError("");
        try {
            await approveActionProposal(proposal);
            setSuccessMessage(`Action applied: ${proposal.reason || "Proposal executed successfully"}`);
            // Remove approved proposal from state
            if (dailyBriefData) {
                setDailyBriefData(prev => ({
                    ...prev,
                    actionProposals: (prev.actionProposals || []).filter(p => p.id !== proposal.id)
                }));
            }
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (err) {
            setError(err.message || "Failed to apply proposal");
        } finally {
            setExecutingProposalId(null);
        }
    };

    const handleDismissProposal = (proposalId) => {
        if (dailyBriefData) {
            setDailyBriefData(prev => ({
                ...prev,
                actionProposals: (prev.actionProposals || []).filter(p => p.id !== proposalId)
            }));
        }
    };

    // Explicit User Confirmation to Create a Parsed Task
    const handleConfirmCreateTask = async (taskProposal) => {
        try {
            setLoading(true);
            const targetSubjectId = taskProposal.subjectId || (subjects.length > 0 ? subjects[0].subject_id : 1);
            await createTask({
                title: taskProposal.title,
                description: taskProposal.description || "Created via SynapseOS AI Assistant",
                due_date: taskProposal.dueDate,
                priority: taskProposal.priority || "Medium",
                status: "Pending",
                subject_id: targetSubjectId
            });
            setSuccessMessage(`Task "${taskProposal.title}" created successfully!`);
            setParsedTaskData(null);
            setNaturalPrompt("");
            setTimeout(() => setSuccessMessage(""), 4000);
        } catch (err) {
            setError(err.message || "Failed to create task");
        } finally {
            setLoading(false);
        }
    };

    // Explicit User Confirmation to Create Subtask Step
    const handleCreateSubtaskStep = async (step, index) => {
        try {
            const defaultSubject = subjects.length > 0 ? subjects[0].subject_id : 1;
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowStr = tomorrow.toISOString().split("T")[0];

            await createTask({
                title: step.title,
                description: step.actionableAdvice || `Subtask for ${taskBreakdownData?.originalTask}`,
                due_date: tomorrowStr,
                priority: "Medium",
                status: "Pending",
                subject_id: defaultSubject
            });
            setCreatedSubtaskIndices(prev => new Set(prev).add(index));
            setSuccessMessage(`Subtask "${step.title}" added to Task Board!`);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError(err.message || "Failed to add subtask");
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setError("");
        setSuccessMessage("");
        if (tab === "daily-brief" && !dailyBriefData) loadDailyBrief();
        if (tab === "insights" && !insightsData) loadInsights();
        if (tab === "planner" && !plannerData) loadPlanner();
        if (tab === "weak-areas" && !weakAreasData) loadWeakAreas();
        if (tab === "weekly-review" && !weeklyReviewData) loadWeeklyReview();
    };

    return (
        <DashboardLayout>
            <div className="ai-hub-page">
                {/* HEADER */}
                <header className="ai-hub-header">
                    <div>
                        <div className="ai-eyebrow">
                            <FiCpu /> SynapseOS Intelligence Layer
                        </div>
                        <h1 className="ai-title">AI Assistant &amp; Reasoning Hub</h1>
                        <p className="ai-subtitle">
                            Grounded, personalized assistance powered by your verified analytics and study activity.
                        </p>
                    </div>

                    <div className="ai-status-badge">
                        <span className="status-dot active"></span>
                        <span>{aiStatus.provider ? aiStatus.provider.toUpperCase() : "AI"} ({aiStatus.model || "Active"})</span>
                    </div>
                </header>

                {/* ALERT BANNERS */}
                {error && (
                    <div className="ai-banner error">
                        <FiAlertCircle />
                        <span>{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="ai-banner success">
                        <FiCheckCircle />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* NAVIGATION TABS */}
                <div className="ai-tabs">
                    <button
                        type="button"
                        className={`ai-tab-btn ${activeTab === "daily-brief" ? "active" : ""}`}
                        onClick={() => handleTabChange("daily-brief")}
                    >
                        <FiZap /> Daily Brief &amp; Actions
                    </button>
                    <button
                        type="button"
                        className={`ai-tab-btn ${activeTab === "insights" ? "active" : ""}`}
                        onClick={() => handleTabChange("insights")}
                    >
                        <FiTrendingUp /> Insights
                    </button>
                    <button
                        type="button"
                        className={`ai-tab-btn ${activeTab === "planner" ? "active" : ""}`}
                        onClick={() => handleTabChange("planner")}
                    >
                        <FiCalendar /> Smart Planner
                    </button>
                    <button
                        type="button"
                        className={`ai-tab-btn ${activeTab === "task-breakdown" ? "active" : ""}`}
                        onClick={() => handleTabChange("task-breakdown")}
                    >
                        <FiLayers /> Task Breakdown
                    </button>
                    <button
                        type="button"
                        className={`ai-tab-btn ${activeTab === "weak-areas" ? "active" : ""}`}
                        onClick={() => handleTabChange("weak-areas")}
                    >
                        <FiAlertCircle /> Weak Areas
                    </button>
                    <button
                        type="button"
                        className={`ai-tab-btn ${activeTab === "weekly-review" ? "active" : ""}`}
                        onClick={() => handleTabChange("weekly-review")}
                    >
                        <FiList /> Weekly Review
                    </button>
                    <button
                        type="button"
                        className={`ai-tab-btn ${activeTab === "quick-task" ? "active" : ""}`}
                        onClick={() => handleTabChange("quick-task")}
                    >
                        <FiPlus /> Quick Task Parser
                    </button>
                </div>

                {/* TAB 0: DAILY BRIEF & ACTIONS (PHASE 6) */}
                {activeTab === "daily-brief" && (
                    <section className="ai-content-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Personalized Daily Briefing</h2>
                                <p>Combines verified productivity facts, deterministic signals, and actionable proposals.</p>
                            </div>
                            <button
                                type="button"
                                className="ai-refresh-btn"
                                onClick={() => loadDailyBrief(true)}
                                disabled={loading}
                            >
                                <FiRefreshCw className={loading ? "spin" : ""} /> Refresh Brief
                            </button>
                        </div>

                        {loading && !dailyBriefData && (
                            <div className="ai-loading-state">
                                <div className="spinner"></div>
                                <p>Synthesizing daily workload, active streak, and deterministic signals...</p>
                            </div>
                        )}

                        {dailyBriefData && (
                            <div className="daily-brief-tab-content">
                                {/* FACTUAL OVERVIEW BAR */}
                                {dailyBriefData.factualOverview && (
                                    <div className="factual-overview-bar">
                                        <div className="fact-item">
                                            <span>Active Streak:</span>
                                            <strong>{dailyBriefData.factualOverview.currentStreak || 0} days</strong>
                                        </div>
                                        <div className="fact-item">
                                            <span>Pending Tasks:</span>
                                            <strong>{dailyBriefData.factualOverview.pendingTasksCount || 0}</strong>
                                        </div>
                                        <div className="fact-item">
                                            <span>Overdue:</span>
                                            <strong className={dailyBriefData.factualOverview.overdueTasksCount > 0 ? "alert-num" : ""}>
                                                {dailyBriefData.factualOverview.overdueTasksCount || 0}
                                            </strong>
                                        </div>
                                        <div className="fact-item">
                                            <span>7d Study Time:</span>
                                            <strong>{dailyBriefData.factualOverview.studyHours7d || "0"}h</strong>
                                        </div>
                                    </div>
                                )}

                                {/* EXECUTIVE SUMMARY */}
                                <div className="ai-summary-box">
                                    <div className="badge-ai">Daily Strategy</div>
                                    <p>{dailyBriefData.executiveSummary}</p>
                                </div>

                                {/* DETERMINISTIC SIGNALS INSPECTOR */}
                                {dailyBriefData.deterministicSignals && dailyBriefData.deterministicSignals.length > 0 && (
                                    <div className="signals-inspector">
                                        <h3>Deterministic Productivity Signals</h3>
                                        <div className="signals-grid">
                                            {dailyBriefData.deterministicSignals.map((sig, sIdx) => (
                                                <div key={sIdx} className={`signal-card ${sig.severity || "medium"}`}>
                                                    <div className="signal-card-top">
                                                        <span className="signal-badge">{sig.type?.replace(/_/g, " ")}</span>
                                                        <span className={`severity-tag ${sig.severity}`}>{sig.severity?.toUpperCase()}</span>
                                                    </div>
                                                    <h4>{sig.label}</h4>
                                                    <p>{sig.description}</p>
                                                    {sig.evidence && (
                                                        <div className="signal-evidence">
                                                            <strong>Evidence:</strong> {sig.evidence}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* ACTION PROPOSALS SECTION */}
                                {dailyBriefData.actionProposals && dailyBriefData.actionProposals.length > 0 && (
                                    <div className="proposals-inspector">
                                        <h3><FiCheckSquare /> Action Proposals (Awaiting Your Review)</h3>
                                        <div className="proposals-list-full">
                                            {dailyBriefData.actionProposals.map((prop, pIdx) => (
                                                <div key={prop.id || pIdx} className="proposal-card-full">
                                                    <div className="prop-card-main">
                                                        <div className="prop-type-badge">{prop.action?.replace("_", " ")}</div>
                                                        <div className="prop-body">
                                                            <h4>{prop.reason}</h4>
                                                            <div className="prop-diff">
                                                                {prop.currentValue && <span>Current: <strong>{prop.currentValue}</strong></span>}
                                                                {prop.proposedValue && (
                                                                    <span>Proposed: <strong className="proposed-highlight">{typeof prop.proposedValue === "object" ? prop.proposedValue.title : prop.proposedValue}</strong></span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="prop-card-actions">
                                                        <button
                                                            type="button"
                                                            className="approve-action-btn"
                                                            onClick={() => handleApproveProposal(prop)}
                                                            disabled={executingProposalId === prop.id}
                                                        >
                                                            <FiCheck /> Approve &amp; Execute
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="dismiss-action-btn"
                                                            onClick={() => handleDismissProposal(prop.id)}
                                                        >
                                                            <FiX /> Dismiss
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 1: PERSONALIZED INSIGHTS */}
                {activeTab === "insights" && (
                    <section className="ai-content-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Personalized Study Insights</h2>
                                <p>Pattern analysis grounded in your recent 7-day study metrics.</p>
                            </div>
                            <button
                                type="button"
                                className="ai-refresh-btn"
                                onClick={() => loadInsights(true)}
                                disabled={loading}
                            >
                                <FiRefreshCw className={loading ? "spin" : ""} /> Refresh
                            </button>
                        </div>

                        {loading && !insightsData && (
                            <div className="ai-loading-state">
                                <div className="spinner"></div>
                                <p>Analyzing your productivity and focus patterns...</p>
                            </div>
                        )}

                        {insightsData && (
                            <div className="insights-container">
                                <div className="ai-summary-box">
                                    <div className="badge-ai">AI Grounded Summary</div>
                                    <p>{insightsData.summary}</p>
                                </div>

                                <div className="insights-grid">
                                    {insightsData.insights?.map((item, idx) => (
                                        <div key={idx} className={`insight-card ${item.category}`}>
                                            <div className="insight-card-top">
                                                <span className="category-pill">{item.category}</span>
                                                <span className="ai-tag">Verified Grounding</span>
                                            </div>
                                            <h3>{item.title}</h3>
                                            <p className="insight-desc">{item.description}</p>
                                            {item.evidence && item.evidence.length > 0 && (
                                                <div className="evidence-box">
                                                    <strong>Evidence:</strong>
                                                    <ul>
                                                        {item.evidence.map((ev, eIdx) => (
                                                            <li key={eIdx}>{ev}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 2: SMART DAILY PLANNER */}
                {activeTab === "planner" && (
                    <section className="ai-content-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Smart Daily Study Plan</h2>
                                <p>Proposes a time-blocked schedule prioritizing overdue deliverables and high-value tasks.</p>
                            </div>
                            <button
                                type="button"
                                className="ai-refresh-btn"
                                onClick={loadPlanner}
                                disabled={loading}
                            >
                                <FiRefreshCw className={loading ? "spin" : ""} /> Regenerate Plan
                            </button>
                        </div>

                        {loading && !plannerData && (
                            <div className="ai-loading-state">
                                <div className="spinner"></div>
                                <p>Synthesizing pending tasks and focus capacities...</p>
                            </div>
                        )}

                        {plannerData && (
                            <div className="planner-container">
                                <div className="planner-stats-bar">
                                    <div className="stat-item">
                                        <span>Target Date:</span>
                                        <strong>{plannerData.date}</strong>
                                    </div>
                                    <div className="stat-item">
                                        <span>Total Planned Time:</span>
                                        <strong>{plannerData.totalPlannedMinutes} mins</strong>
                                    </div>
                                    <div className="stat-item">
                                        <span>Scheduled Tasks:</span>
                                        <strong>{plannerData.plan?.length || 0} blocks</strong>
                                    </div>
                                </div>

                                <div className="planner-timeline">
                                    {plannerData.plan?.length === 0 ? (
                                        <div className="ai-empty-state">
                                            <FiCheckCircle />
                                            <p>No pending tasks found for today. You are all caught up!</p>
                                        </div>
                                    ) : (
                                        plannerData.plan?.map((block, idx) => (
                                            <div key={idx} className="plan-block">
                                                <div className="plan-time">
                                                    <FiClock /> {block.suggestedStart}
                                                    <span className="duration-tag">{block.suggestedDurationMinutes}m</span>
                                                </div>
                                                <div className="plan-details">
                                                    <div className="plan-details-header">
                                                        <h4>Task #{block.taskId}</h4>
                                                        <span className={`priority-badge ${block.priority?.toLowerCase()}`}>
                                                            {block.priority} Priority
                                                        </span>
                                                    </div>
                                                    <p>{block.reason}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {plannerData.recommendations?.length > 0 && (
                                    <div className="planner-recommendations">
                                        <h4>Planning Recommendations:</h4>
                                        <ul>
                                            {plannerData.recommendations.map((rec, rIdx) => (
                                                <li key={rIdx}>{rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 3: SMART TASK BREAKDOWN */}
                {activeTab === "task-breakdown" && (
                    <section className="ai-content-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Smart Task Breakdown</h2>
                                <p>Decompose complex deliverables into actionable, time-budgeted subtasks.</p>
                            </div>
                        </div>

                        <form onSubmit={handleRunBreakdown} className="breakdown-form">
                            <div className="form-group">
                                <label>Task or Project Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Build Distributed Key-Value Store for CS401"
                                    value={breakdownTitle}
                                    onChange={(e) => setBreakdownTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Enrolled Subject (Optional)</label>
                                <select
                                    value={breakdownSubject}
                                    onChange={(e) => setBreakdownSubject(e.target.value)}
                                >
                                    <option value="">General / Uncategorized</option>
                                    {subjects.map(s => (
                                        <option key={s.subject_id} value={s.subject_name}>
                                            {s.subject_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <button type="submit" className="ai-action-submit-btn" disabled={loading || !breakdownTitle.trim()}>
                                {loading ? "Generating Breakdown..." : "Break Down with AI"}
                            </button>
                        </form>

                        {taskBreakdownData && (
                            <div className="breakdown-results">
                                <div className="breakdown-results-header">
                                    <div>
                                        <h3>{taskBreakdownData.originalTask}</h3>
                                        <span>Total Estimated: {taskBreakdownData.totalEstimatedMinutes} minutes</span>
                                    </div>
                                </div>

                                <div className="steps-list">
                                    {taskBreakdownData.steps?.map((step, idx) => (
                                        <div key={idx} className="step-item">
                                            <div className="step-number">{step.stepNumber}</div>
                                            <div className="step-content">
                                                <h4>{step.title}</h4>
                                                <span className="step-duration"><FiClock /> {step.estimatedMinutes} mins</span>
                                                {step.actionableAdvice && <p>{step.actionableAdvice}</p>}
                                            </div>
                                            <div className="step-action">
                                                <button
                                                    type="button"
                                                    className={`add-subtask-btn ${createdSubtaskIndices.has(idx) ? "added" : ""}`}
                                                    onClick={() => handleCreateSubtaskStep(step, idx)}
                                                    disabled={createdSubtaskIndices.has(idx)}
                                                >
                                                    {createdSubtaskIndices.has(idx) ? (
                                                        <><FiCheck /> Added</>
                                                    ) : (
                                                        <><FiPlus /> Add as Task</>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 4: WEAK AREA DETECTION */}
                {activeTab === "weak-areas" && (
                    <section className="ai-content-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Academic Weak Area Analysis</h2>
                                <p>Identifies subjects with lagging completion rates or overdue task concentrations.</p>
                            </div>
                            <button
                                type="button"
                                className="ai-refresh-btn"
                                onClick={loadWeakAreas}
                                disabled={loading}
                            >
                                <FiRefreshCw className={loading ? "spin" : ""} /> Re-Analyze
                            </button>
                        </div>

                        {loading && !weakAreasData && (
                            <div className="ai-loading-state">
                                <div className="spinner"></div>
                                <p>Evaluating subject completion rates and study histories...</p>
                            </div>
                        )}

                        {weakAreasData && (
                            <div className="weak-areas-container">
                                <div className="ai-summary-box">
                                    <div className="badge-ai">Analysis Result</div>
                                    <p>{weakAreasData.summary}</p>
                                </div>

                                {!weakAreasData.hasSufficientData || weakAreasData.areas?.length === 0 ? (
                                    <div className="ai-empty-state">
                                        <FiCheckCircle />
                                        <p>No critical weak areas detected! Your progress across enrolled subjects is balanced.</p>
                                    </div>
                                ) : (
                                    <div className="areas-grid">
                                        {weakAreasData.areas.map((area, idx) => (
                                            <div key={idx} className="weak-area-card">
                                                <div className="weak-area-top">
                                                    <h3>{area.subjectName}</h3>
                                                    <span className={`concern-pill ${area.concernLevel?.toLowerCase()}`}>
                                                        {area.concernLevel} Concern
                                                    </span>
                                                </div>
                                                <p className="area-reason">{area.reason}</p>

                                                {area.evidence && (
                                                    <div className="area-evidence-box">
                                                        <span><strong>Completion Rate:</strong> {area.evidence.completionRate || "N/A"}</span>
                                                        <span><strong>Overdue Tasks:</strong> {area.evidence.overdueCount || 0}</span>
                                                        <span><strong>Study Hours:</strong> {area.evidence.recordedStudyHours || "0h"}</span>
                                                    </div>
                                                )}

                                                <div className="recommended-action-box">
                                                    <strong>Recommended Next Step:</strong>
                                                    <p>{area.recommendedAction}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 5: WEEKLY REVIEW */}
                {activeTab === "weekly-review" && (
                    <section className="ai-content-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Weekly Productivity Retrospective</h2>
                                <p>Comprehensive 7-day review separating verified metrics from recommendations.</p>
                            </div>
                            <button
                                type="button"
                                className="ai-refresh-btn"
                                onClick={loadWeeklyReview}
                                disabled={loading}
                            >
                                <FiRefreshCw className={loading ? "spin" : ""} /> Refresh Review
                            </button>
                        </div>

                        {loading && !weeklyReviewData && (
                            <div className="ai-loading-state">
                                <div className="spinner"></div>
                                <p>Compiling 7-day retrospective...</p>
                            </div>
                        )}

                        {weeklyReviewData && (
                            <div className="weekly-review-container">
                                <div className="review-period-badge">
                                    <span>Review Horizon: {weeklyReviewData.reviewPeriod}</span>
                                </div>

                                <div className="ai-summary-box">
                                    <div className="badge-ai">Executive Summary</div>
                                    <p>{weeklyReviewData.executiveSummary}</p>
                                </div>

                                <div className="review-sections-grid">
                                    <div className="review-section-box highlights">
                                        <h4><FiCheckCircle /> Verified Factual Accomplishments</h4>
                                        <ul>
                                            {weeklyReviewData.factualHighlights?.map((h, i) => (
                                                <li key={i}>{h}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="review-section-box observations">
                                        <h4><FiTrendingUp /> Pattern Observations</h4>
                                        <ul>
                                            {weeklyReviewData.observations?.map((o, i) => (
                                                <li key={i}>{o}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="review-section-box attention">
                                        <h4><FiAlertCircle /> Areas Needing Attention</h4>
                                        <ul>
                                            {weeklyReviewData.areasNeedingAttention?.map((a, i) => (
                                                <li key={i}>{a}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="review-section-box priorities">
                                        <h4><FiCalendar /> Suggested Priorities for Next Week</h4>
                                        <ul>
                                            {weeklyReviewData.recommendedPrioritiesNextWeek?.map((p, i) => (
                                                <li key={i}>{p}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>
                )}

                {/* TAB 6: NATURAL LANGUAGE QUICK TASK */}
                {activeTab === "quick-task" && (
                    <section className="ai-content-panel">
                        <div className="panel-header">
                            <div>
                                <h2>Natural Language Task Creator</h2>
                                <p>Describe a task in plain English. The AI parses parameters into a proposal for your confirmation.</p>
                            </div>
                        </div>

                        <form onSubmit={handleParseTask} className="quick-task-form">
                            <div className="form-group">
                                <label>Describe what you need to do</label>
                                <div className="input-with-btn">
                                    <input
                                        type="text"
                                        placeholder="e.g. Tomorrow at 5pm study Computer Networks for 45 minutes"
                                        value={naturalPrompt}
                                        onChange={(e) => setNaturalPrompt(e.target.value)}
                                        required
                                    />
                                    <button type="submit" disabled={loading || !naturalPrompt.trim()}>
                                        <FiSend /> Parse
                                    </button>
                                </div>
                            </div>
                        </form>

                        {parsedTaskData && (
                            <div className="task-proposal-card">
                                <div className="proposal-header">
                                    <div>
                                        <span className="badge-ai">Proposed Task (Requires Your Confirmation)</span>
                                        <h3>{parsedTaskData.title}</h3>
                                    </div>
                                    <span className="confidence-pill">
                                        Confidence: {Math.round((parsedTaskData.confidence || 0.9) * 100)}%
                                    </span>
                                </div>

                                <div className="proposal-grid">
                                    <div className="prop-item">
                                        <span>Due Date:</span>
                                        <strong>{parsedTaskData.dueDate}</strong>
                                    </div>
                                    <div className="prop-item">
                                        <span>Duration:</span>
                                        <strong>{parsedTaskData.durationMinutes} mins</strong>
                                    </div>
                                    <div className="prop-item">
                                        <span>Priority:</span>
                                        <strong>{parsedTaskData.priority}</strong>
                                    </div>
                                    <div className="prop-item">
                                        <span>Subject:</span>
                                        <strong>{parsedTaskData.subjectName}</strong>
                                    </div>
                                </div>

                                {parsedTaskData.description && (
                                    <p className="prop-desc">{parsedTaskData.description}</p>
                                )}

                                <div className="proposal-actions">
                                    <button
                                        type="button"
                                        className="confirm-create-btn"
                                        onClick={() => handleConfirmCreateTask(parsedTaskData)}
                                        disabled={loading}
                                    >
                                        <FiCheck /> Confirm &amp; Add to Tasks
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setParsedTaskData(null)}
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
}

export default AIHub;
