import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const LoginForm = (props) => {
    const [username, usernameChange] = useState("");
    const [password, passwordChange] = useState("");

    const navigate = useNavigate();

    if (localStorage.getItem("loggedInUser")) {
        const { id, username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

        return <Navigate to={`/welcome/${username}`} state={{ id, username, email, profilepicture }} replace />;
    }

    const handleLogin = (e) => {
        e.preventDefault();

        if (!username || !password) {
            Swal.fire('Warning!', 'Username and Password are required.', 'warning');
            return;
        }

        props.loginHandler({ username, password, navigate });
        // this.setState({
        //     name: '',
        //     email: ''
        // });
        // Navigate to '/login' path after adding the contact
        // navigate('/welcome');
    }

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <form className="ui form" onSubmit={handleLogin}>
                <h2>Login</h2>
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
                    <p>Don't have an account? <Link to={'/registration'}>Register</Link></p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;