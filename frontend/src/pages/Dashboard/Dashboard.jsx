import { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import SummaryCard from "../../components/Summarycard/SummaryCard";
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

                console.error(
                    "Dashboard Error:",
                    error
                );

            }

        }

        fetchDashboard();

    }, []);


    return (

        <DashboardLayout>

            <div className="dashboard-page">

                {/* =================================
                    HERO
                ================================= */}

                <section className="dashboard-hero">

                    <div className="dashboard-hero-content">

                        <p className="dashboard-eyebrow">
                            Your productivity overview
                        </p>

                        <h1 className="dashboard-title">
                            Welcome back <span>👋</span>
                        </h1>

                        <p className="dashboard-subtitle">
                            Stay focused, track your progress,
                            and make today productive.
                        </p>

                    </div>

                </section>


                {/* =================================
                    OVERVIEW
                ================================= */}

                <section className="dashboard-overview">

                    <div className="dashboard-section-header">

                        <div>

                            <h2 className="dashboard-section-title">
                                Overview
                            </h2>

                            <p className="dashboard-section-description">
                                A quick look at your productivity.
                            </p>

                        </div>

                    </div>


                    {/* =================================
                        SUMMARY CARDS
                    ================================= */}

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

                </section>

            </div>

        </DashboardLayout>

    );

}


export default Dashboard;