<DashboardLayout>

    <div className="tasks-page">

        <div className="tasks-header">

            <h1>My Tasks</h1>

            <button className="add-task-btn">
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

                tasks.map(task => (

                    <TaskCard
                        key={task.task_id}
                        task={task}
                    />

                ))

            )
        }

    </div>

</DashboardLayout>