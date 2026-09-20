import { useMemo } from "react";
import "./Navbar.css";
import NotificationBell from "../Notification/NotificationBell";

function Navbar() {
    const user = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem("user")) || {};
        } catch {
            return {};
        }
    }, []);

    const todayDateFormatted = useMemo(() => {
        return new Date().toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        });
    }, []);

    return (
        <header className="navbar">
            <div className="navbar-left">
                <span className="navbar-date">{todayDateFormatted}</span>
                <span className="navbar-divider">•</span>
                <span className="navbar-greeting">
                    {user?.full_name ? `Signed in as ${user.full_name}` : "Workspace"}
                </span>
            </div>

            <div className="navbar-right">
                <NotificationBell />

                <div className="profile-pill">
                    <div className="profile-avatar">
                        {user?.full_name
                            ? user.full_name.charAt(0).toUpperCase()
                            : "U"}
                    </div>
                    <div className="profile-info">
                        <span className="profile-name">
                            {user?.full_name || "User"}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;