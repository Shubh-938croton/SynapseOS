import { useEffect, useState } from "react";

import {
    createContest,
    updateContest
} from "../../services/contestService";

import "./AddContestModal.css";


function AddContestModal({
    contest = null,
    onClose,
    onContestAdded,
    onContestUpdated
}) {

    const isEditMode = Boolean(contest);


    // =========================================
    // FORM STATE
    // =========================================

    const [formData, setFormData] = useState({

        platform: "LeetCode",

        contest_name: "",

        contest_date: "",

        contest_url: "",

        participation_status: "Upcoming"

    });


    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =========================================
    // LOAD CONTEST DATA FOR EDIT
    // =========================================

    useEffect(() => {

        if (!contest) {

            setFormData({

                platform: "LeetCode",

                contest_name: "",

                contest_date: "",

                contest_url: "",

                participation_status: "Upcoming"

            });

            return;

        }


        setFormData({

            platform:
                contest.platform || "LeetCode",

            contest_name:
                contest.contest_name || "",

            contest_date:
                formatDateForInput(
                    contest.contest_date
                ),

            contest_url:
                contest.contest_url || "",

            participation_status:
                contest.participation_status ||
                "Upcoming"

        });

    }, [contest]);


    // =========================================
    // FORMAT DATE FOR DATETIME-LOCAL
    // =========================================

    const formatDateForInput = (date) => {

        if (!date) {
            return "";
        }

        let parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime()) && typeof date === "string") {
            parsedDate = new Date(date.replace(" ", "T"));
        }

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        const year =
            parsedDate.getFullYear();

        const month =
            String(
                parsedDate.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                parsedDate.getDate()
            ).padStart(2, "0");

        const hours =
            String(
                parsedDate.getHours()
            ).padStart(2, "0");

        const minutes =
            String(
                parsedDate.getMinutes()
            ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;

    };


    // =========================================
    // HANDLE INPUT
    // =========================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previousData) => ({

            ...previousData,

            [name]: value

        }));


        // Clear previous error
        if (error) {
            setError("");
        }

    };


    // =========================================
    // VALIDATE FORM
    // =========================================

    const validateForm = () => {

        if (!formData.platform) {

            setError(
                "Please select a platform."
            );

            return false;

        }


        if (
            !formData.contest_name.trim()
        ) {

            setError(
                "Contest name is required."
            );

            return false;

        }


        if (!formData.contest_date) {

            setError(
                "Contest date and time are required."
            );

            return false;

        }


        if (formData.contest_url.trim()) {

            try {

                const parsedUrl = new URL(
                    formData.contest_url.trim()
                );

                if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
                    setError(
                        "Contest URL must begin with http:// or https://"
                    );
                    return false;
                }

            } catch {

                setError(
                    "Please enter a valid contest URL (e.g. https://leetcode.com/contest/...)."
                );

                return false;

            }

        }


        if (
            !formData.participation_status
        ) {

            setError(
                "Please select a participation status."
            );

            return false;

        }


        return true;

    };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        if (!validateForm()) {
            return;
        }


        try {

            setLoading(true);


            const contestData = {

                platform:
                    formData.platform,

                contest_name:
                    formData.contest_name.trim(),

                contest_date:
                    formData.contest_date,

                contest_url:
                    formData.contest_url.trim() ||
                    null,

                participation_status:
                    formData.participation_status

            };


            // =================================
            // EDIT CONTEST
            // =================================

            if (isEditMode) {

                await updateContest(
                    contest.contest_id,
                    contestData
                );


                if (onContestUpdated) {

                    onContestUpdated();

                }

            }


            // =================================
            // CREATE CONTEST
            // =================================

            else {

                await createContest(
                    contestData
                );


                if (onContestAdded) {

                    onContestAdded();

                }

            }

        } catch (err) {

            console.error(
                isEditMode
                    ? "Failed to update contest:"
                    : "Failed to create contest:",
                err
            );


            setError(
                err?.message ||
                (
                    isEditMode
                        ? "Failed to update contest."
                        : "Failed to create contest."
                )
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="contest-modal-overlay"

            onMouseDown={(e) => {

                if (
                    e.target ===
                    e.currentTarget
                ) {

                    if (!loading) {
                        onClose();
                    }

                }

            }}
        >

            <div className="contest-modal">


                {/* =================================
                    HEADER
                ================================= */}

                <div className="contest-modal-header">

                    <div>

                        <span className="contest-modal-label">

                            {isEditMode
                                ? "UPDATE"
                                : "CODING"
                            }

                        </span>


                        <h2>

                            {isEditMode
                                ? "Edit Contest"
                                : "Add Contest"
                            }

                        </h2>


                        <p>

                            {isEditMode
                                ? "Update the details of your coding contest."
                                : "Add a coding contest to your productivity tracker."
                            }

                        </p>

                    </div>


                    <button
                        type="button"

                        className="contest-modal-close"

                        onClick={onClose}

                        disabled={loading}
                    >
                        ×
                    </button>

                </div>


                {/* =================================
                    ERROR
                ================================= */}

                {error && (

                    <div className="contest-modal-error">

                        {error}

                    </div>

                )}


                {/* =================================
                    FORM
                ================================= */}

                <form
                    className="contest-modal-form"

                    onSubmit={handleSubmit}
                >


                    {/* =================================
                        PLATFORM
                    ================================= */}

                    <div className="contest-form-group">

                        <label htmlFor="platform">

                            Platform

                        </label>


                        <select
                            id="platform"

                            name="platform"

                            value={
                                formData.platform
                            }

                            onChange={
                                handleChange
                            }

                            disabled={loading}
                        >

                            <option value="LeetCode">
                                LeetCode
                            </option>

                            <option value="Codeforces">
                                Codeforces
                            </option>

                            <option value="CodeChef">
                                CodeChef
                            </option>

                            <option value="HackerRank">
                                HackerRank
                            </option>

                            <option value="AtCoder">
                                AtCoder
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        CONTEST NAME
                    ================================= */}

                    <div className="contest-form-group">

                        <label htmlFor="contest_name">

                            Contest Name

                        </label>


                        <input
                            id="contest_name"

                            type="text"

                            name="contest_name"

                            value={
                                formData.contest_name
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="e.g. LeetCode Weekly Contest"

                            maxLength={200}

                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        CONTEST DATE
                    ================================= */}

                    <div className="contest-form-group">

                        <label htmlFor="contest_date">

                            Contest Date & Time

                        </label>


                        <input
                            id="contest_date"

                            type="datetime-local"

                            name="contest_date"

                            value={
                                formData.contest_date
                            }

                            onChange={
                                handleChange
                            }

                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        CONTEST URL
                    ================================= */}

                    <div className="contest-form-group">

                        <label htmlFor="contest_url">

                            Contest URL

                            <span>
                                {" "}
                                (Optional)
                            </span>

                        </label>


                        <input
                            id="contest_url"

                            type="url"

                            name="contest_url"

                            value={
                                formData.contest_url
                            }

                            onChange={
                                handleChange
                            }

                            placeholder="https://leetcode.com/contest/..."

                            disabled={loading}
                        />

                    </div>


                    {/* =================================
                        PARTICIPATION STATUS
                    ================================= */}

                    <div className="contest-form-group">

                        <label htmlFor="participation_status">

                            Participation Status

                        </label>


                        <select
                            id="participation_status"

                            name="participation_status"

                            value={
                                formData.participation_status
                            }

                            onChange={
                                handleChange
                            }

                            disabled={loading}
                        >

                            <option value="Upcoming">
                                Upcoming
                            </option>

                            <option value="Participated">
                                Participated
                            </option>

                            <option value="Missed">
                                Missed
                            </option>

                        </select>

                    </div>


                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="contest-modal-actions">


                        <button
                            type="button"

                            className="contest-modal-cancel"

                            onClick={onClose}

                            disabled={loading}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"

                            className="contest-modal-submit"

                            disabled={loading}
                        >

                            {loading

                                ? (
                                    isEditMode
                                        ? "Updating..."
                                        : "Adding..."
                                )

                                : (
                                    isEditMode
                                        ? "Update Contest"
                                        : "Add Contest"
                                )

                            }

                        </button>


                    </div>

                </form>

            </div>

        </div>

    );

}


export default AddContestModal;