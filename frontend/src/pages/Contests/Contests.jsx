import { useEffect, useState, useMemo } from "react";
import {
    FiCode,
    FiPlus,
    FiCalendar,
    FiClock,
    FiExternalLink,
    FiEdit2,
    FiTrash2,
    FiSearch
} from "react-icons/fi";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import AddContestModal from "../../components/Contest/AddContestModal";
import {
    getAllContests,
    deleteContest
} from "../../services/contestService";
import "./Contest.css";


function Contests() {
    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [contestToEdit, setContestToEdit] = useState(null);

    const fetchContests = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getAllContests();
            const contestList = Array.isArray(data)
                ? data
                : (data?.contests || []);
            setContests(contestList);
        } catch (err) {
            console.error("Failed to fetch contests:", err);
            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load contests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContests();
    }, []);

    const filteredContests = useMemo(() => {
        return contests.filter((contest) => {
            const matchesSearch =
                !searchTerm.trim() ||
                contest.contest_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                contest.platform?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus =
                statusFilter === "all" ||
                contest.participation_status?.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesStatus;
        });
    }, [contests, searchTerm, statusFilter]);

    const handleAddContest = () => {
        setContestToEdit(null);
        setShowModal(true);
    };

    const handleEditContest = (contest) => {
        setContestToEdit(contest);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setContestToEdit(null);
    };

    const handleDeleteContest = async (contestId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this contest?"
        );
        if (!confirmed) return;

        try {
            await deleteContest(contestId);
            await fetchContests();
        } catch (err) {
            console.error("Delete contest error:", err);
            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete contest."
            );
        }
    };

    const parseDateSafe = (date) => {
        if (!date) return null;
        let parsed = new Date(date);
        if (Number.isNaN(parsed.getTime()) && typeof date === "string") {
            parsed = new Date(date.replace(" ", "T"));
        }
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const formatDate = (date) => {
        const parsedDate = parseDateSafe(date);
        if (!parsedDate) return "--";
        return parsedDate.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const formatTime = (date) => {
        const parsedDate = parseDateSafe(date);
        if (!parsedDate) return "--";
        return parsedDate.toLocaleTimeString("en-IN", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        });
    };

    const getPlatformClass = (platform) => {
        return platform?.toLowerCase().replace(/\s+/g, "-") || "other";
    };

    const getStatusClass = (status) => {
        return status?.toLowerCase().replace(/\s+/g, "-") || "upcoming";
    };

    return (
        <DashboardLayout>
            <div className="contests-page">
                {/* HEADER */}
                <div className="contests-header">
                    <div>
                        <span className="contests-label">COMPETITIVE PROGRAMMING</span>
                        <h1>Coding Contests</h1>
                        <p>
                            Track scheduled contests, log your participation, and never miss an upcoming round.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-contest-btn"
                        onClick={handleAddContest}
                    >
                        <FiPlus />
                        <span>Add Contest</span>
                    </button>
                </div>

                {/* TOOLBAR */}
                <div className="contests-toolbar">
                    <div className="contests-search-box">
                        <FiSearch />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search contests by name or platform..."
                        />
                    </div>

                    <div className="contests-filter-tabs">
                        {["all", "Upcoming", "Participated", "Missed"].map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                className={`filter-tab ${statusFilter === tab ? "active" : ""}`}
                                onClick={() => setStatusFilter(tab)}
                            >
                                {tab === "all" ? "All Contests" : tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LOADING */}
                {loading && (
                    <div className="contests-loading">
                        <div className="contests-spinner" />
                        <p>Loading contests...</p>
                    </div>
                )}

                {/* ERROR STATE */}
                {!loading && error && (
                    <div className="contests-empty">
                        <h2>Error Loading Contests</h2>
                        <p>{error}</p>
                        <button type="button" className="contest-retry-btn" onClick={fetchContests}>
                            Retry
                        </button>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && contests.length === 0 && (
                    <div className="contests-empty">
                        <div className="contest-empty-icon">
                            <FiCode />
                        </div>
                        <h2>No contests added yet</h2>
                        <p>
                            Track rounds from LeetCode, Codeforces, CodeChef, HackerRank, or AtCoder.
                        </p>
                        <button
                            type="button"
                            className="add-contest-btn"
                            onClick={handleAddContest}
                        >
                            <FiPlus />
                            <span>Add First Contest</span>
                        </button>
                    </div>
                )}

                {/* NO RESULTS FILTERED */}
                {!loading && !error && contests.length > 0 && filteredContests.length === 0 && (
                    <div className="contests-no-results">
                        <p>No contests found matching your filters</p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setStatusFilter("all");
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {/* CONTEST GRID */}
                {!loading && !error && filteredContests.length > 0 && (
                    <div className="contests-grid">
                        {filteredContests.map((contest) => (
                            <div
                                key={contest.contest_id}
                                className="contest-card"
                            >
                                <div className="contest-card-header">
                                    <div className="contest-card-meta">
                                        <span className={`contest-platform ${getPlatformClass(contest.platform)}`}>
                                            {contest.platform}
                                        </span>
                                        <span className={`contest-status ${getStatusClass(contest.participation_status)}`}>
                                            {contest.participation_status}
                                        </span>
                                    </div>

                                    <div className="contest-card-actions">
                                        <button
                                            type="button"
                                            className="contest-action-btn edit"
                                            onClick={() => handleEditContest(contest)}
                                            title="Edit contest"
                                        >
                                            <FiEdit2 />
                                        </button>
                                        <button
                                            type="button"
                                            className="contest-action-btn delete"
                                            onClick={() => handleDeleteContest(contest.contest_id)}
                                            title="Delete contest"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>

                                <div className="contest-card-body">
                                    <h3 className="contest-title">
                                        {contest.contest_name}
                                    </h3>

                                    <div className="contest-schedule">
                                        <div className="schedule-item">
                                            <FiCalendar />
                                            <span>{formatDate(contest.contest_date)}</span>
                                        </div>
                                        <div className="schedule-item">
                                            <FiClock />
                                            <span>{formatTime(contest.contest_date)}</span>
                                        </div>
                                    </div>
                                </div>

                                {contest.contest_url && (
                                    <div className="contest-card-footer">
                                        <a
                                            href={contest.contest_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contest-link-btn"
                                        >
                                            <span>Open Contest</span>
                                            <FiExternalLink />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* CONTEST MODAL */}
                {showModal && (
                    <AddContestModal
                        contest={contestToEdit}
                        onClose={handleCloseModal}
                        onContestAdded={() => {
                            handleCloseModal();
                            fetchContests();
                        }}
                        onContestUpdated={() => {
                            handleCloseModal();
                            fetchContests();
                        }}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}

export default Contests;