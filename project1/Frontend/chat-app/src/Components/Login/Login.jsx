import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from '../UserContext'
import "./Login.css";

export const Login = () => {
    const {login} = useContext(UserContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginAttempts, setLoginAttempts] = useState(0)
    const [lockoutTime, setLockoutTime] =  useState(null)
    const navigate = useNavigate();

    const logInUser = async () => {
        try{
            const response = await axios.post("http://192.168.0.20:5001/login", {
                username,
                password
            });
            if (response.data.success) {
                login({username})
                navigate("/chat");
            } 
        } catch(error)
            {
                if (error.response)
                {
                    if(error.response.status === 401)
                    {
                        setLoginAttempts(prevAttempts => prevAttempts +1)
                        if(loginAttempts + 1 >= 5)
                        {
                            alert("Too many failed attempts, Account locked for 15 minutes")
                            setLockoutTime(Date.now()+200)
                        }
                        else {
                            alert("Login Failed: Inccorect username or password")
                        }
                    }
                    else{
                        alert("Error")
                    }
                }
            }
    };

    const lockedOut = lockoutTime && Date.now() < lockoutTime

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
                        disabled={lockedOut}
                    />
                </div>
                <div className="textbox">
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        disabled={lockedOut}
                    />
                </div>
                <div className="remember-me">
                    <input type="checkbox" id="remember" />
                    <label htmlFor="remember">Remember Me</label>
                </div>
                <button type="button" className="btn" onClick={logInUser} disabled={lockedOut}>Login</button>
                {lockedOut && (<div className="lockout">
                    Your account is locked, please try again in {Math.ceil((lockoutTime - Date.now()) / 60000)} minutes
                     </div>)}



                <div className="signuplink">
                    <label onClick={() => navigate("/signup")}>Sign Up</label>
                </div>
            </div>
        </div>
    );
};

export default Login;
