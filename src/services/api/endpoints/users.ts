import { AxiosResponse } from 'axios';
import { IUser } from '../../../types/User';
import axios from '../axios';

interface IUserResponse {
  data: IUser[];
  hasNextPage: boolean;
}

export default {
  list: () =>
    axios
      .get<IUserResponse, AxiosResponse<IUserResponse>>('/v1/users')
      .then((res) => res.data),
};
