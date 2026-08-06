import api from "./api";

export const getAllTasks = async () => {
    const response = await api.get("/tasks");
    return response.data;
};

export const createTask = async (taskData) => {

    const response = await api.post("/tasks", taskData);

    return response.data;

};