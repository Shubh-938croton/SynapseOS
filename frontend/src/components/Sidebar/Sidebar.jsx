import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome,
    FaTasks,
    FaStickyNote,
    FaBullseye,
    FaCalendarAlt,
    FaBookOpen,
    FaClock,
    FaChartBar,
    FaTrophy,
    FaUser,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <aside className="sidebar">

            {/* LOGO */}
            <div className="sidebar-logo">
                🧠 SynapseOS
            </div>

            {/* MENU */}
            <nav className="sidebar-menu">

                {/* DASHBOARD */}
                <NavLink to="/dashboard">
                    <FaHome />
                    <span>Dashboard</span>
                </NavLink>

                {/* TASKS */}
                <NavLink to="/tasks">
                    <FaTasks />
                    <span>Tasks</span>
                </NavLink>

                {/* NOTES */}
                <NavLink to="/notes">
                    <FaStickyNote />
                    <span>Notes</span>
                </NavLink>

                {/* GOALS */}
                <NavLink to="/goals">
                    <FaBullseye />
                    <span>Goals</span>
                </NavLink>

                {/* CALENDAR */}
                <NavLink to="/calendar">
                    <FaCalendarAlt />
                    <span>Calendar</span>
                </NavLink>

                {/* STUDY SESSIONS */}
                <NavLink to="/study-sessions">
                    <FaBookOpen />
                    <span>Study Sessions</span>
                </NavLink>

                {/* POMODORO */}
                <NavLink to="/pomodoro">
                    <FaClock />
                    <span>Pomodoro</span>
                </NavLink>

                {/* CONTESTS */}
                <NavLink to="/contests">
                    <FaTrophy />
                    <span>Contests</span>
                </NavLink>

                {/* ANALYTICS */}
                <NavLink to="/analytics">
                    <FaChartBar />
                    <span>Analytics</span>
                </NavLink>

                {/* PROFILE */}
                <NavLink to="/profile">
                    <FaUser />
                    <span>Profile</span>
                </NavLink>

                {/* SETTINGS */}
                <NavLink to="/settings">
                    <FaCog />
                    <span>Settings</span>
                </NavLink>

            </nav>

            {/* LOGOUT */}
            <div className="sidebar-footer">

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

            </div>

        </aside>
    );
}

export default Sidebar;