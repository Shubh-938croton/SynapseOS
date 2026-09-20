import { useState } from "react";
import DashboardLayout from "../../components/Layout/DashboardLayout";
import PomodoroTimer from "../../components/Pomodoro/PomodoroTimer";
import PomodoroHistory from "../../components/Pomodoro/PomodoroHistory";
import "./Pomodoro.css";

function Pomodoro() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleSessionSaved = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    return (
        <DashboardLayout>
            <div className="pomodoro-page">
                <div className="pomodoro-page-header">
                    <div>
                        <h1>Pomodoro Focus</h1>
                        <p>Work in focused intervals, take mindful breaks, and build a sustained study routine.</p>
                    </div>
                </div>

                <div className="pomodoro-page-content">
                    <PomodoroTimer onSessionSaved={handleSessionSaved} />
                    <PomodoroHistory refreshTrigger={refreshTrigger} />
                </div>
            </div>
        </DashboardLayout>
    );
}

export default Pomodoro;