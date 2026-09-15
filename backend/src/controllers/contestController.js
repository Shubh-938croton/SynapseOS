const contestModel = require("../models/contestModel");


// =========================
// CONSTANTS
// =========================

const allowedPlatforms = [
    "LeetCode",
    "Codeforces",
    "CodeChef",
    "HackerRank",
    "AtCoder",
    "Other"
];

const allowedStatuses = [
    "Upcoming",
    "Participated",
    "Missed"
];


// =========================
// HELPER: VALIDATE CONTEST URL
// =========================

const isValidContestUrl = (url) => {
    if (!url || !url.trim()) return true;
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) return false;
    try {
        const parsed = new URL(trimmed);
        return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
        return false;
    }
};


// =========================
// CREATE CONTEST
// =========================

const createContest = (req, res) => {

    try {

        const userId = req.user.user_id;

        const {
            platform,
            contest_name,
            contest_date,
            contest_url,
            participation_status
        } = req.body;


        // -------------------------
        // Validate required fields
        // -------------------------

        if (
            !platform ||
            !contest_name ||
            !contest_date
        ) {

            return res.status(400).json({
                message:
                    "Platform, contest name and contest date are required"
            });

        }


        // -------------------------
        // Validate platform
        // -------------------------

        if (!allowedPlatforms.includes(platform)) {

            return res.status(400).json({
                message: "Invalid contest platform"
            });

        }


        // -------------------------
        // Validate date
        // -------------------------

        const contestDate = new Date(contest_date);

        if (
            Number.isNaN(
                contestDate.getTime()
            )
        ) {

            return res.status(400).json({
                message: "Invalid contest date"
            });

        }


        // -------------------------
        // Validate status
        // -------------------------

        const status =
            participation_status || "Upcoming";

        if (!allowedStatuses.includes(status)) {

            return res.status(400).json({
                message:
                    "Invalid participation status"
            });

        }


        // -------------------------
        // Validate contest URL
        // -------------------------

        if (contest_url && !isValidContestUrl(contest_url)) {

            return res.status(400).json({
                message: "Contest URL must be a valid HTTP or HTTPS URL"
            });

        }


        // -------------------------
        // Create contest object
        // -------------------------

        const contest = {

            user_id: userId,

            platform,

            contest_name:
                contest_name.trim(),

            contest_date,

            contest_url:
                contest_url?.trim() || null,

            participation_status:
                status

        };


        // -------------------------
        // Save contest
        // -------------------------

        contestModel.createContest(
            contest,
            (err, result) => {

                if (err) {

                    console.error(
                        "Create contest database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to create contest"
                    });

                }


                return res.status(201).json({

                    message:
                        "Contest created successfully",

                    contest_id:
                        result.insertId

                });

            }
        );

    } catch (error) {

        console.error(
            "Create contest controller error:",
            error
        );

        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// GET ALL CONTESTS
// =========================

const getAllContests = (req, res) => {

    try {

        const userId =
            req.user.user_id;


        contestModel.getAllContests(
            userId,
            (err, contests) => {

                if (err) {

                    console.error("Get all contests database error:", err);
                    return res.status(500).json({
                        message: "Failed to fetch contests"
                    });

                }


                return res.status(200).json({

                    message:
                        "Contests fetched successfully",

                    count:
                        contests ? contests.length : 0,

                    contests:
                        contests || []

                });

            }
        );

    } catch (error) {

        console.error("Get all contests controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// GET CONTEST BY ID
// =========================

const getContestById = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const contestId =
            req.params.id;


        contestModel.getContestById(
            userId,
            contestId,
            (err, contests) => {

                if (err) {

                    console.error("Get contest by ID database error:", err);
                    return res.status(500).json({
                        message: "Failed to fetch contest"
                    });

                }


                if (
                    !contests ||
                    contests.length === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Contest not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Contest fetched successfully",

                    contest:
                        contests[0]

                });

            }
        );

    } catch (error) {

        console.error("Get contest by ID controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// UPDATE CONTEST
// =========================

const updateContest = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const contestId =
            req.params.id;


        const {
            platform,
            contest_name,
            contest_date,
            contest_url,
            participation_status
        } = req.body;


        // -------------------------
        // Validate required fields
        // -------------------------

        if (
            !platform ||
            !contest_name ||
            !contest_date
        ) {

            return res.status(400).json({

                message:
                    "Platform, contest name and contest date are required"

            });

        }


        // -------------------------
        // Validate platform
        // -------------------------

        if (
            !allowedPlatforms.includes(platform)
        ) {

            return res.status(400).json({

                message:
                    "Invalid contest platform"

            });

        }


        // -------------------------
        // Validate date
        // -------------------------

        const contestDate =
            new Date(contest_date);

        if (
            Number.isNaN(
                contestDate.getTime()
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid contest date"

            });

        }


        // -------------------------
        // Validate status
        // -------------------------

        const status =
            participation_status || "Upcoming";

        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid participation status"

            });

        }


        // -------------------------
        // Validate contest URL
        // -------------------------

        if (contest_url && !isValidContestUrl(contest_url)) {

            return res.status(400).json({
                message: "Contest URL must be a valid HTTP or HTTPS URL"
            });

        }


        // -------------------------
        // Update contest object
        // -------------------------

        const contest = {

            platform,

            contest_name:
                contest_name.trim(),

            contest_date,

            contest_url:
                contest_url?.trim() || null,

            participation_status:
                status

        };


        // -------------------------
        // Update database
        // -------------------------

        contestModel.updateContest(
            userId,
            contestId,
            contest,
            (err, result) => {

                if (err) {

                    console.error(
                        "Update contest database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to update contest"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Contest not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Contest updated successfully"

                });

            }
        );

    } catch (error) {

        console.error("Update contest controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// DELETE CONTEST
// =========================

const deleteContest = (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const contestId =
            req.params.id;


        contestModel.deleteContest(
            userId,
            contestId,
            (err, result) => {

                if (err) {

                    console.error(
                        "Delete contest database error:",
                        err
                    );

                    return res.status(500).json({
                        message: "Failed to delete contest"
                    });

                }


                if (
                    result.affectedRows === 0
                ) {

                    return res.status(404).json({

                        message:
                            "Contest not found"

                    });

                }


                return res.status(200).json({

                    message:
                        "Contest deleted successfully"

                });

            }
        );

    } catch (error) {

        console.error("Delete contest controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });

    }

};


// =========================
// EXPORT
// =========================

module.exports = {

    createContest,

    getAllContests,

    getContestById,

    updateContest,

    deleteContest

};