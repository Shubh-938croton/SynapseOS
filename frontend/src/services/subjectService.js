import api from "./api";

// =======================================
// GET ALL SUBJECTS
// =======================================
export const getAllSubjects = async () => {
    const response = await api.get("/subjects");
    return response.data.subjects;
};

// =======================================
// GET SINGLE SUBJECT
// =======================================
export const getSubjectById = async (subjectId) => {
    const response = await api.get(`/subjects/${subjectId}`);
    return response.data;
};

// =======================================
// CREATE SUBJECT
// =======================================
export const createSubject = async (subjectData) => {
    const response = await api.post("/subjects", subjectData);
    return response.data;
};

// =======================================
// UPDATE SUBJECT
// =======================================
export const updateSubject = async (subjectId, subjectData) => {
    const response = await api.put(`/subjects/${subjectId}`, subjectData);
    return response.data;
};

// =======================================
// DELETE SUBJECT
// =======================================
export const deleteSubject = async (subjectId) => {
    const response = await api.delete(`/subjects/${subjectId}`);
    return response.data;
};