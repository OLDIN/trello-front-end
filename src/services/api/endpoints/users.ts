import { AxiosResponse } from 'axios';
import { IUser } from '../../../types/User';
import axios from '../axios';

interface IUserResponse {
  data: IUser[];
  hasNextPage: boolean;
}

export type CreateUserPayload = Pick<
  IUser,
  'firstName' | 'lastName' | 'email'
> & {
  password: string;
};

export default {
  list: () =>
    axios
      .get<IUserResponse, AxiosResponse<IUserResponse>>('/v1/users')
      .then((res) => res.data),
  delete: (id: number) => axios.delete(`/v1/users/${id}`),
  create: (data: CreateUserPayload) =>
    axios
      .post<IUser, AxiosResponse<IUser>>('/v1/users', data)
      .then((res) => res.data),
};
