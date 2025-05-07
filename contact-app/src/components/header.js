import React, { useState } from "react";
import user from '../images/nouser.jpg';
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // adjust path

// Header Component
const Header = () => {
    // const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    let isLoggedIn = false;
    let isLoginPage = false;

    const { username, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    if (username) isLoggedIn = true;
    if (location.pathname === "/login") isLoginPage = true;

    const handleLogout = () => {
        localStorage.clear();
        setHovered(false);
        navigate('/');
    };

    const [hovered, setHovered] = useState(false);

    return (
        <div className="ui fixed menu main-header">
            <div className="center-header">
                <h2 className="child-header">Contact Manager</h2>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                    {isLoggedIn ? (
                        <div
                            style={{ position: "relative", marginRight: "1rem", cursor: "pointer" }}
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <img
                                src={profilepicture || user}
                                alt="User"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    boxShadow: "0 0 0 0.2rem rgba(255, 255, 255, 0.75)",
                                    objectFit: "cover"
                                }}
                            />
                            {hovered && <UserDropdown username={username} email={email} onLogout={handleLogout} />}
                        </div>
                    ) : isLoginPage ? (
                        <Link to={'/register'}>
                            <button className="ui button inverted" style={{ marginLeft: "1rem" }}>
                                Register
                            </button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <button className="ui button inverted" style={{ marginLeft: "1rem" }}>
                                Sign In
                            </button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

const UserDropdown = ({ username, email, onLogout }) => {
    return (
        <div
            style={{
                position: "absolute",
                top: "45px",
                left: 0,
                backgroundColor: "white",
                padding: "0.5rem 1rem",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                borderRadius: "6px",
                whiteSpace: "nowrap",
                zIndex: 10
            }}
        >
            <strong>{username}</strong><br />
            <small>{email}</small>
            <div>
                <Link to={`/welcome/${username}`}>
                    <i className="user alternate outline icon"></i> My Profile
                </Link>
                <div className="divider"></div>
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