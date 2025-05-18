import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import socketClient from '../api/socket';
import { sentenceCase, showWarning } from "../contexts/common";
import BuildList from "../components/build-list";

const Welcome = () => {
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

    return (
        <div className="ui container parent-container" style={{ paddingBottom: '1rem' }}>
            <div className="ui card fluid">
                <div className="content">
                    <h2 className="ui header" style={{ color: '#1b1c1d' }}>
                        Welcome back, {sentenceCase(username)}!
                    </h2>
                    <p>Here is your user dashboard. You can view, manage, and explore records as needed.</p>
                </div>
            </div>

            <div className="ui segment" style={{ marginTop: '2rem' }}>
                <BuildList type="user" origin="welcome" />
            </div>
        </div>
    );
};

export default Welcome;