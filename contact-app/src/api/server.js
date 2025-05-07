import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}/`
});

// Request Interceptor to automatically add the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;  // attach token to all requests
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        if (status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('loggedInUser');

            window.location.href = '/login';
            return;
        }
        return Promise.reject(error);
    }
);

export default api;
