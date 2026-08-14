import { useEffect, useState } from "react";

import {
    createPomodoroSession
} from "../../services/pomodoroService";

import "./PomodoroTimer.css";


function PomodoroTimer() {

    // =======================================
    // TIMER CONFIGURATION
    // =======================================

    const FOCUS_DURATION = 25 * 60;

    // =======================================
    // STATE
    // =======================================

    const [timeLeft, setTimeLeft] =
        useState(FOCUS_DURATION);

    const [isRunning, setIsRunning] =
        useState(false);

    const [startedAt, setStartedAt] =
        useState(null);

    const [loading, setLoading] =
        useState(false);


    // =======================================
    // FORMAT TIME
    // =======================================

    const formatTime = (seconds) => {

        const minutes =
            Math.floor(seconds / 60);

        const remainingSeconds =
            seconds % 60;

        return `${String(minutes).padStart(2, "0")}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;

    };


    // =======================================
    // START TIMER
    // =======================================

    const handleStart = () => {

        if (isRunning) {
            return;
        }

        if (!startedAt) {

            setStartedAt(
                new Date().toISOString()
            );

        }

        setIsRunning(true);

    };


    // =======================================
    // PAUSE TIMER
    // =======================================

    const handlePause = () => {

        setIsRunning(false);

    };


    // =======================================
    // RESET TIMER
    // =======================================

    const handleReset = () => {

        setIsRunning(false);

        setTimeLeft(
            FOCUS_DURATION
        );

        setStartedAt(null);

    };


    // =======================================
    // SAVE SESSION
    // =======================================

    const saveSession = async (status) => {

        if (!startedAt) {
            return;
        }

        try {

            setLoading(true);

            const endedAt =
                new Date().toISOString();

            await createPomodoroSession({

                subject_id: null,

                task_id: null,

                break_minutes: 5,

                session_status: status,

                started_at: startedAt,

                ended_at: endedAt

            });

        } catch (error) {

            console.error(
                "Save Pomodoro session error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to save Pomodoro session."
            );

        } finally {

            setLoading(false);

        }

    };


    // =======================================
    // INTERRUPT SESSION
    // =======================================

    const handleInterrupt = async () => {

        if (!startedAt) {
            return;
        }

        setIsRunning(false);

        await saveSession(
            "Interrupted"
        );

        setTimeLeft(
            FOCUS_DURATION
        );

        setStartedAt(null);

    };


    // =======================================
    // TIMER EFFECT
    // =======================================

    useEffect(() => {

        if (!isRunning) {
            return;
        }

        const interval =
            setInterval(() => {

                setTimeLeft((previousTime) => {

                    if (previousTime <= 1) {

                        clearInterval(interval);

                        return 0;

                    }

                    return previousTime - 1;

                });

            }, 1000);

        return () => {

            clearInterval(interval);

        };

    }, [isRunning]);


    // =======================================
    // TIMER COMPLETED
    // =======================================

    useEffect(() => {

        if (
            timeLeft === 0 &&
            isRunning &&
            startedAt
        ) {

            const completeSession =
                async () => {

                    setIsRunning(false);

                    await saveSession(
                        "Completed"
                    );

                    setStartedAt(null);

                };

            completeSession();

        }

    }, [
        timeLeft,
        isRunning,
        startedAt
    ]);


    // =======================================
    // RENDER
    // =======================================

    return (

        <div className="pomodoro-timer">

            <div className="pomodoro-timer-header">

                <span className="pomodoro-label">
                    FOCUS SESSION
                </span>

                <h2>
                    Pomodoro
                </h2>

            </div>


            <div className="pomodoro-clock">

                {formatTime(timeLeft)}

            </div>


            <div className="pomodoro-status">

                {isRunning
                    ? "Focus mode is running"
                    : startedAt
                        ? "Session paused"
                        : "Ready to focus"}

            </div>


            <div className="pomodoro-actions">

                {!isRunning ? (

                    <button
                        type="button"
                        className="pomodoro-start-btn"
                        onClick={handleStart}
                        disabled={loading}
                    >
                        Start
                    </button>

                ) : (

                    <button
                        type="button"
                        className="pomodoro-pause-btn"
                        onClick={handlePause}
                        disabled={loading}
                    >
                        Pause
                    </button>

                )}


                <button
                    type="button"
                    className="pomodoro-reset-btn"
                    onClick={handleReset}
                    disabled={loading}
                >
                    Reset
                </button>


                {startedAt && (

                    <button
                        type="button"
                        className="pomodoro-interrupt-btn"
                        onClick={handleInterrupt}
                        disabled={loading}
                    >
                        Interrupt
                    </button>

                )}

            </div>

        </div>

    );

}


export default PomodoroTimer;