import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from '../UserContext'
import "./Login.css";

export const Login = () => {
    const {login} = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const logInUser = async () => {
        try {
            const response = await axios.post("http://localhost:5001/login", {
                username,
                password
            });
            if (response.data.success) {
                login({username})
                navigate("/chat");
            } else {
                alert("Login failed: Incorrect username or password");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="title">
                <h1>Secure Chat</h1>
            </div>
            <div className="login-box">
                <h2>Login</h2>
                <div className="textbox">
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                    />
                </div>
                <div className="textbox">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                </div>
                <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                </div>
                <button type="button" className="btn" onClick={logInUser}>Login</button>
                <div className="signuplink">
                    <label onClick={() => navigate("/signup")}>Sign Up</label>
                </div>
            </div>
        </div>
    );
};

export default Login;
