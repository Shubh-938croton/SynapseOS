import { googleLogin } from "./authService";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
        if (onError) {
            onError("Google Client ID is missing. Please set VITE_GOOGLE_CLIENT_ID in your frontend .env file.");
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
                    if (onError) {
                        onError(tokenResponse.error_description || "Google sign-in was cancelled or failed.");
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
                    console.error("Backend Google Auth Error:", authErr);
                    if (onError) {
                        onError(
                            authErr.response?.data?.message ||
                            "Failed to authenticate with Google on the server."
                        );
                    }
                }
            },
            error_callback: (err) => {
                console.error("Google Token Client Error:", err);
                if (onError) {
                    onError("Google sign-in encountered an error. Please try again.");
                }
            }
        });

        tokenClient.requestAccessToken({ prompt: "select_account" });

    } catch (err) {
        console.error("Google Auth Initialization Error:", err);
        if (onError) {
            onError(err.message || "Failed to initialize Google authentication.");
        }
    }
};
