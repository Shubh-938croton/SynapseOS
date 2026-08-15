import { useState } from "react";
import { createContest } from "../../services/contestService";
import "./AddContestModal.css";


function AddContestModal({ onClose, onContestAdded }) {

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
    // HANDLE INPUT
    // =========================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value
        }));

    };


    // =========================================
    // SUBMIT
    // =========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // Basic validation

        if (
            !formData.platform ||
            !formData.contest_name.trim() ||
            !formData.contest_date
        ) {

            setError(
                "Platform, contest name and contest date are required."
            );

            return;

        }


        try {

            setLoading(true);


            const contestData = {

                platform: formData.platform,

                contest_name:
                    formData.contest_name.trim(),

                contest_date:
                    formData.contest_date,

                contest_url:
                    formData.contest_url.trim() || null,

                participation_status:
                    formData.participation_status

            };


            await createContest(contestData);


            // Tell ContestList to refresh

            if (onContestAdded) {
                onContestAdded();
            }


        } catch (err) {

            console.error(
                "Failed to create contest:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Failed to create contest. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div
            className="contest-modal-overlay"
            onMouseDown={(e) => {

                if (e.target === e.currentTarget) {
                    onClose();
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
                            CODING
                        </span>

                        <h2>
                            Add Contest
                        </h2>

                        <p>
                            Add a coding contest to your
                            productivity tracker.
                        </p>

                    </div>


                    <button
                        type="button"
                        className="contest-modal-close"
                        onClick={onClose}
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

                    {/* PLATFORM */}

                    <div className="contest-form-group">

                        <label htmlFor="platform">
                            Platform
                        </label>

                        <select
                            id="platform"
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
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


                    {/* CONTEST NAME */}

                    <div className="contest-form-group">

                        <label htmlFor="contest_name">
                            Contest Name
                        </label>

                        <input
                            id="contest_name"
                            type="text"
                            name="contest_name"
                            value={formData.contest_name}
                            onChange={handleChange}
                            placeholder="e.g. LeetCode Weekly Contest"
                            maxLength={200}
                        />

                    </div>


                    {/* DATE */}

                    <div className="contest-form-group">

                        <label htmlFor="contest_date">
                            Contest Date & Time
                        </label>

                        <input
                            id="contest_date"
                            type="datetime-local"
                            name="contest_date"
                            value={formData.contest_date}
                            onChange={handleChange}
                        />

                    </div>


                    {/* URL */}

                    <div className="contest-form-group">

                        <label htmlFor="contest_url">
                            Contest URL
                            <span>
                                {" "} (Optional)
                            </span>
                        </label>

                        <input
                            id="contest_url"
                            type="url"
                            name="contest_url"
                            value={formData.contest_url}
                            onChange={handleChange}
                            placeholder="https://leetcode.com/contest/..."
                        />

                    </div>


                    {/* STATUS */}

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
                            onChange={handleChange}
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
                                ? "Adding..."
                                : "Add Contest"
                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


export default AddContestModal;