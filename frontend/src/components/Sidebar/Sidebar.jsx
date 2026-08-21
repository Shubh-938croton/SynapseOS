import {
    FaHome,
    FaTasks,
    FaStickyNote,
    FaBullseye,
    FaCalendarAlt,
    FaBookOpen,
    FaClock,
    FaChartBar,
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaUsers
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
    return (
        <aside className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo">
                🧠 SynapseOS
            </div>

            {/* MENU */}
            <nav className="sidebar-menu">

                {/* DASHBOARD */}
                <a href="/dashboard">
                    <FaHome />
                    <span>Dashboard</span>
                </a>

                {/* TASKS */}
                <a href="/tasks">
                    <FaTasks />
                    <span>Tasks</span>
                </a>

                {/* NOTES */}
                <a href="/notes">
                    <FaStickyNote />
                    <span>Notes</span>
                </a>

                {/* GOALS */}
                <a href="/goals">
                    <FaBullseye />
                    <span>Goals</span>
                </a>

                {/* CALENDAR */}
                <a href="/calendar">
                    <FaCalendarAlt />
                    <span>Calendar</span>
                </a>

                {/* STUDY SESSIONS */}
                <a href="/study-sessions">
                    <FaBookOpen />
                    <span>Study Sessions</span>
                </a>

                {/* POMODORO */}
                <a href="/pomodoro">
                    <FaClock />
                    <span>Pomodoro</span>
                </a>

                {/* ANALYTICS */}
                <a href="/analytics">
                    <FaChartBar />
                    <span>Analytics</span>
                </a>

                {/* PROFILE */}
                <a href="/profile">
                    <FaUser />
                    <span>Profile</span>
                </a>

                {/* SETTINGS */}
                <a href="/settings">
                    <FaCog />
                    <span>Settings</span>
                </a>

            </nav>

            {/* LOGOUT */}
            <div className="sidebar-footer">

                <button
                    className="logout-btn"
                    onClick={() => {
                        localStorage.removeItem("token");
                        localStorage.removeItem("user");

                        window.location.href = "/login";
                    }}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;