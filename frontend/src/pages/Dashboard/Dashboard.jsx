import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import SummaryCard from "../../components/SummaryCard/SummaryCard";
import { getDashboardSummary } from "../../services/dashboardService";

import {
    FaBook,
    FaTasks,
    FaClock,
    FaChartLine
} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {

    
    const [summary, setSummary] = useState({
        totalSubjects: 0,
        totalTasks: 0,
        totalStudyHours: 0,
        totalPomodoroHours: 0
    });

    
    useEffect(() => {

        async function fetchDashboard() {

            try {

                const response = await getDashboardSummary();

                console.log(response);

                setSummary(response.summary);

            } catch (error) {

                console.error("Dashboard Error:", error);

            }

        }

        fetchDashboard();

    }, []);

    
    return (

        <DashboardLayout>

            <div className="summary-grid">

                <SummaryCard
                    title="Subjects"
                    value={summary.totalSubjects}
                    icon={<FaBook />}
                />

                <SummaryCard
                    title="Tasks"
                    value={summary.totalTasks}
                    icon={<FaTasks />}
                />

                <SummaryCard
                    title="Study Hours"
                    value={summary.totalStudyHours}
                    icon={<FaClock />}
                />

                <SummaryCard
                    title="Pomodoro Hours"
                    value={summary.totalPomodoroHours}
                    icon={<FaChartLine />}
                />

            </div>

        </DashboardLayout>

    );

}

export default Dashboard;