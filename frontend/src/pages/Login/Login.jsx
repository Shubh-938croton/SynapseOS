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

            {/* =========================
                AMBIENT LIGHTING & GRID
            ========================= */}
            <div className="login-grid-pattern"></div>
            <div className="background-orb orb-one"></div>
            <div className="background-orb orb-two"></div>
            <div className="background-orb orb-three"></div>

            <div className="login-container">

                {/* =========================
                    LEFT SIDE: HERO & BRAND
                ========================= */}
                <div className="login-left">

                    <div className="brand-badge">
                        <span className="badge-dot"></span>
                        <FiZap className="badge-icon" />
                        <span>AI-Powered Cognitive OS</span>
                    </div>

                    <div className="brand-content">
                        <h1 className="logo">SynapseOS</h1>
                        <h2>Master Your Focus & Studies</h2>
                        <p>
                            The unified cognitive operating system for students and developers.
                            Track tasks, deep work sessions, habits, and let intelligent analytics guide your journey.
                        </p>
                    </div>

                    {/* Brain Visual with Floating Badges */}
                    <div className="brain-wrapper">
                        <div className="brain-glow"></div>
                        <div className="brain-ambient-ring"></div>

                        {/* Floating Metric Chips */}
                        <div className="floating-chip chip-one">
                            <FiZap className="chip-icon zap" />
                            <div className="chip-text">
                                <strong>Deep Focus</strong>
                                <span>Pomodoro Engine</span>
                            </div>
                        </div>

                        <div className="floating-chip chip-two">
                            <FiTarget className="chip-icon target" />
                            <div className="chip-text">
                                <strong>Smart Goals</strong>
                                <span>Milestone Tracking</span>
                            </div>
                        </div>

                        <div className="floating-chip chip-three">
                            <FiActivity className="chip-icon stats" />
                            <div className="chip-text">
                                <strong>Analytics</strong>
                                <span>Real-Time Insights</span>
                            </div>
                        </div>

                        <img
                            src={hero}
                            alt="SynapseOS AI productivity"
                            className="brain-image"
                        />
                    </div>

                    <div className="product-tagline">
                        <div className="tagline-item">
                            <span className="dot"></span>
                            <span>Plan</span>
                        </div>
                        <div className="tagline-item">
                            <span className="dot"></span>
                            <span>Focus</span>
                        </div>
                        <div className="tagline-item">
                            <span className="dot"></span>
                            <span>Analyze</span>
                        </div>
                        <div className="tagline-item">
                            <span className="dot"></span>
                            <span>Excel</span>
                        </div>
                    </div>

                </div>

                {/* =========================
                    RIGHT SIDE: AUTH CARD
                ========================= */}
                <div className="login-right">

                    <div className="login-card">
                        <div className="card-glass-highlight"></div>

                        {/* Heading */}
                        <div className="login-heading">
                            <div className="welcome-tag">
                                <span>👋 Welcome Back</span>
                            </div>
                            <h2>Sign In to SynapseOS</h2>
                            <p>Enter your credentials to access your productivity workspace</p>
                        </div>

                        {/* Error Alert */}
                        {errorMessage && (
                            <div className="login-error" role="alert">
                                <span className="error-icon">⚠️</span>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Google Quick Sign-In */}
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

                        {/* Divider */}
                        <div className="divider">
                            <span></span>
                            <p>Or continue with email</p>
                            <span></span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleLogin} className="login-form">

                            {/* Email */}
                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
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

                            {/* Password */}
                            <div className="input-group">
                                <div className="label-row">
                                    <label htmlFor="password">Password</label>
                                    <a
                                        href="#"
                                        onClick={handleForgotPassword}
                                        className="forgot-link"
                                        tabIndex={0}
                                    >
                                        Forgot Password?
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

                            {/* Remember Me */}
                            <div className="login-options">
                                <label className="remember-label">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        disabled={loading || googleLoading}
                                    />
                                    <span className="checkbox-custom"></span>
                                    <span className="remember-text">Remember me for 30 days</span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading || googleLoading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span>Signing In...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Workspace</span>
                                        <FiArrowRight className="btn-arrow" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="signup-link">
                            <span>Don't have an account?</span>
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                disabled={loading || googleLoading}
                            >
                                Create an Account
                            </button>
                        </div>

                        {/* Security Badge */}
                        <div className="security-message">
                            <FiShield className="security-icon" />
                            <span>256-Bit Encrypted &amp; Secure JWT Authentication</span>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;