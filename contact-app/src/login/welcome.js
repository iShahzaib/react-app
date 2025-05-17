import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import socketClient from '../api/socket';
import { showWarning } from "../contexts/common";
import BuildList from "../components/build-list";
import { tabItems } from "../constant";

const Welcome = () => {
    const { state } = useLocation();
    const [activeTab, setActiveTab] = useState(() => state?.type || "user");

    const { username: authenticatedUser } = useParams();
    const { username } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

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
        <div className="ui main container">
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
                <BuildList type={activeTab} />
            </div>
        </div>
    );
};

export default Welcome;