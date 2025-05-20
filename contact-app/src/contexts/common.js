import Swal from "sweetalert2";

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

export const RenderForm = ({ title, fields, buttonLabel, self }) => {
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
    const value = self.state[field.name] || [];

    const handleArrayItemChange = (index, newValue) => {
        // const updated = [...(value || [])];
        const updated = [...value];
        updated[index] = newValue;
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    const addArrayItem = () => {
        // const updated = [...(value || []), ''];
        const updated = [...value, ''];
        self.handleChange({
            target: {
                name: field.name,
                value: updated
            }
        });
    };

    const removeArrayItem = (index) => {
        // const updated = [...(value || [])];
        const updated = [...value];
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
                <select
                    id={field.name}
                    className="ui dropdown"
                    name={field.name}
                    placeholder={field.placeholder}
                    required={field.required}
                    value={self.state[field.name]}
                    onChange={self.handleChange}
                >
                    <option value=""></option>
                    {field.options?.map(opt => (
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
                    value={self.state[field.name]}
                    onChange={self.handleChange}
                    style={{ height: "8em" }}
                />
            );
        case 'array':
            if (field.subtype === 'text') {
                return (
                    <div>
                        <label style={{ marginRight: "0.5rem" }}>{field.label}</label>
                        {value.map((item, index) => (
                            <div key={index} style={{ display: 'flex', margin: "8px 0" }}>
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
                        checked={self.state[field.name]}
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
                                checked={self.state[field.name] === opt.value}
                                onChange={self.handleChange}
                            />
                            <label htmlFor={`${field.name}-${opt.value}`}>{opt.label}</label>
                        </div>
                    ))}
                </div>
            );
        default:
            return (
                <input
                    id={field.name}
                    type={field.type}
                    name={field.name}
                    required={field.required}
                    placeholder={field.placeholder}
                    value={self.state[field.name]}
                    onChange={self.handleChange}
                />
            );
    }
};
