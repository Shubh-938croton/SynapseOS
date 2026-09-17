import { googleLogin } from "./authService";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const GOOGLE_UNAVAILABLE_MESSAGE =
    "Google sign-in is temporarily unavailable. Please try again later or continue with email.";
const GOOGLE_CANCELLED_MESSAGE = "Google sign-in was cancelled.";

/**
 * Dynamically load Google Identity Services SDK script
 */
export const loadGoogleScript = () => {
    return new Promise((resolve, reject) => {
        if (window.google?.accounts) {
            resolve(window.google);
            return;
        }

        const existingScript = document.getElementById("google-gsi-script");
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(window.google));
            existingScript.addEventListener("error", reject);
            return;
        }

        const script = document.createElement("script");
        script.id = "google-gsi-script";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => resolve(window.google);
        script.onerror = (err) => reject(err);
        document.head.appendChild(script);
    });
};

/**
 * Trigger Google OAuth popup and perform authentication
 */
export const triggerGoogleAuth = async ({ onSuccess, onError, onStart }) => {
    if (!GOOGLE_CLIENT_ID) {
        console.error(
            "[Google Auth] Missing configuration: VITE_GOOGLE_CLIENT_ID is not defined in frontend environment variables."
        );
        if (onError) {
            onError(GOOGLE_UNAVAILABLE_MESSAGE);
        }
        return;
    }

    try {
        if (onStart) onStart();
        await loadGoogleScript();

        if (!window.google?.accounts?.oauth2) {
            throw new Error("Google Identity Services failed to load.");
        }

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: "openid email profile",
            callback: async (tokenResponse) => {
                if (tokenResponse.error) {
                    console.warn("[Google Auth] OAuth token response error:", tokenResponse);
                    if (onError) {
                        if (
                            tokenResponse.error === "popup_closed_by_user" ||
                            tokenResponse.error === "access_denied" ||
                            tokenResponse.error === "user_logged_out"
                        ) {
                            onError(GOOGLE_CANCELLED_MESSAGE);
                        } else {
                            onError(GOOGLE_UNAVAILABLE_MESSAGE);
                        }
                    }
                    return;
                }

                try {
                    const response = await googleLogin({
                        access_token: tokenResponse.access_token
                    });

                    // Save JWT token
                    localStorage.setItem("token", response.token);

                    // Save user information
                    localStorage.setItem("user", JSON.stringify(response.user));

                    if (onSuccess) {
                        onSuccess(response);
                    }
                } catch (authErr) {
                    console.error("[Google Auth] Backend Google Auth Error:", authErr);
                    if (onError) {
                        onError(GOOGLE_UNAVAILABLE_MESSAGE);
                    }
                }
            },
            error_callback: (err) => {
                console.error("[Google Auth] Token Client Error:", err);
                if (onError) {
                    if (err?.type === "popup_closed" || err?.message?.includes("closed")) {
                        onError(GOOGLE_CANCELLED_MESSAGE);
                    } else {
                        onError(GOOGLE_UNAVAILABLE_MESSAGE);
                    }
                }
            }
        });

        tokenClient.requestAccessToken({ prompt: "select_account" });

    } catch (err) {
        console.error("[Google Auth] Initialization Error:", err);
        if (onError) {
            onError(GOOGLE_UNAVAILABLE_MESSAGE);
        }
    }
};
