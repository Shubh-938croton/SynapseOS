import api from "./api";


// =======================================
// GET ALL CONTESTS
// =======================================

export const getAllContests = async () => {
    const response = await api.get("/contests");
    return response.data?.contests || response.data || [];
};


// =======================================
// GET CONTEST BY ID
// =======================================

export const getContestById = async (contestId) => {
    const response = await api.get(`/contests/${contestId}`);
    return response.data?.contest || response.data;
};


// =======================================
// CREATE CONTEST
// =======================================

export const createContest = async (contestData) => {
    const response = await api.post("/contests", contestData);
    return response.data;
};


// =======================================
// UPDATE CONTEST
// =======================================

export const updateContest = async (
    contestId,
    contestData
) => {
    const response = await api.put(
        `/contests/${contestId}`,
        contestData
    );
    return response.data;
};


// =======================================
// DELETE CONTEST
// =======================================

export const deleteContest = async (contestId) => {
    const response = await api.delete(
        `/contests/${contestId}`
    );
    return response.data;
};