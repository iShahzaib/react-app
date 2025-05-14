import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import user from '../images/nouser.jpg';
// import { useAuth } from "../contexts/AuthContext"; // adjust path

// Header Component
const Header = () => {
    // const { isLoggedIn } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    const { username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const isLoggedIn = !!username;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const dropdownRef = useRef(null);

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
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="ui fixed menu main-header">
            <SideBar
                username={username}
                sidebarVisible={sidebarVisible}
                onLogout={handleLogout}
                closeSidebar={closeSidebar}
            />

            <div className="center-header">
                {isLoggedIn && (
                    <i
                        className="bars icon big"
                        style={{ cursor: 'pointer', marginRight: '1rem', color: "white" }}
                        onClick={toggleSidebar}
                    />
                )}
                <h2 className="child-header">Contact Manager</h2>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", position: "relative" }}>
                    {isLoggedIn ? (
                        <div
                            ref={dropdownRef}
                            style={{ position: "relative", marginRight: "1rem", cursor: "pointer" }}
                            title={username}
                        >
                            <img src={profilepicture || user} alt="User" className="user-profile" onClick={toggleDropdown} />
                            {dropdownOpen && (<UserDropdown username={username} email={email} onLogout={handleLogout} closeDropdown={closeDropdown} />)}
                        </div>
                    ) : isLoginPage ? (
                        <Link to='/register'>
                            <button className="ui button inverted" style={{ marginBottom: "0" }}>Register</button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <button className="ui button inverted" style={{ marginBottom: "0" }}>Sign In</button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const SideBar = ({ username, sidebarVisible, onLogout, closeSidebar }) => {
    return (
        <div className={`custom-sidebar ${sidebarVisible ? 'show' : ''}`}>
            <i className="close icon close-btn" onClick={closeSidebar} />

            <Link to={`/welcome/${username}`} onClick={closeSidebar}>
                <i className="home icon"></i> Home
            </Link>
            <Link to={`/myprofile/${username}`} onClick={closeSidebar}>
                <i className="user alternate outline icon"></i> My Profile
            </Link>
            <Link to='/' onClick={onLogout}>
                <i className="logout icon"></i> Sign Out
            </Link>
        </div>
    )
};

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

// Home/Main Page Component
export const Main = () => {
    return (
        <div className="main-page">
            <h1 style={{ fontSize: "4rem", marginBottom: "1rem" }}>Welcome to Contact Manager</h1>
            <p style={{ fontSize: "1.5rem" }}>Manage your contacts efficiently and securely</p>
            <Link to="/login">
                <button className="ui massive inverted white button" style={{ marginTop: "2rem" }}>
                    Get Started
                </button>
            </Link>
        </div>
    );
};

export default Header;