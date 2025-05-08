import React from "react";
import user from '../images/nouser.jpg';
import { Link, useLocation } from "react-router-dom";

const ContactDetail = (props) => {
    const { state } = useLocation();  // Access location object to get state
    const { _id, name, email } = state.data;

    return (
        <div className="ui main" style={{ padding: "2rem" }}>
            <div className="responsive-header">
                <h2 style={{ marginBottom: "0.5rem" }}>Contact Detail</h2>
                <div className="responsive-button">
                    <Link to={`/contacts`}                >
                        <button className="ui button">Back</button>
                    </Link>
                </div>
            </div>
            <div className="ui card centered">
                <div className="content">
                    <p>ID:
                        <Link
                            to={`/update/contact/${_id}`}
                            state={{ data: state.data }}
                            className="right floated"
                        >
                            <i className="edit alternate outline icon"></i>
                            {/* onClick={() => props.updateDataHandler(_id)} */}
                        </Link>
                        <span>{_id}</span>
                    </p>
                </div>
                <div className="image">
                    <img src={user} alt="user" />
                </div>
                <div className="content">
                    <div className="header">{name}</div>
                    <div className="description">{email}</div>
                </div>
            </div>
        </div>
    );
}

export default ContactDetail;