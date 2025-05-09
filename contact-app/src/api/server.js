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
    response => response,
    async error => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            localStorage.clear();

            window.location.href = '/login';
            return;

        } else if (status === 403) {
            // // Refresh the token logic
            // const refreshToken = localStorage.getItem('refresh_token');
            // // Assume we have a function to refresh the token here
            // const newToken = await refreshAuthToken(refreshToken);
            // localStorage.setItem('token', newToken);

            // // Retry the request with the new token
            // error.config.headers['Authorization'] = `Bearer ${newToken}`;
            // return api(error.config);  // Retry the request
        }
        return Promise.reject(error);
    }
);

export default api;
