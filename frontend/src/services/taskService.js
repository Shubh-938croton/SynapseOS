import api from "./api";

export const getAllTasks = async () => {

    const response = await api.get("/tasks");

    return response.data;

};