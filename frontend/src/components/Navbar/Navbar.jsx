import "./Navbar.css";
import { FaBell } from "react-icons/fa";

function Navbar() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (

        <header className="navbar">

            <div className="navbar-left">

                <h2>
                    Welcome back,
                    <span> {user?.full_name || "User"} 👋</span>
                </h2>

                <p>
                    Stay productive today.
                </p>

            </div>

            <div className="navbar-right">

                <button className="notification-btn">

                    <FaBell />

                </button>

                <div className="profile">

                    <div className="avatar">

                        {user?.full_name
                            ? user.full_name.charAt(0).toUpperCase()
                            : "U"}

                    </div>

                    <div>

                        <h4>{user?.full_name}</h4>

                        <span>{user?.email}</span>

                    </div>

                </div>

            </div>

        </header>

    );

}

export default Navbar;

