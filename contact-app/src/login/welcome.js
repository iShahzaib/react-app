import React from "react";
import user from '../images/nouser.jpg';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

const Welcome = () => {
    const navigate = useNavigate();
    const { state } = useLocation();  // Access location object to get state
    const username = state?.username;

    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const authenticatedUser = localStorage.getItem('loggedInUser');

    if (isAuthenticated !== 'true' || authenticatedUser !== username) {
        alert('Please login first.');
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    const logout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loggedInUser');
        navigate('/login');
    };

    return (
        <div className="ui main">
            <h2>User Detail
                <button className="ui button blue right floated" onClick={logout}>Logout</button>
                <Link to={`/users`} state={{ username }}>
                    <button className="ui button right floated">User List</button>
                </Link>
            </h2>
            <div className="ui card centered" style={{ width: "150px" }}>
                <div className="content">
                    <div className="header">Welcome!</div>
                </div>
                <div className="image">
                    <img src={user} alt="user" />
                </div>
                <div className="content">
                    <h5>{username}</h5>
                    {/* <div className="description">{email}</div> */}
                </div>
            </div>
        </div >
    );
}

export default Welcome;