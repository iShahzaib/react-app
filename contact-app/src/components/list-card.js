import React from "react";
import user from '../images/nouser.jpg';
import { Link, useNavigate } from "react-router-dom";
import { confirmDelete, showError, showSuccess } from "../contexts/common";

const ListCard = (props) => {
    const { data: { _id, name, username, email, profilepicture }, type, loggedInUsername } = props;

    const navigate = useNavigate();

    const handleDelete = (e) => {
        e.preventDefault(); // prevent link
        e.stopPropagation(); // prevent navigation

        if (type === 'user' && loggedInUsername === username) {
            showError(`You cannot delete this ${type}.`, 'Access Denied!');
            return;
        }
        confirmDelete(`Do you want to delete this ${type}?`).then((result) => {
            if (result.isConfirmed) {
                props.deleteHandler(_id);

                showSuccess(`The ${type} has been deleted successfully.`, 'Deleted!');
                navigate(`/${type ? `welcome/${loggedInUsername}` : `${type}s`}`, { state: { ...props.data, loggedInUsername, type } });
            }
        });
    };

    const state = type !== 'user' ? { data: props.data } : { _id, username, email, profilepicture, loggedInUsername };
    const linkPath = type !== 'user' ? `/${type}/${_id}` : '/chat';
    const headerName = type !== 'user' ? name : username;

    return (
        <Link to={linkPath} state={state} className="item">
            <div style={{ margin: "5px 0px 5px 0" }}>
                <img className="ui avatar image" src={profilepicture || user} alt="user" />
                <div className="content">
                    <div className="header">{headerName}</div>
                    <div>{email}</div>
                </div>
                {/* Delete Button */}
                <i
                    className="trash red alternate outline icon right floated"
                    title={type === 'user' && loggedInUsername === username ? `You can not delete your own ${type}.` : 'Delete'}
                    style={{
                        margin: "7px 0 0 15px",
                        cursor: type === 'user' && loggedInUsername === username ? 'not-allowed' : 'pointer',
                        opacity: type === 'user' && loggedInUsername === username ? 0.5 : 1,
                    }}
                    onClick={handleDelete}
                />

                {/* Edit Button */}
                {type !== 'user' && (
                    <i
                        className="edit alternate outline icon right floated"
                        title='Edit'
                        style={{ marginTop: "7px", color: "unset" }}
                        onClick={(e) => {
                            e.preventDefault(); e.stopPropagation();
                            navigate(`/update/${type}/${_id}`, { state: { ...state, loggedInUsername, type } });
                        }}
                    // onClick={() => props.updateDataHandler(_id)}
                    />
                )}
            </div >
        </Link>
    )
};

export default ListCard;