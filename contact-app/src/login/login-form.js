import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = (props) => {
    const [username, usernameChange] = useState("");
    const [password, passwordChange] = useState("");

    const navigate = useNavigate();

    const login = (e) => {
        e.preventDefault();

        if (!username || !password) {
            alert('Username and Password are required.');
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
        <div className="ui main">
            <form className="ui form" onSubmit={login}>
                <h2>Login</h2>
                <div className="field">
                    <label>User Name</label>
                    <input type="text" value={username} onChange={e => usernameChange(e.target.value)} placeholder="Username" required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => passwordChange(e.target.value)} placeholder="Password" required />
                </div>

                <button className="ui button blue" type="submit">Login</button>

                <div className="register-link" style={{ marginTop: "10px" }}>
                    <p>Don't have an account? <Link to={'/registration'}>Register</Link></p>
                </div>
            </form>
        </div>
    )
}

export default LoginForm;