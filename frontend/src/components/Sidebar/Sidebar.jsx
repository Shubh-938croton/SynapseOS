import { NavLink, useNavigate } from "react-router-dom";
import {
    FiHome,
    FiCheckSquare,
    FiFileText,
    FiTarget,
    FiCalendar,
    FiClock,
    FiBookOpen,
    FiFolder,
    FiAward,
    FiPlayCircle,
    FiBarChart2,
    FiUser,
    FiSettings,
    FiLogOut
} from "react-icons/fi";

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
            {/* BRAND LOGO */}
            <div className="sidebar-logo">
                <div className="logo-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 3v6m0 6v6M3 12h6m6 0h6"></path>
                    </svg>
                </div>
                <span className="logo-text">SynapseOS</span>
            </div>

            {/* NAVIGATION MENU */}
            <nav className="sidebar-menu">
                <div className="menu-group">
                    <span className="menu-group-title">Workspace</span>
                    <NavLink to="/dashboard" end>
                        <FiHome />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/tasks">
                        <FiCheckSquare />
                        <span>Tasks</span>
                    </NavLink>
                    <NavLink to="/notes">
                        <FiFileText />
                        <span>Notes</span>
                    </NavLink>
                    <NavLink to="/goals">
                        <FiTarget />
                        <span>Goals</span>
                    </NavLink>
                    <NavLink to="/calendar">
                        <FiCalendar />
                        <span>Calendar</span>
                    </NavLink>
                </div>

                <div className="menu-group">
                    <span className="menu-group-title">Focus &amp; Learning</span>
                    <NavLink to="/pomodoro">
                        <FiClock />
                        <span>Pomodoro</span>
                    </NavLink>
                    <NavLink to="/study-sessions">
                        <FiBookOpen />
                        <span>Study Sessions</span>
                    </NavLink>
                    <NavLink to="/subjects">
                        <FiFolder />
                        <span>Subjects</span>
                    </NavLink>
                    <NavLink to="/contests">
                        <FiAward />
                        <span>Contests</span>
                    </NavLink>
                    <NavLink to="/youtube">
                        <FiPlayCircle />
                        <span>YouTube</span>
                    </NavLink>
                </div>

                <div className="menu-group">
                    <span className="menu-group-title">System</span>
                    <NavLink to="/analytics">
                        <FiBarChart2 />
                        <span>Analytics</span>
                    </NavLink>
                    <NavLink to="/profile">
                        <FiUser />
                        <span>Profile</span>
                    </NavLink>
                    <NavLink to="/settings">
                        <FiSettings />
                        <span>Settings</span>
                    </NavLink>
                </div>
            </nav>

            {/* FOOTER */}
            <div className="sidebar-footer">
                <button
                    className="logout-btn"
                    onClick={handleLogout}
                    title="Sign out of SynapseOS"
                >
                    <FiLogOut />
                    <span>Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;