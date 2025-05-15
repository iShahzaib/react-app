import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { showWarning } from "../contexts/common";

const LoginForm = React.memo((props) => {
    const [username, usernameChange] = useState("");
    const [password, passwordChange] = useState("");

    const navigate = useNavigate();

    if (localStorage.getItem("loggedInUser")) {
        const { username } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

        return <Navigate to={`/welcome/${username}`} replace />;
    }

    const handleLogin = (e) => {
        e.preventDefault();

        if (!username || !password) {
            showWarning('Username and Password are required.');
            return;
        }

        props.loginHandler({ email: username?.toLowerCase(), password, navigate });
    }

    return (
        <div className="ui main">
            <div className="responsive-header">
                <h2>Login</h2>
            </div>
            <form className="ui form" style={{ marginTop: "0.5rem" }} onSubmit={handleLogin}>
                <div className="field">
                    <label>User Name</label>
                    <input type="text" value={username} onChange={e => usernameChange(e.target.value)} placeholder="Username" required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => passwordChange(e.target.value)} placeholder="Password" required />
                </div>

                <button className="ui button blue" type="submit">Sign In</button>

                <div className="register-link" style={{ marginTop: "10px" }}>
                    <p>Don't have an account? <Link to={'/register'}>Register</Link></p>
                </div>
            </form>
        </div>
    )
});

export default LoginForm;