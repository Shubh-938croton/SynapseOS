import api from "./api";


// =========================
// GET ALL EVENTS
// =========================

export const getAllEvents = async () => {

    const response = await api.get("/calendar");

    return response.data.events;

};


// =========================
// GET EVENT BY ID
// =========================

export const getEventById = async (eventId) => {

    const response =
        await api.get(`/calendar/${eventId}`);

    return response.data.event;

};


// =========================
// CREATE EVENT
// =========================

export const createEvent = async (eventData) => {

    const response =
        await api.post("/calendar", eventData);

    return response.data;

};


// =========================
// UPDATE EVENT
// =========================

export const updateEvent = async (
    eventId,
    eventData
) => {

    const response =
        await api.put(
            `/calendar/${eventId}`,
            eventData
        );

    return response.data;

};


// =========================
// DELETE EVENT
// =========================

export const deleteEvent = async (eventId) => {

    const response =
        await api.delete(
            `/calendar/${eventId}`
        );

    return response.data;

};