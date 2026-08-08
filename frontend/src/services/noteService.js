import api from "./api";

// ==========================================
// Get all notes
// ==========================================
export const getAllNotes = async () => {
    const token = localStorage.getItem("token");

    const response = await api.get("/notes", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};


// ==========================================
// Get note by ID
// ==========================================
export const getNoteById = async (id) => {
    const token = localStorage.getItem("token");

    const response = await api.get(`/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};


// ==========================================
// Create note
// ==========================================
export const createNote = async (noteData) => {
    const token = localStorage.getItem("token");

    const response = await api.post("/notes", noteData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};


// ==========================================
// Update note
// ==========================================
export const updateNote = async (id, noteData) => {
    const token = localStorage.getItem("token");

    const response = await api.put(`/notes/${id}`, noteData, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};


// ==========================================
// Delete note
// ==========================================
export const deleteNote = async (id) => {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
};