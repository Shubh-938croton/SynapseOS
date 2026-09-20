import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiShield, FiZap, FiTarget, FiActivity } from "react-icons/fi";
import { loginUser } from "../../services/authService";
import { triggerGoogleAuth } from "../../services/googleAuth";
import "./Login.css";
import hero from "../../assets/hero.png";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading || googleLoading) return;

        setErrorMessage("");
        setLoading(true);

        try {
            const response = await loginUser({
                email,
                password
            });

            console.log("Login successful:", response);

            // Save JWT
            localStorage.setItem("token", response.token);

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            // Save remember-me preference
            localStorage.setItem(
                "rememberMe",
                JSON.stringify(rememberMe)
            );

            // Go to dashboard
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            console.error(
                "Server response:",
                error.response?.data
            );

            setErrorMessage(
                error.response?.data?.message ||
                "Invalid email or password. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log("Forgot password clicked");
    };

    const handleGoogleLogin = () => {
        if (loading || googleLoading) return;

        setErrorMessage("");

        triggerGoogleAuth({
            onStart: () => setGoogleLoading(true),
            onSuccess: (response) => {
                console.log("Google Login successful:", response);
                setGoogleLoading(false);
                localStorage.setItem("rememberMe", JSON.stringify(rememberMe));
                navigate("/dashboard");
            },
            onError: (errMessage) => {
                setGoogleLoading(false);
                setErrorMessage(errMessage);
            }
        });
    };

    return (
        <div className="login-page">
            <div className="login-container">
                {/* LEFT: BRAND & PRODUCT STATEMENT */}
                <div className="login-left">
                    <div className="brand-header">
                        <div className="brand-logo-icon">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3"></circle>
                                <path d="M12 3v6m0 6v6M3 12h6m6 0h6"></path>
                            </svg>
                        </div>
                        <span className="brand-name">SynapseOS</span>
                    </div>

                    <div className="brand-hero">
                        <h1>A calm, personal workspace for study and focus.</h1>
                        <p>
                            Organize your tasks, manage coursework, track coding milestones,
                            and run deep focus sessions without unnecessary noise.
                        </p>
                    </div>

                    <div className="feature-list">
                        <div className="feature-item">
                            <FiZap className="feature-icon" />
                            <div>
                                <strong>Focused Workflows</strong>
                                <span>Pomodoro timer and organized study sessions</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiTarget className="feature-icon" />
                            <div>
                                <strong>Clear Milestones</strong>
                                <span>Track goals, assignments, and contest schedules</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiActivity className="feature-icon" />
                            <div>
                                <strong>Daily Progress</strong>
                                <span>Understand your study rhythm with real data</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: AUTH CARD */}
                <div className="login-right">
                    <div className="login-card">
                        <div className="login-heading">
                            <h2>Sign In</h2>
                            <p>Enter your credentials to access your workspace</p>
                        </div>

                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="login-error" role="alert">
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Google Sign-In */}
                        <button
                            type="button"
                            className="google-btn"
                            onClick={handleGoogleLogin}
                            disabled={loading || googleLoading}
                            aria-label="Continue with Google"
                        >
                            {googleLoading ? (
                                <>
                                    <span className="loading-spinner google-spinner"></span>
                                    <span>Connecting with Google...</span>
                                </>
                            ) : (
                                <>
                                    <img
                                        src="https://www.svgrepo.com/show/475656/google-color.svg"
                                        alt="Google logo"
                                    />
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                        <div className="divider">
                            <span></span>
                            <p>or sign in with email</p>
                            <span></span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="login-form">
                            <div className="input-group">
                                <label htmlFor="email">Email address</label>
                                <div className="input-wrapper">
                                    <FiMail className="field-icon" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            setErrorMessage("");
                                        }}
                                        autoComplete="email"
                                        required
                                        disabled={loading || googleLoading}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <div className="label-row">
                                    <label htmlFor="password">Password</label>
                                    <a
                                        href="#"
                                        onClick={handleForgotPassword}
                                        className="forgot-link"
                                        tabIndex={0}
                                    >
                                        Forgot password?
                                    </a>
                                </div>
                                <div className="input-wrapper password-wrapper">
                                    <FiLock className="field-icon" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setErrorMessage("");
                                        }}
                                        autoComplete="current-password"
                                        required
                                        disabled={loading || googleLoading}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        tabIndex={0}
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </button>
                                </div>
                            </div>

                            <div className="login-options">
                                <label className="remember-label">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading || googleLoading}
                                    />
                                    <span className="remember-text">Remember me for 30 days</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading || googleLoading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign in</span>
                                        <FiArrowRight className="btn-arrow" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="signup-link">
                            <span>Don't have an account?</span>
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                disabled={loading || googleLoading}
                            >
                                Create an account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;