import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'https://localhost:7116/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cấu hình interceptors nếu cần (ví dụ đính kèm Token)
axiosClient.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;