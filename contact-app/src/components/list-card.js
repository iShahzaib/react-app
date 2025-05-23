import React from "react";
import { useNavigate } from "react-router-dom";
import user from '../images/nouser.jpg';
import { confirmDelete, displayLabel, sentenceCase, showError, showSuccess } from "../contexts/common";
import { defaultFields } from "../constant";
import { useSchema } from "../contexts/SchemaContext";

const ListCard = (props) => {
    const { schemaList } = useSchema();
    const { rowData, type, loggedInUsername, isSelected, toggleSelectOne } = props;
    const { _id, username, email, profilepicture } = rowData;
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
                    `/getalldata/${sentenceCase(type)}`,
                    { state: { ...props.rowData, loggedInUsername, type, collection: `${sentenceCase(type)}` } }
                );
            }
        });
    };

    const state = type !== 'user' ? { data: props.rowData, loggedInUsername } : { _id, username, email, profilepicture, loggedInUsername };
    const linkPath = type !== 'user' ? `/detail/${type}/${_id}` : '/chat';

    // Get field config based on type
    const tab = schemaList[type];
    const fields = tab?.fields || defaultFields;

    return (
        <tr className={`${isSelected ? 'selected' : ''}`} onDoubleClick={() => navigate(linkPath, { state })}>
            <td className="grid-row-checkbox">
                <div className="ui fitted checkbox">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={toggleSelectOne}
                    />
                    <label></label>
                </div>
            </td>
            {fields.some(field => field.ispicture) && <td><img className="ui avatar image" src={profilepicture || user} alt="user" /></td>}
            {fields.map(field => {
                if (field.ispicture || field.notshowongrid) return null;
                const fieldValue = displayLabel(field, rowData);

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
    const { schemaList } = useSchema();
    const tab = schemaList[type];
    const fields = tab?.fields || defaultFields;

    return (
        <thead>
            <tr>
                <th className="grid-row-checkbox-all" style={{ width: "5%" }}>
                    <div className="ui fitted checkbox">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                        />
                        <label></label>
                    </div>
                </th>
                {fields.some(field => field.ispicture) && <th className="image-header" style={{ width: "6%" }}>IMG</th>}
                {fields.map(field => !field.ispicture && !field.notshowongrid && <th key={field.name}>{field.label}</th>)}
                <th className="grid-row-action-buttons">Action Buttons</th>
            </tr>
        </thead>
    );
};

const ActionButtons = ({ state, parentProps, handleDelete }) => {
    const navigate = useNavigate();
    const { rowData: { _id, username }, type, loggedInUsername } = parentProps;

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