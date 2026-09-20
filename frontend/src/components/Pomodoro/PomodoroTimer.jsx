import { useEffect, useState } from "react";
import { FiPlay, FiPause, FiRotateCcw, FiSquare, FiClock } from "react-icons/fi";
import {
    createPomodoroSession
} from "../../services/pomodoroService";
import { useSettings } from "../../context/SettingsContext";
import "./PomodoroTimer.css";

function PomodoroTimer({ onSessionSaved }) {
    const { settings } = useSettings();

    // =======================================
    // TIMER CONFIGURATION
    // =======================================
    const durationMinutes = Math.max(1, Number(settings?.pomodoro_duration) || 25);
    const breakMinutes = Math.max(1, Number(settings?.short_break_duration) || 5);
    const focusDuration = durationMinutes * 60;

    // =======================================
    // STATE
    // =======================================
    const [timeLeft, setTimeLeft] = useState(focusDuration);
    const [isRunning, setIsRunning] = useState(false);
    const [startedAt, setStartedAt] = useState(null);
    const [loading, setLoading] = useState(false);

    // Sync timeLeft when duration setting updates while timer is idle
    useEffect(() => {
        if (!isRunning && !startedAt) {
            setTimeLeft(focusDuration);
        }
    }, [focusDuration, isRunning, startedAt]);

    // =======================================
    // FORMAT TIME
    // =======================================
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
    };

    // =======================================
    // START TIMER
    // =======================================
    const handleStart = () => {
        if (isRunning) return;
        if (!startedAt) {
            setStartedAt(new Date().toISOString());
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
        setTimeLeft(focusDuration);
        setStartedAt(null);
    };

    // =======================================
    // SAVE SESSION
    // =======================================
    const saveSession = async (status) => {
        if (!startedAt) return;

        try {
            setLoading(true);
            const endedAt = new Date().toISOString();

            await createPomodoroSession({
                subject_id: null,
                task_id: null,
                duration_minutes: durationMinutes,
                break_minutes: breakMinutes,
                session_status: status,
                started_at: startedAt,
                ended_at: endedAt
            });

            if (typeof onSessionSaved === "function") {
                onSessionSaved();
            }
        } catch (error) {
            console.error("Save Pomodoro session error:", error);
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
        if (!startedAt) return;

        setIsRunning(false);
        await saveSession("Interrupted");
        setTimeLeft(focusDuration);
        setStartedAt(null);
    };

    // =======================================
    // TIMER EFFECT
    // =======================================
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((previousTime) => {
                if (previousTime <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return previousTime - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    // =======================================
    // TIMER COMPLETED
    // =======================================
    useEffect(() => {
        if (timeLeft === 0 && isRunning && startedAt) {
            const completeSession = async () => {
                setIsRunning(false);
                await saveSession("Completed");
                setStartedAt(null);
            };
            completeSession();
        }
    }, [timeLeft, isRunning, startedAt]);

    return (
        <div className="pomodoro-timer">
            <div className="pomodoro-timer-header">
                <span className="pomodoro-duration-badge">
                    <FiClock /> {durationMinutes} min focus
                </span>
                <h2>Focus Session</h2>
            </div>

            <div className="pomodoro-clock">
                {formatTime(timeLeft)}
            </div>

            <div className="pomodoro-status">
                {isRunning
                    ? "Focus session is actively running..."
                    : startedAt
                        ? "Session paused"
                        : "Ready to begin deep work"}
            </div>

            <div className="pomodoro-actions">
                {!isRunning ? (
                    <button
                        type="button"
                        className="pomodoro-btn start-btn"
                        onClick={handleStart}
                        disabled={loading}
                    >
                        <FiPlay />
                        <span>Start Focus</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        className="pomodoro-btn pause-btn"
                        onClick={handlePause}
                        disabled={loading}
                    >
                        <FiPause />
                        <span>Pause</span>
                    </button>
                )}

                <button
                    type="button"
                    className="pomodoro-btn reset-btn"
                    onClick={handleReset}
                    disabled={loading}
                >
                    <FiRotateCcw />
                    <span>Reset</span>
                </button>

                {startedAt && (
                    <button
                        type="button"
                        className="pomodoro-btn interrupt-btn"
                        onClick={handleInterrupt}
                        disabled={loading}
                    >
                        <FiSquare />
                        <span>End Session</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default PomodoroTimer;