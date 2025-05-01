import React from "react";
import user from '../images/nouser.jpg';
import { Link, Navigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Welcome = () => {
    const { state } = useLocation();  // Access location object to get state
    const username = state?.username;
    const email = state?.email;
    const profilepicture = state?.profilepicture || user;

    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const authenticatedUser = localStorage.getItem('loggedInUser');

    if (isAuthenticated !== 'true' || authenticatedUser !== username) {
        Swal.fire('Error!', 'Please login first', 'error');
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ margin: 0 }}>User Detail</h2>
                <div>
                    <Link to="/contacts">
                        <button className="ui button green">Contact List</button>
                    </Link>
                    <Link to="/users">
                        <button className="ui button blue" style={{ marginLeft: "0.5rem" }}>User List</button>
                    </Link>
                </div>
            </div>

            <div className="ui centered card" style={{ width: "320px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <div className="image" style={{ padding: "1rem", background: "#f9f9f9" }}>
                    <img src={profilepicture} alt="user" style={{ borderRadius: "50%", width: "100px", height: "100px", margin: "0 auto", display: "block" }} />
                </div>
                <div className="content" style={{ textAlign: "center" }}>
                    <h3 style={{ marginBottom: "0.5rem" }}>{username}</h3>
                    <div className="description" style={{ color: "gray" }}>{email}</div>
                </div>
            </div>
        </div>
    );
}

export default Welcome;