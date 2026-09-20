import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUser, FiAtSign, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle, FiZap, FiTarget, FiActivity } from "react-icons/fi";
import { registerUser } from "../../services/authService";
import { triggerGoogleAuth } from "../../services/googleAuth";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        full_name: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
        if (errorMessage) setErrorMessage("");
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (loading || googleLoading) return;

        setErrorMessage("");
        setSuccessMessage("");

        // Validation
        if (!formData.full_name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        if (formData.password.length < 6) {
            setErrorMessage("Password must be at least 6 characters long.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const payload = {
                full_name: formData.full_name.trim(),
                username: formData.username.trim(),
                email: formData.email.trim(),
                password: formData.password
            };

            const response = await registerUser(payload);
            console.log("Registration successful:", response);

            setSuccessMessage("Account created successfully! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("Registration error:", error);
            setErrorMessage(
                error.response?.data?.message ||
                "Failed to create account. Please check your details and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        if (loading || googleLoading || Boolean(successMessage)) return;

        setErrorMessage("");

        triggerGoogleAuth({
            onStart: () => setGoogleLoading(true),
            onSuccess: (response) => {
                console.log("Google Login/Register successful:", response);
                setGoogleLoading(false);
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
                        <h1>Start structuring your academic & coding workflows.</h1>
                        <p>
                            Join a focused environment designed for consistent progress across
                            your studies, coding challenges, and daily routines.
                        </p>
                    </div>

                    <div className="feature-list">
                        <div className="feature-item">
                            <FiZap className="feature-icon" />
                            <div>
                                <strong>Deep Focus Sessions</strong>
                                <span>Built-in timer with custom durations and subject logs</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiTarget className="feature-icon" />
                            <div>
                                <strong>Integrated Task Hierarchy</strong>
                                <span>Link tasks, notes, and milestones directly to your subjects</span>
                            </div>
                        </div>
                        <div className="feature-item">
                            <FiActivity className="feature-icon" />
                            <div>
                                <strong>Calendar & Contest Tracking</strong>
                                <span>Stay ahead of assignments, exams, and coding contests</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: REGISTRATION CARD */}
                <div className="login-right">
                    <div className="login-card register-card">
                        <div className="login-heading">
                            <h2>Create Account</h2>
                            <p>Set up your SynapseOS workspace</p>
                        </div>

                        {/* Success Message */}
                        {successMessage && (
                            <div className="register-success" role="status">
                                <FiCheckCircle style={{ marginRight: "6px", flexShrink: 0 }} />
                                <span>{successMessage}</span>
                            </div>
                        )}

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
                            disabled={loading || googleLoading || Boolean(successMessage)}
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
                            <p>or register with email</p>
                            <span></span>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleRegister} className="register-form">
                            {/* Full Name & Username */}
                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="full_name">Full Name</label>
                                    <div className="input-wrapper">
                                        <FiUser className="field-icon" />
                                        <input
                                            id="full_name"
                                            name="full_name"
                                            type="text"
                                            placeholder="Alex Johnson"
                                            value={formData.full_name}
                                            onChange={handleChange}
                                            autoComplete="name"
                                            required
                                            disabled={loading || googleLoading || Boolean(successMessage)}
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label htmlFor="username">Username</label>
                                    <div className="input-wrapper">
                                        <FiAtSign className="field-icon" />
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            placeholder="alexj"
                                            value={formData.username}
                                            onChange={handleChange}
                                            autoComplete="username"
                                            required
                                            disabled={loading || googleLoading || Boolean(successMessage)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <div className="input-wrapper">
                                    <FiMail className="field-icon" />
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="alex@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                        disabled={loading || googleLoading || Boolean(successMessage)}
                                    />
                                </div>
                            </div>

                            {/* Password & Confirm Password */}
                            <div className="form-row">
                                <div className="input-group">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-wrapper password-wrapper">
                                        <FiLock className="field-icon" />
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="6+ characters"
                                            value={formData.password}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            required
                                            disabled={loading || googleLoading || Boolean(successMessage)}
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

                                <div className="input-group">
                                    <label htmlFor="confirmPassword">Confirm</label>
                                    <div className="input-wrapper password-wrapper">
                                        <FiLock className="field-icon" />
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Repeat password"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            autoComplete="new-password"
                                            required
                                            disabled={loading || googleLoading || Boolean(successMessage)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading || googleLoading || Boolean(successMessage)}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Create account</span>
                                        <FiArrowRight className="btn-arrow" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="signup-link">
                            <span>Already have an account?</span>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                disabled={loading || googleLoading}
                            >
                                Sign in
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;