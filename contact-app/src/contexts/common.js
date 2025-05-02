import Swal from "sweetalert2";

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

export const showError = (detail = '') => {
    Swal.fire({
        title: 'Error!',
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
