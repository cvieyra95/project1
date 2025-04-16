import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./signUp.css";

export const Signup = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/

    const handleSignup = async () => {
        if(!passwordPolicy.test(password)){
            alert("password does not meet criteria")
            return
        }
        try {
            const response = await axios.post("project1-production-ccdd.up.railway.app/signup", {
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
                <p>-Password must be at least 10 characters long</p>
                <p>-Password must contain a uppercase letter</p>
                <p>-Password must contain a lowercase letter</p>
                <p>-Password must contain a number</p>
                <p>-Password must contain a special character</p>
                <button type="button" className="btn" onClick={handleSignup}>Sign Up</button>
                <div className="loginlink">
                    <label onClick={() => navigate("/login")}>Already have an account? Login</label>
                </div>
            </div>
        </div>
    );
};

export default Signup;
