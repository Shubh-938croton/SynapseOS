import "./AddTaskModal.css";

function AddTaskModal({ isOpen, onClose }) {

    if (!isOpen) return null;

    return (

        <div className="modal-overlay">

            <div className="modal">

                <div className="modal-header">

                    <h2>Create New Task</h2>

                    <button onClick={onClose}>
                        ✕
                    </button>

                </div>

                <form>

                    <input
                        type="text"
                        placeholder="Task Title"
                    />

                    <textarea
                        placeholder="Description"
                    />

                    <select>

                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>

                    </select>

                    <input type="date"/>

                    <button type="submit">

                        Create Task

                    </button>

                </form>

            </div>

        </div>

    );

}

export default AddTaskModal;