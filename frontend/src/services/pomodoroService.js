import api from "./api";

// =======================================
// GET ALL POMODORO SESSIONS
// =======================================

export const getAllPomodoroSessions = async () => {

    const response = await api.get(
        "/pomodoro"
    );

    return response.data.sessions;

};


// =======================================
// GET POMODORO SESSION BY ID
// =======================================

export const getPomodoroSessionById = async (
    sessionId
) => {

    const response = await api.get(
        `/pomodoro/${sessionId}`
    );

    return response.data.session;

};


// =======================================
// CREATE POMODORO SESSION
// =======================================

export const createPomodoroSession = async (
    sessionData
) => {

    const response = await api.post(
        "/pomodoro",
        sessionData
    );

    return response.data;

};


// =======================================
// UPDATE POMODORO SESSION
// =======================================

export const updatePomodoroSession = async (
    sessionId,
    sessionData
) => {

    const response = await api.put(
        `/pomodoro/${sessionId}`,
        sessionData
    );

    return response.data;

};


// =======================================
// DELETE POMODORO SESSION
// =======================================

export const deletePomodoroSession = async (
    sessionId
) => {

    const response = await api.delete(
        `/pomodoro/${sessionId}`
    );

    return response.data;

};