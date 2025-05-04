import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from '../api/server';
import user from '../images/nouser.jpg';
import { confirmDelete, showSuccess, showError } from "../contexts/common";

const UserList = (props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [redirect, setRedirect] = useState(false);
    const { users, setUsers } = props;
    const navigate = useNavigate();
    const inputSearch = useRef('');

    const { username: loggedInUsername } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    const retrieveUsers = useCallback(async () => {
        const response = await api.get('/user');
        const getUsers = response.data;
        if (getUsers) setUsers(getUsers);
    }, [setUsers]);

    useEffect(() => {
        if (!loggedInUsername) {
            setRedirect(true);
        } else if (!users.length) {
            retrieveUsers();
        }
    }, [loggedInUsername, users, retrieveUsers]);

    const UserCard = (props) => {
        const { id, username, email, profilepicture } = props.user;

        const handleDelete = () => {
            confirmDelete('Do you want to delete this user?').then((result) => {
                if (result.isConfirmed) {
                    setUsers(users.filter(c => c.id !== id));
                    api.delete(`/user/${id}`);

                    showSuccess('The user has been deleted successfully.', 'Deleted!');
                    navigate("/users");
                }
            });
        };

        return (
            <div className="item" style={{ marginTop: "5px" }}>
                <img className="ui avatar image" src={profilepicture || user} alt="user" />
                <div className="content">
                    <div className="header">{username}</div>
                    <div style={{ color: "#4183c4" }}>{email}</div>
                </div>
                <i
                    className="trash alternate outline icon right floated"
                    title={loggedInUsername === username ? 'You can not delete your own user.' : 'Delete'}
                    style={{
                        color: "red",
                        marginLeft: "10px",
                        marginTop: "7px",
                        cursor: loggedInUsername === username ? 'not-allowed' : 'pointer',
                        opacity: loggedInUsername === username ? 0.5 : 1,
                    }}
                    onClick={() => {
                        if (loggedInUsername !== username) {
                            handleDelete();
                        } else {
                            showError('You cannot delete this user.', 'Access Denied!');
                        }
                    }}
                />
                {loggedInUsername !== username && (<Link to="/chat" state={{ id, username, email, profilepicture, loggedInUsername }}>
                    <i
                        className="comment alternate outline icon right floated"
                        style={{ color: "green", marginLeft: "10px", marginTop: "7px" }}
                    ></i>
                </Link>)}
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
            <div className="responsive-header">
                <h2 style={{ marginBottom: "0.5rem" }}>User List</h2>
                <div className="responsive-button">
                    <Link to={`/welcome/${loggedInUsername}`}>
                        <button className="ui button">Back</button>
                    </Link>
                </div>
            </div>
            <div className="ui search search-container">
                <div className="ui icon input search-input">
                    <input
                        ref={inputSearch}
                        type="text"
                        placeholder="Search Users"
                        className="prompt"
                        value={searchTerm}
                        onChange={() => setSearchTerm(inputSearch.current.value)}
                    />
                    <i className="search icon"></i>
                </div>
                <button className="prompt refresh-button" onClick={retrieveUsers} style={{ width: "5.75%" }}>
                    <i className="refresh icon" style={{ marginLeft: "-3px" }}></i>
                </button>
            </div>
            <div className="ui celled list">
                {renderUserList.length > 0 ? renderUserList : 'No record found'}
            </div>
        </div >
    );
}

export default UserList;