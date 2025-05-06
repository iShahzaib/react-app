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

export const showSuccess = (detail = '', msg) => {
    Swal.fire({
        title: msg || 'Success!',
        text: detail,
        icon: 'success'
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

export const confirmDelete = (detail = '') => {
    return Swal.fire({
        title: 'Are you sure?',
        text: detail,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Delete'
    });
}
