import React from "react";
import user from '../images/nouser.jpg';
import { Link, useNavigate } from "react-router-dom";
import { confirmDelete, showSuccess } from "../contexts/common";

const ListCard = (props) => {
    const { id, name, email } = props.data;
    const navigate = useNavigate();

    const handleDelete = () => {
        confirmDelete('Do you want to delete this contact?').then((result) => {
            if (result.isConfirmed) {
                props.deleteHandler(id);

                showSuccess('The contact has been deleted successfully.', 'Deleted!');
                navigate("/contacts");
            }
        });
    };

    return (
        <div className="item" style={{ marginTop: "5px" }}>
            <img className="ui avatar image" src={user} alt="user" />
            <div className="content">
                <Link
                    to={`/contact/${id}`}
                    state={{ contact: props.data }}
                >
                    <div className="header">{name}</div>
                    <div>{email}</div>
                </Link>
            </div>
            <i
                className="trash alternate outline icon right floated"
                style={{ color: "red", marginLeft: "10px", marginTop: "7px" }}
                onClick={handleDelete}
            ></i>
            {/* <Link
                to={`/delete/${id}`}
                state={{ contact: props.data }}
                style={{ color: "red", marginTop: "7px" }}
                className="right floated"
            >
                <i className="trash alternate outline icon right floated"></i>
                onClick={() => props.deleteHandler(id)}
            </Link> */}
            <Link
                to={`/update/contact/${id}`}
                state={{ contact: props.data }}
                style={{ marginTop: "7px" }}
                className="right floated"
            >
                <i className="edit alternate outline icon"></i>
                {/* onClick={() => props.updateContactHandler(id)} */}
            </Link>
        </div >
    );
}

export default ListCard;