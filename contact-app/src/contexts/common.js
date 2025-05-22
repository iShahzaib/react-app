import { useEffect, useState } from "react";
import Select from 'react-select';
import Swal from "sweetalert2";
import api from "../api/server";

// export const checkEmailUnique = async (email, collection) => {
//     const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${collection}?email=${email}`);
//     const data = await res.json();
//     return data.length === 0; // true if email is unique
// };

export const sentenceCase = (str) => {
    return str
        ?.replace(/[_-]/g, ' ')               // replace underscores/dashes with spaces
        ?.toLowerCase()                       // lowercase all
        ?.replace(/^\w/, c => c.toUpperCase()); // capitalize first letter
};

export const showSuccess = (detail = '', msg, timer) => {
    Swal.fire({
        title: msg || 'Success!',
        text: detail,
        icon: 'success',
        timer: timer || 2000
    });
};

export const showWarning = (detail = '') => {
    Swal.fire({
        title: 'Warning!',
        text: detail,
        icon: 'warning'
    });
};

export const showError = (detail = '', msg) => {
    Swal.fire({
        title: msg || 'Error!',
        text: detail,
        icon: 'error'
    });
};

export const confirmDelete = (detail = '', extraParam) => {
    let params = {
        title: 'Are you sure?',
        text: detail,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete'
    }
    if (extraParam) {
        params = { ...params, ...extraParam };
    }
    return Swal.fire(params);
}

