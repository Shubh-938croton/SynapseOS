import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import TaskCard from "../../components/TaskCard/TaskCard";
import AddTaskModal from "../../components/AddTaskModal/AddTaskModal";

import { getAllTasks } from "../../services/taskService";

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

            setTasks(data);

        } catch (error) {

            console.error(
                "Error fetching tasks:",
                error
            );

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

            // Search
            const search = searchTerm.toLowerCase();

            const matchesSearch =
                task.title?.toLowerCase().includes(search) ||
                task.description?.toLowerCase().includes(search);


            // Priority
            const matchesPriority =
                priorityFilter === "All" ||
                task.priority === priorityFilter;


            // Status
            const matchesStatus =
                statusFilter === "All" ||
                task.status === statusFilter;


            return (
                matchesSearch &&
                matchesPriority &&
                matchesStatus
            );

        });

    }, [
        tasks,
        searchTerm,
        priorityFilter,
        statusFilter
    ]);


    // =========================
    // STATISTICS
    // =========================

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) =>
            task.status?.toLowerCase() === "completed"
    ).length;

    const pendingTasks = tasks.filter(
        (task) =>
            task.status?.toLowerCase() === "pending"
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
    // OPEN CREATE MODAL
    // =========================

    const handleAddTask = () => {

        setTaskToEdit(null);

        setIsModalOpen(true);

    };


    // =========================
    // OPEN EDIT MODAL
    // =========================

    const handleEditTask = (task) => {

        setTaskToEdit(task);

        setIsModalOpen(true);

    };


    // =========================
    // CLOSE MODAL
    // =========================

    const handleCloseModal = () => {

        setIsModalOpen(false);

        setTaskToEdit(null);

    };


    // =========================
    // RENDER
    // =========================

    return (

        <DashboardLayout>

            <div className="tasks-page">


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <div className="tasks-header">

                    <div>

                        <h1>
                            My Tasks
                        </h1>

                        <p>
                            Organize your work and stay
                            on top of your productivity.
                        </p>

                    </div>


                    <button
                        className="add-task-btn"
                        onClick={handleAddTask}
                    >

                        + Add Task

                    </button>

                </div>


                {/* =================================
                    TASK STATISTICS
                ================================= */}

                <div className="task-stats">

    <div className="stat-card">

        <div className="stat-icon">
            📋
        </div>

        <div className="stat-info">

            <span className="stat-label">
                Total Tasks
            </span>

            <span className="stat-value">
                {tasks.length}
            </span>

        </div>

    </div>


    <div className="stat-card">

        <div className="stat-icon">
            ⏳
        </div>

        <div className="stat-info">

            <span className="stat-label">
                Pending
            </span>

            <span className="stat-value">
                {
                    tasks.filter(
                        task => task.status !== "Completed"
                    ).length
                }
            </span>

        </div>

    </div>


    <div className="stat-card">

        <div className="stat-icon">
            ✅
        </div>

        <div className="stat-info">

            <span className="stat-label">
                Completed
            </span>

            <span className="stat-value">
                {
                    tasks.filter(
                        task => task.status === "Completed"
                    ).length
                }
            </span>

        </div>

    </div>

</div>


                {/* =================================
                    TOOLBAR
                ================================= */}

                <div className="task-toolbar">


                    {/* Search */}

                    <div className="search-wrapper">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search tasks..."
                            className="search-box"
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(e.target.value)
                            }
                        />

                    </div>


                    {/* Priority */}

                    <select
                        className="filter"
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(e.target.value)
                        }
                    >

                        <option value="All">
                            All Priorities
                        </option>

                        <option value="High">
                            High
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Low">
                            Low
                        </option>

                    </select>


                    {/* Status */}

                    <select
                        className="filter"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >

                        <option value="All">
                            All Status
                        </option>

                        <option value="Pending">
                            Pending
                        </option>

                        <option value="Completed">
                            Completed
                        </option>

                    </select>


                    {/* Clear */}

                    {(searchTerm ||
                        priorityFilter !== "All" ||
                        statusFilter !== "All") && (

                        <button
                            className="clear-filter-btn"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                    )}

                </div>


                {/* =================================
                    RESULTS INFO
                ================================= */}

                <div className="task-results">

                    <span>

                        Showing{" "}
                        <strong>
                            {filteredTasks.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {totalTasks}
                        </strong>{" "}
                        tasks

                    </span>

                </div>


                {/* =================================
                    TASK LIST
                ================================= */}

                <div className="tasks-list">


                    {filteredTasks.length === 0 ? (

                        <div className="empty-tasks">

                            <div className="empty-icon">
                                📝
                            </div>

                            <h3>
                                No tasks found
                            </h3>

                            <p>

                                {tasks.length === 0
                                    ? "You haven't created any tasks yet."
                                    : "Try changing your search or filters."
                                }

                            </p>


                            {tasks.length === 0 ? (

                                <button
                                    className="empty-add-btn"
                                    onClick={handleAddTask}
                                >
                                    + Create Your First Task
                                </button>

                            ) : (

                                <button
                                    className="empty-add-btn"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
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


            {/* =================================
                ADD / EDIT TASK MODAL
            ================================= */}

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