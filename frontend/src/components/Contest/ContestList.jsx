import { useEffect, useState } from "react";

import DashboardLayout from "../Layout/DashboardLayout";
import AddContestModal from "./AddContestModal";

import {
    getAllContests,
    deleteContest
} from "../../services/contestService";

import "./ContestList.css";


function ContestList() {

    // =========================================
    // STATE
    // =========================================

    const [contests, setContests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    // Add modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Edit modal
    const [editingContest, setEditingContest] = useState(null);

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    // Sort
    const [sortBy, setSortBy] = useState("date-asc");


    // =========================================
    // FETCH CONTESTS
    // =========================================

    const fetchContests = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getAllContests();

            const contestData =
                response?.contests ||
                (Array.isArray(response)
                    ? response
                    : []);

            setContests(contestData);

        } catch (err) {

            console.error(
                "Failed to fetch contests:",
                err
            );

            setError(
                err?.message ||
                "Failed to load contests"
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================
    // INITIAL FETCH
    // =========================================

    useEffect(() => {

        fetchContests();

    }, []);


    // =========================================
    // OPEN EDIT MODAL
    // =========================================

    const handleEdit = (contest) => {

        setError("");

        setEditingContest(contest);

    };


    // =========================================
    // DELETE CONTEST
    // =========================================

    const handleDelete = async (contestId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this contest?"
        );

        if (!confirmed) {
            return;
        }


        try {

            setError("");

            await deleteContest(contestId);


            setContests(
                (previousContests) =>
                    previousContests.filter(
                        (contest) =>
                            contest.contest_id !== contestId
                    )
            );


        } catch (err) {

            console.error(
                "Failed to delete contest:",
                err
            );

            setError(
                err?.message ||
                "Failed to delete contest"
            );

        }

    };


    // =========================================
    // CONTEST ADDED
    // =========================================

    const handleContestAdded = () => {

        setIsAddModalOpen(false);

        fetchContests();

    };


    // =========================================
    // CONTEST UPDATED
    // =========================================

    const handleContestUpdated = () => {

        setEditingContest(null);

        fetchContests();

    };


    // =========================================
    // FORMAT DATE
    // =========================================

    const formatDate = (date) => {

        if (!date) {
            return "No date";
        }


        const parsedDate = new Date(date);


        if (Number.isNaN(parsedDate.getTime())) {
            return "No date";
        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

    };


    // =========================================
    // FORMAT TIME
    // =========================================

    const formatTime = (date) => {

        if (!date) {
            return "";
        }


        const parsedDate = new Date(date);


        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }


        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // =========================================
    // PLATFORM CLASS
    // =========================================

    const getPlatformClass = (platform) => {

        if (!platform) {
            return "contest-platform-other";
        }


        return `contest-platform-${platform
            .toLowerCase()
            .replace(/\s+/g, "-")}`;

    };


    // =========================================
    // STATUS CLASS
    // =========================================

    const getStatusClass = (status) => {

        if (!status) {
            return "contest-status-upcoming";
        }


        return `contest-status-${status
            .toLowerCase()}`;

    };


    // =========================================
    // SEARCH + SORT
    // =========================================

    const filteredContests = [...contests]

        .filter((contest) => {

            const search =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (!search) {
                return true;
            }


            const contestName =
                contest.contest_name
                    ?.toLowerCase() || "";


            const platform =
                contest.platform
                    ?.toLowerCase() || "";


            const status =
                contest.participation_status
                    ?.toLowerCase() || "";


            return (
                contestName.includes(search) ||
                platform.includes(search) ||
                status.includes(search)
            );

        })


        .sort((a, b) => {

            switch (sortBy) {

                case "date-asc":

                    return (
                        new Date(a.contest_date) -
                        new Date(b.contest_date)
                    );


                case "date-desc":

                    return (
                        new Date(b.contest_date) -
                        new Date(a.contest_date)
                    );


                case "name-asc":

                    return (
                        a.contest_name || ""
                    ).localeCompare(
                        b.contest_name || ""
                    );


                case "name-desc":

                    return (
                        b.contest_name || ""
                    ).localeCompare(
                        a.contest_name || ""
                    );


                case "platform":

                    return (
                        a.platform || ""
                    ).localeCompare(
                        b.platform || ""
                    );


                default:

                    return 0;

            }

        });


    // =========================================
    // RENDER
    // =========================================

    return (

        <DashboardLayout>

            <div className="contest-page">

                <div className="contest-page-container">


                    {/* =================================
                        PAGE HEADER
                    ================================= */}

                    <div className="contest-page-header">

                        <div>

                            <div className="contest-section-label">
                                CODING
                            </div>


                            <h1>
                                Coding Contests
                            </h1>


                            <p>
                                Track upcoming and completed
                                competitive programming contests.
                            </p>

                        </div>


                        <button
                            type="button"
                            className="contest-add-button"
                            onClick={() =>
                                setIsAddModalOpen(true)
                            }
                        >
                            + Add Contest
                        </button>

                    </div>


                    {/* =================================
                        SEARCH + SORT
                    ================================= */}

                    {!loading &&
                        contests.length > 0 && (

                            <div className="contest-controls">


                                {/* SEARCH */}

                                <div className="contest-search">

                                    <span className="contest-search-icon">
                                        🔎
                                    </span>


                                    <input
                                        type="text"
                                        placeholder="Search contests, platforms or status..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>


                                {/* SORT */}

                                <div className="contest-sort">

                                    <label htmlFor="contest-sort">
                                        Sort by
                                    </label>


                                    <select
                                        id="contest-sort"
                                        value={sortBy}
                                        onChange={(e) =>
                                            setSortBy(
                                                e.target.value
                                            )
                                        }
                                    >

                                        <option value="date-asc">
                                            Upcoming first
                                        </option>

                                        <option value="date-desc">
                                            Latest first
                                        </option>

                                        <option value="name-asc">
                                            Name: A → Z
                                        </option>

                                        <option value="name-desc">
                                            Name: Z → A
                                        </option>

                                        <option value="platform">
                                            Platform
                                        </option>

                                    </select>

                                </div>

                            </div>

                        )}


                    {/* =================================
                        ERROR
                    ================================= */}

                    {error && (

                        <div className="contest-error">

                            {error}

                        </div>

                    )}


                    {/* =================================
                        LOADING
                    ================================= */}

                    {loading ? (

                        <div className="contest-loading-card">

                            <div className="contest-spinner"></div>

                            <p>
                                Loading contests...
                            </p>

                        </div>


                    ) : contests.length === 0 ? (

                        /* =================================
                           NO CONTESTS
                        ================================= */

                        <div className="contest-empty-state">

                            <div className="contest-empty-icon">
                                🏆
                            </div>


                            <h2>
                                No contests yet
                            </h2>


                            <p>
                                Add your first coding contest
                                to start tracking your progress.
                            </p>


                            <button
                                type="button"
                                className="contest-empty-button"
                                onClick={() =>
                                    setIsAddModalOpen(true)
                                }
                            >
                                + Add Contest
                            </button>

                        </div>


                    ) : filteredContests.length === 0 ? (

                        /* =================================
                           NO SEARCH RESULTS
                        ================================= */

                        <div className="contest-empty-state">

                            <div className="contest-empty-icon">
                                🔎
                            </div>


                            <h2>
                                No contests found
                            </h2>


                            <p>
                                No contests match "{searchTerm}".
                                Try a different search term.
                            </p>


                            <button
                                type="button"
                                className="contest-empty-button"
                                onClick={() =>
                                    setSearchTerm("")
                                }
                            >
                                Clear Search
                            </button>

                        </div>


                    ) : (

                        /* =================================
                           CONTEST GRID
                        ================================= */

                        <div className="contest-grid">

                            {filteredContests.map(
                                (contest) => (

                                    <div
                                        className="contest-card"
                                        key={
                                            contest.contest_id
                                        }
                                    >


                                        {/* =============================
                                            CARD HEADER
                                        ============================= */}

                                        <div className="contest-card-header">

                                            <div>

                                                <span
                                                    className={`contest-platform ${getPlatformClass(
                                                        contest.platform
                                                    )}`}
                                                >
                                                    {
                                                        contest.platform
                                                    }
                                                </span>


                                                <h2>
                                                    {
                                                        contest.contest_name
                                                    }
                                                </h2>

                                            </div>


                                            <span
                                                className={`contest-status ${getStatusClass(
                                                    contest.participation_status
                                                )}`}
                                            >
                                                {
                                                    contest.participation_status
                                                }
                                            </span>

                                        </div>


                                        {/* =============================
                                            DIVIDER
                                        ============================= */}

                                        <div className="contest-divider"></div>


                                        {/* =============================
                                            DETAILS
                                        ============================= */}

                                        <div className="contest-details">


                                            {/* DATE */}

                                            <div className="contest-detail">

                                                <div className="contest-detail-icon">
                                                    📅
                                                </div>


                                                <div>

                                                    <span className="contest-detail-label">
                                                        Date
                                                    </span>


                                                    <span className="contest-detail-value">
                                                        {
                                                            formatDate(
                                                                contest.contest_date
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            {/* TIME */}

                                            <div className="contest-detail">

                                                <div className="contest-detail-icon">
                                                    ⏰
                                                </div>


                                                <div>

                                                    <span className="contest-detail-label">
                                                        Time
                                                    </span>


                                                    <span className="contest-detail-value">
                                                        {
                                                            formatTime(
                                                                contest.contest_date
                                                            )
                                                        }
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* =============================
                                            CARD FOOTER
                                        ============================= */}

                                        <div className="contest-card-footer">


                                            {/* OPEN CONTEST */}

                                            {contest.contest_url ? (

                                                <a
                                                    href={
                                                        contest.contest_url
                                                    }
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="contest-open-button"
                                                >
                                                    Open Contest ↗
                                                </a>

                                            ) : (

                                                <span className="contest-no-link">
                                                    No contest link
                                                </span>

                                            )}


                                            {/* ACTION BUTTONS */}

                                            <div className="contest-card-actions">


                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    className="contest-edit-button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            contest
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    className="contest-delete-button"
                                                    onClick={() =>
                                                        handleDelete(
                                                            contest.contest_id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>


                {/* =================================
                    ADD CONTEST MODAL
                ================================= */}

                {isAddModalOpen && (

                    <AddContestModal
                        onClose={() =>
                            setIsAddModalOpen(false)
                        }
                        onContestAdded={
                            handleContestAdded
                        }
                    />

                )}


                {/* =================================
                    EDIT CONTEST MODAL
                ================================= */}

                {editingContest && (

                    <AddContestModal
                        contest={editingContest}

                        onClose={() =>
                            setEditingContest(null)
                        }

                        onContestUpdated={
                            handleContestUpdated
                        }
                    />

                )}

            </div>

        </DashboardLayout>

    );

}


export default ContestList;