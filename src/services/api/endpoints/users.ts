import { GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import { QueryFunctionContext } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { IUser } from '../../../types/User';
import axios from '../axios';
import {
  type CreateQueryParams,
  RequestQueryBuilder,
} from '@dataui/crud-request';

export interface IUserResponse {
  data: IUser[];
  hasNextPage: boolean;
}

export type CreateUserPayload = Pick<
  IUser,
  'firstName' | 'lastName' | 'email'
> & {
  password: string;
  photo?: {
    id: string;
  };
};

export type UpdateUserPayload = Pick<
  IUser,
  'firstName' | 'lastName' | 'email'
> & {
  photo?: {
    id: string;
  };
};

export default {
  listSimple: (query: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .get<IUser[], AxiosResponse<IUser[]>>(`/v1/users?${queryString}`)
      .then((res) => res.data);
  },
  /*
   *
   *
   *
   *
   *
   *
   */
  list: ({
    queryKey: [
      _,
      {
        sortModel: sort,
        filterModel: { items: filters },
      },
      { page, pageSize: limit },
    ],
  }: QueryFunctionContext<
    [
      'users',
      { sortModel: GridSortModel; filterModel: GridFilterModel },
      { page: number; pageSize: number },
    ]
  >) => {
    const sortFormatted = JSON.stringify(
      sort.map(({ field, sort }) => ({
        orderBy: field,
        order: sort,
      })),
    );
    const filtersFormatted = JSON.stringify(
      filters.reduce((acc, { field, value }) => {
        if (field === 'role' && value >= 1) {
          return {
            ...acc,
            roles: [{ id: value }],
          };
        }

        return acc;
      }, {}),
    );

    return axios
      .get<
        IUserResponse,
        AxiosResponse<IUserResponse>
      >(`/v1/users?sort=${sortFormatted}&page=${page + 1}&limit=${limit}&filters=${filtersFormatted}`)
      .then((res) => res.data);
  },
  delete: (id: number) => axios.delete(`/v1/users/${id}`),
  create: (data: CreateUserPayload) =>
    axios
      .post<IUser, AxiosResponse<IUser>>('/v1/users', data)
      .then((res) => res.data),
  update: (id: number, data: UpdateUserPayload) =>
    axios
      .patch<IUser, AxiosResponse<IUser>>(`/v1/users/${id}`, data)
      .then((res) => res.data),
  count: () =>
    axios
      .get<
        { count: number },
        AxiosResponse<{ count: number }>
      >(`/v1/users/count`)
      .then((res) => res.data.count),
};
