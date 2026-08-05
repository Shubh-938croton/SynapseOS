import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import "./DashboardLayout.css";

function DashboardLayout({ children }) {
    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-main">

                <Navbar />

                <div className="dashboard-content">
                    {children}
                </div>

            </div>

        </div>
    );
}

export default DashboardLayout;