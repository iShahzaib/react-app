import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import user from '../images/nouser.jpg';
import logo from '../images/logo.png';
import socketClient from '../api/socket';
import { sentenceCase, showWarning } from "../contexts/common";
import BuildList from "../components/build-list";
import { useSchema } from "../contexts/SchemaContext";

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

export const WelcomeHeader = () => {
    const { username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const dropdownRef = useRef(null);
    const sidebarRef = useRef(null);

    const handleLogout = () => {
        localStorage.clear();
        closeDropdown();
        window.location.href = '/';
    };

    const toggleSidebar = () => setSidebarVisible(prev => !prev);
    const closeSidebar = () => setSidebarVisible(false);
    const toggleDropdown = () => setDropdownOpen(prev => !prev);
    const closeDropdown = () => setDropdownOpen(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setSidebarVisible(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="ui menu main-header sticky-header">
            <SideBar
                ref={sidebarRef}
                sidebarVisible={sidebarVisible}
                closeSidebar={closeSidebar}
                onLogout={handleLogout}
            />
            <div className="center-header">
                <i
                    className="bars icon big"
                    style={{ cursor: 'pointer', marginRight: '1rem', color: "#fff" }}
                    onClick={toggleSidebar}
                />
                <img src={logo} alt="user" className="image-logo" />
                <h2 className="child-header" style={{ marginLeft: "0.5rem" }}>MySH Manager</h2>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", position: "relative" }}>
                    <div
                        ref={dropdownRef}
                        style={{ position: "relative", marginRight: "1rem", cursor: "pointer" }}
                        title={username}
                    >
                        <img src={profilepicture || user} alt="User" className="user-profile" onClick={toggleDropdown} />
                        {dropdownOpen && (<UserDropdown username={username} email={email} onLogout={handleLogout} closeDropdown={closeDropdown} />)}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SideBar = React.forwardRef(({ sidebarVisible, closeSidebar, onLogout }, sidebarRef) => {
    const { schemaList } = useSchema();
    const { username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    return (
        <div ref={sidebarRef} className={`custom-sidebar ${sidebarVisible ? 'show' : ''}`}>
            <div className="sidebar-header">
                <i className="close icon close-sidebar" onClick={closeSidebar} />
                <div className="sidebar-user">
                    <img src={profilepicture || user} alt="User" className="user-profile" />
                    <div className="sidebar-user-info">
                        <div style={{ fontWeight: "600", fontSize: "1.25rem" }}>{username}</div>
                        <div style={{ fontSize: "1rem" }}>{email}</div>
                    </div>
                </div>
            </div>

            <div className="sidebar-divider"></div>

            <div className="sidebar-scrollable">
                <div className="sidebar-menu">
                    <Link to={`/welcome/${username}`} className="sidebar-menu-item" onClick={closeSidebar}>
                        <i className="home icon"></i>
                        <span style={{ marginLeft: "0.5rem" }}>Home</span>
                    </Link>
                    {Object.values(schemaList).map(({ collection, icon, label }) => collection && (
                        <Link key={label} to={`/getalldata/${collection}`} state={{ collection }} className="sidebar-menu-item" onClick={closeSidebar}>
                            <i className={`${icon} icon`}></i>
                            <span style={{ marginLeft: "0.5rem" }}>{label}</span>
                        </Link>
                    ))}
                </div>

                <div className="sidebar-footer">
                    <div className="sidebar-divider"></div>
                    <div className="sidebar-logout" onClick={onLogout}>
                        <i className="logout icon"></i>
                        <span style={{ marginLeft: "0.5rem" }}>Sign Out</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

const UserDropdown = ({ username, email, onLogout, closeDropdown }) => {
    return (
        <div className="dropdown-popup-header">
            <div className="dropdown-popup">
                <div style={{ fontWeight: "600", fontSize: "1.25rem", color: "#333" }}>{username}</div>
                <div style={{ fontSize: "1rem", color: "#666" }}>{email}</div>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
                <Link to={`/welcome/${username}`} onClick={closeDropdown}>
                    <i className="home icon"></i> Home
                </Link>
                <div style={{ marginTop: "0.5rem" }}></div>
                <Link to={`/myprofile/${username}`} onClick={closeDropdown}>
                    <i className="user alternate outline icon"></i> My Profile
                </Link>
                <div className="dropdown-popup"></div>
                <Link to='/' onClick={onLogout}>
                    <i className="logout icon"></i> Sign Out
                </Link>
            </div>
        </div>
    );
};

export default Welcome;