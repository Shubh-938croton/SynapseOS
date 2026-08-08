import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";
import hero from "../../assets/hero.png";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading) return;

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

        // We will implement this later.
    };

    const handleGoogleLogin = () => {
        console.log("Google login clicked");

        // Google OAuth will be implemented later.
    };

    return (
        <div className="login-page">

            {/* =========================
                BACKGROUND
            ========================= */}

            <div className="background-orb orb-one"></div>
            <div className="background-orb orb-two"></div>
            <div className="background-orb orb-three"></div>


            {/* =========================
                LEFT SIDE
            ========================= */}

            <div className="login-left">

                <div className="brand-content">

                    <h1 className="logo">
                        SynapseOS
                    </h1>

                    <h2>
                        AI Powered Productivity
                    </h2>

                    <p>
                        Organize your studies, manage tasks,
                        build habits and let AI guide your
                        productivity journey.
                    </p>

                </div>


                {/* =========================
                    BRAIN
                ========================= */}

                <div className="brain-wrapper">

                    <div className="brain-glow"></div>

                    <img
                        src={hero}
                        alt="SynapseOS AI productivity"
                        className="brain-image"
                    />

                </div>


                <div className="product-tagline">

                    <span>Plan</span>
                    <span>•</span>
                    <span>Learn</span>
                    <span>•</span>
                    <span>Analyze</span>
                    <span>•</span>
                    <span>Grow</span>

                </div>

            </div>


            {/* =========================
                RIGHT SIDE
            ========================= */}

            <div className="login-right">

                <div className="login-card">

                    {/* Heading */}

                    <div className="login-heading">

                        <h2>
                            Welcome Back 👋
                        </h2>

                        <p>
                            Login to continue to SynapseOS
                        </p>

                    </div>


                    {/* =========================
                        LOGIN FORM
                    ========================= */}

                    <form
                        onSubmit={handleLogin}
                        className="login-form"
                    >

                        {/* Email */}

                        <div className="input-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setErrorMessage("");
                                }}
                                autoComplete="email"
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="input-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrorMessage("");
                                    }}
                                    autoComplete="current-password"
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>

                            </div>

                        </div>


                        {/* Error */}

                        {errorMessage && (
                            <div className="login-error">
                                {errorMessage}
                            </div>
                        )}


                        {/* Remember / Forgot */}

                        <div className="login-options">

                            <label className="remember-label">

                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>


                            <a
                                href="#"
                                onClick={handleForgotPassword}
                            >
                                Forgot Password?
                            </a>

                        </div>


                        {/* Sign In */}

                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}

                        </button>

                    </form>


                    {/* =========================
                        DIVIDER
                    ========================= */}

                    <div className="divider">

                        <span></span>

                        <p>OR</p>

                        <span></span>

                    </div>


                    {/* =========================
                        GOOGLE
                    ========================= */}

                    <button
                        type="button"
                        className="google-btn"
                        onClick={handleGoogleLogin}
                    >

                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                        />

                        <span>
                            Continue with Google
                        </span>

                    </button>


                    {/* =========================
                        REGISTER
                    ========================= */}

                    <div className="signup-link">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Sign Up
                        </button>

                    </div>


                    {/* Security */}

                    <div className="security-message">
                        🔒 Your information is securely protected
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;