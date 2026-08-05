import {
    FaHome,
    FaTasks,
    FaStickyNote,
    FaBullseye,
    FaCalendarAlt,
    FaBookOpen,
    FaClock,
    FaChartBar,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar() {

    return (

        <aside className="sidebar">

            <div className="sidebar-logo">
                🧠 SynapseOS
            </div>

            <nav className="sidebar-menu">

                <a href="/dashboard" className="active">
                    <FaHome />
                    <span>Dashboard</span>
                </a>

                <a href="#">
                    <FaTasks />
                    <span>Tasks</span>
                </a>

                <a href="#">
                    <FaStickyNote />
                    <span>Notes</span>
                </a>

                <a href="#">
                    <FaBullseye />
                    <span>Goals</span>
                </a>

                <a href="#">
                    <FaCalendarAlt />
                    <span>Calendar</span>
                </a>

                <a href="#">
                    <FaBookOpen />
                    <span>Study Sessions</span>
                </a>

                <a href="#">
                    <FaClock />
                    <span>Pomodoro</span>
                </a>

                <a href="#">
                    <FaChartBar />
                    <span>Analytics</span>
                </a>

                <a href="#">
                    <FaCog />
                    <span>Settings</span>
                </a>

            </nav>

            <div className="sidebar-footer">

                <button className="logout-btn">
                    <FaSignOutAlt />
                    <span>Logout</span>
                </button>

            </div>

        </aside>

    );

}

export default Sidebar;