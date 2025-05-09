import React from "react";
import { Link, useNavigate } from "react-router-dom";
import user from '../images/nouser.jpg';
import { confirmDelete, showError, showSuccess } from "../contexts/common";
import { defaultFields, tabItems } from "../constant";

const ListCard = (props) => {
    const { data, type, loggedInUsername } = props;
    const { _id, username, email, profilepicture } = data;
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
                navigate(
                    `/${type ? `welcome/${loggedInUsername}` : `${type}s`}`,
                    { state: { ...props.data, loggedInUsername, type } }
                );
            }
        });
    };

    const state = type !== 'user' ? { data: props.data, loggedInUsername } : { _id, username, email, profilepicture, loggedInUsername };
    const linkPath = type !== 'user' ? `/detail/${type}/${_id}` : '/chat';

    // Get field config based on type
    const tab = tabItems.find(tab => tab.key === type);
    const fields = tab?.fields || defaultFields;

    return (
        <Link to={linkPath} state={state} className="item">
            <div className="grid-row">
                <img className="ui avatar image" src={profilepicture || user} alt="user" />

                {fields.filter(field => !field.ispicture).map(field => (
                    <div key={field.name} className="grid-cell">
                        <strong>{field.label}:</strong> <span title={`${data[field.name] || ''}`}>{data[field.name] || '—'}</span>
                    </div>
                ))}

                <div className="grid-row-action-buttons">
                    {type !== 'user' && (
                        <i
                            className="edit blue alternate outline icon"
                            title="Edit"
                            style={{ cursor: "pointer", fontSize: "1.2rem" }}
                            onClick={(e) => {
                                e.preventDefault(); e.stopPropagation();
                                navigate(`/update/${type}/${_id}`, { state: { ...state, loggedInUsername, type } });
                            }}
                        // onClick={() => props.updateDataHandler(_id)}
                        />
                    )}
                    <i
                        className="trash red alternate outline icon"
                        title={type === 'user' && loggedInUsername === username ? `You can not delete your own ${type}.` : 'Delete'}
                        style={{
                            cursor: type === 'user' && loggedInUsername === username ? 'not-allowed' : 'pointer',
                            opacity: type === 'user' && loggedInUsername === username ? 0.5 : 1,
                            fontSize: "1.2rem"
                        }}
                        onClick={handleDelete}
                    />
                </div>
            </div>
        </Link>
    );
};

export default ListCard;