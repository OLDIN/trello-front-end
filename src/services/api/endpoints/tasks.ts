import {
  type CreateQueryParams,
  RequestQueryBuilder,
} from '@dataui/crud-request';
import { AxiosResponse } from 'axios';
import { Task } from '../../../types/Task';
import axios from '../axios';

export type PartialUpdateTask = Partial<
  Pick<Task, 'name' | 'description' | 'taskListId' | 'id'>
>;

export default {
  partialUpdate: ({ id, ...data }: PartialUpdateTask) =>
    axios
      .patch<Task, AxiosResponse<Task>>(`/v1/tasks/${id}`, data)
      .then((res) => res.data),
  getById: (id: number) =>
    axios
      .get<Task, AxiosResponse<Task>>(`/v1/tasks/${id}`)
      .then((res) => res.data),
  list: (query: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .get<Task[], AxiosResponse<Task[]>>(`/v1/tasks?${queryString}`)
      .then((res) => res.data);
  },
};
