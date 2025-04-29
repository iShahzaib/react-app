import React from "react";
import user from '../images/nouser.jpg';
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ContactCard = (props) => {
    const { id, name, email } = props.contact;
    const navigate = useNavigate();

    const handleDelete = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                props.deleteHandler(id);
                Swal.fire(
                    'Deleted!',
                    'The contact has been deleted successfully.',
                    'success'
                );
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
                    state={{ contact: props.contact }}
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
                state={{ contact: props.contact }}
                style={{ color: "red", marginTop: "7px" }}
                className="right floated"
            >
                <i className="trash alternate outline icon right floated"></i>
                onClick={() => props.deleteHandler(id)}
            </Link> */}
            <Link
                to={`/update/${id}`}
                state={{ contact: props.contact }}
                style={{ color: "blue", marginTop: "7px" }}
                className="right floated"
            >
                <i className="edit alternate outline icon"></i>
                {/* onClick={() => props.updateContactHandler(id)} */}
            </Link>
        </div >
    );
}

export default ContactCard;