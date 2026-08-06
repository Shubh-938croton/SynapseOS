import api from "./api";

export const getAllSubjects = async () => {
    const response = await api.get("/subjects");
    return response.data.subjects;
};