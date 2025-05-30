import React from "react";
import { useNavigate } from "react-router-dom";
import documentIcon from '../images/nouser.jpg';
import { confirmDelete, displayLabel, showError, showSuccess } from "../contexts/common";

const ListCard = (props) => {
    const { fields, rowData, type, loggedInUsername, isSelected, toggleSelectOne } = props;
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
                // navigate(
                //     `/getalldata/${sentenceCase(type)}`,
                //     { state: { ...props.rowData, loggedInUsername, type, collection: `${sentenceCase(type)}` } }
                // );
            }
        });
    };

    const state = type !== 'chat' ? { data: props.rowData, loggedInUsername } : { _id, username, email, profilepicture, loggedInUsername };
    const linkPath = type !== 'chat' ? `/detail/${type}/${_id}` : '/chat';

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
            {fields.some(field => field.ispicture) && <td style={{ width: '55px', textOverflow: "unset" }}><img className="ui avatar image" src={profilepicture || documentIcon} alt="document" /></td>}
            {fields.map(field => {
                if (field.ispicture || field.notshowongrid) return null;
                const fieldValue = displayLabel(field, rowData);

                return (
                    <td
                        key={field.name}
                        style={{
                            width: field.columnWidth || '150px',
                            minWidth: field.columnWidth || '150px',
                            maxWidth: field.columnWidth || '150px'
                        }}
                    >
                        <span style={{ display: field.type === 'checkbox' ? 'flex' : 'inline' }} title={fieldValue || ''}>{fieldValue || '—'}</span>
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

export const ListCardHead = ({ fields, isAllSelected, toggleSelectAll }) => {
    return (
        <thead>
            <tr>
                <th className="grid-row-checkbox-all" style={{ width: "40px" }}>
                    <div className="ui fitted checkbox">
                        <input
                            type="checkbox"
                            checked={isAllSelected}
                            onChange={toggleSelectAll}
                        />
                        <label></label>
                    </div>
                </th>
                {fields.some(field => field.ispicture) && <th className="image-header" style={{ width: "55px" }}>IMG</th>}
                {fields.map(field => {
                    if (field.ispicture || field.notshowongrid) return null;

                    return (
                        <th
                            key={field.name}
                            field-uid={field.name}
                            style={{
                                width: field.columnWidth || '150px',
                                minWidth: field.columnWidth || '150px',
                                maxWidth: field.columnWidth || '150px'
                            }}
                        >
                            {field.label}
                        </th>
                    )
                })}
                <th className="grid-row-action-buttons" style={{ width: '120px' }}>Action Buttons</th>
            </tr>
        </thead>
    );
};

const ActionButtons = ({ state, parentProps, handleDelete }) => {
    const navigate = useNavigate();
    const { rowData: { _id, username }, type, loggedInUsername } = parentProps;

    return (
        <td className="grid-row-action-buttons" style={{ width: '120px' }}>
            {type !== 'chat' && (
                <i
                    className="edit blue alternate outline icon"
                    title="Edit"
                    style={{ cursor: "pointer", fontSize: "1.2rem", marginRight: '1rem' }}
                    onClick={(e) => {
                        e.preventDefault(); e.stopPropagation();
                        navigate(`/update/${type}/${_id}`, { state: { ...state, loggedInUsername, type } });
                    }}
                // onClick={() => props.updateDataHandler(_id)}
                />
            )}
            <i
                className="trash icon red alternate outline"
                title={type === 'user' && loggedInUsername === username ? `You cannot delete your own ${type}.` : 'Delete'}
                style={{
                    cursor: type === 'user' && loggedInUsername === username ? 'not-allowed' : 'pointer',
                    opacity: type === 'user' && loggedInUsername === username ? 0.5 : 0.9,
                    fontSize: "1.2rem"
                }}
                onClick={handleDelete}
            />
        </td>
    )
};

export default ListCard;