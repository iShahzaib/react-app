import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../contexts/AuthContext"; // adjust path

// Header Component
const Header = () => {
    // const { isLoggedIn } = useAuth();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    // useEffect(() => {
    //     // Check login state from localStorage or any global method
    //     const user = localStorage.getItem("loggedInUser");
    //     setIsLoggedIn(!!user);
    // }, []);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('loggedInUser');
        setIsLoggedIn(false);
        navigate('/login');
    };


    return (
        <div className="ui fixed menu main-header">
            <div className="center-header">
                <h2 className="child-header">Contact Manager</h2>
                <div style={{ flexShrink: 0 }}>
                    {isLoggedIn ? (
                        <div>
                            <button className="ui button inverted" style={{ marginLeft: "1rem" }} onClick={handleLogout}                        >
                                Sign Out
                            </button>
                            <Link to="/">
                                <button className="ui button inverted" style={{ marginLeft: "1rem" }}>
                                    Home
                                </button>
                            </Link>
                        </div>
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