import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3232/api",
    withCredentials: true,
});

// interceptor to handle different content types
axiosInstance.interceptors.request.use(
    (config) => {
        // If data is FormData, let browser set Content-Type with boundary
        if (config.data instanceof FormData) {
            // Don't set Content-Type, browser will set it with boundary
            delete config.headers['Content-Type'];
        } else {
            // For JSON requests, set Content-Type
            config.headers['Content-Type'] = 'application/json';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export default axiosInstance;