import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import user from '../images/nouser.jpg';
import { defaultFields, tabItems } from "../constant";

const Detail = (props) => {
    const { type } = useParams();
    const { state } = useLocation();  // Access location object to get state
    const { data, loggedInUsername } = state || {};
    const { _id, profilepicture } = data || {};

    const tab = tabItems.find(tab => tab.key === type);
    const fields = tab?.fields || defaultFields;

    // const state = type !== 'user' ? { data: props.data } : { _id, username, email, profilepicture, loggedInUsername };
    // const linkPath = type !== 'user' ? `/welcome/${loggedInUsername}` : `/contacts`;
    const backPath = type !== 'contact' ? `/welcome/${loggedInUsername}` : `/contacts`;

    return (
        <div className="ui main" style={{ padding: "1rem" }}>
            <div className="responsive-header">
                {/* Image Card */}
                <div className="ui card" style={{ padding: '1rem', width: "100%", backgroundColor: "#f3f7ff" }}>
                    <div style={{ display: "flex" }}>
                        <img src={profilepicture || user} alt="user" style={{ width: '100px' }} />
                        <div style={{ marginLeft: '1rem', maxWidth: "70%" }}>
                            <h4>{data?.name || data?.username}</h4>
                        </div>

                        {/* Action Buttons */}
                        <div className="responsive-button">
                            <Link
                                to={`/update/${type}/${_id}`}
                                state={{ data, location: 'detail', type }}
                            >
                                <button className="ui button blue">Edit</button>
                                {/* onClick={() => props.updateDataHandler(_id)} */}
                            </Link>
                            <Link to={backPath} state={{ type }}>
                                <button className="ui button">Back</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Information Section */}
            <div className="ui segment" style={{ minHeight: "450px", overflowX: "auto" }}>
                <div className="ui stackable grid">
                    {fields.map(field => {
                        const fieldValue = field.type === 'select'
                            ? field.options.find(opt => opt.value === data?.[field.name])?.label
                            : data?.[field.name];
                        return (
                            <div key={field.name} className={`column ${field.fullWidth ? 'sixteen' : 'eight'} wide`} style={{ marginBottom: "1rem", wordWrap: "break-word" }}>
                                <strong>{field.label}:</strong> {fieldValue || '—'}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

export default Detail;