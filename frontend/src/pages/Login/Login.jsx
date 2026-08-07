import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";
import hero from "../../assets/hero.png";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await loginUser({
                email,
                password
            });

            localStorage.setItem("token", response.token);

            localStorage.setItem(
                "user",
                JSON.stringify(response.user)
            );

            navigate("/dashboard");

        } catch (error) {

            console.log(error);
            alert("Invalid Email or Password");

        }

    };

    return (

        <div className="login-page">

            {/* LEFT SIDE */}

            <div className="login-left">

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

                <div className="brain-wrapper">

                    <img
                        src={hero}
                        alt="AI Brain"
                        className="brain-image"
                    />

                </div>

            </div>

            {/* RIGHT SIDE */}

            <div className="login-right">

                <div className="login-card">

                    <h2>
                        Welcome Back 👋
                    </h2>

                    <p>
                        Login to continue to SynapseOS
                    </p>

                    <form onSubmit={handleLogin}>

                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <div className="login-options">

                            <label>

                                <input type="checkbox" />

                                Remember me

                            </label>

                            <a href="#">
                                Forgot Password?
                            </a>

                        </div>

                        <button
                            type="submit"
                            className="login-btn"
                        >
                            Sign In
                        </button>

                    </form>

                    <div className="divider">

                        <span>
                            OR
                        </span>

                    </div>

                    <button
                        type="button"
                        className="google-btn"
                    >

                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                        />

                        Continue with Google

                    </button>

                    <div className="signup-link">

                        Don't have an account?

                        <span
                            onClick={() =>
                                navigate("/register")
                            }
                        >
                            Sign Up
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;