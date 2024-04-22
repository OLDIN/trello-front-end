import { AxiosResponse } from 'axios';
import { IProfile } from 'types/Profile';
import axios from '../axios';

interface IAuthLoginResponse {
  token: string;
  refreshToken: string;
  user: IProfile;
}

export default {
  registration: (data: unknown) => axios.post('/v1/auth/email/register', data),
  login: (data: unknown) =>
    axios
      .post<
        IAuthLoginResponse,
        AxiosResponse<IAuthLoginResponse>
      >('/v1/auth/email/login', data)
      .then((res) => res.data),
  forgotPassword: (data: unknown) =>
    axios.post('/v1/auth/forgot/password', data),
  getProfile: (): Promise<IProfile> =>
    axios.get('/v1/auth/me').then((res) => res?.data),
  updateProfile: (data: unknown) =>
    axios
      .patch<IProfile, AxiosResponse<IProfile>>('/v1/auth/me', data)
      .then((res) => res.data),
  /**
   *
   * @param hash - email confirmation hash from email link
   * @returns HTTP status code
   */
  confirmEmail: (hash: string) =>
    axios
      .post<void, AxiosResponse<void>>('/v1/auth/email/confirm', { hash })
      .then((res) => res.status),
};
