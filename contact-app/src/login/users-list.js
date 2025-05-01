import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import api from './../api/contact'
import user from '../images/nouser.jpg';

const UserList = (props) => {
    const [redirect, setRedirect] = useState(false);
    const { users, setUsers } = props;

    const username = localStorage.getItem("loggedInUser");

    useEffect(() => {
        const isAuthenticated = localStorage.getItem('isAuthenticated');
        const authenticatedUser = localStorage.getItem('loggedInUser');

        if (isAuthenticated !== 'true' || authenticatedUser !== username) {
            setRedirect(true);
        } else if (!users.length) {
            const retrieveUsers = async () => {
                const response = await api.get('/user');
                const getUsers = response.data;
                if (getUsers) setUsers(getUsers);
            };
            retrieveUsers();
        }
    }, [username, users, setUsers]);

    const UserCard = (props) => {
        const { username, email, profilepicture } = props.user;
        return (
            <div className="item" style={{ marginTop: "5px" }}>
                <img className="ui avatar image" src={profilepicture || user} alt="user" />
                <div className="content">
                    <div className="header">{username}</div>
                    <div>{email}</div>
                </div>
            </div >
        )
    };

    const renderUserList = users.map((u) => <UserCard key={u.id} user={u} />);

    // If redirect is true, navigate to login
    if (redirect) {
        return <Navigate to="/" replace />;  // <-- This will redirect without remount issues
    }

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <h2>User List
                <Link to={`/welcome/${username}`} state={{ username }}>
                    <button className="ui button right floated">Back to User</button>
                </Link>
            </h2>
            <div className="ui celled list">
                {renderUserList.length > 0 ? renderUserList : 'No record found'}
            </div>
        </div >
    );
}

export default UserList;