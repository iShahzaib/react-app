import Swal from "sweetalert2";

// export const checkEmailUnique = async (email, collection) => {
//     const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/${collection}?email=${email}`);
//     const data = await res.json();
//     return data.length === 0; // true if email is unique
// };

export const sentenceCase = (str) => {
    return str
        .replace(/[_-]/g, ' ')               // replace underscores/dashes with spaces
        .toLowerCase()                       // lowercase all
        .replace(/^\w/, c => c.toUpperCase()); // capitalize first letter
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

export const FieldCard = ({ self, field }) => {
    switch (field.type) {
        case 'select':
            return (
                <select
                    id={field.name}
                    className="ui dropdown"
                    name={field.name}
                    required={field.required}
                    value={self.state[field.name]}
                    onChange={self.handleChange}
                >
                    <option value="" disabled>{field.placeholder || 'Select...'}</option>
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

