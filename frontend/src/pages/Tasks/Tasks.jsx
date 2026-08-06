import { useEffect, useState } from "react";

import DashboardLayout from "../../components/Layout/DashboardLayout";
import TaskCard from "../../components/TaskCard/TaskCard";
import AddTaskModal from "../../components/AddTaskModal/AddTaskModal";

import { getAllTasks } from "../../services/taskService";

import "./Tasks.css";

function Tasks() {

    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {

        async function fetchTasks() {

            try {

                const data = await getAllTasks();

                console.log(data);

                setTasks(data);

            } catch (error) {

                console.error("Error fetching tasks:", error);

            }

        }

        fetchTasks();

    }, []);

    return (

        <DashboardLayout>

            <div className="tasks-page">

                <div className="tasks-header">

                    <h1>My Tasks</h1>

                    <button
                        className="add-task-btn"
                        onClick={() => setIsModalOpen(true)}
                    >
                        + Add Task
                    </button>

                </div>

                <div className="task-toolbar">

                    <input
                        type="text"
                        placeholder="🔍 Search tasks..."
                        className="search-box"
                    />

                    <select className="filter">

                        <option>All Priorities</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>

                    </select>

                    <select className="filter">

                        <option>All Status</option>
                        <option>Pending</option>
                        <option>Completed</option>

                    </select>

                </div>

                {
                    tasks.length === 0 ? (

                        <h3>No Tasks Found</h3>

                    ) : (

                        tasks.map((task) => (

                            <TaskCard
                                key={task.task_id}
                                task={task}
                            />

                        ))

                    )
                }

            </div>

            <AddTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

        </DashboardLayout>

    );

}

export default Tasks;

