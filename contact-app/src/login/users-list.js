import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import api from '../api/server';
import user from '../images/nouser.jpg';
import Swal from "sweetalert2";

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
            Swal.fire({
                title: 'Are you sure?',
                text: "Do you want to delete this user?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Delete',
            }).then((result) => {
                if (result.isConfirmed) {
                    setUsers(users.filter(c => c.id !== id));
                    api.delete(`/user/${id}`);

                    Swal.fire('Deleted!', 'The user has been deleted successfully.', 'success');
                    navigate("/users");
                }
            });
        };

        return (
            <div className="item" style={{ marginTop: "5px" }}>
                <img className="ui avatar image" src={profilepicture || user} alt="user" />
                <div className="content">
                    <div className="header">{username}</div>
                    <div>{email}</div>
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
            <h2>User List
                <Link to={`/welcome/${loggedInUsername}`} state={{ id, username: loggedInUsername, email, profilepicture }}>
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