import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from '../api/server';
import user from '../images/nouser.jpg';
import { confirmDelete, showSuccess } from "../contexts/common";

const UserList = (props) => {
    const [redirect, setRedirect] = useState(false);
    const { users, setUsers } = props;
    const navigate = useNavigate();

    const { id, username: loggedInUsername, email, profilepicture } = localStorage.getItem("loggedInUser") ? JSON.parse(localStorage.getItem("loggedInUser")) : {};

    useEffect(() => {
        if (!loggedInUsername) {
            setRedirect(true);
        } else if (!users.length) {
            const retrieveUsers = async () => {
                const response = await api.get('/user');
                const getUsers = response.data;
                if (getUsers) setUsers(getUsers);
            };
            retrieveUsers();
        }
    }, [loggedInUsername, users, setUsers]);

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
                {loggedInUsername !== username && (<i
                    className="trash alternate outline icon right floated"
                    style={{ color: "red", marginLeft: "10px", marginTop: "7px" }}
                    onClick={handleDelete}
                ></i>)}
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
                    <Link to={`/welcome/${loggedInUsername}`} state={{ id, username: loggedInUsername, email, profilepicture }}>
                        <button className="ui button">Back to User</button>
                    </Link>
                </div>
            </div>
            <div className="ui celled list">
                {renderUserList.length > 0 ? renderUserList : 'No record found'}
            </div>
        </div >
    );
}

export default UserList;