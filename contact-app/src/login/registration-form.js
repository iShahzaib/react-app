import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegistrationForm = (props) => {
    const [username, usernameChange] = useState("");
    const [password, passwordChange] = useState("");
    const [email, emailChange] = useState("");
    const [profilepicture, profilepictureChange] = useState("");

    const navigate = useNavigate();

    const register = (e) => {
        e.preventDefault();
        if (username === '' || password === '' || email === '') {
            alert('All the fields are mandatory except profile picture');
            return;
        }
        props.registrationHandler({ username, password, email, profilepicture });
        // this.setState({
        //     name: '',
        //     email: ''
        // });
        // Navigate to '/login' path after adding the contact
        navigate('/login');
    }
    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <form className="ui form" onSubmit={register}>
                <h2>Registration</h2>
                <div className="field">
                    <label>User Name</label>
                    <input type="text" value={username} onChange={e => usernameChange(e.target.value)} placeholder="Username" required />
                </div>
                <div className="field">
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => passwordChange(e.target.value)} placeholder="Password" required />
                </div>
                <div className="field">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => emailChange(e.target.value)} placeholder="Email" required />
                </div>
                <div className="field">
                    <label>Profile Picture</label>
                    <input type="text" value={profilepicture} onChange={e => profilepictureChange(e.target.value)} placeholder="Link" />
                </div>

                <button className="ui button blue" type="submit">Register</button>

                <div className="register-link" style={{ marginTop: "10px" }}>
                    <p>Already have an account? <Link to={'/login'}>Sign In</Link></p>
                </div>
            </form>
        </div>
    )
}

export default RegistrationForm;