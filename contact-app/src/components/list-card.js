import React from "react";
import { useNavigate } from "react-router-dom";
import user from '../images/nouser.jpg';
import { confirmDelete, showError, showSuccess } from "../contexts/common";
import { defaultFields, tabItems } from "../constant";

const ListCard = (props) => {
    const { data, type, loggedInUsername, isSelected, toggleSelectOne } = props;
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
                props.deleteHandler([_id]);

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
        <tr className={`${isSelected ? 'selected' : ''}`} onDoubleClick={() => navigate(linkPath, { state })}>
            <td>
                <div className="ui fitted checkbox">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={toggleSelectOne}
                    />
                    <label></label>
                </div>
            </td>
            <td>
                <img className="ui avatar image" src={profilepicture || user} alt="user" />
            </td>

            {fields.map(field => {
                if (field.ispicture) return null;

                const fieldValue = field.type === 'select'
                    ? field.options.find(opt => opt.value === data?.[field.name])?.label
                    : data?.[field.name];
                return (
                    <td key={field.name}>
                        <span title={fieldValue || ''}>{fieldValue || '—'}</span>
                    </td>
                )
            })}

            <ActionButtons
                state={state}
                parentProps={props}
                handleDelete={handleDelete}
            />
        </tr>
    );
};

export const ListCardHead = ({ type, isAllSelected, toggleSelectAll }) => {
    const tab = tabItems.find(tab => tab.key === type);
    const fields = tab?.fields || defaultFields;

    return (
        <thead>
            <tr>
                <th>
                    <div className="ui fitted checkbox">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                        />
                        <label></label>
                    </div>
                </th>
                <th className="image-header">IMG</th>
                {fields.map(field => !field.ispicture && <th key={field.name}>{field.label}</th>)}
                <th className="grid-row-action-buttons">Action Buttons</th>
            </tr>
        </thead>
    );
};

const ActionButtons = ({ state, parentProps, handleDelete }) => {
    const navigate = useNavigate();
    const { data: { _id, username }, type, loggedInUsername } = parentProps;

    return (
        <td className="grid-row-action-buttons">
            {type !== 'user' && (
                <i
                    className="edit blue alternate outline icon"
                    title="Edit"
                    style={{ cursor: "pointer", fontSize: "1.2rem", marginRight: '0.5rem' }}
                    onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        navigate(`/update/${type}/${_id}`, { state: { ...state, loggedInUsername, type } });
                    }}
                // onClick={() => props.updateDataHandler(_id)}
                />
            )}
            <i
                className="trash red alternate outline icon"
                title={type === 'user' && loggedInUsername === username ? `You cannot delete your own ${type}.` : 'Delete'}
                style={{
                    cursor: type === 'user' && loggedInUsername === username ? 'not-allowed' : 'pointer',
                    opacity: type === 'user' && loggedInUsername === username ? 0.5 : 1,
                    fontSize: "1.2rem"
                }}
                onClick={handleDelete}
            />
        </td>
    )
};

export default ListCard;