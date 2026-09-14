import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";

import AddContestModal from "../../components/Contest/AddContestModal";

import {
    getAllContests,
    deleteContest
} from "../../services/contestService";

import "./Contest.css";


function Contests() {

    // =========================
    // STATE
    // =========================

    const [contests, setContests] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [contestToEdit, setContestToEdit] = useState(null);


    // =========================
    // FETCH CONTESTS
    // =========================

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

            console.error(
                "Failed to fetch contests:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load contests."
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // INITIAL LOAD
    // =========================

    useEffect(() => {

        fetchContests();

    }, []);


    // =========================
    // OPEN ADD MODAL
    // =========================

    const handleAddContest = () => {

        setContestToEdit(null);

        setShowModal(true);

    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const handleEditContest = (contest) => {

        setContestToEdit(contest);

        setShowModal(true);

    };


    // =========================
    // CLOSE MODAL
    // =========================

    const handleCloseModal = () => {

        setShowModal(false);

        setContestToEdit(null);

    };


    // =========================
    // DELETE CONTEST
    // =========================

    const handleDeleteContest = async (contestId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this contest?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteContest(contestId);

            await fetchContests();

        } catch (err) {

            console.error(
                "Delete contest error:",
                err
            );

            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to delete contest."
            );

        }

    };


    // =========================
    // PARSE DATE SAFELY
    // =========================

    const parseDateSafe = (date) => {

        if (!date) return null;

        let parsed = new Date(date);

        if (Number.isNaN(parsed.getTime()) && typeof date === "string") {
            parsed = new Date(date.replace(" ", "T"));
        }

        return Number.isNaN(parsed.getTime()) ? null : parsed;

    };


    // =========================
    // FORMAT DATE
    // =========================

    const formatDate = (date) => {

        const parsedDate = parseDateSafe(date);

        if (!parsedDate) {
            return "--";
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


    // =========================
    // FORMAT TIME
    // =========================

    const formatTime = (date) => {

        const parsedDate = parseDateSafe(date);

        if (!parsedDate) {
            return "--";
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

    };


    // =========================
    // PLATFORM CLASS
    // =========================

    const getPlatformClass = (platform) => {

        return platform
            ?.toLowerCase()
            .replace(/\s+/g, "-") || "other";

    };


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (status) => {

        return status
            ?.toLowerCase()
            .replace(/\s+/g, "-") || "upcoming";

    };


    // =========================
    // RENDER
    // =========================

    return (

        <DashboardLayout>

            {/* =========================
                CONTEST MODAL
            ========================= */}

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


            {/* =========================
                PAGE
            ========================= */}

            <div className="contests-page">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="contests-header">

                    <div>

                        <h1>
                            Coding Contests
                        </h1>

                        <p>
                            Track upcoming contests
                            and your competitive
                            programming progress.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="add-contest-btn"
                        onClick={handleAddContest}
                    >
                        + Add Contest
                    </button>

                </div>


                {/* =========================
                    LOADING
                ========================= */}

                {loading && (

                    <div className="contests-loading">

                        Loading contests...

                    </div>

                )}


                {/* =========================
                    ERROR STATE
                ========================= */}

                {!loading && error && (

                    <div className="contests-empty">

                        <h2>Error Loading Contests</h2>

                        <p>{error}</p>

                        <button
                            type="button"
                            onClick={fetchContests}
                        >
                            Retry
                        </button>

                    </div>

                )}


                {/* =========================
                    EMPTY STATE
                ========================= */}

                {!loading && !error &&
                    contests.length === 0 && (

                        <div className="contests-empty">

                            <h2>
                                No contests yet
                            </h2>

                            <p>
                                Add your first coding
                                contest to start
                                tracking it.
                            </p>

                            <button
                                type="button"
                                onClick={handleAddContest}
                            >
                                Add Contest
                            </button>

                        </div>

                    )}


                {/* =========================
                    CONTEST GRID
                ========================= */}

                {!loading &&
                    contests.length > 0 && (

                        <div className="contests-grid">

                            {contests.map((contest) => (

                                <div
                                    key={contest.contest_id}
                                    className="contest-card"
                                >

                                    {/* CARD HEADER */}

                                    <div className="contest-card-header">

                                        <div>

                                            <span
                                                className={`contest-platform ${getPlatformClass(
                                                    contest.platform
                                                )}`}
                                            >
                                                {contest.platform}
                                            </span>

                                            <h2>
                                                {contest.contest_name}
                                            </h2>

                                        </div>

                                    </div>


                                    {/* DATE/TIME */}

                                    <div className="contest-info">

                                        <div>

                                            <span>
                                                Date
                                            </span>

                                            <strong>
                                                {formatDate(
                                                    contest.contest_date
                                                )}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Time
                                            </span>

                                            <strong>
                                                {formatTime(
                                                    contest.contest_date
                                                )}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div className="contest-status-row">

                                        <span>
                                            Status
                                        </span>

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


                                    {/* ACTIONS */}

                                    <div className="contest-actions">

                                        {contest.contest_url && (

                                            <a
                                                href={contest.contest_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="contest-link-btn"
                                            >
                                                View Contest
                                            </a>

                                        )}


                                        <button
                                            type="button"
                                            className="edit-contest-btn"
                                            onClick={() =>
                                                handleEditContest(
                                                    contest
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="delete-contest-btn"
                                            onClick={() =>
                                                handleDeleteContest(
                                                    contest.contest_id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

            </div>

        </DashboardLayout>

    );

}


export default Contests;