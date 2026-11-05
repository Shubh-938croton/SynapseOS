import api from "./api";

// =======================================
// GET SYLLABUS FOR A SUBJECT
// =======================================
export const getSubjectSyllabus = async (subjectId) => {
    const response = await api.get(`/syllabus?subject_id=${subjectId}`);
    return response.data;
};

// =======================================
// CREATE UNIT
// =======================================
export const createUnit = async (unitData) => {
    const response = await api.post("/syllabus/units", unitData);
    return response.data;
};

// =======================================
// UPDATE UNIT
// =======================================
export const updateUnit = async (unitId, unitData) => {
    const response = await api.put(`/syllabus/units/${unitId}`, unitData);
    return response.data;
};

// =======================================
// DELETE UNIT
// =======================================
export const deleteUnit = async (unitId) => {
    const response = await api.delete(`/syllabus/units/${unitId}`);
    return response.data;
};

// =======================================
// CREATE TOPIC
// =======================================
export const createTopic = async (topicData) => {
    const response = await api.post("/syllabus/topics", topicData);
    return response.data;
};

// =======================================
// UPDATE TOPIC
// =======================================
export const updateTopic = async (topicId, topicData) => {
    const response = await api.put(`/syllabus/topics/${topicId}`, topicData);
    return response.data;
};

// =======================================
// UPDATE TOPIC STATUS
// =======================================
export const updateTopicStatus = async (topicId, status) => {
    const response = await api.patch(`/syllabus/topics/${topicId}/status`, { status });
    return response.data;
};

// =======================================
// DELETE TOPIC
// =======================================
export const deleteTopic = async (topicId) => {
    const response = await api.delete(`/syllabus/topics/${topicId}`);
    return response.data;
};

// =======================================
// PARSE RAW SYLLABUS TEXT (Smart Parser)
// =======================================
export const parseRawSyllabus = async (text) => {
    const response = await api.post("/syllabus/parse", { text });
    return response.data;
};

// =======================================
// BULK IMPORT MODULES
// =======================================
export const bulkImportSyllabus = async (subjectId, modules) => {
    const response = await api.post("/syllabus/import", {
        subject_id: subjectId,
        modules
    });
    return response.data;
};
