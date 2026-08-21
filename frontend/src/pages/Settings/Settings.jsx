import { useState } from "react";

import {
    FaCog,
    FaMoon,
    FaBell,
    FaClock,
    FaBullseye,
    FaSave,
    FaUndo
} from "react-icons/fa";

import DashboardLayout from "../../components/DashboardLayout/DashboardLayout";
import { useSettings } from "../../context/SettingsContext";

import "./Settings.css";


function Settings() {

    // =======================================
    // GLOBAL SETTINGS CONTEXT
    // =======================================

    const {
        settings,
        loading,
        updateLocalSettings,
        saveSettings,
        resetSettings
    } = useSettings();


    // =======================================
    // LOCAL UI STATE
    // =======================================

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =======================================
    // HANDLE SETTING CHANGE
    // =======================================

    const handleChange = (name, value) => {

        updateLocalSettings({
            [name]: value
        });

        setMessage("");
        setError("");

    };


    // =======================================
    // SAVE SETTINGS
    // =======================================

    const handleSave = async () => {

        try {

            setSaving(true);
            setMessage("");
            setError("");

            await saveSettings(settings);

            setMessage("Settings saved successfully.");

        } catch (err) {

            console.error("Save settings error:", err);

            setError(
                err.message || "Failed to save settings."
            );

        } finally {

            setSaving(false);

        }

    };


    // =======================================
    // RESET SETTINGS
    // =======================================

    const handleReset = async () => {

        try {

            setSaving(true);
            setMessage("");
            setError("");

            await resetSettings();

            setMessage(
                "Settings reset to default values."
            );

        } catch (err) {

            console.error("Reset settings error:", err);

            setError(
                err.message || "Failed to reset settings."
            );

        } finally {

            setSaving(false);

        }

    };


    // =======================================
    // LOADING
    // =======================================

    if (loading) {

        return (
            <DashboardLayout>

                <div className="settings-page">

                    <div className="settings-loading">

                        <FaCog className="settings-loading-icon" />

                        <p>
                            Loading settings...
                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );

    }


    // =======================================
    // SETTINGS PAGE
    // =======================================

    return (

        <DashboardLayout>

            <div className="settings-page">

                {/* =======================================
                    HEADER
                ======================================= */}

                <div className="settings-header">

                    <div>

                        <h1>
                            <FaCog />
                            Settings
                        </h1>

                        <p>
                            Customize your SynapseOS experience.
                        </p>

                    </div>

                </div>


                {/* =======================================
                    SUCCESS MESSAGE
                ======================================= */}

                {message && (

                    <div className="settings-message success">

                        {message}

                    </div>

                )}


                {/* =======================================
                    ERROR MESSAGE
                ======================================= */}

                {error && (

                    <div className="settings-message error">

                        {error}

                    </div>

                )}


                <div className="settings-grid">


                    {/* =======================================
                        APPEARANCE
                    ======================================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div className="settings-card-icon">

                                <FaMoon />

                            </div>

                            <div>

                                <h2>
                                    Appearance
                                </h2>

                                <p>
                                    Customize how SynapseOS looks.
                                </p>

                            </div>

                        </div>


                        <div className="setting-item">

                            <div className="setting-info">

                                <h3>
                                    Theme
                                </h3>

                                <p>
                                    Choose your preferred interface theme.
                                </p>

                            </div>


                            <div className="theme-options">

                                <button
                                    type="button"
                                    className={
                                        settings.theme === "Light"
                                            ? "theme-option active"
                                            : "theme-option"
                                    }
                                    onClick={() =>
                                        handleChange(
                                            "theme",
                                            "Light"
                                        )
                                    }
                                >
                                    ☀️
                                    <span>
                                        Light
                                    </span>
                                </button>


                                <button
                                    type="button"
                                    className={
                                        settings.theme === "Dark"
                                            ? "theme-option active"
                                            : "theme-option"
                                    }
                                    onClick={() =>
                                        handleChange(
                                            "theme",
                                            "Dark"
                                        )
                                    }
                                >
                                    🌙
                                    <span>
                                        Dark
                                    </span>
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* =======================================
                        NOTIFICATIONS
                    ======================================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div className="settings-card-icon">

                                <FaBell />

                            </div>

                            <div>

                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Control productivity notifications.
                                </p>

                            </div>

                        </div>


                        <div className="setting-item">

                            <div className="setting-info">

                                <h3>
                                    Notifications
                                </h3>

                                <p>
                                    Receive reminders and productivity notifications.
                                </p>

                            </div>


                            <label className="switch">

                                <input
                                    type="checkbox"
                                    checked={
                                        Boolean(
                                            settings.notification_enabled
                                        )
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "notification_enabled",
                                            e.target.checked
                                        )
                                    }
                                />

                                <span className="slider"></span>

                            </label>

                        </div>

                    </section>


                    {/* =======================================
                        DAILY GOAL
                    ======================================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div className="settings-card-icon">

                                <FaBullseye />

                            </div>

                            <div>

                                <h2>
                                    Daily Study Goal
                                </h2>

                                <p>
                                    Set your daily study target.
                                </p>

                            </div>

                        </div>


                        <div className="setting-item vertical">

                            <div className="setting-info">

                                <h3>
                                    Daily Goal
                                </h3>

                                <p>
                                    Target study time per day.
                                </p>

                            </div>


                            <div className="range-container">

                                <div className="range-value">

                                    <strong>
                                        {settings.daily_goal_minutes}
                                    </strong>

                                    <span>
                                        minutes
                                    </span>

                                </div>


                                <input
                                    type="range"
                                    min="30"
                                    max="600"
                                    step="15"
                                    value={
                                        settings.daily_goal_minutes
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "daily_goal_minutes",
                                            Number(e.target.value)
                                        )
                                    }
                                />


                                <div className="range-labels">

                                    <span>
                                        30 min
                                    </span>

                                    <span>
                                        10 hours
                                    </span>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =======================================
                        POMODORO
                    ======================================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div className="settings-card-icon">

                                <FaClock />

                            </div>

                            <div>

                                <h2>
                                    Pomodoro
                                </h2>

                                <p>
                                    Configure your focus sessions and breaks.
                                </p>

                            </div>

                        </div>


                        {/* FOCUS DURATION */}

                        <div className="setting-item vertical">

                            <div className="setting-info">

                                <h3>
                                    Focus Duration
                                </h3>

                                <p>
                                    Length of each Pomodoro session.
                                </p>

                            </div>


                            <div className="range-container">

                                <div className="range-value">

                                    <strong>
                                        {settings.pomodoro_duration}
                                    </strong>

                                    <span>
                                        minutes
                                    </span>

                                </div>


                                <input
                                    type="range"
                                    min="5"
                                    max="60"
                                    step="5"
                                    value={
                                        settings.pomodoro_duration
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "pomodoro_duration",
                                            Number(e.target.value)
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* SHORT BREAK */}

                        <div className="setting-item vertical">

                            <div className="setting-info">

                                <h3>
                                    Short Break
                                </h3>

                                <p>
                                    Duration of your short break.
                                </p>

                            </div>


                            <div className="range-container">

                                <div className="range-value">

                                    <strong>
                                        {settings.short_break_duration}
                                    </strong>

                                    <span>
                                        minutes
                                    </span>

                                </div>


                                <input
                                    type="range"
                                    min="1"
                                    max="15"
                                    step="1"
                                    value={
                                        settings.short_break_duration
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "short_break_duration",
                                            Number(e.target.value)
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* LONG BREAK */}

                        <div className="setting-item vertical">

                            <div className="setting-info">

                                <h3>
                                    Long Break
                                </h3>

                                <p>
                                    Duration of your long break.
                                </p>

                            </div>


                            <div className="range-container">

                                <div className="range-value">

                                    <strong>
                                        {settings.long_break_duration}
                                    </strong>

                                    <span>
                                        minutes
                                    </span>

                                </div>


                                <input
                                    type="range"
                                    min="5"
                                    max="30"
                                    step="5"
                                    value={
                                        settings.long_break_duration
                                    }
                                    onChange={(e) =>
                                        handleChange(
                                            "long_break_duration",
                                            Number(e.target.value)
                                        )
                                    }
                                />

                            </div>

                        </div>

                    </section>


                </div>


                {/* =======================================
                    ACTIONS
                ======================================= */}

                <div className="settings-actions">

                    <button
                        type="button"
                        className="reset-settings-btn"
                        onClick={handleReset}
                        disabled={saving}
                    >

                        <FaUndo />

                        Reset Defaults

                    </button>


                    <button
                        type="button"
                        className="save-settings-btn"
                        onClick={handleSave}
                        disabled={saving}
                    >

                        <FaSave />

                        {saving
                            ? "Saving..."
                            : "Save Settings"
                        }

                    </button>

                </div>


            </div>

        </DashboardLayout>

    );

}


export default Settings;