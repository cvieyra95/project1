import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./signUp.css";

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        try {
            const response = await axios.post("http://localhost:5001/signup", {
                username,
                password
            });
            if (response.data.success) {
                alert("Signup successful! Please login.");
                navigate("/login");
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Signup error:", error);
            alert("Signup failed. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="title">
                <h1>Create an Account</h1>
            </div>
            <div className="signup-box">
                <h2>Sign Up</h2>
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
                <button type="button" className="btn" onClick={handleSignup}>Sign Up</button>
                <div className="loginlink">
                    <label onClick={() => navigate("/login")}>Already have an account? Login</label>
                </div>
            </div>
        </div>
    );
};

export default Signup;
