import { useEffect, useState } from "react";

import {
    FaCog,
    FaMoon,
    FaSun,
    FaBell,
    FaClock,
    FaBullseye,
    FaSave,
    FaRedo,
    FaCheck,
    FaFire
} from "react-icons/fa";

import Sidebar from "../../components/Sidebar/Sidebar";

import {
    getSettings,
    updateSettings
} from "../../services/settingsService";

import "./Settings.css";


const DEFAULT_SETTINGS = {
    theme: "Light",
    notification_enabled: true,
    daily_goal_minutes: 120,
    pomodoro_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15
};


function Settings() {

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    // =======================================
    // LOAD SETTINGS
    // =======================================

    useEffect(() => {

        const loadSettings = async () => {

            try {

                const data = await getSettings();

                setSettings({
                    ...DEFAULT_SETTINGS,
                    ...data.settings
                });

            } catch (err) {

                setError(err.message);

            } finally {

                setLoading(false);

            }

        };

        loadSettings();

    }, []);


    // =======================================
    // HANDLE CHANGE
    // =======================================

    const handleChange = (name, value) => {

        setSettings((previous) => ({
            ...previous,
            [name]: value
        }));

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

            await updateSettings(settings);

            setMessage("Settings saved successfully.");

        } catch (err) {

            setError(err.message);

        } finally {

            setSaving(false);

        }

    };


    // =======================================
    // RESET SETTINGS
    // =======================================

    const handleReset = () => {

        setSettings(DEFAULT_SETTINGS);

        setMessage("Settings reset to defaults.");

        setError("");

    };


    // =======================================
    // DAILY GOAL DISPLAY
    // =======================================

    const hours = Math.floor(
        settings.daily_goal_minutes / 60
    );

    const minutes = settings.daily_goal_minutes % 60;


    // =======================================
    // LOADING
    // =======================================

    if (loading) {

        return (
            <div className="settings-container">

                <Sidebar />

                <main className="settings-content">

                    <div className="settings-loading">
                        Loading settings...
                    </div>

                </main>

            </div>
        );

    }


    return (

        <div
            className={`settings-container ${
                settings.theme === "Dark"
                    ? "settings-dark"
                    : ""
            }`}
        >

            <Sidebar />


            <main className="settings-content">

                <div className="settings-page">


                    {/* ===================================
                        HEADER
                    =================================== */}

                    <div className="settings-header">

                        <div>

                            <div className="settings-title">

                                <div className="title-icon">
                                    <FaCog />
                                </div>

                                <div>

                                    <h1>
                                        Settings
                                    </h1>

                                    <p>
                                        Customize your SynapseOS experience.
                                    </p>

                                </div>

                            </div>

                        </div>


                        <button
                            className="header-save-btn"
                            onClick={handleSave}
                            disabled={saving}
                        >

                            <FaSave />

                            {saving
                                ? "Saving..."
                                : "Save Changes"}

                        </button>

                    </div>


                    {/* ===================================
                        MESSAGES
                    =================================== */}

                    {message && (

                        <div className="settings-message success">

                            <FaCheck />

                            {message}

                        </div>

                    )}


                    {error && (

                        <div className="settings-message error">

                            {error}

                        </div>

                    )}


                    {/* ===================================
                        APPEARANCE
                    =================================== */}

                    <section className="settings-card">

                        <div className="section-heading">

                            <div className="section-icon blue">
                                <FaMoon />
                            </div>

                            <div>

                                <h2>
                                    Appearance
                                </h2>

                                <p>
                                    Choose how SynapseOS looks.
                                </p>

                            </div>

                        </div>


                        <div className="theme-options">

                            {/* LIGHT */}

                            <button
                                type="button"
                                className={`theme-option ${
                                    settings.theme === "Light"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleChange(
                                        "theme",
                                        "Light"
                                    )
                                }
                            >

                                <div className="theme-preview light-preview">

                                    <FaSun />

                                </div>

                                <div className="theme-info">

                                    <strong>
                                        Light
                                    </strong>

                                    <span>
                                        Clean and bright
                                    </span>

                                </div>

                                {settings.theme === "Light" && (
                                    <FaCheck className="theme-check" />
                                )}

                            </button>


                            {/* DARK */}

                            <button
                                type="button"
                                className={`theme-option dark-option ${
                                    settings.theme === "Dark"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleChange(
                                        "theme",
                                        "Dark"
                                    )
                                }
                            >

                                <div className="theme-preview dark-preview">

                                    <FaMoon />

                                </div>

                                <div className="theme-info">

                                    <strong>
                                        Dark
                                    </strong>

                                    <span>
                                        Focused and easy on the eyes
                                    </span>

                                </div>

                                {settings.theme === "Dark" && (
                                    <FaCheck className="theme-check" />
                                )}

                            </button>

                        </div>

                    </section>


                    {/* ===================================
                        NOTIFICATIONS
                    =================================== */}

                    <section className="settings-card">

                        <div className="section-heading">

                            <div className="section-icon purple">
                                <FaBell />
                            </div>

                            <div>

                                <h2>
                                    Notifications
                                </h2>

                                <p>
                                    Control your productivity reminders.
                                </p>

                            </div>

                        </div>


                        <div className="interactive-row">

                            <div className="setting-description">

                                <strong>
                                    Productivity Notifications
                                </strong>

                                <span>
                                    Receive reminders and productivity alerts.
                                </span>

                            </div>


                            <button
                                type="button"
                                className={`switch ${
                                    settings.notification_enabled
                                        ? "active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleChange(
                                        "notification_enabled",
                                        !settings.notification_enabled
                                    )
                                }
                            >

                                <span className="switch-circle"></span>

                            </button>

                        </div>

                    </section>


                    {/* ===================================
                        DAILY GOAL
                    =================================== */}

                    <section className="settings-card">

                        <div className="section-heading">

                            <div className="section-icon green">
                                <FaBullseye />
                            </div>

                            <div>

                                <h2>
                                    Daily Study Goal
                                </h2>

                                <p>
                                    Set how much time you want to study each day.
                                </p>

                            </div>

                        </div>


                        <div className="goal-display">

                            <div>

                                <span className="goal-number">
                                    {settings.daily_goal_minutes}
                                </span>

                                <span className="goal-unit">
                                    minutes
                                </span>

                            </div>


                            <div className="goal-time">

                                {hours > 0 && (
                                    <span>
                                        {hours} hour{hours > 1 ? "s" : ""}
                                    </span>
                                )}

                                {minutes > 0 && (
                                    <span>
                                        {minutes} min
                                    </span>
                                )}

                            </div>

                        </div>


                        <input
                            className="range-input"
                            type="range"
                            min="30"
                            max="600"
                            step="15"
                            value={settings.daily_goal_minutes}
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

                    </section>


                    {/* ===================================
                        POMODORO
                    =================================== */}

                    <section className="settings-card">

                        <div className="section-heading">

                            <div className="section-icon orange">
                                <FaClock />
                            </div>

                            <div>

                                <h2>
                                    Pomodoro
                                </h2>

                                <p>
                                    Customize your focus and break sessions.
                                </p>

                            </div>

                        </div>


                        {/* FOCUS */}

                        <div className="slider-setting">

                            <div className="slider-header">

                                <div>

                                    <strong>
                                        Focus Duration
                                    </strong>

                                    <span>
                                        Length of each focus session.
                                    </span>

                                </div>

                                <div className="value-badge">
                                    {settings.pomodoro_duration} min
                                </div>

                            </div>


                            <input
                                className="range-input"
                                type="range"
                                min="5"
                                max="90"
                                step="5"
                                value={settings.pomodoro_duration}
                                onChange={(e) =>
                                    handleChange(
                                        "pomodoro_duration",
                                        Number(e.target.value)
                                    )
                                }
                            />

                        </div>


                        {/* SHORT BREAK */}

                        <div className="slider-setting">

                            <div className="slider-header">

                                <div>

                                    <strong>
                                        Short Break
                                    </strong>

                                    <span>
                                        Duration of short breaks.
                                    </span>

                                </div>

                                <div className="value-badge">
                                    {settings.short_break_duration} min
                                </div>

                            </div>


                            <input
                                className="range-input"
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={settings.short_break_duration}
                                onChange={(e) =>
                                    handleChange(
                                        "short_break_duration",
                                        Number(e.target.value)
                                    )
                                }
                            />

                        </div>


                        {/* LONG BREAK */}

                        <div className="slider-setting">

                            <div className="slider-header">

                                <div>

                                    <strong>
                                        Long Break
                                    </strong>

                                    <span>
                                        Duration after multiple focus sessions.
                                    </span>

                                </div>

                                <div className="value-badge">
                                    {settings.long_break_duration} min
                                </div>

                            </div>


                            <input
                                className="range-input"
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={settings.long_break_duration}
                                onChange={(e) =>
                                    handleChange(
                                        "long_break_duration",
                                        Number(e.target.value)
                                    )
                                }
                            />

                        </div>


                        {/* POMODORO PREVIEW */}

                        <div className="pomodoro-preview">

                            <div className="preview-icon">
                                <FaFire />
                            </div>

                            <div>

                                <strong>
                                    Your Pomodoro Cycle
                                </strong>

                                <p>

                                    {settings.pomodoro_duration} min focus

                                    <span> → </span>

                                    {settings.short_break_duration} min break

                                    <span> → </span>

                                    repeat

                                </p>

                                <small>
                                    After 4 sessions, take a{" "}
                                    {settings.long_break_duration}-minute
                                    long break.
                                </small>

                            </div>

                        </div>

                    </section>


                    {/* ===================================
                        FOOTER ACTIONS
                    =================================== */}

                    <div className="settings-footer">

                        <button
                            type="button"
                            className="reset-btn"
                            onClick={handleReset}
                        >

                            <FaRedo />

                            Reset to Defaults

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
                                : "Save Settings"}

                        </button>

                    </div>


                </div>

            </main>

        </div>

    );

}


export default Settings;