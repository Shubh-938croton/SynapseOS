import api from "./api";

// =========================
// GET ALL GOALS
// =========================

export const getAllGoals = async () => {

    const response = await api.get("/goals");

    return response.data.goals;

};


// =========================
// GET GOAL BY ID
// =========================

export const getGoalById = async (goalId) => {

    const response =
        await api.get(`/goals/${goalId}`);

    return response.data.goal;

};


// =========================
// CREATE GOAL
// =========================

export const createGoal = async (goalData) => {

    const response =
        await api.post(
            "/goals",
            goalData
        );

    return response.data;

};


// =========================
// UPDATE GOAL
// =========================

export const updateGoal = async (
    goalId,
    goalData
) => {

    const response =
        await api.put(
            `/goals/${goalId}`,
            goalData
        );

    return response.data;

};


// =========================
// DELETE GOAL
// =========================

export const deleteGoal = async (goalId) => {

    const response =
        await api.delete(
            `/goals/${goalId}`
        );

    return response.data;

};