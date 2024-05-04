import axios from '../axios';
import { AxiosResponse } from 'axios';

import { TaskList } from '../../../types/TaskList';

import { CreateQueryParams, RequestQueryBuilder } from '@dataui/crud-request';

export interface ICreateTaskListPayload {
  name: string;
  boardId: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IPartialUpdateTaskListPayload
  extends Pick<ICreateTaskListPayload, 'name'> {}

export default {
  getAll: (query?: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .get<
        TaskList[],
        AxiosResponse<TaskList[]>
      >(`/v1/task-lists?${queryString}`)
      .then((res) => res.data);
  },
  create: (data: ICreateTaskListPayload) =>
    axios
      .post<TaskList, AxiosResponse<TaskList>>('/v1/task-lists', data)
      .then((res) => res.data),
  partialUpdate: (id: number, data: IPartialUpdateTaskListPayload) =>
    axios
      .patch<TaskList, AxiosResponse<TaskList>>(`/v1/task-lists/${id}`, data)
      .then((res) => res.data),
};
