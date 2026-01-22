import type { AxiosInstance } from "axios";
import axios from "axios";

const axiosInstance : AxiosInstance = axios.create({
    baseURL : 'http://localhost:8080/api/v1',
    headers : {
        'Content-Type' : 'application/json'
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    
    (response) => response,
    (error) =>{
        if(error.response?.status === 401){
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;