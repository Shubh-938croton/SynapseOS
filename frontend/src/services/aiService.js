const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${BASE_URL}/ai`;

const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    };
};

export const getAIStatus = async () => {
    const response = await fetch(`${API_URL}/status`, {
        method: "GET",
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to retrieve AI status");
    return data;
};

export const getDailyBrief = async (date = null, forceRefresh = false) => {
    const response = await fetch(`${API_URL}/daily-brief`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ date, forceRefresh })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to generate daily brief");
    return data;
};

export const approveActionProposal = async (proposal) => {
    const response = await fetch(`${API_URL}/actions/approve`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ proposal })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to execute action proposal");
    return data;
};

export const batchApproveActionProposals = async (proposals) => {
    const response = await fetch(`${API_URL}/actions/batch-approve`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ proposals })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to process batch proposals");
    return data;
};

export const getPersonalizedInsights = async (period = "7d", forceRefresh = false) => {
    const response = await fetch(`${API_URL}/insights`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ period, forceRefresh })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to generate personalized insights");
    return data;
};

export const getDailyPlan = async (date = null) => {
    const response = await fetch(`${API_URL}/planner`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ date })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to generate daily plan");
    return data;
};

export const getTaskBreakdown = async (title, description = "", subjectName = "General", durationMinutes = null) => {
    const response = await fetch(`${API_URL}/task-breakdown`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ title, description, subjectName, durationMinutes })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to break down task");
    return data;
};

export const getWeakAreas = async () => {
    const response = await fetch(`${API_URL}/weak-areas`, {
        method: "POST",
        headers: getHeaders()
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to analyze weak areas");
    return data;
};

export const getWeeklyReview = async (endDate = null) => {
    const response = await fetch(`${API_URL}/weekly-review`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ endDate })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to generate weekly review");
    return data;
};

export const parseNaturalLanguageTask = async (prompt) => {
    const response = await fetch(`${API_URL}/parse-task`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ prompt })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Failed to parse task");
    return data;
};
