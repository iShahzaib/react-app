import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeletePopup = (props) => {
    const navigate = useNavigate();
    const { _id } = useParams();  // Get the `_id` from the URL

    const handleDelete = () => {
        props.deleteContact(_id);
        navigate("/getalldata/Contact", { state: { collection: "Contact" } });
    };

    return (
        <div className="ui main" style={{ padding: "1rem", textAlign: "center" }}>
            <div className="ui raised very padded text container segment">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this contact?</p>
                <button className="ui red button" onClick={handleDelete}>Delete</button>
                <button
                    className="ui grey button"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => navigate('/getalldata/Contact', { state: { collection: "Contact" } })}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DeletePopup;