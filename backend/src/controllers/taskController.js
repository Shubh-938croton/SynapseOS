const taskModel = require("../models/taskModel");
const { recordEvent, EVENT_TYPES, ENTITY_TYPES } = require("../services/activityEventService");

// Get all tasks
const getAllTasks = (req, res) => {
    try {
        const user_id = req.user.user_id;

        taskModel.getAllTasks(user_id, (err, tasks) => {
            if (err) {
                console.error("Get all tasks database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch tasks"
                });
            }

            res.status(200).json(tasks || []);
        });
    } catch (error) {
        console.error("Get all tasks controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const createTask = (req, res) => {
    try {
        // Get user_id from the JWT
        const user_id = req.user.user_id;

        // Get remaining fields from the request body
        const {
            subject_id,
            title,
            description,
            priority,
            status,
            due_date
        } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Task title is required"
            });
        }

        const task = {
            user_id,
            subject_id: subject_id || null,
            title: title.trim(),
            description: description ? description.trim() : null,
            priority: priority || "Medium",
            status: status || "Pending",
            due_date: due_date || null
        };

        taskModel.createTask(task, (err, result) => {
            if (err) {
                console.error("Create task database error:", err);
                return res.status(500).json({
                    message: "Failed to create task"
                });
            }

            // Record TASK_CREATED event
            recordEvent({
                userId: user_id,
                eventType: EVENT_TYPES.TASK_CREATED,
                entityType: ENTITY_TYPES.TASK,
                entityId: result.insertId,
                metadata: {
                    title: task.title,
                    priority: task.priority,
                    status: task.status,
                    due_date: task.due_date,
                    subject_id: task.subject_id
                }
            });

            return res.status(201).json({
                message: "Task created successfully",
                taskId: result.insertId
            });
        });
    } catch (error) {
        console.error("Create task controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getTaskById = (req, res) => {
    try {
        const user_id = req.user.user_id;
        const id = req.params.id;

        taskModel.getTaskById(user_id, id, (err, results) => {
            if (err) {
                console.error("Get task by ID database error:", err);
                return res.status(500).json({
                    message: "Failed to fetch task"
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            res.status(200).json(results[0]);
        });
    } catch (error) {
        console.error("Get task by ID controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const updateTask = (req, res) => {
    try {
        const user_id = req.user.user_id;
        const id = req.params.id;
        const task = req.body;

        taskModel.updateTask(user_id, id, task, (err, result) => {
            if (err) {
                console.error("Update task database error:", err);
                return res.status(500).json({
                    message: "Failed to update task"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            // Record events based on update specifics
            if (task.status === "Completed") {
                recordEvent({
                    userId: user_id,
                    eventType: EVENT_TYPES.TASK_COMPLETED,
                    entityType: ENTITY_TYPES.TASK,
                    entityId: Number(id),
                    metadata: {
                        status: "Completed",
                        completed_at: new Date().toISOString()
                    }
                });
            } else if (task.due_date !== undefined) {
                recordEvent({
                    userId: user_id,
                    eventType: EVENT_TYPES.TASK_RESCHEDULED,
                    entityType: ENTITY_TYPES.TASK,
                    entityId: Number(id),
                    metadata: {
                        due_date: task.due_date
                    }
                });
            }

            recordEvent({
                userId: user_id,
                eventType: EVENT_TYPES.TASK_UPDATED,
                entityType: ENTITY_TYPES.TASK,
                entityId: Number(id),
                metadata: {
                    updated_fields: Object.keys(task)
                }
            });

            return res.status(200).json({
                message: "Task updated successfully"
            });
        });
    } catch (error) {
        console.error("Update task controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const deleteTask = (req, res) => {
    try {
        const user_id = req.user.user_id;
        const id = req.params.id;

        taskModel.deleteTask(user_id, id, (err, result) => {
            if (err) {
                console.error("Delete task database error:", err);
                return res.status(500).json({
                    message: "Failed to delete task"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            // Record TASK_DELETED event
            recordEvent({
                userId: user_id,
                eventType: EVENT_TYPES.TASK_DELETED,
                entityType: ENTITY_TYPES.TASK,
                entityId: Number(id)
            });

            return res.status(200).json({
                message: "Task deleted successfully"
            });
        });
    } catch (error) {
        console.error("Delete task controller error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    getTaskById,
    updateTask,
    deleteTask
};