import { createContext, useContext, useEffect, useState } from "react";

import {
    getSettings,
    updateSettings
} from "../services/settingsService";

const DEFAULT_SETTINGS = {
    theme: "Light",
    notification_enabled: true,
    daily_goal_minutes: 120,
    pomodoro_duration: 25,
    short_break_duration: 5,
    long_break_duration: 15
};

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {

    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    // =======================================
    // LOAD SETTINGS
    // =======================================

    const loadSettings = async () => {

        try {

            setLoading(true);

            const data = await getSettings();

            setSettings({
                ...DEFAULT_SETTINGS,
                ...data.settings
            });

        } catch (error) {

            console.error("Failed to load settings:", error);

        } finally {

            setLoading(false);

        }

    };


    // =======================================
    // INITIAL LOAD
    // =======================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            loadSettings();
        } else {
            setLoading(false);
        }

    }, []);


    // =======================================
    // UPDATE LOCAL SETTINGS
    // =======================================

    const updateLocalSettings = (newSettings) => {

        setSettings((previous) => ({
            ...previous,
            ...newSettings
        }));

    };


    // =======================================
    // SAVE SETTINGS
    // =======================================

    const saveSettings = async (newSettings) => {

        const mergedSettings = {
            ...settings,
            ...newSettings
        };

        await updateSettings(mergedSettings);

        setSettings(mergedSettings);

        return mergedSettings;

    };


    return (
        <SettingsContext.Provider
            value={{
                settings,
                loading,
                updateLocalSettings,
                saveSettings,
                reloadSettings: loadSettings
            }}
        >
            {children}
        </SettingsContext.Provider>
    );

};


// =======================================
// CUSTOM HOOK
// =======================================

export const useSettings = () => {

    const context = useContext(SettingsContext);

    if (!context) {

        throw new Error(
            "useSettings must be used inside SettingsProvider"
        );

    }

    return context;

};