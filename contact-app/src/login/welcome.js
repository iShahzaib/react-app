import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import user from '../images/nouser.jpg';
import socketClient from '../api/socket';
import { showWarning } from "../contexts/common";
import BuildList from "../components/build-list";
import { tabItems } from "../constant";

const Welcome = () => {
    const { state } = useLocation();
    const [activeTab, setActiveTab] = useState(() => state?.type || "user");

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

    const setDataInParams = (tabName) => {
        if (activeTab !== tabName) {
            setActiveTab(tabName);
        }
    };

    return (
        <div className="ui main" style={{ padding: "1rem" }}>
            <ul className="tab-button-group responsive-button">
                {tabItems.map(({ key, label, className, link, bgcolor }) => (
                    <li key={key}>
                        {/* <button className={`tab-button ${activeTab === "user" ? "active" : ""}`} onClick={() => setDataInParams("user")}>User Detail</button> */}
                        <Link
                            to={link || "#"}
                            className={`tab-button ${className} ${activeTab === key ? "active" : ""}`}
                            style={{ backgroundColor: bgcolor || '#2185d0' }}
                            onClick={() => setDataInParams(key)}
                        >
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="tab-content">
                {activeTab === "user"
                    ? (<div className="ui centered card" style={{ width: "320px", margin: "0 auto", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
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
                    </div>)
                    : activeTab === "chats" ? <p>Chats content goes here.</p> : <BuildList type={activeTab} />
                }
            </div>
        </div>
    );
};

export default Welcome;