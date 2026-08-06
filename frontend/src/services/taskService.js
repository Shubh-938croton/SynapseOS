import api from "./api";

// Get All Tasks
export const getAllTasks = async () => {

    const token = localStorage.getItem("token");

    const response = await api.get("/tasks", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Create Task
export const createTask = async (taskData) => {

    const token = localStorage.getItem("token");

    const response = await api.post("/tasks", taskData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Update Task
export const updateTask = async (id, taskData) => {

    const token = localStorage.getItem("token");

    const response = await api.put(`/tasks/${id}`, taskData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};

// Delete Task
export const deleteTask = async (id) => {

    const token = localStorage.getItem("token");

    const response = await api.delete(`/tasks/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};