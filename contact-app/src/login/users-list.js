import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import api from './../api/contact'
import user from '../images/nouser.jpg';

const UserList = (props) => {
    const [users, setUsers] = useState([]);
    const [redirect, setRedirect] = useState(false);

    const { state } = useLocation();  // Access location object to get state
    const username = state?.username;

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const authenticatedUser = localStorage.getItem('loggedInUser');

        if (isAuthenticated !== 'true' || authenticatedUser !== username) {
            alert('Please login first.');
            setRedirect(true);
        }
        const retrieveUsers = async () => {
            const response = await api.get('/user');
            const getUsers = response.data;
            if (getUsers) setUsers(getUsers);
        };
        retrieveUsers();
    }, [username]);

    const renderUserList = users.map(({ username, email }) => {
        return (
            <div className="item" style={{ marginTop: "5px" }}>
                <img className="ui avatar image" src={user} alt="user" />
                <div className="content">
                    <div className="header">{username}</div>
                    <div>{email}</div>
                </div>
            </div >
        )
    })

    // If redirect is true, navigate to login
    if (redirect) {
        return <Navigate to="/login" replace />;  // <-- This will redirect without remount issues
    }

    return (
        <div className="ui main">
            <h2>User List
                <Link to={`/welcome/${username}`} state={{ username }}>
                    <button className="ui button blue right floated">Back to Login</button>
                </Link>
            </h2>
            <div className="ui celled list">
                {renderUserList.length > 0 ? renderUserList : 'No record found'}
            </div>
        </div >
    );
}

export default UserList;