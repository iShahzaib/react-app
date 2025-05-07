import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // adjust path

// Header Component
const Header = () => {
    // const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    let isLoggedIn = false;
    let isLoginPage = false;
    if (localStorage.getItem("loggedInUser")) isLoggedIn = true;
    if (location.pathname === "/login") isLoginPage = true;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loggedInUser');

        isLoggedIn = false;
        navigate('/');
    };


    return (
        <div className="ui fixed menu main-header">
            <div className="center-header">
                <h2 className="child-header">Contact Manager</h2>
                <div style={{ flexShrink: 0 }}>
                    {isLoggedIn ? (
                        <button className="ui button inverted" style={{ marginLeft: "1rem" }} onClick={handleLogout}                        >
                            Sign Out
                        </button>
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