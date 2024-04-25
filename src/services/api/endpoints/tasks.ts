import axios from '../axios';
import { AxiosResponse } from 'axios';

import { ITask } from '../../../types/Task';

import {
  type CreateQueryParams,
  RequestQueryBuilder,
} from '@dataui/crud-request';

export interface IPartialUpdateTask
  extends Partial<Pick<ITask, 'name' | 'description' | 'taskListId' | 'id'>> {
  attachmentsIds?: string[];
  fileCoverId?: string | null;
  membersIds?: number[];
}

export default {
  partialUpdate: (id: number, data: IPartialUpdateTask) =>
    axios
      .patch<ITask, AxiosResponse<ITask>>(`/v1/tasks/${id}`, data)
      .then((res) => res.data),
  getById: (id: number, query: Omit<CreateQueryParams, 'filter'>) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .get<ITask, AxiosResponse<ITask>>(`/v1/tasks/${id}?${queryString}`)
      .then((res) => res.data);
  },

  list: (query: CreateQueryParams) => {
    const qb = RequestQueryBuilder.create(query);
    const queryString = qb.query();

    return axios
      .get<ITask[], AxiosResponse<ITask[]>>(`/v1/tasks?${queryString}`)
      .then((res) => res.data);
  },
};
