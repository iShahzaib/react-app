import Swal from "sweetalert2";

export const sentenceCase = (str) => {
    return str
        .replace(/[_-]/g, ' ')               // replace underscores/dashes with spaces
        .toLowerCase()                       // lowercase all
        .replace(/^\w/, c => c.toUpperCase()); // capitalize first letter
};

export const showSuccess = (detail = '') => {
    Swal.fire({
        title: 'Success!',
        text: detail,
        icon: 'success',
        width: '75%',
    });
};

export const showWarning = (detail = '') => {
    Swal.fire({
        title: 'Warning!',
        text: detail,
        icon: 'warning',
        width: '75%',
    });
};

export const showError = (detail = '') => {
    Swal.fire({
        title: 'Error!',
        text: detail,
        icon: 'error',
        width: '75%',
    });
};
