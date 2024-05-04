import axios from '../axios';
import { AxiosResponse } from 'axios';

import { ITask } from '../../../types/Task';

import {
  type CreateQueryParams,
  RequestQueryBuilder,
} from '@dataui/crud-request';

export interface IPartialUpdateTask
  extends Partial<
    Pick<ITask, 'name' | 'description' | 'taskListId' | 'id' | 'isTemplate'>
  > {
  attachmentsIds?: string[];
  fileCoverId?: string | null;
  membersIds?: number[];
  isWatched?: boolean;
}

export interface ITaskDetainedResponse extends ITask {
  isWatched: boolean;
}

export type CreateTaskPayload = Pick<ITask, 'name' | 'taskListId' | 'boardId'>;

export default {
  partialUpdate: (
    id: number,
    data: IPartialUpdateTask,
    query?: Omit<CreateQueryParams, 'filter'>,
  ) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .patch<
        ITask,
        AxiosResponse<ITask>
      >(`/v1/tasks/${id}?${queryString}`, data)
      .then((res) => res.data);
  },
  getById: (id: number, query: Omit<CreateQueryParams, 'filter'>) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .get<
        ITaskDetainedResponse,
        AxiosResponse<ITaskDetainedResponse>
      >(`/v1/tasks/${id}?${queryString}`)
      .then((res) => res.data);
  },

  list: (query: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .get<ITask[], AxiosResponse<ITask[]>>(`/v1/tasks?${queryString}`)
      .then((res) => res.data);
  },
  create: (data: CreateTaskPayload, query?: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .post<ITask, AxiosResponse<ITask>>(`/v1/tasks?${queryString}`, data)
      .then((res) => res.data);
  },
};
