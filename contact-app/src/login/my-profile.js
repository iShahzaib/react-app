import React, { useEffect } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import user from '../images/nouser.jpg';
import socketClient from '../api/socket';
import { showWarning } from "../contexts/common";

const MyProfile = () => {
    const { state } = useLocation();
    const { username: authenticatedUser } = useParams();
    const { _id, username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const isAuthenticated = localStorage.getItem('isAuthenticated');

    useEffect(() => {
        console.log('loggedin', username);
        socketClient.emit('login', username);
    }, [username]);

    useEffect(() => {
        const handleReceiveMessage = otheruser => console.log(`${otheruser} is active.`);
        socketClient.on('user_joined', handleReceiveMessage);
        return () => socketClient.off('user_joined', handleReceiveMessage);
    }, []);

    if (isAuthenticated !== 'true' || authenticatedUser !== username) {
        console.log('Something went wrong!');
        isAuthenticated !== 'true' && showWarning('Please login first');
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    return (
        <div className="ui main" style={{ padding: "1rem" }}>
            <div className="tab-content">
                <div className="ui centered card" style={{ width: "320px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                    <div className="content">
                        <Link
                            to={`/update/user/${_id}`}
                            state={{ data: { _id, username, email, profilepicture }, loggedInUsername: authenticatedUser, type: state?.type }}
                            className="right floated"
                        >
                            <i className="edit alternate outline icon"></i>
                            {/* onClick={() => props.updateUserHandler(_id)} */}
                        </Link>
                    </div>
                    <div className="image" style={{ padding: "1rem", background: "#f9f9f9" }}>
                        <img src={profilepicture || user} alt="user" style={{ borderRadius: "50%", width: "100px", height: "100px", margin: "0 auto", display: "block" }} />
                    </div>
                    <div className="content" style={{ textAlign: "center" }}>
                        <h3 style={{ marginBottom: "0.5rem" }}>{username}</h3>
                        <div className="description" style={{ color: "gray" }}>{email}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;