export const RenderForm = ({ title, buttonLabel, self }) => {
    const fields = self.fields;

    if (!title && self.state?._id) {
        title = 'Edit ' + (self.state?.[fields.find(f => f.isTitle)?.name] || self.state?.name || '');
    }

    return (
        <div className="ui main container">
            <div className="responsive-header form-header">
                <h2>{title}</h2>
            </div>

            <form className="ui form" style={{ marginTop: "0.5rem" }} onSubmit={self.handleSave}>
                <div className="ui stackable grid">
                    {fields.map(field => (
                        <div className={`column ${field.fullWidth ? 'sixteen' : 'eight'} wide`} key={field.name}>
                            <div className="field">
                                <label>{field.label}</label>
                                <FieldCard self={self} field={field} />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="responsive-form-button" style={{ marginTop: "1rem" }}>
                    <button className="ui button blue" type="submit">{buttonLabel}</button>
                    <button className="ui button" type="button" onClick={self.handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export const FieldCard = ({ self, field }) => {
    const [refOptions, setRefOptions] = useState([]);
    const fieldData = self.state[field.name];

    const refFieldData = (field.type === 'select' && field.ref && fieldData && self.state[`${field.name}_RefFields`])
        ? self.state[`${field.name}_RefFields`]
        : null;

    useEffect(() => {
        if (refFieldData && !refOptions.find(opt => opt.value === fieldData)) {
            const manualOption = {
                value: fieldData,
                label: refFieldData.label,
                _id: fieldData
            };
            setRefOptions(prev => [...prev, manualOption]);
        }
    }, [fieldData, refFieldData, refOptions]);

    const fetchRefOptions = async () => {
        if (field.type === 'select' && field.ref) {
            try {
                const projection = field.refFields?.concat('_id')?.join(','); // Always include _id for value
                const response = await api.get(`/api/getdocdata?collection=${field.ref}&projection=${projection}`);
                const seperator = field.refFieldsSeparator || ' ';

                const formatted = response?.data?.map(item => {
                    const labelName = field.refFields?.map(fld => item[fld] || '').join(seperator) || item._id;
                    return { value: item._id, label: labelName, _id: item._id };
                });

                formatted.sort((a, b) => a.label.localeCompare(b.label));
                setRefOptions(formatted);
            } catch (error) {
                console.error(`Error fetching ref options for ${field.name}:`, error);
            }
        }
    };

    const handleArrayItemChange = (index, newValue) => {
        // const updated = [...(fieldData || [])];
        const updated = [...fieldData];
        updated[index] = newValue;
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    const addArrayItem = () => {
        // const updated = [...(fieldData || []), ''];
        const updated = [...fieldData, ''];
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    const removeArrayItem = (index) => {
        // const updated = [...(fieldData || [])];
        const updated = [...fieldData];
        updated.splice(index, 1);
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    switch (field.type) {
        case 'select':
            return (
                field.ref
                    ? <Select
                        inputId={field.name}
                        name={field.name}
                        value={refOptions.find(opt => opt.value === fieldData) || null}
                        onChange={(selectedOption) => {
                            self.handleChange({
                                target: {
                                    name: field.name,
                                    value: selectedOption ? selectedOption.value : null,
                                    refName: `${field.name}_RefFields`,
                                    refValue: selectedOption || null
                                }
                            });
                        }}
                        onFocus={fetchRefOptions}
                        options={refOptions}
                        placeholder={field.placeholder || 'Select...'}
                        className={`${field.required ? 'required' : ''}`}
                        isClearable
                    />
                    : <select
                        id={field.name}
                        className="ui dropdown"
                        name={field.name}
                        placeholder={field.placeholder}
                        required={field.required}
                        value={fieldData}
                        onChange={self.handleChange}
                    >
                        <option value=""></option>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
            );
        case 'textarea':
            return (
                <textarea
                    id={field.name}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={fieldData}
                    onChange={self.handleChange}
                    style={{ height: "8em" }}
                />
            );
        case 'array':
            if (field.subtype === 'text') {
                return (
                    <div>
                        <label style={{ marginRight: "0.5rem" }}>{field.label}</label>
                        {(fieldData || []).map((item, index) => (
                            <div key={index} className="subtype-field">
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => handleArrayItemChange(index, e.target.value)}
                                    placeholder={field.placeholder || ''}
                                    style={{ flex: 1 }}
                                />
                                <button
                                    type="button"
                                    className="ui negative basic button remove-subtype-field"
                                    onClick={() => removeArrayItem(index)}
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            className="ui positive basic button add-subtype-field"
                            onClick={addArrayItem}
                        >
                            Add Item
                        </button>
                    </div>
                );
            }
            break;
        case 'checkbox':
            return (
                <div>
                    <input
                        id={field.name}
                        type="checkbox"
                        name={field.name}
                        required={field.required}
                        checked={fieldData}
                        onChange={self.handleChange}
                    />
                    <label htmlFor={field.name}>{field.label}</label>
                </div>
            );
        case 'radio':
            return (
                <div>
                    {field.options?.map(opt => (
                        <div key={opt.value}>
                            <input
                                id={`${field.name}-${opt.value}`}
                                type="radio"
                                name={field.name}
                                value={opt.value}
                                required={field.required}
                                checked={fieldData === opt.value}
                                onChange={self.handleChange}
                            />
                            <label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</label>
                        </div>
                    ))}
                </div>
            );
        case 'date':
            return (
                <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={fieldData || getLocalToday()}
                    onChange={self.handleChange}
                />
            );
        default:
            return (
                <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={fieldData}
                    onChange={self.handleChange}
                />
            );
    }
};

export const displayLabel = (field, data) => {
    if (!data) return '';
    const fieldData = data[field.name];

    switch (field.type) {
        case 'select':
            return (field.ref && data[`${field.name}_RefFields`]
                ? data[`${field.name}_RefFields`]
                : field.options?.find(opt => opt.value === fieldData))?.label;

        case 'array':
            return fieldData ? fieldData.join(', ') : ''

        case 'date':
        case 'datetime':
            return formatDateTime(fieldData, field.type === 'datetime');

        default:
            return fieldData;
    }
};

export const getLocalToday = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
};

export const formatDateTime = (timestamp, includeTime) => {
    if (!timestamp) return '';

    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    hours = String(hours).padStart(2, '0');

    return `${day}-${month}-${year} ${includeTime ? `${hours}:${minutes} ${ampm}` : ``}`;
}

