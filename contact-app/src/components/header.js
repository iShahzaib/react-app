import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <div className="ui fixed menu">
            <div className="ui container" style={{ marginTop: "10px" }}>
                <h2>Contact Manager</h2>
                <div className="right menu">
                    <Link to={'/'}>
                        <button className="ui button blue right floated">Home</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export const Main = () => {
    return (
        <div className="fixed menu">
            <Link to={'/contacts'}>
                <button className="ui button blue">Show Contact List</button>
            </Link>
            <Link to={'/login'}>
                <button className="ui button blue right floated">Sign In</button>
            </Link>
            <h2 style={{textAlign: "center", margin: "10rem"}}>WELCOME</h2>
        </div>
    )
}

export default Header;