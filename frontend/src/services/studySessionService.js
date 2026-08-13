import api from "./api";

// =========================
// GET ALL STUDY SESSIONS
// =========================

export const getAllStudySessions = async () => {

    const response = await api.get("/study-sessions");

    return response.data.sessions;

};


// =========================
// GET STUDY SESSION BY ID
// =========================

export const getStudySessionById = async (sessionId) => {

    const response = await api.get(
        `/study-sessions/${sessionId}`
    );

    return response.data.session;

};


// =========================
// CREATE STUDY SESSION
// =========================

export const createStudySession = async (sessionData) => {

    const response = await api.post(
        "/study-sessions",
        sessionData
    );

    return response.data;

};


// =========================
// UPDATE STUDY SESSION
// =========================

export const updateStudySession = async (
    sessionId,
    sessionData
) => {

    const response = await api.put(
        `/study-sessions/${sessionId}`,
        sessionData
    );

    return response.data;

};


// =========================
// DELETE STUDY SESSION
// =========================

export const deleteStudySession = async (sessionId) => {

    const response = await api.delete(
        `/study-sessions/${sessionId}`
    );

    return response.data;

};