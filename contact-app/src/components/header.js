import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from '../images/logo.png';
// import { useAuth } from "../contexts/AuthContext"; // adjust path

// Header Component
const Header = () => {
    // const { isLoggedIn } = useAuth();
    const location = useLocation();
    const isLoginPage = location.pathname === "/login";

    return (
        <div className="ui menu main-header sticky-header">
            <div className="center-header">
                <img src={logo} alt="user" className="image-logo" />
                <h2 className="child-header" style={{ marginLeft: "0.5rem" }}>MySH Manager</h2>
                <div style={{ flexShrink: 0, display: "flex", alignItems: "center", position: "relative" }}>
                    {isLoginPage ? (
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

// Main Page Component
export const MainPage = () => {
    return (
        <>
            <Header />
            <div className="ui main-page container">
                <h1>Welcome to MySH Manager</h1>
                <p style={{ fontSize: "1.5rem" }}>Manage Everything. The MySH Way. Your Smart Business Hub.</p>
                <Link to="/login">
                    <button className="ui massive inverted button" style={{ marginTop: "2rem" }}>
                        Get Started
                    </button>
                </Link>
            </div>
        </>
    );
};

export default Header;