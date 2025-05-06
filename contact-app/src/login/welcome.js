import React, { useEffect, useState } from "react";
import user from '../images/nouser.jpg';
import { Link, Navigate, useParams } from "react-router-dom";
import socketClient from '../api/socket';
import { showWarning } from "../contexts/common";

const Welcome = () => {
    const [activeTab, setActiveTab] = useState("user");

    const { username: authenticatedUser } = useParams();
    const { _id, username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const isAuthenticated = localStorage.getItem('isAuthenticated');

    useEffect(() => {
        console.log('loggedin', username);
        socketClient.emit('login', username);
    }, [username]);


    useEffect(() => {
        const handleReceiveMessage = (otheruser) => { console.log(`${otheruser} is active.`); };

        socketClient.on('user_joined', handleReceiveMessage);

        return () => { socketClient.off('user_joined', handleReceiveMessage); };
    }, []);

    if (isAuthenticated !== 'true' || authenticatedUser !== username) {
        isAuthenticated !== 'true' && showWarning('Please login first');
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <ul className="tab-button-group responsive-button">
                <li>
                    {/* <button className={`tab-button ${activeTab === "user" ? "active" : ""}`} onClick={() => setActiveTab("user")}>User Detail</button> */}
                    <Link className={`tab-button user ${activeTab === "user" ? "active" : ""}`} onClick={() => setActiveTab("user")}>User Detail</Link>
                </li>
                <li>
                    {/* <button className={`tab-button ${activeTab === "chats" ? "active" : ""}`} onClick={() => setActiveTab("chats")}>Chats</button> */}
                    <Link to="/users" className={`tab-button chats ${activeTab === "chats" ? "active" : ""}`} onClick={() => setActiveTab("chats")}>Chats</Link>
                </li>
                <li>
                    {/* <button className={`tab-button ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>Contacts</button> */}
                    <Link to="/contacts" className={`tab-button contacts ${activeTab === "contacts" ? "active" : ""}`} onClick={() => setActiveTab("contacts")}>Contacts</Link>
                </li>
            </ul>
            <div className="tab-content">
                {activeTab === "user" && (
                    <div>
                        {/* <div className="responsive-header">
                            <h2 style={{ marginBottom: "0.5rem" }}>
                                {activeTab === "user" ? "User Detail" : activeTab === "chats" ? "Chats" : "Contacts"}
                            </h2>
                        </div> */}
                        <div className="ui centered card" style={{ width: "320px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                            <div className="content">
                                <Link
                                    to={`/update/user/${_id}`}
                                    state={{ user: { _id, username, email, profilepicture } }}
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
                )}
                {activeTab === "chats" && <p>Chats content goes here.</p>}
                {activeTab === "contacts" && <p>Contacts content goes here.</p>}
            </div>
        </div>
    );
};

export default Welcome;