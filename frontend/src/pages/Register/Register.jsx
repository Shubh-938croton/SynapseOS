import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";
import "./Register.css";
import hero from "../../assets/hero.png";

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

        if (loading) return;

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

    return (
        <div className="login-page">

            {/* =========================
                BACKGROUND ORBS
            ========================= */}
            <div className="background-orb orb-one"></div>
            <div className="background-orb orb-two"></div>
            <div className="background-orb orb-three"></div>

            {/* =========================
                LEFT SIDE
            ========================= */}
            <div className="login-left">
                <div className="brand-content">
                    <h1 className="logo">SynapseOS</h1>
                    <h2>Start Your Journey</h2>
                    <p>
                        Create your account today and experience personalized,
                        AI-assisted productivity and structured learning.
                    </p>
                </div>

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
                <div className="register-card">

                    {/* Heading */}
                    <div className="login-heading">
                        <h2>Create Account 🚀</h2>
                        <p>Join SynapseOS to supercharge your study workflow</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="register-success">
                            {successMessage}
                        </div>
                    )}

                    {/* Error Message */}
                    {errorMessage && (
                        <div className="login-error">
                            {errorMessage}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleRegister} className="register-form">

                        {/* Full Name & Username in row */}
                        <div className="form-row">
                            <div className="input-group">
                                <label htmlFor="full_name">Full Name</label>
                                <input
                                    id="full_name"
                                    name="full_name"
                                    type="text"
                                    placeholder="e.g. Alex Johnson"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="e.g. alexj"
                                    value={formData.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="alex@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="At least 6 characters"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="input-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="password-wrapper">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="login-btn"
                            disabled={loading || Boolean(successMessage)}
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="signup-link">
                        <span>Already have an account?</span>
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Sign In
                        </button>
                    </div>

                    {/* Security Message */}
                    <div className="security-message">
                        🔒 Your data is stored securely and never shared
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Register;