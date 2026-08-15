const API_URL = "http://localhost:5000/api/contests";


// =======================================
// GET ALL CONTESTS
// =======================================

export const getAllContests = async () => {

    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "GET",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch contests"
        );
    }

    return data;
};


// =======================================
// GET CONTEST BY ID
// =======================================

export const getContestById = async (contestId) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${contestId}`,
        {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch contest"
        );
    }

    return data;
};


// =======================================
// CREATE CONTEST
// =======================================

export const createContest = async (contestData) => {

    const token = localStorage.getItem("token");

    const response = await fetch(API_URL, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },

        body: JSON.stringify(contestData)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to create contest"
        );
    }

    return data;
};


// =======================================
// UPDATE CONTEST
// =======================================

export const updateContest = async (
    contestId,
    contestData
) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${contestId}`,
        {
            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },

            body: JSON.stringify(contestData)
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update contest"
        );
    }

    return data;
};


// =======================================
// DELETE CONTEST
// =======================================

export const deleteContest = async (contestId) => {

    const token = localStorage.getItem("token");

    const response = await fetch(
        `${API_URL}/${contestId}`,
        {
            method: "DELETE",

            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to delete contest"
        );
    }

    return data;
};