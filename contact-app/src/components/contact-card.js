import React from "react";
import user from '../images/nouser.jpg';
import { Link } from "react-router-dom";

const ContactCard = (props) => {
    const { id, name, email } = props.contact;
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
            <Link
                to={`/delete/${id}`}
                state={{ contact: props.contact }}
                style={{ color: "red", marginTop: "7px" }}
                className="right floated"
            >
                <i className="trash alternate outline icon right floated"></i>
                {/* onClick={() => props.deleteHandler(id)} */}
            </Link>
            <Link
                to={`/update/${id}`}
                state={{ contact: props.contact }}
                style={{ color: "blue", marginTop: "7px"}}
                className="right floated"
            >
                <i className="edit alternate outline icon"></i>
                {/* onClick={() => props.updateContactHandler(id)} */}
            </Link>
        </div >
    );
}

export default ContactCard;