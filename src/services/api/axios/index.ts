import axios from 'axios';
import Cookie from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: 'https://nestjs-boilerplate-test.herokuapp.com/api',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem('token');

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
