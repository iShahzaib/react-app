import React from "react";
import user from '../images/nouser.jpg';
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { showWarning } from "../contexts/common";

const Welcome = () => {
    const { state } = useLocation();  // Access location object to get state
    const { username: authenticatedUser } = useParams();
    const id = state?.id;
    const username = state?.username;
    const email = state?.email;
    const profilepicture = state?.profilepicture || user;

    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true' || authenticatedUser !== username) {
        isAuthenticated !== 'true' && showWarning('Please login first');
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <div className="responsive-header">
                <h2 style={{ marginBottom: "0.5rem" }}>User Detail</h2>
                <div className="responsive-button">
                    <Link to="/contacts">
                        <button className="ui button green">Contact List</button>
                    </Link>
                    <Link to="/users">
                        <button className="ui button blue">User List</button>
                    </Link>
                </div>
            </div>

            <div className="ui centered card" style={{ width: "320px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                <div className="content">
                    <Link
                        to={`/update/user/${id}`}
                        state={{ user: state }}
                        className="right floated"
                    >
                        <i className="edit alternate outline icon"></i>
                        {/* onClick={() => props.updateUserHandler(id)} */}
                    </Link>
                </div>
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