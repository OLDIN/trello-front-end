import axios from '../axios';

export default {
  registration: (data: unknown) => axios.post('/v1/auth/email/register', data),
  login: (data: unknown) => axios.post('/v1/auth/email/login', data),
  forgotPassword: (data: unknown) =>
    axios.post('/v1/auth/forgot/password', data),
  getProfile: (data: unknown) => axios.post('/v1/auth/me', data),
  updateProfile: (data: unknown) => axios.patch('/v1/auth/me', data),
};
