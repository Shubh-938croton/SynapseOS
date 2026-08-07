import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // 👇 handleLogin goes HERE
    const handleLogin = async (e) => {

    e.preventDefault();

    console.log("1. Login Started");

    try {

        const response = await loginUser({
            email,
            password
        });

        console.log("2. API Success");
        console.log(response);

        localStorage.setItem("token", response.token);

        console.log("3. Token Saved");

        localStorage.setItem(
            "user",
            JSON.stringify(response.user)
        );

        console.log("4. User Saved");

        navigate("/dashboard");

        console.log("5. Navigation Called");

    } catch (error) {

        console.log("Login Error");
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