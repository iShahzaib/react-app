import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
// import CloseableTabs from 'react-closeable-tabs';
import user from '../images/nouser.jpg';
import logo from '../images/logo.png';
import socketClient from '../api/socket';
import { showWarning } from "../contexts/common";
import { useSchema } from "../contexts/SchemaContext";
import { BuildChatList } from "../components/messaging/chat";

const HomePage = ({ tabs, activeIndex, handleClickTab, handleCloseTab }) => {
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
            <Welcome username={username} />
            {/* <div className="custom-tab-wrapper">
                <CloseableTabs
                    data={tabs}
                    activeIndex={activeIndex}
                    onCloseTab={handleCloseTab}
                    onTabClick={handleClickTab}
                    // tabPanelColor="#f9f9f9"
                    // renderClose={() => (
                    //     <span className="close-btn" title="Close this tab">&times;</span>
                    // )}
                    closeTitle="Close this tab"
                />
            </div> */}
        </div>
    );
};

export const HomePageHeader = ({ handleAddTab }) => {
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
                handleAddTab={handleAddTab}
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
                        style={{ position: "relative", marginRight: "0.5rem", cursor: "pointer" }}
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

const SideBar = React.forwardRef(({ sidebarVisible, closeSidebar, handleAddTab, onLogout }, sidebarRef) => {
    const { schemaList } = useSchema();
    const navigate = useNavigate();
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
                    {Object.values(schemaList).map(({ key, collection, icon, label, notInMenu }) => collection && !notInMenu && (
                        <div
                            key={label}
                            className="sidebar-menu-item"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                // handleAddTab(label, key);
                                navigate(`/getalldata/${collection}`, { state: { collection } });
                                closeSidebar();
                            }}
                        >
                            <i className={`${icon} icon`}></i>
                            <span style={{ marginLeft: "0.5rem" }}>{label}</span>
                        </div>
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
                    <i className="user icon"></i> My Profile
                </Link>
                <div style={{ marginTop: "0.5rem" }}></div>
                <Link to={`/managetags/${username}`} onClick={closeDropdown}>
                    <i className="tags icon"></i> Manage Tags
                </Link>
                <div style={{ marginTop: "0.5rem" }}></div>
                <Link to={`/manageusers/${username}`} onClick={closeDropdown}>
                    <i className="users icon"></i> Users
                </Link>
                <div className="dropdown-popup"></div>
                <Link to='/' onClick={onLogout}>
                    <i className="logout icon"></i> Sign Out
                </Link>
            </div>
        </div>
    );
};

export const Welcome = ({ username }) => (
    <>
        <div className="ui card fluid">
            <div className="content">
                <h1 className="ui header" style={{ color: '#1b1c1d', marginBottom: "0.5rem" }}>
                    Welcome back, {username}!
                </h1>
                <p>Here is your user dashboard. You can view, manage, and explore records as needed.</p>
            </div>
        </div>

        <div className="ui segment" style={{ marginTop: '2rem' }}>
            <BuildChatList type="chat" origin="welcome" />
        </div>
    </>
);

export default HomePage;