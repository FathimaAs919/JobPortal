import axios from 'axios';
const API = axios.create({
    baseURL: 'https://jobportal-ukfr.onrender.com/api', // Backend port 5000
});

// Interceptor to inject token
API.interceptors.request.use((req) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        req.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
    }
    return req;
}, (error) => {
    return Promise.reject(error);
});

export default API;
