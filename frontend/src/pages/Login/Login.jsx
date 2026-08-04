import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 👇 handleLogin goes HERE
    const handleLogin = async (e) => {

    e.preventDefault();

    try {

        const response = await loginUser({
            email,
            password
        });

        console.log("Login Response:", response);

        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        console.log("Token Saved");

        console.log("Navigating...");

        navigate("/dashboard");

    } catch (error) {

        console.log(error);

    }

};

    // 👇 return comes AFTER handleLogin
    return (

        <form onSubmit={handleLogin}>

            <h1>Login</h1>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button type="submit">
                Login
            </button>

        </form>

    );
}

export default Login;