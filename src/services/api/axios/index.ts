import axios from 'axios';
import Cookie from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = Cookie.get('token');

    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosInstance;
