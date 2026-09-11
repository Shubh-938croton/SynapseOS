import DashboardLayout from "../../components/Layout/DashboardLayout";
import PomodoroTimer from "../../components/Pomodoro/PomodoroTimer";
import PomodoroHistory from "../../components/Pomodoro/PomodoroHistory";

import "./Pomodoro.css";


function Pomodoro() {

    return (

        <DashboardLayout>

            <div className="pomodoro-page">

                <div className="pomodoro-page-header">

                    <div>

                        <span className="pomodoro-page-label">
                            PRODUCTIVITY
                        </span>

                        <h1>
                            Pomodoro
                        </h1>

                        <p>
                            Focus on your work, take meaningful
                            breaks, and build consistent study habits.
                        </p>

                    </div>

                </div>


                <div className="pomodoro-page-content">

                    <PomodoroTimer />

                    <PomodoroHistory />

                </div>

            </div>

        </DashboardLayout>

    );

}


export default Pomodoro;