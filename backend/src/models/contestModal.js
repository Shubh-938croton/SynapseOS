const db = require("../config/database");


// =========================
// CREATE CONTEST
// =========================

const createContest = (contest, callback) => {

    const query = `
        INSERT INTO contests
        (
            user_id,
            platform,
            contest_name,
            contest_date,
            contest_url,
            participation_status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            contest.user_id,
            contest.platform,
            contest.contest_name,
            contest.contest_date,
            contest.contest_url || null,
            contest.participation_status || "Upcoming"
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};


// =========================
// GET ALL CONTESTS
// =========================

const getAllContests = (userId, callback) => {

    const query = `
        SELECT
            contest_id,
            user_id,
            platform,
            contest_name,
            contest_date,
            contest_url,
            participation_status,
            created_at
        FROM contests
        WHERE user_id = ?
        ORDER BY contest_date ASC
    `;

    db.query(
        query,
        [userId],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);

        }
    );

};


// =========================
// GET CONTEST BY ID
// =========================

const getContestById = (userId, contestId, callback) => {

    const query = `
        SELECT
            contest_id,
            user_id,
            platform,
            contest_name,
            contest_date,
            contest_url,
            participation_status,
            created_at
        FROM contests
        WHERE contest_id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            contestId,
            userId
        ],
        (err, results) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, results);

        }
    );

};


// =========================
// UPDATE CONTEST
// =========================

const updateContest = (
    userId,
    contestId,
    contest,
    callback
) => {

    const query = `
        UPDATE contests
        SET
            platform = ?,
            contest_name = ?,
            contest_date = ?,
            contest_url = ?,
            participation_status = ?
        WHERE contest_id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            contest.platform,
            contest.contest_name,
            contest.contest_date,
            contest.contest_url || null,
            contest.participation_status || "Upcoming",
            contestId,
            userId
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

};


// =========================
// DELETE CONTEST
// =========================

const deleteContest = (
    userId,
    contestId,
    callback
) => {

    const query = `
        DELETE FROM contests
        WHERE contest_id = ?
        AND user_id = ?
    `;

    db.query(
        query,
        [
            contestId,
            userId
        ],
        (err, result) => {

            if (err) {
                return callback(err, null);
            }

            callback(null, result);

        }
    );

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