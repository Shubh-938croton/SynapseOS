// =====================================================
// ACTIVITY EVENT CONSTANTS & ENUMS
// =====================================================

const EVENT_TYPES = Object.freeze({
    // Tasks
    TASK_CREATED: "TASK_CREATED",
    TASK_UPDATED: "TASK_UPDATED",
    TASK_COMPLETED: "TASK_COMPLETED",
    TASK_DELETED: "TASK_DELETED",
    TASK_RESCHEDULED: "TASK_RESCHEDULED",

    // Notes
    NOTE_CREATED: "NOTE_CREATED",
    NOTE_UPDATED: "NOTE_UPDATED",
    NOTE_DELETED: "NOTE_DELETED",

    // Goals
    GOAL_CREATED: "GOAL_CREATED",
    GOAL_UPDATED: "GOAL_UPDATED",
    GOAL_COMPLETED: "GOAL_COMPLETED",
    GOAL_DELETED: "GOAL_DELETED",

    // Study Sessions
    STUDY_SESSION_CREATED: "STUDY_SESSION_CREATED",
    STUDY_SESSION_COMPLETED: "STUDY_SESSION_COMPLETED",
    STUDY_SESSION_DELETED: "STUDY_SESSION_DELETED",

    // Pomodoro
    POMODORO_COMPLETED: "POMODORO_COMPLETED",
    POMODORO_INTERRUPTED: "POMODORO_INTERRUPTED",
    POMODORO_ABANDONED: "POMODORO_ABANDONED",
    POMODORO_DELETED: "POMODORO_DELETED",

    // Calendar Events
    CALENDAR_EVENT_CREATED: "CALENDAR_EVENT_CREATED",
    CALENDAR_EVENT_UPDATED: "CALENDAR_EVENT_UPDATED",
    CALENDAR_EVENT_DELETED: "CALENDAR_EVENT_DELETED",

    // Subjects
    SUBJECT_CREATED: "SUBJECT_CREATED",
    SUBJECT_UPDATED: "SUBJECT_UPDATED",
    SUBJECT_DELETED: "SUBJECT_DELETED",

    // Contests
    CONTEST_CREATED: "CONTEST_CREATED",
    CONTEST_UPDATED: "CONTEST_UPDATED",
    CONTEST_DELETED: "CONTEST_DELETED"
});

const ENTITY_TYPES = Object.freeze({
    TASK: "task",
    NOTE: "note",
    GOAL: "goal",
    STUDY_SESSION: "study_session",
    POMODORO_SESSION: "pomodoro_session",
    CALENDAR_EVENT: "calendar_event",
    SUBJECT: "subject",
    CONTEST: "contest"
});

const VALID_EVENT_TYPES_SET = new Set(Object.values(EVENT_TYPES));
const VALID_ENTITY_TYPES_SET = new Set(Object.values(ENTITY_TYPES));

const isValidEventType = (eventType) => {
    return typeof eventType === "string" && VALID_EVENT_TYPES_SET.has(eventType);
};

const isValidEntityType = (entityType) => {
    return typeof entityType === "string" && VALID_ENTITY_TYPES_SET.has(entityType);
};

module.exports = {
    EVENT_TYPES,
    ENTITY_TYPES,
    isValidEventType,
    isValidEntityType
};
