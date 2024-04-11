import { AxiosResponse } from 'axios';
import { IProfile } from '../../../types/Profile';
import axios from '../axios';

export default {
  registration: (data: unknown) => axios.post('/v1/auth/email/register', data),
  login: (data: unknown) => axios.post('/v1/auth/email/login', data),
  forgotPassword: (data: unknown) =>
    axios.post('/v1/auth/forgot/password', data),
  getProfile: (): Promise<IProfile> =>
    axios.get('/v1/auth/me').then((res) => res.data),
  updateProfile: (data: unknown) =>
    axios
      .patch<IProfile, AxiosResponse<IProfile>>('/v1/auth/me', data)
      .then((res) => res.data),
};
