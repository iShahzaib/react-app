import React from "react";
import user from '../images/nouser.jpg';
import { Link, useNavigate } from "react-router-dom";
import { confirmDelete, showError, showSuccess } from "../contexts/common";

const ListCard = (props) => {
    const { data: { id, name, username, email, profilepicture }, type, loggedInUsername } = props;

    const navigate = useNavigate();

    const handleDelete = () => {
        if (type === 'user' && loggedInUsername === username) {
            showError(`You cannot delete this ${type}.`, 'Access Denied!');
            return;
        }
        confirmDelete(`Do you want to delete this ${type}?`).then((result) => {
            if (result.isConfirmed) {
                props.deleteHandler(id);

                showSuccess(`The ${type} has been deleted successfully.`, 'Deleted!');
                navigate(`/${type}s`);
            }
        });
    };

    return (
        <div className="item" style={{ marginTop: "5px" }}>
            <img className="ui avatar image" src={profilepicture || user} alt="user" />
            <div className="content">
                {
                    type === 'contact'
                        ? (<Link
                            to={`/${type}/${id}`}
                            state={{ contact: props.data }}
                        >
                            <div className="header">{name}</div>
                            <div>{email}</div>
                        </Link>)
                        : (<div>
                            <div className="header">{username}</div>
                            <div style={{ color: "#4183c4" }}>{email}</div>
                        </div>)
                }
            </div>
            <i
                className="trash alternate outline icon right floated"
                title={type === 'user' && loggedInUsername === username ? `You can not delete your own ${type}.` : 'Delete'}
                style={{
                    color: "red",
                    marginLeft: "10px",
                    marginTop: "7px",
                    cursor: type === 'user' && loggedInUsername === username ? 'not-allowed' : 'pointer',
                    opacity: type === 'user' && loggedInUsername === username ? 0.5 : 1,
                }}
                onClick={handleDelete}
            />
            {
                type === 'contact'
                    ? (<Link
                        to={`/update/${type}/${id}`}
                        state={{ contact: props.data }}
                        style={{ marginTop: "7px" }}
                        className="right floated"
                    >
                        <i className="edit alternate outline icon"></i>
                        {/* onClick={() => props.updateContactHandler(id)} */}
                    </Link>)
                    : loggedInUsername !== username && (<Link to="/chat" state={{ id, username, email, profilepicture, loggedInUsername }}>
                        <i
                            className="comment alternate outline icon right floated"
                            style={{ color: "green", marginLeft: "10px", marginTop: "7px" }}
                        ></i>
                    </Link>)
            }
        </div >
    )
};

export default ListCard;