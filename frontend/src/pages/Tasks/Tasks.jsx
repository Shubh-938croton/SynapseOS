import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import TaskCard from "../../components/TaskCard/TaskCard";
import AddTaskModal from "../../components/AddTaskModal/AddTaskModal";
import { getAllTasks } from "../../services/taskService";
import { FiPlus, FiSearch, FiList, FiClock, FiCheckCircle, FiCheckSquare, FiFilter } from "react-icons/fi";
import "./Tasks.css";

function Tasks() {
    // =========================
    // STATE
    // =========================
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    // =========================
    // FETCH TASKS
    // =========================
    const fetchTasks = async () => {
        try {
            const data = await getAllTasks();
            setTasks(data || []);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        fetchTasks();
    }, []);

    // =========================
    // FILTER TASKS
    // =========================
    const filteredTasks = useMemo(() => {
        return tasks.filter((task) => {
            const search = searchTerm.toLowerCase();
            const matchesSearch =
                task.title?.toLowerCase().includes(search) ||
                task.description?.toLowerCase().includes(search);

            const matchesPriority =
                priorityFilter === "All" ||
                task.priority?.toLowerCase() === priorityFilter.toLowerCase();

            const matchesStatus =
                statusFilter === "All" ||
                task.status?.toLowerCase() === statusFilter.toLowerCase();

            return matchesSearch && matchesPriority && matchesStatus;
        });
    }, [tasks, searchTerm, priorityFilter, statusFilter]);

    // =========================
    // STATISTICS
    // =========================
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
        (task) => task.status?.toLowerCase() === "completed"
    ).length;
    const pendingTasks = tasks.filter(
        (task) => task.status?.toLowerCase() !== "completed"
    ).length;

    // =========================
    // CLEAR FILTERS
    // =========================
    const clearFilters = () => {
        setSearchTerm("");
        setPriorityFilter("All");
        setStatusFilter("All");
    };

    // =========================
    // MODAL HANDLERS
    // =========================
    const handleAddTask = () => {
        setTaskToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setTaskToEdit(task);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTaskToEdit(null);
    };

    return (
        <DashboardLayout>
            <div className="tasks-page">
                {/* PAGE HEADER */}
                <div className="tasks-header">
                    <div>
                        <h1>Tasks</h1>
                        <p>Track your assignments, study milestones, and deliverables.</p>
                    </div>

                    <button
                        className="add-task-btn"
                        onClick={handleAddTask}
                    >
                        <FiPlus />
                        <span>Add Task</span>
                    </button>
                </div>

                {/* TASK STATISTICS */}
                <div className="task-stats">
                    <div className="stat-card">
                        <div className="stat-icon">
                            <FiList />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Total Tasks</span>
                            <span className="stat-value">{totalTasks}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon pending-icon">
                            <FiClock />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Incomplete</span>
                            <span className="stat-value">{pendingTasks}</span>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon completed-icon">
                            <FiCheckCircle />
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">Completed</span>
                            <span className="stat-value">{completedTasks}</span>
                        </div>
                    </div>
                </div>

                {/* TOOLBAR */}
                <div className="task-toolbar">
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search tasks by title or description..."
                            className="search-box"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters-group">
                        <select
                            className="filter"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="All">All Priorities</option>
                            <option value="High">High Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="Low">Low Priority</option>
                        </select>

                        <select
                            className="filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>

                        {(searchTerm || priorityFilter !== "All" || statusFilter !== "All") && (
                            <button
                                className="clear-filter-btn"
                                onClick={clearFilters}
                            >
                                Reset Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* RESULTS INFO */}
                <div className="task-results">
                    <span>
                        Showing <strong>{filteredTasks.length}</strong> of <strong>{totalTasks}</strong> tasks
                    </span>
                </div>

                {/* TASK LIST */}
                <div className="tasks-list">
                    {filteredTasks.length === 0 ? (
                        <div className="empty-tasks">
                            <div className="empty-icon">
                                <FiCheckSquare />
                            </div>
                            <h3>No tasks match your criteria</h3>
                            <p>
                                {tasks.length === 0
                                    ? "You don't have any active tasks yet. Create one to organize your work."
                                    : "No tasks matched your search or filters. Try adjusting your criteria."}
                            </p>

                            {tasks.length === 0 ? (
                                <button
                                    className="empty-add-btn"
                                    onClick={handleAddTask}
                                >
                                    <FiPlus />
                                    <span>Create First Task</span>
                                </button>
                            ) : (
                                <button
                                    className="empty-add-btn"
                                    onClick={clearFilters}
                                >
                                    Reset Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task.task_id}
                                task={task}
                                onEdit={handleEditTask}
                                onTaskChanged={fetchTasks}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* ADD / EDIT TASK MODAL */}
            <AddTaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                taskToEdit={taskToEdit}
                onTaskCreated={fetchTasks}
            />
        </DashboardLayout>
    );
}

export default Tasks;