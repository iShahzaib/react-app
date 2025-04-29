import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const DeletePopup = (props) => {
    const navigate = useNavigate()
    const { id } = useParams();  // Get the `id` from the URL

    return (
        <div className="ui main">
            <div className="ui card centered">
                <div className="content">
                    <h3>Do you want to delete the item?</h3>
                    <button
                        className="ui button blue"
                        onClick={() => {
                            props.deleteContact(id);
                            navigate('/contacts');
                        }}
                    >Yes</button>
                    <button
                        className="ui button grey"
                        onClick={() => navigate('/contacts')}
                    >No</button>
                </div>
            </div>
        </div >
    );
}

export default DeletePopup;